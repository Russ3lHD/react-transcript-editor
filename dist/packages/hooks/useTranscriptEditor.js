import { useState, useEffect, useCallback, useRef } from 'react';
/**
 * Custom hook for managing transcript editor state
 *
 * This hook encapsulates all the state management logic for the transcript editor,
 * providing a clean API for components to interact with editor state.
 *
 * @param options - Configuration options for the hook
 * @returns State and setter functions for transcript editor
 */
export const useTranscriptEditor = (options = {}) => {
    const { initialTranscriptData = null, initialTimecodeOffset = 0, initialRollBackValueInSeconds = 15, initialShowTimecodes = true, initialShowSpeakers = true, initialIsPauseWhileTypingOn = true, initialPreviewIsDisplayed = true, initialMediaDuration = '00:00:00:00', mediaType = 'video' } = options;
    const [state, setState] = useState({
        currentTime: 0,
        transcriptData: initialTranscriptData,
        isScrollIntoViewOn: false,
        showSettings: false,
        showShortcuts: false,
        showExportOptions: false,
        isPauseWhileTypingOn: initialIsPauseWhileTypingOn,
        rollBackValueInSeconds: initialRollBackValueInSeconds,
        timecodeOffset: initialTimecodeOffset,
        showTimecodes: initialShowTimecodes,
        showSpeakers: initialShowSpeakers,
        previewIsDisplayed: initialPreviewIsDisplayed,
        mediaDuration: initialMediaDuration,
        gridDisplay: null,
    });
    const previousMediaTypeRef = useRef(mediaType);
    // Update grid display based on media type
    useEffect(() => {
        const updateGridDisplay = () => {
            let gridDisplay = {
                display: 'grid',
                gridTemplateColumns: '1fr 3fr',
                gridColumnGap: '1em',
            };
            if (mediaType === 'audio') {
                gridDisplay = null;
            }
            setState(prev => ({ ...prev, gridDisplay }));
        };
        if (previousMediaTypeRef.current !== mediaType) {
            updateGridDisplay();
            previousMediaTypeRef.current = mediaType;
        }
    }, [mediaType]);
    // Update transcript data when prop changes
    useEffect(() => {
        if (initialTranscriptData !== null) {
            setState(prev => ({ ...prev, transcriptData: initialTranscriptData }));
        }
    }, [initialTranscriptData]);
    // Memoized state update functions
    const updateTranscriptData = useCallback((data) => {
        setState(prev => ({ ...prev, transcriptData: data }));
    }, []);
    const updateTimecodeOffset = useCallback((offset) => {
        setState(prev => ({ ...prev, timecodeOffset: offset }));
    }, []);
    const toggleSettings = useCallback(() => {
        setState(prev => ({ ...prev, showSettings: !prev.showSettings }));
    }, []);
    const toggleShortcuts = useCallback(() => {
        setState(prev => ({ ...prev, showShortcuts: !prev.showShortcuts }));
    }, []);
    const toggleExportOptions = useCallback(() => {
        setState(prev => ({ ...prev, showExportOptions: !prev.showExportOptions }));
    }, []);
    const toggleScrollIntoView = useCallback(() => {
        setState(prev => ({ ...prev, isScrollIntoViewOn: !prev.isScrollIntoViewOn }));
    }, []);
    const togglePauseWhileTyping = useCallback(() => {
        setState(prev => ({ ...prev, isPauseWhileTypingOn: !prev.isPauseWhileTypingOn }));
    }, []);
    const toggleShowTimecodes = useCallback(() => {
        setState(prev => ({ ...prev, showTimecodes: !prev.showTimecodes }));
    }, []);
    const toggleShowSpeakers = useCallback(() => {
        setState(prev => ({ ...prev, showSpeakers: !prev.showSpeakers }));
    }, []);
    const togglePreviewDisplay = useCallback(() => {
        setState(prev => ({ ...prev, previewIsDisplayed: !prev.previewIsDisplayed }));
    }, []);
    const updateRollBackValue = useCallback((value) => {
        setState(prev => ({ ...prev, rollBackValueInSeconds: value }));
    }, []);
    const updateCurrentTime = useCallback((time) => {
        setState(prev => ({ ...prev, currentTime: time }));
    }, []);
    const updateMediaDuration = useCallback((duration) => {
        setState(prev => ({ ...prev, mediaDuration: duration }));
    }, []);
    const resetState = useCallback(() => {
        setState({
            currentTime: 0,
            transcriptData: initialTranscriptData,
            isScrollIntoViewOn: false,
            showSettings: false,
            showShortcuts: false,
            showExportOptions: false,
            isPauseWhileTypingOn: initialIsPauseWhileTypingOn,
            rollBackValueInSeconds: initialRollBackValueInSeconds,
            timecodeOffset: initialTimecodeOffset,
            showTimecodes: initialShowTimecodes,
            showSpeakers: initialShowSpeakers,
            previewIsDisplayed: initialPreviewIsDisplayed,
            mediaDuration: initialMediaDuration,
            gridDisplay: null,
        });
    }, [
        initialTranscriptData,
        initialIsPauseWhileTypingOn,
        initialRollBackValueInSeconds,
        initialTimecodeOffset,
        initialShowTimecodes,
        initialShowSpeakers,
        initialPreviewIsDisplayed,
        initialMediaDuration,
    ]);
    return {
        state,
        updateTranscriptData,
        updateTimecodeOffset,
        toggleSettings,
        toggleShortcuts,
        toggleExportOptions,
        toggleScrollIntoView,
        togglePauseWhileTyping,
        toggleShowTimecodes,
        toggleShowSpeakers,
        togglePreviewDisplay,
        updateRollBackValue,
        updateCurrentTime,
        updateMediaDuration,
        resetState,
    };
};
export default useTranscriptEditor;
//# sourceMappingURL=useTranscriptEditor.js.map