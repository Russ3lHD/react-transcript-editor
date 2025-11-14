// eslint-disable-next-line no-unused-vars
import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * Word Component - Optimized with React.memo and useMemo
 * Renders individual words with timing data for transcript synchronization
 *
 * Performance optimizations:
 * - Converted from class to functional component with memo
 * - Memoized expensive calculations (prevTimes, confidence)
 * - Custom comparison function to prevent unnecessary re-renders
 * - Pre-allocated arrays for better performance
 */
const Word = memo(({ entityKey, contentState, children, decoratedText }) => {
  // Keep decoratedText in scope for memo comparator while avoiding lint warning
  void decoratedText;
  // Memoize word data extraction
  const wordData = useMemo(() => {
    if (!entityKey) return {};
    return contentState.getEntity(entityKey).getData();
  }, [entityKey, contentState]);

  // Memoize confidence calculation
  const confidence = useMemo(() => {
    // handling edge case where confidence score not present
    if (wordData.confidence) {
      return wordData.confidence > 0.6 ? 'high' : 'low';
    }
    return 'high';
  }, [wordData.confidence]);

  // Memoize previous times generation - optimized with pre-allocated array
  const prevTimes = useMemo(() => {
    if (!wordData.start) return '';

    const startInt = Math.floor(wordData.start);

    // Pre-allocate array for better performance than string concatenation
    const timeArray = Array.from({ length: startInt }, (_, i) => i);
    let times = timeArray.join(' ');

    if (wordData.start % 1 > 0) {
      // Find the closest quarter-second to the current time, for more dynamic results
      const dec = Math.floor((wordData.start % 1) * 4.0) / 4.0;
      times += ` ${startInt + dec}`;
    }

    return times;
  }, [wordData.start]);

  return (
    <span
      data-start={wordData.start}
      data-end={wordData.end}
      data-confidence={confidence}
      data-prev-times={prevTimes}
      data-entity-key={entityKey}
      className="Word"
    >
      {children}
    </span>
  );
}, (prevProps, nextProps) => {
  // Custom comparison: re-render if decoratedText, entityKey, or contentState changes
  return (
    prevProps.decoratedText === nextProps.decoratedText &&
    prevProps.entityKey === nextProps.entityKey &&
    prevProps.contentState === nextProps.contentState
  );
});

Word.displayName = 'Word';

Word.propTypes = {
  contentState: PropTypes.object,
  entityKey: PropTypes.string,
  children: PropTypes.array,
  decoratedText: PropTypes.string
};

export default Word;
