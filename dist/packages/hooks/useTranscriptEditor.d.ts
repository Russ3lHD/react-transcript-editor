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
export declare const useTranscriptEditor: (options?: UseTranscriptEditorOptions) => UseTranscriptEditorReturn;
export default useTranscriptEditor;
//# sourceMappingURL=useTranscriptEditor.d.ts.map