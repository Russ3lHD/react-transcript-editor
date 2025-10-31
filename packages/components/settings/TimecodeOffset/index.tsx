import React, { useState, useCallback, useEffect } from 'react';
import style from './index.module.css';
import type { AnalyticsEvent } from '../types';

import {
  timecodeToSeconds,
  secondsToTimecode
} from '../../../util/timecode-converter';

export interface TimecodeOffsetProps {
  /** Callback function when timecode offset is set */
  handleSetTimecodeOffset?: (offset: number) => void;
  /** Callback function when timecode offset changes */
  onChange?: (offset: number) => void;
  /** Initial timecode offset value in seconds */
  timecodeOffset?: number;
  /** Callback for analytics events */
  handleAnalyticsEvents?: (event: AnalyticsEvent) => void;
  /** Additional CSS class name */
  className?: string;
  /** Test ID for testing purposes */
  'data-testid'?: string;
}

/**
 * TimecodeOffset component for adjusting media time offset
 * 
 * Allows users to set a timecode offset to synchronize media
 * with transcript timestamps. Supports both timecode format
 * (HH:MM:SS:FF) and seconds input.
 */
const TimecodeOffset: React.FC<TimecodeOffsetProps> = ({
  handleSetTimecodeOffset,
  onChange,
  timecodeOffset = 0,
  handleAnalyticsEvents,
  className = '',
  'data-testid': testId,
}) => {
  const [localTimecodeOffset, setLocalTimecodeOffset] = useState(
    secondsToTimecode(timecodeOffset)
  );

  // Update local state when prop changes
  useEffect(() => {
    setLocalTimecodeOffset(secondsToTimecode(timecodeOffset));
  }, [timecodeOffset]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTimecode = e.target.value;
    setLocalTimecodeOffset(newTimecode);
    
    // Notify parent of change if callback provided
    if (onChange) {
      let offsetInSeconds = 0;
      
      if (
        typeof newTimecode === 'string' &&
        newTimecode.includes(':') &&
        !newTimecode.includes('NaN')
      ) {
        offsetInSeconds = timecodeToSeconds(newTimecode);
      } else {
        offsetInSeconds = parseFloat(newTimecode) || 0;
      }
      
      onChange(offsetInSeconds);
    }
  }, [onChange]);

  const resetTimecodeOffset = useCallback(() => {
    const resetValue = 0;
    
    if (handleAnalyticsEvents) {
      handleAnalyticsEvents({
        category: 'TimecodeOffset',
        action: 'resetTimecodeOffset',
        name: 'resetTimecodeOffset',
        value: String(resetValue)
      });
    }

    setLocalTimecodeOffset(secondsToTimecode(resetValue));
    handleSetTimecodeOffset?.(resetValue);
  }, [handleAnalyticsEvents, handleSetTimecodeOffset]);

  const saveTimecodeOffset = useCallback(() => {
    if (handleAnalyticsEvents) {
      handleAnalyticsEvents({
        category: 'TimecodeOffset',
        action: 'setTimecodeOffset',
        name: 'setTimecodeOffset',
        value: localTimecodeOffset
      });
    }

    let offsetInSeconds = 0;

    if (
      typeof localTimecodeOffset === 'string' &&
      localTimecodeOffset.includes(':') &&
      !localTimecodeOffset.includes('NaN')
    ) {
      offsetInSeconds = timecodeToSeconds(localTimecodeOffset);
    } else {
      offsetInSeconds = parseFloat(localTimecodeOffset) || 0;
    }

    handleSetTimecodeOffset?.(offsetInSeconds);
  }, [handleAnalyticsEvents, handleSetTimecodeOffset, localTimecodeOffset]);

  return (
    <div className={`${style.offsetContainer} ${className}`.trim()}>
      <label htmlFor="timecode-offset-input" className={style.visuallyHidden}>
        Timecode Offset
      </label>
      <input
        id="timecode-offset-input"
        className={style.inputBox}
        type="text"
        value={localTimecodeOffset}
        onChange={handleChange}
        placeholder="00:00:00:00"
        aria-label="Timecode offset in HH:MM:SS:FF format"
        data-testid={testId}
      />
      <button
        type="button"
        className={style.button}
        onClick={resetTimecodeOffset}
        aria-label="Reset timecode offset to zero"
      >
        <u>Reset</u>
      </button>
      <span aria-hidden="true"> | </span>
      <button
        type="button"
        className={style.button}
        onClick={saveTimecodeOffset}
        aria-label="Apply timecode offset"
      >
        <u>Save</u>
      </button>
    </div>
  );
};

export default TimecodeOffset;