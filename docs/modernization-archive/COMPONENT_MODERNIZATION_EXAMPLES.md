# Component Modernization Examples

This document demonstrates the before/after transformation of React components from legacy class components to modern TypeScript functional components.

## TimecodeOffset Component Transformation

### Before (Legacy Class Component)
```javascript
// packages/components/settings/TimecodeOffset/index.js
import React from 'react';
import PropTypes from 'prop-types';

import style from './index.module.css';
import {
  timecodeToSeconds,
  secondsToTimecode
} from '../../../util/timecode-converter';

class TimecodeOffset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timecodeOffset: secondsToTimecode(this.props.timecodeOffset)
    };
  }

  handleChange = e => {
    this.setState({
      timecodeOffset: e.target.value
    });
  };

  resetTimecodeOffset = () => {
    const resetTimecodeOffsetValue = 0;
    if (this.props.handleAnalyticsEvents !== undefined) {
      this.props.handleAnalyticsEvents({
        category: 'TimecodeOffset',
        action: 'resetTimecodeOffset',
        name: 'resetTimecodeOffset',
        value: 0
      });
    }

    this.setState({
      timecodeOffset: secondsToTimecode(resetTimecodeOffsetValue)
    }, () => {
      this.props.handleSetTimecodeOffset(resetTimecodeOffsetValue);
    });
  };

  setTimecodeOffset = () => {
    if (this.props.handleAnalyticsEvents !== undefined) {
      this.props.handleAnalyticsEvents({
        category: 'TimecodeOffset',
        action: 'setTimecodeOffset',
        name: 'setTimecodeOffset',
        value: this.state.timecodeOffset
      });
    }

    let newCurrentTimeInSeconds = this.state.timecodeOffset;

    if (
      typeof newCurrentTimeInSeconds === 'string' &&
      newCurrentTimeInSeconds.includes(':') &&
      !newCurrentTimeInSeconds.includes('NaN')
    ) {
      newCurrentTimeInSeconds = timecodeToSeconds(newCurrentTimeInSeconds);
    }
    this.props.handleSetTimecodeOffset(newCurrentTimeInSeconds);
  };

  render() {
    return (
      <div className={ style.offsetContainer }>
        <input
          className={ style.inputBox }
          type="text"
          value={ this.state.timecodeOffset }
          onChange={ this.handleChange }
          name="lname"
        />
        <span className={ style.button } onClick={ this.resetTimecodeOffset }>
          <u>Reset</u>
        </span>
        <span> | </span>
        <span className={ style.button } onClick={ this.setTimecodeOffset }>
          <u>Save</u>
        </span>
      </div>
    );
  }
}

TimecodeOffset.propTypes = {
  handleSetTimecodeOffset: PropTypes.func,
  onChange: PropTypes.func,
  timecodeOffset: PropTypes.number,
  handleAnalyticsEvents: PropTypes.func
};

export default TimecodeOffset;
```

### After (Modern TypeScript Functional Component)
```typescript
// packages/components/settings/TimecodeOffset/index.tsx
import React, { useState, useCallback, useEffect } from 'react';
import style from './index.module.css';

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
  handleAnalyticsEvents?: (event: {
    category: string;
    action: string;
    name: string;
    value: string | number;
  }) => void;
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
        value: resetValue
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
```

## Key Improvements Made

### 1. TypeScript Integration
- **Before**: PropTypes with runtime validation
- **After**: Compile-time type safety with interfaces
- **Benefits**: Better IDE support, fewer runtime errors

### 2. Modern React Patterns
- **Before**: Class component with constructor and state
- **After**: Functional component with hooks
- **Benefits**: Cleaner code, better performance, easier testing

### 3. Performance Optimization
- **Before**: Class methods recreated on each render
- **After**: useCallback for stable function references
- **Benefits**: Fewer unnecessary re-renders

### 4. Accessibility Enhancements
- **Before**: Missing labels, semantic issues
- **After**: Proper ARIA labels, semantic HTML
- **Benefits**: WCAG compliance, better user experience

### 5. Error Handling
- **Before**: Basic error handling
- **After**: Robust error handling with fallbacks
- **Benefits**: More reliable user experience

### 6. Documentation
- **Before**: Minimal documentation
- **After**: Comprehensive JSDoc comments
- **Benefits**: Better developer experience

## CSS Module Type Declaration

For each component, we also create a type declaration file for CSS modules:

```typescript
// packages/components/settings/TimecodeOffset/index.module.css.d.ts
declare const styles: {
  readonly offsetContainer: string;
  readonly inputBox: string;
  readonly button: string;
  readonly visuallyHidden: string;
};

export = styles;
```

## Migration Pattern Summary

The transformation follows this consistent pattern:

1. **Convert to TypeScript**: Add proper type definitions
2. **Replace Class with Function**: Use functional component pattern
3. **Replace State with useState**: Use React hooks for state
4. **Replace Lifecycle with useEffect**: Use hooks for side effects
5. **Add useCallback**: Optimize performance with memoized callbacks
6. **Enhance Accessibility**: Add proper ARIA attributes
7. **Add Documentation**: Include comprehensive JSDoc comments
8. **Create Type Declarations**: Add CSS module type definitions

This pattern can be applied to all remaining components in the codebase for consistent modernization.
