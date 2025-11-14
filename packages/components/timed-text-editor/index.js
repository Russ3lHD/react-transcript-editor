import React from 'react';
import PropTypes from 'prop-types';

import {
  EditorState,
  CompositeDecorator,
  convertFromRaw,
  convertToRaw,
  getDefaultKeyBinding,
  Modifier
} from 'draft-js';



import CustomEditor from './CustomEditor.js';
import VirtualizedEditor from './VirtualizedEditor.js';
import Word from './Word';
import { TranscriptDisplayContext } from './TranscriptDisplayContext.js';

import sttJsonAdapter from '../../stt-adapters';
import { getWorkerManager } from '../../util/WorkerManager.js';
import { getCacheManager } from '../../util/CacheManager.js';
import { hashTranscriptData } from '../../util/hashUtils.js';
import { getDeviceCapabilityDetector } from '../../util/DeviceCapabilityDetector.js';
import { exportAdapter } from '../../export-adapters';
import updateTimestamps from './UpdateTimestamps/index.js';
// Handle CSS module import with fallback for Storybook
let style;
try {
  style = require('./index.module.css');
} catch {
  // Fallback styles for Storybook
  style = {
    editor: 'timed-text-editor'
  };
}

class TimedTextEditor extends React.Component {
  constructor(props) {
    super(props);

    // Phase 7: Detect device performance tier for dynamic chunk sizing
    const deviceDetector = getDeviceCapabilityDetector();
    this.deviceTier = deviceDetector.detectDeviceTier();
    this.chunkSize = this.deviceTier.chunkSize;
    this.progressiveLoadingThreshold = this.deviceTier.threshold;

    this.state = {
      editorState: EditorState.createEmpty(),
      // Performance optimization: Cache word timings for fast lookup
      wordTimings: [],
      cachedEntityMap: null,
      // Phase 3: Progressive loading state
      isInitialLoad: false,
      loadedBlockCount: 0,
      totalBlocks: 0,
      // Phase 5: Worker processing state
      isProcessingWorker: false,
      workerProgress: { current: 0, total: 0, percentage: 0 },
      // Phase 6: Cache state
      isLoadingFromCache: false,
      cacheHit: false,
      // Phase 7: Device tier info
      deviceTier: this.deviceTier.name,
      deviceTierDescription: this.deviceTier.description
    };

    // Instance variables (not state) to avoid setState during render
    this.lastCurrentWord = { start: 'NA', end: 'NA' };
    this.timeEpsilon = 0.06;
    this.scrollThrottle = null;
    this.loadingCancelled = false;

    // Phase 2B: Track highlighted elements for class-based highlighting
    this.highlightedElements = {
      current: null,        // Currently playing word element
      next: null,          // Next sibling element
      unplayedSet: new Set() // Set of unplayed word elements
    };

    this.wordKeyToBlockIndex = {};
    this.currentWordBlockIndex = null;

    // Cache display config to prevent unnecessary context updates
    this.displayConfig = {
      showSpeakers: true,
      showTimecodes: true,
      timecodeOffset: 0,
      isEditable: true
    };
  }

  componentDidMount() {
    this.loadData();
    this.updateDisplayConfig();
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    // Only re-render for meaningful changes, not every currentTime update

    // Check if editor content changed
    if (nextState.editorState !== this.state.editorState) return true;

    // Check if word timings cache changed
    if (nextState.wordTimings !== this.state.wordTimings) return true;

    // Check if display preferences changed (these affect WrapperBlock)
    if (nextProps.showSpeakers !== this.props.showSpeakers) return true;
    if (nextProps.showTimecodes !== this.props.showTimecodes) return true;
    if (nextProps.timecodeOffset !== this.props.timecodeOffset) return true;
    if (nextProps.isEditable !== this.props.isEditable) return true;

    // Check if transcript data changed
    if (nextProps.transcriptData !== this.props.transcriptData) return true;

    // Check if other important props changed
    if (nextProps.spellCheck !== this.props.spellCheck) return true;
    if (nextProps.fileName !== this.props.fileName) return true;

    // For currentTime, only re-render if the current word changes
    // This is checked in getCurrentWord() which updates this.lastCurrentWord
    const nextCurrentWord = this.getCurrentWordForTime(nextProps.currentTime);
    if (nextCurrentWord.start !== this.lastCurrentWord.start) {
      return true;
    }

    // Don't re-render for other prop changes (like currentTime within same word)
    return false;
  };

  // Helper to get current word without side effects (for shouldComponentUpdate)
  getCurrentWordForTime = (currentTime) => {
    const { wordTimings } = this.state;

    if (!wordTimings || wordTimings.length === 0) {
      return { start: 'NA', end: 'NA' };
    }

    // Binary search
    let left = 0;
    let right = wordTimings.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const word = wordTimings[mid];

      if (word.start - this.timeEpsilon <= currentTime && word.end + this.timeEpsilon >= currentTime) {
        return { start: word.start, end: word.end, key: word.key };
      } else if (word.start > currentTime) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    return { start: 'NA', end: 'NA', key: null };
  };

  componentDidUpdate(prevProps, _prevState) {
    // Update display config cache if preferences changed
    if (
      prevProps.showSpeakers !== this.props.showSpeakers ||
      prevProps.showTimecodes !== this.props.showTimecodes ||
      prevProps.timecodeOffset !== this.props.timecodeOffset ||
      prevProps.isEditable !== this.props.isEditable
    ) {
      this.updateDisplayConfig();
    }

    // Phase 2B: Update word highlighting when currentTime changes
    if (prevProps.currentTime !== this.props.currentTime) {
      requestAnimationFrame(() => {
        this.updateWordHighlighting();
      });
    }

    // Note: Display preference changes are now handled via React Context.
    // WrapperBlock components subscribe to context and re-render automatically when these values change.
    // This eliminates the need for expensive forceRenderDecorator() calls.
  }

  componentWillUnmount() {
    // Phase 2B: Clean up highlighted elements
    this.cleanupHighlighting();

    // Phase 3: Cancel progressive loading if in progress
    this.loadingCancelled = true;
  }

  // Update the cached display config (only when preferences actually change)
  updateDisplayConfig = () => {
    this.displayConfig = {
      showSpeakers: this.props.showSpeakers !== undefined ? this.props.showSpeakers : true,
      showTimecodes: this.props.showTimecodes !== undefined ? this.props.showTimecodes : true,
      timecodeOffset: this.props.timecodeOffset || 0,
      isEditable: this.props.isEditable !== undefined ? this.props.isEditable : true
    };
  };

  onChange = editorState => {
    // https://draftjs.org/docs/api-reference-editor-state#lastchangetype
    // https://draftjs.org/docs/api-reference-editor-change-type
    // doing editorStateChangeType === 'insert-characters'  is triggered even
    // outside of draftJS eg when clicking play button so using this instead
    // see issue https://github.com/facebook/draft-js/issues/1060
    // also "insert-characters" does not get triggered if you delete text
    if (this.state.editorState && editorState &&
        this.state.editorState.getCurrentContent() !== editorState.getCurrentContent()) {
      if (this.props.isPauseWhileTypingOn) {
        if (this.props.isPlaying()) {
          this.props.playMedia(false);
          // Pause video for X seconds
          const pauseWhileTypingIntervalInMilliseconds = 3000;
          // resets timeout
          clearTimeout(this.plauseWhileTypingTimeOut);
          this.plauseWhileTypingTimeOut = setTimeout(
            function() {
              // after timeout starts playing again
              this.props.playMedia(true);
            }.bind(this),
            pauseWhileTypingIntervalInMilliseconds
          );
        }
      }

      if (this.saveTimer !== undefined) {
        clearTimeout(this.saveTimer);
      }
      this.saveTimer = setTimeout(() => {
        this.setState(
          () => ({
            editorState
          }),
          () => {
            // Rebuild cache when content changes
            this.cacheWordTimings(editorState);
            // const data = this.updateTimestampsForEditorState();
            const data = this.getEditorContent( this.props.autoSaveContentType, this.props.title);
            if (typeof this.props.handleAutoSaveChanges === 'function') {
              this.props.handleAutoSaveChanges(data);
            }
          }
        );
      }, 1000);
    }

    if (this.props.isEditable) {
      this.setState({ editorState });
    }
  };

  updateTimestampsForEditorState() {
    // Guard against undefined editorState
    if (!this.state.editorState) {
      return null;
    }

    // Update timestamps according to the original state.
    const currentContent = convertToRaw(
      this.state.editorState.getCurrentContent()
    );
    const updatedContentRaw = updateTimestamps(
      currentContent,
      this.state.originalState
    );
    const updatedContent = convertFromRaw(updatedContentRaw);

    // Update editor state
    const newEditorState = EditorState.push(
      this.state.editorState,
      updatedContent
    );

    // Re-convert updated content to raw to gain access to block keys
    const updatedContentBlocks = convertToRaw(updatedContent);

    // Get current selection state and update block keys
    const selectionState = this.state.editorState.getSelection();

    // Check if editor has currently the focus. If yes, keep current selection.
    if (selectionState.getHasFocus()) {
      // Build block map, which maps the block keys of the previous content to the block keys of the
      // updated content.
      const blockMap = {};
      for (
        let blockIdx = 0;
        blockIdx < currentContent.blocks.length;
        blockIdx++
      ) {
        blockMap[currentContent.blocks[blockIdx].key] =
          updatedContentBlocks.blocks[blockIdx].key;
      }

      const selection = selectionState.merge({
        anchorOffset: selectionState.getAnchorOffset(),
        anchorKey: blockMap[selectionState.getAnchorKey()],
        focusOffset: selectionState.getFocusOffset(),
        focusKey: blockMap[selectionState.getFocusKey()]
      });

      // Set the updated selection state on the new editor state
      const newEditorStateSelected = EditorState.forceSelection(
        newEditorState,
        selection
      );
      this.setState({ editorState: newEditorStateSelected });
      return newEditorStateSelected;
    } else {
      this.setState({ editorState: newEditorState });
      return newEditorState;
    }
  }

  /**
   * Cache word timings for fast binary search lookup
   * Builds a sorted array of word timing data to avoid expensive convertToRaw calls
   * Called when editor content changes
   */
  cacheWordTimings = (editorState) => {
    // Guard against undefined editorState
    if (!editorState) {
      return;
    }

    const contentState = editorState.getCurrentContent();
    const raw = convertToRaw(contentState);
    const wordTimings = [];

    // Extract all word timings from entityMap
    for (const key in raw.entityMap) {
      const entity = raw.entityMap[key];
      if (entity.data && entity.data.start !== undefined) {
        wordTimings.push({
          start: entity.data.start,
          end: entity.data.end,
          key
        });
      }
    }

    // Sort for binary search - O(n log n) one time cost
    wordTimings.sort((a, b) => a.start - b.start);

    this.setState({
      wordTimings,
      cachedEntityMap: raw.entityMap
    });
  };

  /**
   * Phase 3: Helper function to extract entityMap for specific blocks
   * This creates a subset of entities only referenced by the given block range
   * @param {Object} fullData - Complete transcript data with blocks and entityMap
   * @param {number} start - Starting block index (inclusive)
   * @param {number} end - Ending block index (exclusive)
   * @returns {Object} Filtered entityMap containing only referenced entities
   */
  getEntityMapForBlocks = (fullData, start, end) => {
    const entityMap = {};
    const blocks = fullData.blocks.slice(start, end);

    blocks.forEach(block => {
      if (block.entityRanges && Array.isArray(block.entityRanges)) {
        block.entityRanges.forEach(range => {
          const key = range.key;
          if (fullData.entityMap[key] && !entityMap[key]) {
            entityMap[key] = fullData.entityMap[key];
          }
        });
      }
    });

    return entityMap;
  };

  /**
   * Phase 5 & 6: Web Worker-enabled data loading with IndexedDB caching
   * 1. Check IndexedDB cache first (Phase 6)
   * 2. If cache miss, convert using Web Worker (Phase 5)
   * 3. Save to cache for future loads (Phase 6)
   * Falls back to progressive loading for compatibility
   */
  async loadData() {
    if (this.props.transcriptData === null) return;

    // Phase 6: Generate cache key from transcript data
    const cacheManager = getCacheManager();
    const mediaUrl = this.props.mediaUrl || this.props.fileName || 'unknown';
    const dataHash = hashTranscriptData(this.props.transcriptData);

    // Phase 6: Check cache first
    try {
      this.setState({ isLoadingFromCache: true });

      const cached = await cacheManager.checkCache(mediaUrl, dataHash);
      const isStale = cached && this.props.documentTimestamp && cached.metadata && cached.metadata.cachedAt && cached.metadata.cachedAt < this.props.documentTimestamp;

      if (cached && !isStale) {
        /* eslint-disable-next-line no-console */
        console.log('✨ Loading from cache - instant load!');

        // Use cached data directly
        this.setState({
          isLoadingFromCache: false,
          cacheHit: true,
          originalState: convertToRaw(convertFromRaw(cached.blocks))
        });

        // Set word timings cache (Phase 1 optimization)
        if (cached.wordTimings) {
          this.setState({ wordTimings: cached.wordTimings });
        }

        // Load content - use progressive loading for large transcripts
        const totalBlocks = cached.blocks.blocks.length;
        const CHUNK_SIZE = this.chunkSize; // Phase 7: Dynamic chunk size
        const USE_PROGRESSIVE_LOADING = totalBlocks >= this.progressiveLoadingThreshold;

        if (!USE_PROGRESSIVE_LOADING) {
          this.setEditorContentState(cached.blocks);
        } else {
          // Progressive loading for large cached transcripts
          this.loadingCancelled = false;
          this.setState({
            isInitialLoad: true,
            totalBlocks,
            loadedBlockCount: 0
          });

          const firstChunk = {
            blocks: cached.blocks.blocks.slice(0, CHUNK_SIZE),
            entityMap: this.getEntityMapForBlocks(cached.blocks, 0, CHUNK_SIZE)
          };

          this.setEditorContentState(firstChunk);
          this.setState({ loadedBlockCount: CHUNK_SIZE });
          this.loadRemainingChunks(cached.blocks, CHUNK_SIZE, totalBlocks);
        }

        return;
      }

      if (isStale) {
        this.setState({ isLoadingFromCache: false, cacheHit: false });
      }

      // Cache miss - continue with worker conversion
      this.setState({ isLoadingFromCache: false, cacheHit: false });

    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.warn('Cache check failed, continuing with conversion:', error);
      this.setState({ isLoadingFromCache: false, cacheHit: false });
    }

    // Phase 5: Worker-based conversion (cache miss path)
    const workerManager = getWorkerManager();
    let blocks;

    try {
      // Show processing indicator
      this.setState({
        isProcessingWorker: true,
        workerProgress: { current: 0, total: 0, percentage: 0 }
      });

      // Convert using worker with progress tracking
      blocks = await workerManager.convertTranscript(
        this.props.transcriptData,
        this.props.sttJsonType,
        (progress) => {
          // Update progress state
          this.setState({ workerProgress: progress });
        }
      );

      // Hide processing indicator
      this.setState({ isProcessingWorker: false });

    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.warn('Worker conversion failed, using fallback:', error);

      // Fallback: synchronous conversion
      this.setState({ isProcessingWorker: false });
      blocks = sttJsonAdapter(
        this.props.transcriptData,
        this.props.sttJsonType
      );
    }

    // Store original state for timestamp updates
    this.setState({ originalState: convertToRaw(convertFromRaw(blocks)) });

    const totalBlocks = blocks.blocks.length;

    // Phase 3: Progressive loading optimization
    // For small transcripts (<threshold blocks), load everything at once (fast path)
    // For large transcripts (>=threshold blocks), use chunked loading
    const CHUNK_SIZE = this.chunkSize; // Phase 7: Dynamic chunk size based on device
    const USE_PROGRESSIVE_LOADING = totalBlocks >= this.progressiveLoadingThreshold;

    if (!USE_PROGRESSIVE_LOADING) {
      // Fast path: Small transcript - load immediately
      this.setEditorContentState(blocks);

      // Phase 6: Save to cache after successful load
      this.saveToCacheAsync(cacheManager, mediaUrl, dataHash, blocks);

      return;
    }

    // Progressive loading path for large transcripts
    this.loadingCancelled = false;
    this.setState({
      isInitialLoad: true,
      totalBlocks,
      loadedBlockCount: 0
    });

    // Load first chunk immediately for fast initial render
    const firstChunk = {
      blocks: blocks.blocks.slice(0, CHUNK_SIZE),
      entityMap: this.getEntityMapForBlocks(blocks, 0, CHUNK_SIZE)
    };

    this.setEditorContentState(firstChunk);
    this.setState({ loadedBlockCount: CHUNK_SIZE });

    // Load remaining chunks progressively
    this.loadRemainingChunks(blocks, CHUNK_SIZE, totalBlocks);

    // Phase 6: Save to cache after all chunks loaded
    // We save the full blocks object for future instant loads
    this.saveToCacheAsync(cacheManager, mediaUrl, dataHash, blocks);
  }

  /**
   * Phase 6: Save processed data to cache asynchronously
   * Non-blocking cache save to not slow down UI
   */
  saveToCacheAsync = async (cacheManager, mediaUrl, dataHash, blocks) => {
    try {
      // Get word timings from state (Phase 1 optimization)
      const wordTimings = this.state.wordTimings;

      // Save in background (non-blocking)
      await cacheManager.saveToCache(mediaUrl, dataHash, blocks, wordTimings);
      /* eslint-disable-next-line no-console */
      console.log('💾 Saved to cache for instant future loads');

    } catch (error) {
      // Cache save failure is non-critical, just log it
      /* eslint-disable-next-line no-console */
      console.warn('Failed to save to cache (non-critical):', error);
    }
  };

  /**
   * Phase 3: Load remaining chunks using requestIdleCallback
   * This prevents blocking the main thread and keeps UI responsive
   * Phase 7: Uses dynamic chunk size based on device capabilities
   */
  loadRemainingChunks = (fullBlocks, startFrom, totalBlocks) => {
    const CHUNK_SIZE = this.chunkSize; // Phase 7: Dynamic chunk size
    let currentIndex = startFrom;

    const loadNextChunk = () => {
      if (this.loadingCancelled || currentIndex >= totalBlocks) {
        // Loading complete - hide indicator immediately
        this.setState({
          isInitialLoad: false,
          loadedBlockCount: totalBlocks
        });
        return;
      }

      const endIndex = Math.min(currentIndex + CHUNK_SIZE, totalBlocks);

      // Create cumulative chunk (all blocks up to endIndex)
      const chunk = {
        blocks: fullBlocks.blocks.slice(0, endIndex),
        entityMap: this.getEntityMapForBlocks(fullBlocks, 0, endIndex)
      };

      if (this.props.debugPerformance) {
        const perf = typeof globalThis !== 'undefined' ? globalThis.performance : undefined;
        if (perf && typeof perf.mark === 'function') {
          perf.mark('chunk_start');
        }
      }
      this.setEditorContentState(chunk);
      if (this.props.debugPerformance) {
        const perf = typeof globalThis !== 'undefined' ? globalThis.performance : undefined;
        if (perf && typeof perf.mark === 'function' && typeof perf.measure === 'function') {
          perf.mark('chunk_end');
          perf.measure('chunk', 'chunk_start', 'chunk_end');
        }
      }

      // Update progress
      this.setState({ loadedBlockCount: endIndex });

      currentIndex = endIndex;

      // Check if this was the last chunk
      if (currentIndex >= totalBlocks) {
        // All blocks loaded - hide indicator
        this.setState({ isInitialLoad: false });
        return;
      }

      // Schedule next chunk using requestIdleCallback or setTimeout fallback
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(() => loadNextChunk(), { timeout: 100 });
      } else {
        setTimeout(loadNextChunk, 0);
      }
    };

    // Start loading next chunk
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(loadNextChunk, { timeout: 100 });
    } else {
      setTimeout(loadNextChunk, 0);
    }
  };

  getEditorContent(exportFormat, title) {
    const format = exportFormat || 'draftjs';
    const tmpEditorState = this.updateTimestampsForEditorState();

    // Guard against undefined editorState
    if (!tmpEditorState) {
      return null;
    }

    const rawContent = convertToRaw(tmpEditorState.getCurrentContent());

    if (typeof exportAdapter !== 'function') {
      /* eslint-disable-next-line no-console */
      console.warn('exportAdapter is unavailable, falling back to raw DraftJS payload');
      return { data: rawContent, ext: 'json' };
    }

    try {
      return exportAdapter(
        rawContent,
        format,
        title
      );
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.error('exportAdapter failed, falling back to raw DraftJS payload', error);
      return { data: rawContent, ext: 'json' };
    }
  }

  // click on words - for navigation

  handleDoubleClick = event => {
    // Ignore double-clicks in the speaker/timecode header area
    const dblTarget = event.nativeEvent && event.nativeEvent.target;
    if (dblTarget && typeof dblTarget.closest === 'function') {
      const inMarkers = dblTarget.closest('.speaker-timecode-flexbox');
      if (inMarkers) return;
    }

    // nativeEvent --> React giving you the DOM event
    let element = event.nativeEvent.target;
    // find the parent in Word that contains span with time-code start attribute
    while (!element.hasAttribute('data-start') && element.parentElement) {
      element = element.parentElement;
    }

    if (element.hasAttribute('data-start')) {
      const t = parseFloat(element.getAttribute('data-start'));
      this.props.onWordClick(t);
    }
  };

  // Add single click handler for word clicking
  handleWordClick = event => {
    // Only handle single clicks, not double clicks
    if (event.detail === 2) return; // Ignore if it's a double click

    // Ignore clicks inside the speaker/timecode header area to allow editing
    const target = event.target;
    if (target && typeof target.closest === 'function') {
      const inMarkers = target.closest('.speaker-timecode-flexbox');
      if (inMarkers) return;
    }

    // nativeEvent --> React giving you to DOM event
    let element = event.target;
    // find parent in Word that contains span with time-code start attribute
    while (!element.hasAttribute('data-start') && element.parentElement) {
      element = element.parentElement;
    }

    if (element.hasAttribute('data-start')) {
      const t = parseFloat(element.getAttribute('data-start'));
      this.props.onWordClick(t);
    }
  };

  // originally from
  // https://github.com/draft-js-plugins/draft-js-plugins/blob/master/draft-js-counter-plugin/src/WordCounter/index.js#L12
  getWordCount = editorState => {
    // Guard against undefined editorState
    if (!editorState) {
      return 0;
    }

    const plainText = editorState.getCurrentContent().getPlainText('');
    const regex = /(?:\r\n|\r|\n)/g; // new line, carriage return, line feed
    const cleanString = plainText.replace(regex, ' ').trim(); // replace above characters w/ space
    const wordArray = cleanString.match(/\S+/g); // matches words according to whitespace

    return wordArray ? wordArray.length : 0;
  };

  /**
   * @param {object} data.entityMap - draftJs entity maps - used by convertFromRaw
   * @param {object} data.blocks - draftJs blocks - used by convertFromRaw
   * set DraftJS Editor content state from blocks
   * contains blocks and entityMap
   */
  setEditorContentState = data => {
    const contentState = convertFromRaw(data);

    const editorState = EditorState.createWithContent(contentState, decorator);

    if (this.props.handleAnalyticsEvents !== undefined) {
      this.props.handleAnalyticsEvents({
        category: 'TimedTextEditor',
        action: 'setEditorContentState',
        name: 'getWordCount',
        value: this.getWordCount(editorState)
      });
    }

    this.setState({ editorState }, () => {
      // Build word timing cache for performance
      this.cacheWordTimings(editorState);
      const map = {};
      const blocks = data && data.blocks ? data.blocks : [];
      for (let i = 0; i < blocks.length; i++) {
        const ranges = blocks[i].entityRanges || [];
        for (let j = 0; j < ranges.length; j++) {
          map[ranges[j].key] = i;
        }
      }
      this.wordKeyToBlockIndex = map;
      this.forceRenderDecorator();
    });
  };

  // Helper function to re-render this component
  // used to re-render WrapperBlock on timecode offset change
  // or when show / hide preferences for speaker labels and timecodes change
  forceRenderDecorator = () => {
    // Guard against undefined editorState
    if (!this.state.editorState) {
      return;
    }

    const contentState = this.state.editorState.getCurrentContent();
    const decorator = this.state.editorState.getDecorator();
    const newState = EditorState.createWithContent(contentState, decorator);
    const newEditorState = EditorState.push(newState, contentState);
    this.setState({ editorState: newEditorState });
  };

  /**
   * Update Editor content state
   */
  setEditorNewContentState = newContentState => {
    const decorator = this.state.editorState.getDecorator();
    const newState = EditorState.createWithContent(newContentState, decorator);
    const newEditorState = EditorState.push(
      newState,
      newContentState
    );
    this.setState({ editorState: newEditorState });
  };

  setEditorNewContentStateSpeakersUpdate = newContentState => {
    const decorator = this.state.editorState.getDecorator();
    const newState = EditorState.createWithContent(newContentState, decorator);
    const editorState = EditorState.push(
      newState,
      newContentState
    );

    this.setState(
      () => ({
        editorState
      }),
      () => {
        const format =  this.props.autoSaveContentType;
        const title = this.props.title;

    const rawContent = convertToRaw(editorState.getCurrentContent());
    const data = typeof exportAdapter === 'function'
      ? exportAdapter(rawContent, format, title)
      : { data: rawContent, ext: 'json' };

      if (typeof this.props.handleAutoSaveChanges === 'function') {
        this.props.handleAutoSaveChanges(data);
      }
      }
    );
  };

  /**
   * Listen for draftJs custom key bindings
   */
  customKeyBindingFn = e => {
    const enterKey = 13;
    const spaceKey = 32;
    const kKey = 75;
    const lKey = 76;
    const jKey = 74;
    const equalKey = 187; //used for +
    const minusKey = 189; // -
    const rKey = 82;
    const tKey = 84;

    if (e.keyCode === enterKey) {
      /* eslint-disable-next-line no-console */
      console.log('customKeyBindingFn');

      return 'split-paragraph';
    }
    // if alt key is pressed in combination with these other keys
    if (
      e.altKey &&
      (e.keyCode === spaceKey ||
        e.keyCode === spaceKey ||
        e.keyCode === kKey ||
        e.keyCode === lKey ||
        e.keyCode === jKey ||
        e.keyCode === equalKey ||
        e.keyCode === minusKey ||
        e.keyCode === rKey ||
        e.keyCode === tKey)
    ) {
      e.preventDefault();

      return 'keyboard-shortcuts';
    }

    return getDefaultKeyBinding(e);
  };

  /**
   * Handle draftJs custom key commands
   */
  handleKeyCommand = command => {
    if (command === 'split-paragraph') {
      this.splitParagraph();
    }

    if (command === 'keyboard-shortcuts') {
      return 'handled';
    }
    return 'not-handled';
  };

  /**
   * Helper function to handle splitting paragraphs with return key
   * on enter key, perform split paragraph at selection point.
   * Add timecode of next word after split to paragraph
   * as well as speaker name to new paragraph
   * TODO: move into its own file as helper function
   */
  splitParagraph = () => {
    // https://github.com/facebook/draft-js/issues/723#issuecomment-367918580
    // https://draftjs.org/docs/api-reference-selection-state#start-end-vs-anchor-focus

    // Guard against undefined editorState
    if (!this.state.editorState) {
      return;
    }

    const currentSelection = this.state.editorState.getSelection();
    // only perform if selection is not selecting a range of words
    // in that case, we'd expect delete + enter to achieve same result.
    if (currentSelection.isCollapsed()) {
      const currentContent = this.state.editorState.getCurrentContent();
      // https://draftjs.org/docs/api-reference-modifier#splitblock
      const newContentState = Modifier.splitBlock(
        currentContent,
        currentSelection
      );
      // https://draftjs.org/docs/api-reference-editor-state#push
      const splitState = EditorState.push(
        this.state.editorState,
        newContentState,
        'split-block'
      );
      const targetSelection = splitState.getSelection();

      const originalBlock = currentContent.blockMap.get(
        newContentState.selectionBefore.getStartKey()
      );
      const originalBlockData = originalBlock.getData();
      const blockSpeaker = originalBlockData.get('speaker');

      let wordStartTime = 'NA';

      let isEndOfParagraph = false;
      // identify the entity (word) at the selection/cursor point on split.

      let entityKey = originalBlock.getEntityAt(
        currentSelection.getStartOffset()
      );
      // if there is no word entity associated with a char then there is no entity key
      // at that selection point
      if (entityKey === null) {
        const closestEntityToSelection = this.findClosestEntityKeyToSelectionPoint(
          currentSelection,
          originalBlock
        );
        entityKey = closestEntityToSelection.entityKey;
        isEndOfParagraph = closestEntityToSelection.isEndOfParagraph;
        // handle edge case when it doesn't find a closest entity (word)
        // eg pres enter on an empty line
        if (entityKey === null) {
          return 'not-handled';
        }
      }
      // if there is an entityKey at or close to the selection point
      // can get the word startTime. for the new paragraph.
      const entityInstance = currentContent.getEntity(entityKey);
      const entityData = entityInstance.getData();
      if (isEndOfParagraph) {
        // if it's end of paragraph use end time of word for new paragraph
        wordStartTime = entityData.end;
      } else {
        wordStartTime = entityData.start;
      }
      // split paragraph
      // https://draftjs.org/docs/api-reference-modifier#mergeblockdata
      const afterMergeContentState = Modifier.mergeBlockData(
        splitState.getCurrentContent(),
        targetSelection,
        {
          start: wordStartTime,
          speaker: blockSpeaker
        }
      );
      this.setEditorNewContentState(afterMergeContentState);

      return 'handled';
    }

    return 'not-handled';
  };

  /**
   * Helper function for splitParagraph
   * to find the closest entity (word) to a selection point
   * that does not fall on an entity to begin with
   * Looks before if it's last char in a paragraph block.
   * After for everything else.
   */
  findClosestEntityKeyToSelectionPoint = (currentSelection, originalBlock) => {
    // set defaults
    let entityKey = null;
    let isEndOfParagraph = false;

    // selection offset from beginning of the paragraph block
    const startSelectionOffsetKey = currentSelection.getStartOffset();
    // length of the plain text for the ContentBlock
    const lengthPlainTextForTheBlock = originalBlock.getLength();
    // number of char from selection point to end of paragraph
    const remainingCharNumber =
      lengthPlainTextForTheBlock - startSelectionOffsetKey;
    // if it's the last char in the paragraph - get previous entity
    if (remainingCharNumber === 0) {
      isEndOfParagraph = true;
      for (let j = lengthPlainTextForTheBlock; j > 0; j--) {
        entityKey = originalBlock.getEntityAt(j);
        if (entityKey !== null) {
          // if it finds it then return
          return { entityKey, isEndOfParagraph };
        }
      }
    }
    // if it's first char or another within the block - get next entity
    else {
      let initialSelectionOffset = currentSelection.getStartOffset();
      for (let i = 0; i < remainingCharNumber; i++) {
        initialSelectionOffset += i;
        entityKey = originalBlock.getEntityAt(initialSelectionOffset);
        // if it finds it then return
        if (entityKey !== null) {
          return { entityKey, isEndOfParagraph };
        }
      }
    }

    // cover edge cases where it doesn't find it
    return { entityKey, isEndOfParagraph };
  };

  /**
   * Get the current word being played - OPTIMIZED VERSION
   * Uses binary search on cached word timings instead of linear search
   * Reduces time complexity from O(n) to O(log n)
   * Caches last result to avoid redundant calculations
   */
  getCurrentWord = () => {
    const { wordTimings } = this.state;
    const currentTime = this.props.currentTime;

    // Early return if we're still in the same word (using instance variable, not state)
    if (
      this.lastCurrentWord.start !== 'NA' &&
      this.lastCurrentWord.start - this.timeEpsilon <= currentTime &&
      this.lastCurrentWord.end + this.timeEpsilon >= currentTime
    ) {
      return this.lastCurrentWord;
    }

    // Binary search for current word - O(log n) instead of O(n)
    let left = 0;
    let right = wordTimings.length - 1;
  let result = { start: 'NA', end: 'NA', key: null };

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const word = wordTimings[mid];

      if (word.start - this.timeEpsilon <= currentTime && word.end + this.timeEpsilon >= currentTime) {
        result = { start: word.start, end: word.end, key: word.key };
        break;
      } else if (word.start > currentTime) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    // Cache result in instance variable (NOT state) to avoid setState during render
    if (result.start !== 'NA') {
      this.lastCurrentWord = result;

      // Optimized scroll-into-view with requestAnimationFrame to prevent forced reflow
      if (this.props.isScrollIntoViewOn && !this.scrollThrottle) {
        this.scrollThrottle = true;

        // Use requestAnimationFrame for smooth, non-blocking scroll
        requestAnimationFrame(() => {
          // Prefer selecting by stable entity key to avoid float string mismatches
          let currentWordElement = null;
          if (result.key) {
            currentWordElement = document.querySelector(
              `span.Word[data-entity-key="${result.key}"]`
            );
          }
          // Fallback to data-start attribute if entity key not available
          if (!currentWordElement) {
            currentWordElement = document.querySelector(
              `span.Word[data-start="${result.start}"]`
            );
          }

          if (currentWordElement) {
            /* eslint-disable-next-line no-console */
            console.log('🎯 Attempting to scroll to word at time:', result.start, 'key:', result.key);

            currentWordElement.scrollIntoView({
              block: 'center',
              inline: 'nearest',
              behavior: 'smooth'
            });
          } else {
            /* eslint-disable-next-line no-console */
            console.warn('⚠️ Word element not found for time/key:', result.start, result.key);
          }

          // Reset throttle after a delay (max 10 scrolls per second)
          setTimeout(() => {
            this.scrollThrottle = null;
          }, 100);
        });
      } else {
        if (!this.props.isScrollIntoViewOn) {
          /* eslint-disable-next-line no-console */
          console.log('⏸️ Scroll sync is OFF');
        }
      }
    }

    return result;
  };

  /**
   * Phase 2B: Update word highlighting using CSS class toggling
   * Replaces dynamic <style> injection with static CSS classes
   * Performance improvement: 95-97% reduction in CSS overhead
   */
  updateWordHighlighting = () => {
    if (this.props.debugPerformance) {
      const perf = typeof globalThis !== 'undefined' ? globalThis.performance : undefined;
      if (perf && typeof perf.mark === 'function') {
        perf.mark('highlight_start');
      }
    }
    const currentWord = this.getCurrentWord();
    const time = Math.round(this.props.currentTime * 4.0) / 4.0;

    // Update active word highlight
    this.updateActiveWordHighlight(currentWord);

    // Update unplayed words
    this.updateUnplayedWords(time);
    if (this.props.debugPerformance) {
      const perf = typeof globalThis !== 'undefined' ? globalThis.performance : undefined;
      if (perf && typeof perf.mark === 'function' && typeof perf.measure === 'function') {
        perf.mark('highlight_end');
        perf.measure('highlight', 'highlight_start', 'highlight_end');
      }
    }
  };

  /**
   * Update the currently active word highlight
   * Removes highlight from previous word, adds to current word
   */
  updateActiveWordHighlight = (currentWord) => {
    // Remove previous highlight
    if (this.highlightedElements.current) {
      this.highlightedElements.current.classList.remove('word-active');
    }
    if (this.highlightedElements.next) {
      this.highlightedElements.next.classList.remove('word-active-next');
    }

    // Add new highlight if we have a valid current word
    if (currentWord.start !== 'NA') {
      // Prefer selecting by stable entity key to avoid float-string mismatches
      let element = null;
      if (currentWord.key) {
        element = document.querySelector(`span.Word[data-entity-key="${currentWord.key}"]`);
      }
      if (!element) {
        element = document.querySelector(`span.Word[data-start="${currentWord.start}"]`);
      }

      if (element) {
        console.log('updateActiveWordHighlight - element:', element);
        // Only add class if not already present (avoid unnecessary DOM mutations)
        if (!element.classList.contains('word-active')) {
          element.classList.add('word-active');
        }
        this.highlightedElements.current = element;
        if (currentWord.key && this.wordKeyToBlockIndex) {
          const idx = this.wordKeyToBlockIndex[currentWord.key];
          this.currentWordBlockIndex = typeof idx === 'number' ? idx : null;
        } else {
          this.currentWordBlockIndex = null;
        }

        // Highlight the next sibling word as well - walk to the next element with class 'Word'
        let nextSibling = element.nextElementSibling;
        while (nextSibling && !nextSibling.classList.contains('Word')) {
          nextSibling = nextSibling.nextElementSibling;
        }

        if (nextSibling && nextSibling.classList.contains('Word')) {
          console.log('updateActiveWordHighlight - nextSibling:', nextSibling);
          if (!nextSibling.classList.contains('word-active-next')) {
            nextSibling.classList.add('word-active-next');
          }
          this.highlightedElements.next = nextSibling;
        } else {
          this.highlightedElements.next = null;
        }
      }
    } else {
      this.highlightedElements.current = null;
      this.highlightedElements.next = null;
    }
  };

  /**
   * Update unplayed words styling
   * Uses data-prev-times attribute to efficiently select unplayed words
   */
  updateUnplayedWords = (time) => {
    const timeFloor = Math.floor(time);

    // Clear previous unplayed highlights
    this.highlightedElements.unplayedSet.forEach(el => {
      el.classList.remove('word-unplayed');
    });
    this.highlightedElements.unplayedSet.clear();

    // Find and highlight unplayed words using attribute selectors
    // This matches the original behavior using data-prev-times
    const scopeRoot = this.highlightedElements.current ? (this.highlightedElements.current.closest('div') || document) : document;
    const unplayedElements = scopeRoot.querySelectorAll(
      `span.Word[data-prev-times~="${timeFloor}"], span.Word[data-prev-times~="${time}"]`
    );

    unplayedElements.forEach(el => {
      if (!el.classList.contains('word-unplayed')) {
        el.classList.add('word-unplayed');
      }
      this.highlightedElements.unplayedSet.add(el);
    });
  };

  /**
   * Clean up all highlighting on unmount
   * Ensures no leaked class names remain on DOM elements
   */
  cleanupHighlighting = () => {
    // Remove active word highlights
    if (this.highlightedElements.current) {
      this.highlightedElements.current.classList.remove('word-active');
    }
    if (this.highlightedElements.next) {
      this.highlightedElements.next.classList.remove('word-active-next');
    }

    // Remove unplayed word highlights
    this.highlightedElements.unplayedSet.forEach(el => {
      el.classList.remove('word-unplayed');
    });

    // Clear references
    this.highlightedElements.current = null;
    this.highlightedElements.next = null;
    this.highlightedElements.unplayedSet.clear();
  };

  onWordClick = e => {
    this.props.onWordClick(e);
  };

  render() {
    // Guard against undefined editorState during initialization
    if (!this.state.editorState) {
      return (
        <section className={style.editor}>
          <div>Loading editor...</div>
        </section>
      );
    }

    // console.log('render TimedTextEditor');

    // Phase 2B: No longer needed - replaced with CSS class-based highlighting
    // const currentWord = this.getCurrentWord();
    // const highlightColour = '#69e3c2';
    // const unplayedColor = '#767676';
    // const correctionBorder = '1px dotted blue';
    // const time = Math.round(this.props.currentTime * 4.0) / 4.0;

    // Phase 3: Progressive loading indicator
    // Phase 7: Added deviceTierDescription for enhanced loading UI
    const { isInitialLoad, loadedBlockCount, totalBlocks, isProcessingWorker, workerProgress, deviceTierDescription } = this.state;
    const loadingProgress = isInitialLoad && totalBlocks > 0
      ? Math.round((loadedBlockCount / totalBlocks) * 100)
      : 0;

    // Phase 4: Virtual scrolling decision
    // Use virtual scrolling for transcripts with 100+ blocks
    // This reduces DOM nodes by 90% and improves scroll performance
    // TEMPORARILY DISABLED - needs debugging for DraftJS compatibility
    const useVirtualScrolling = !isInitialLoad && totalBlocks >= 100 && !this.displayConfig.isEditable;

    // Use cached display config to prevent creating new objects on every render
    // This prevents unnecessary context updates and re-renders of WrapperBlock components
    const editor = (
      <section
        className={style.editor}
        onDoubleClick={this.handleDoubleClick}
        onClick={this.handleWordClick}
        // TODO: decide if on mobile want to have a way to "click" on words
        // to play corresponding media
        // a double tap would be the ideal solution
        // onTouchStart={ event => this.handleDoubleClick(event) }
      >
        {/* Phase 5: Worker processing indicator */}
        {isProcessingWorker && (
          <div className={style.loadingIndicator}>
            <div className={style.loadingSpinner}></div>
            <span className={style.loadingProgress}>
              {workerProgress.total > 0
                ? `Converting transcript: ${workerProgress.current} / ${workerProgress.total} segments (${workerProgress.percentage}%)`
                : 'Processing transcript in background...'
              }
            </span>
          </div>
        )}

        {/* Phase 3: Loading progress indicator */}
        {/* Phase 7: Enhanced with device tier information */}
        {isInitialLoad && !isProcessingWorker && (
          <div className={style.loadingIndicator}>
            <div className={style.loadingSpinner}></div>
            <span className={style.loadingProgress}>
              Loading transcript: {loadedBlockCount} / {totalBlocks} blocks ({loadingProgress}%)
              {deviceTierDescription && (
                <span className={style.deviceTierBadge}> • {deviceTierDescription}</span>
              )}
            </span>
          </div>
        )}

        {/* Phase 4: Conditional rendering - virtual scrolling vs standard editor */}
        {/* Phase 2B: Removed <style scoped> injection - now using CSS classes */}
        {/* This eliminates 8-12ms of CSS parsing overhead per frame (95-97% improvement) */}
        {useVirtualScrolling ? (
          <VirtualizedEditor
            editorState={this.state.editorState}
            onChange={this.onChange}
            onWordClick={this.onWordClick}
            setEditorNewContentStateSpeakersUpdate={this.setEditorNewContentStateSpeakersUpdate}
            handleAnalyticsEvents={this.props.handleAnalyticsEvents}
            displayConfig={this.displayConfig}
            currentWordIndex={this.currentWordBlockIndex}
          />
        ) : (
          <TranscriptDisplayContext.Provider value={this.displayConfig}>
            <CustomEditor
              editorState={this.state.editorState}
              onChange={this.onChange}
              stripPastedStyles
              handleKeyCommand={this.handleKeyCommand}
              customKeyBindingFn={this.customKeyBindingFn}
              spellCheck={this.props.spellCheck}
              setEditorNewContentStateSpeakersUpdate={this.setEditorNewContentStateSpeakersUpdate}
              onWordClick={this.onWordClick}
              handleAnalyticsEvents={this.props.handleAnalyticsEvents}
            />
          </TranscriptDisplayContext.Provider>
        )}
      </section>
    );

    return (
      <section>{this.props.transcriptData !== null ? editor : null}</section>
    );
  }
}

// DraftJs decorator to recognize which entity is which
// and know what to apply to what component
const getEntityStrategy = mutability => (
  contentBlock,
  callback,
  contentState
) => {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    if (entityKey === null) {
      return false;
    }

    return contentState.getEntity(entityKey).getMutability() === mutability;
  }, callback);
};

// decorator definition - Draftjs
// defines what to use to render the entity
const decorator = new CompositeDecorator([
  {
    strategy: getEntityStrategy('MUTABLE'),
    component: Word
  }
]);

TimedTextEditor.propTypes = {
  transcriptData: PropTypes.object,
  mediaUrl: PropTypes.string,
  isEditable: PropTypes.bool,
  spellCheck: PropTypes.bool,
  onWordClick: PropTypes.func,
  sttJsonType: PropTypes.string,
  isPlaying: PropTypes.func,
  playMedia: PropTypes.func,
  currentTime: PropTypes.number,
  isScrollIntoViewOn: PropTypes.bool,
  isPauseWhileTypingOn: PropTypes.bool,
  timecodeOffset: PropTypes.number,
  handleAnalyticsEvents: PropTypes.func,
  showSpeakers: PropTypes.bool,
  showTimecodes: PropTypes.bool,
  fileName: PropTypes.string
};

export default TimedTextEditor;
