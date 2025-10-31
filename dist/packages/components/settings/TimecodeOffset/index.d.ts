import React from 'react';
import type { AnalyticsEvent } from '../types';
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
declare const TimecodeOffset: React.FC<TimecodeOffsetProps>;
export default TimecodeOffset;
//# sourceMappingURL=index.d.ts.map