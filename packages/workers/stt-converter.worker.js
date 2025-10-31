/* eslint-disable no-restricted-globals, no-undef */
/**
 * Web Worker for STT JSON to DraftJS conversion
 * Offloads CPU-intensive transcript processing to background thread
 * 
 * Performance Impact:
 * - Keeps UI thread responsive during processing
 * - Enables progress reporting for large transcripts
 * - Expected 50-70% faster perceived load time
 */

// ============================================
// UTILITY FUNCTIONS (copied from adapters)
// ============================================

/**
 * Flatten nested arrays into one-dimensional array
 */
const flatten = list => list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

/**
 * Generate DraftJS entity ranges with offset and length for word positioning
 */
const generateEntitiesRanges = (words, wordAttributeName) => {
  let position = 0;

  return words.map((word) => {
    const result = {
      start: word.start,
      end: word.end,
      confidence: word.confidence,
      text: word[wordAttributeName],
      offset: position,
      length: word[wordAttributeName].length,
      key: Math.random()
        .toString(36)
        .substring(6)
    };
    // increase position counter - to determine word offset in paragraph
    position = position + word[wordAttributeName].length + 1;

    return result;
  });
};

/**
 * Create DraftJS entityMap from blocks
 */
const createEntityMap = (blocks) => {
  const entityRanges = blocks.map(block => block.entityRanges);
  const flatEntityRanges = flatten(entityRanges);

  const entityMap = {};

  flatEntityRanges.forEach((data) => {
    entityMap[data.key] = {
      type: 'WORD',
      mutability: 'MUTABLE',
      data
    };
  });

  return entityMap;
};

// ============================================
// WHISPER ADAPTER (optimized for worker)
// ============================================

const asNumber = value => {
  if (value === undefined || value === null) {
    return undefined;
  }

  const num = typeof value === 'string' ? parseFloat(value) : value;
  return Number.isFinite(num) ? num : undefined;
};

const normaliseWords = (segment, segmentIndex) => {
  if (Array.isArray(segment.words) && segment.words.length > 0) {
    return segment.words
      .map((word) => {
        const rawText = (word.word ?? word.text ?? '').toString().trim();
        if (!rawText) {
          return null;
        }

        const start =
          asNumber(word.start) ??
          asNumber(word.start_time) ??
          asNumber(segment.start);
        const end =
          asNumber(word.end) ??
          asNumber(word.end_time) ??
          start ??
          asNumber(segment.end);

        const confidence =
          asNumber(word.probability) ??
          asNumber(word.confidence) ??
          asNumber(segment.confidence);

        return {
          start: start ?? 0,
          end: end ?? start ?? 0,
          confidence: confidence ?? undefined,
          punct: rawText,
          word: rawText,
          text: rawText,
          speaker: word.speaker ?? word.speaker_label ?? segment.speaker_label
        };
      })
      .filter(Boolean);
  }

  const fallbackText = (segment.text ?? '').trim();
  if (!fallbackText) {
    return [];
  }

  const start = asNumber(segment.start) ?? 0;
  const end = asNumber(segment.end) ?? start;

  return [
    {
      start,
      end,
      confidence: asNumber(segment.confidence) ?? undefined,
      punct: fallbackText,
      word: fallbackText,
      text: fallbackText,
      speaker: segment.speaker_label ?? `TBC ${segmentIndex}`
    }
  ];
};

const extractSegments = whisperJson => {
  if (!whisperJson) {
    return [];
  }

  if (Array.isArray(whisperJson)) {
    return whisperJson;
  }

  if (Array.isArray(whisperJson.segments)) {
    return whisperJson.segments;
  }

  if (whisperJson.results && Array.isArray(whisperJson.results.segments)) {
    return whisperJson.results.segments;
  }

  return [];
};

const whisperToDraft = (whisperJson, onProgress) => {
  const segments = extractSegments(whisperJson);
  const totalSegments = segments.length;

  const blocks = segments
    .map((segment, index) => {
      // Report progress every 100 segments or at the end
      if (onProgress && (index % 100 === 0 || index === totalSegments - 1)) {
        onProgress({
          type: 'progress',
          current: index + 1,
          total: totalSegments,
          percentage: Math.round(((index + 1) / totalSegments) * 100)
        });
      }

      const words = normaliseWords(segment, index);
      if (!words.length) {
        return null;
      }

      const text = words.map(word => word.punct).join(' ').trim();
      const startTime = words[0].start ?? 0;
      const speakerLabel =
        (segment.speaker_label && segment.speaker_label.trim()) ||
        (words[0].speaker && words[0].speaker.trim()) ||
        `TBC ${index}`;

      return {
        text,
        type: 'paragraph',
        data: {
          speaker: speakerLabel,
          words,
          start: startTime
        },
        entityRanges: generateEntitiesRanges(words, 'punct')
      };
    })
    .filter(Boolean);

  // Merge consecutive blocks with the same speaker
  const mergedBlocks = [];
  for (let i = 0; i < blocks.length; i++) {
    const currentBlock = blocks[i];
    
    if (mergedBlocks.length === 0 || mergedBlocks[mergedBlocks.length - 1].data.speaker !== currentBlock.data.speaker) {
      mergedBlocks.push(currentBlock);
    } else {
      const previousBlock = mergedBlocks[mergedBlocks.length - 1];
      previousBlock.text = previousBlock.text + ' ' + currentBlock.text;
      previousBlock.data.words = [...previousBlock.data.words, ...currentBlock.data.words];
      previousBlock.entityRanges = generateEntitiesRanges(previousBlock.data.words, 'punct');
    }
  }

  return mergedBlocks;
};

// ============================================
// BBC KALDI ADAPTER (for backwards compatibility)
// ============================================

const bbcKaldiToDraft = (bbcKaldiJson, onProgress) => {
  if (!bbcKaldiJson || !Array.isArray(bbcKaldiJson.words)) {
    return [];
  }

  const words = bbcKaldiJson.words;
  const totalWords = words.length;
  
  // Group words by paragraph/speaker
  const paragraphs = [];
  let currentParagraph = { words: [], speaker: null };

  words.forEach((word, index) => {
    if (onProgress && index % 500 === 0) {
      onProgress({
        type: 'progress',
        current: index + 1,
        total: totalWords,
        percentage: Math.round(((index + 1) / totalWords) * 100)
      });
    }

    const speaker = word.speaker || 'Unknown';
    
    if (currentParagraph.speaker !== speaker && currentParagraph.words.length > 0) {
      paragraphs.push(currentParagraph);
      currentParagraph = { words: [], speaker };
    }
    
    currentParagraph.speaker = speaker;
    currentParagraph.words.push({
      start: word.start,
      end: word.end,
      confidence: word.confidence,
      punct: word.word,
      word: word.word,
      text: word.word
    });
  });

  if (currentParagraph.words.length > 0) {
    paragraphs.push(currentParagraph);
  }

  return paragraphs.map((para) => {
    const text = para.words.map(w => w.punct).join(' ');
    return {
      text,
      type: 'paragraph',
      data: {
        speaker: para.speaker,
        words: para.words,
        start: para.words[0].start
      },
      entityRanges: generateEntitiesRanges(para.words, 'punct')
    };
  });
};

// ============================================
// OTHER ADAPTERS (simplified for worker)
// ============================================

// Add other adapters as needed...
// For now, we'll handle the most common ones: whisper and bbckaldi

// ============================================
// MAIN WORKER LOGIC
// ============================================

/**
 * Process STT JSON data based on format type
 */
const processTranscript = (transcriptData, sttJsonType, onProgress) => {
  let blocks;

  switch (sttJsonType) {
    case 'whisper':
      blocks = whisperToDraft(transcriptData, onProgress);
      break;
    
    case 'bbckaldi':
      blocks = bbcKaldiToDraft(transcriptData, onProgress);
      break;
    
    case 'draftjs':
      // Already in DraftJS format
      return transcriptData;
    
    default:
      throw new Error(`Unsupported STT format: ${sttJsonType}`);
  }

  return {
    blocks,
    entityMap: createEntityMap(blocks)
  };
};

/**
 * Worker message handler
 */
self.onmessage = function(event) {
  const { id, type, data } = event.data;

  try {
    if (type === 'convert') {
      const { transcriptData, sttJsonType } = data;

      // Progress callback that posts messages back to main thread
      const onProgress = (progressData) => {
        self.postMessage({
          id,
          type: 'progress',
          data: progressData
        });
      };

      // Perform conversion
      const result = processTranscript(transcriptData, sttJsonType, onProgress);

      // Send final result
      self.postMessage({
        id,
        type: 'complete',
        data: result
      });
    }
  } catch (error) {
    // Send error back to main thread
    self.postMessage({
      id,
      type: 'error',
      error: {
        message: error.message,
        stack: error.stack
      }
    });
  }
};

// Signal that worker is ready
self.postMessage({ type: 'ready' });
