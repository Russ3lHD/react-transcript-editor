import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from 'react';
import style from './index.module.css';
import { timecodeToSeconds, secondsToTimecode } from '../../../util/timecode-converter';
/**
 * TimecodeOffset component for adjusting media time offset
 *
 * Allows users to set a timecode offset to synchronize media
 * with transcript timestamps. Supports both timecode format
 * (HH:MM:SS:FF) and seconds input.
 */
const TimecodeOffset = ({ handleSetTimecodeOffset, onChange, timecodeOffset = 0, handleAnalyticsEvents, className = '', 'data-testid': testId, }) => {
    const [localTimecodeOffset, setLocalTimecodeOffset] = useState(secondsToTimecode(timecodeOffset));
    // Update local state when prop changes
    useEffect(() => {
        setLocalTimecodeOffset(secondsToTimecode(timecodeOffset));
    }, [timecodeOffset]);
    const handleChange = useCallback((e) => {
        const newTimecode = e.target.value;
        setLocalTimecodeOffset(newTimecode);
        // Notify parent of change if callback provided
        if (onChange) {
            let offsetInSeconds = 0;
            if (typeof newTimecode === 'string' &&
                newTimecode.includes(':') &&
                !newTimecode.includes('NaN')) {
                offsetInSeconds = timecodeToSeconds(newTimecode);
            }
            else {
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
        if (typeof localTimecodeOffset === 'string' &&
            localTimecodeOffset.includes(':') &&
            !localTimecodeOffset.includes('NaN')) {
            offsetInSeconds = timecodeToSeconds(localTimecodeOffset);
        }
        else {
            offsetInSeconds = parseFloat(localTimecodeOffset) || 0;
        }
        handleSetTimecodeOffset?.(offsetInSeconds);
    }, [handleAnalyticsEvents, handleSetTimecodeOffset, localTimecodeOffset]);
    return (_jsxs("div", { className: `${style.offsetContainer} ${className}`.trim(), children: [_jsx("label", { htmlFor: "timecode-offset-input", className: style.visuallyHidden, children: "Timecode Offset" }), _jsx("input", { id: "timecode-offset-input", className: style.inputBox, type: "text", value: localTimecodeOffset, onChange: handleChange, placeholder: "00:00:00:00", "aria-label": "Timecode offset in HH:MM:SS:FF format", "data-testid": testId }), _jsx("button", { type: "button", className: style.button, onClick: resetTimecodeOffset, "aria-label": "Reset timecode offset to zero", children: _jsx("u", { children: "Reset" }) }), _jsx("span", { "aria-hidden": "true", children: " | " }), _jsx("button", { type: "button", className: style.button, onClick: saveTimecodeOffset, "aria-label": "Apply timecode offset", children: _jsx("u", { children: "Save" }) })] }));
};
export default TimecodeOffset;
//# sourceMappingURL=index.js.map