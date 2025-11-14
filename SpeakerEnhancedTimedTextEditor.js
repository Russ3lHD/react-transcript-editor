import React from 'react';
import * as TranscriptEditorPackage from 'pmacom-react-transcript-editor';
// Ensure our override / helper CSS is loaded so classes like
// .pmacom-custom-editor and .speaker-timecode-flexbox take effect.
import './pmacom-transcript-editor.css';
import { analyzeDraftJsSpeakerBlocks, getSpeakerBlockClasses } from '../../utils/speaker-block-processor';

/* global MutationObserver */
/* eslint-disable no-console */

const TimedTextEditor = TranscriptEditorPackage.TimedTextEditor;

/**
 * Enhanced TimedTextEditor wrapper that adds speaker block spacing
 * This component wraps the original TimedTextEditor and applies CSS classes
 * for improved speaker block visual separation
 */
const SpeakerEnhancedTimedTextEditor = React.forwardRef(({
  transcriptData,
  originalTranscriptData,
  onChange,
  ...props
}, ref) => {
  const [blockMetadata, setBlockMetadata] = React.useState({});
  const containerRef = React.useRef(null);
  const timedTextEditorRef = React.useRef(null);

  // Combine refs
  React.useImperativeHandle(ref, () => timedTextEditorRef.current);

  // Process speaker blocks when data changes
  React.useEffect(() => {
    if (transcriptData && originalTranscriptData) {
      const metadata = analyzeDraftJsSpeakerBlocks(transcriptData, originalTranscriptData);
      setBlockMetadata(metadata);
      console.log('Speaker block metadata updated:', metadata);
    }
  }, [transcriptData, originalTranscriptData]);

  // Apply CSS classes and ensure Flexbox layout after render
  React.useEffect(() => {
    if (!transcriptData || !blockMetadata || Object.keys(blockMetadata).length === 0) {
      return;
    }

    const applyClassesAndFlexbox = () => {
      const container = containerRef.current;
      if (!container) return;

      // Find all wrapper blocks and marker containers
      const wrapperBlocks = container.querySelectorAll(
        '[class*="WrapperBlock-module__WrapperBlock"]'
      );
      const markerContainers = container.querySelectorAll(
        '[class*="WrapperBlock-module__markers"]'
      );

      console.log(
        `Applying speaker classes to ${wrapperBlocks.length} blocks`
      );
      console.log(
        `Found ${markerContainers.length} marker containers for Flexbox enhancement`
      );
      console.log('Available block metadata:', blockMetadata);

      // Debug: Log actual DOM structure
      console.log('=== DOM DEBUG INFO ===');
      console.log('Container HTML:', container.innerHTML.substring(0, 500));

      // Debug: Find all possible marker-like containers
      const allMarkers = container.querySelectorAll(
        '[class*="marker"], [class*="Marker"]'
      );
      console.log(
        `Found ${allMarkers.length} elements with "marker" in class name`
      );
      allMarkers.forEach((el, i) => {
        console.log(`Marker ${i}:`, el.className);
      });

      // First, enhance all marker containers with Flexbox classes
      markerContainers.forEach((markerElement, index) => {
        console.log(
          `Processing marker container ${index}:`,
          markerElement.className
        );
        console.log('Marker HTML:', markerElement.outerHTML.substring(0, 200));

        // Add CSS class to target with our Flexbox styles
        markerElement.classList.add('speaker-timecode-flexbox');

        // Force inline Flexbox styles as backup (kept consistent so the
        // MutationObserver can reapply them reliably)
        markerElement.style.setProperty('display', 'flex', 'important');
        markerElement.style.setProperty('flex-direction', 'row', 'important');
        markerElement.style.setProperty(
          'justify-content',
          'space-between',
          'important'
        );
        markerElement.style.setProperty('align-items', 'center', 'important');
        markerElement.style.setProperty('width', '100%', 'important');

        console.log(
          `Enhanced Flexbox for marker container ${index}`
        );
      });

      // Then apply speaker block classes.
      // Map DOM blocks to transcript block keys using common data attributes
      // (DraftJS often uses `data-offset-key`). Fall back to index if needed.
      wrapperBlocks.forEach((blockElement, index) => {
        const blocks = transcriptData.blocks || [];

        // Try several possible attributes for the block key
        const offset = blockElement.getAttribute('data-offset-key');
        const blockKeyFromAttr = offset ? offset.split('-')[0] : null;
        const attrKey =
          blockKeyFromAttr ||
          blockElement.getAttribute('data-block-key') ||
          blockElement.getAttribute('data-key');

        // Prefer mapping by attribute; fall back to index-based mapping
        const blockKey = attrKey || (blocks[index] && blocks[index].key);

        if (!blockKey) {
          console.log(
            `Skipping block ${index} — no key found on element. class=${blockElement.className}`
          );
          return;
        }

        const classes = getSpeakerBlockClasses(blockMetadata, blockKey);

        console.log(
          `Block ${index} (domKey: ${attrKey}, mappedKey: ${blockKey}):`,
          {
            metadata: blockMetadata[blockKey],
            classes,
            element: blockElement
          }
        );

        // Remove any old speaker classes and add new ones if present
        blockElement.classList.remove(
          'speaker-block',
          'same-speaker-segment',
          'first-speaker-block'
        );
        if (classes) {
          classes
            .split(/\s+/)
            .filter(Boolean)
            .forEach(cls => blockElement.classList.add(cls));
          console.log(
            `Applied classes "${classes}" to block ${index} (key: ${blockKey})`
          );
        }
      });
    };

    // Apply classes and Flexbox with multiple attempts to ensure DOM is ready
    const timeouts = [50, 100, 200, 500, 1000].map(delay => setTimeout(applyClassesAndFlexbox, delay));

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [transcriptData, blockMetadata, props.showSpeakers]);

  // Set up MutationObserver for dynamic content changes
  React.useEffect(() => {
    if (!transcriptData || !blockMetadata || Object.keys(blockMetadata).length === 0) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const observer = new MutationObserver(() => {
      // Re-apply classes and Flexbox when DOM changes. Re-set the inline
      // flex styles rather than clearing them so our layout stays applied.
      setTimeout(() => {
        const markerContainers = container.querySelectorAll(
          '[class*="WrapperBlock-module__markers"]'
        );
        markerContainers.forEach(markerElement => {
          markerElement.classList.add('speaker-timecode-flexbox');
          // Re-apply the same inline styles we set initially (with priority)
          markerElement.style.setProperty('display', 'flex', 'important');
          markerElement.style.setProperty('flex-direction', 'row', 'important');
          markerElement.style.setProperty('justify-content', 'space-between', 'important');
          markerElement.style.setProperty('align-items', 'center', 'important');
          markerElement.style.setProperty('width', '100%', 'important');
        });
      }, 100);
    });

    // Observe the container for changes
    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    return () => {
      observer.disconnect();
    };
  }, [transcriptData, blockMetadata]);

  return (
    <div
      ref={containerRef}
      className="pmacom-custom-editor enhanced-document-transcript-container speaker-enhanced-timed-text-editor"
      style={{ width: '100%', height: '100%' }}
    >
      <TimedTextEditor
        ref={timedTextEditorRef}
        transcriptData={transcriptData}
        onChange={onChange}
        onWordClick={props.onWordClick}
        currentTime={props.currentTime}
        showTimecodes={props.showTimecodes}
        showSpeakers={props.showSpeakers}
        isEditable={props.isEditable}
        spellCheck={props.spellCheck}
        {...props}
      />
    </div>
  );
});

SpeakerEnhancedTimedTextEditor.displayName = 'SpeakerEnhancedTimedTextEditor';

export default SpeakerEnhancedTimedTextEditor;
