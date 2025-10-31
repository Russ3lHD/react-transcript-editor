import { useState, useEffect, useCallback, useRef } from 'react';

export interface TranscriptData {
  blocks: any[];
  entityMap: any;
}

export interface TranscriptEditorState {
  currentTime: number;
  transcriptData: TranscriptData | null;
  isScrollIntoViewOn: boolean;
  showSettings: boolean;
  showShortcuts: boolean;
  showExportOptions: boolean;
  isPauseWhileTypingOn: boolean;
  rollBackValueInSeconds: number;
  timecodeOffset: number;
  showTimecodes: boolean;
  showSpeakers: boolean;
  previewIsDisplayed: boolean;
  mediaDuration: string;
  gridDisplay: {
    display: string;
    gridTemplateColumns: string;
    gridColumnGap: string;
  } | null;
}

export interface UseTranscriptEditorOptions {
  initialTranscriptData?: TranscriptData | null;
  initialTimecodeOffset?: number;
  initialRollBackValueInSeconds?: number;
  initialShowTimecodes?: boolean;
  initialShowSpeakers?: boolean;
  initialIsPauseWhileTypingOn?: boolean;
  initialPreviewIsDisplayed?: boolean;
  initialMediaDuration?: string;
  mediaType?: 'video' | 'audio';
}

export interface UseTranscriptEditorReturn {
  state: TranscriptEditorState;
  updateTranscriptData: (data: TranscriptData | null) => void;
  updateTimecodeOffset: (offset: number) => void;
  toggleSettings: () => void;
  toggleShortcuts: () => void;
  toggleExportOptions: () => void;
  toggleScrollIntoView: () => void;
  togglePauseWhileTyping: () => void;
  toggleShowTimecodes: () => void;
  toggleShowSpeakers: () => void;
  togglePreviewDisplay: () => void;
  updateRollBackValue: (value: number) => void;
  updateCurrentTime: (time: number) => void;
  updateMediaDuration: (duration: string) => void;
  resetState: () => void;
}

/**
 * Custom hook for managing transcript editor state
 * 
 * This hook encapsulates all the state management logic for the transcript editor,
 * providing a clean API for components to interact with editor state.
 * 
 * @param options - Configuration options for the hook
 * @returns State and setter functions for transcript editor
 */
export const useTranscriptEditor = (
  options: UseTranscriptEditorOptions = {}
): UseTranscriptEditorReturn => {
  const {
    initialTranscriptData = null,
    initialTimecodeOffset = 0,
    initialRollBackValueInSeconds = 15,
    initialShowTimecodes = true,
    initialShowSpeakers = true,
    initialIsPauseWhileTypingOn = true,
    initialPreviewIsDisplayed = true,
    initialMediaDuration = '00:00:00:00',
    mediaType = 'video'
  } = options;

  const [state, setState] = useState<TranscriptEditorState>({
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
      let gridDisplay: TranscriptEditorState['gridDisplay'] = {
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
  const updateTranscriptData = useCallback((data: TranscriptData | null) => {
    setState(prev => ({ ...prev, transcriptData: data }));
  }, []);

  const updateTimecodeOffset = useCallback((offset: number) => {
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

  const updateRollBackValue = useCallback((value: number) => {
    setState(prev => ({ ...prev, rollBackValueInSeconds: value }));
  }, []);

  const updateCurrentTime = useCallback((time: number) => {
    setState(prev => ({ ...prev, currentTime: time }));
  }, []);

  const updateMediaDuration = useCallback((duration: string) => {
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