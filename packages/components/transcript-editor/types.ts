export interface TranscriptData {
  blocks: Array<{
    key: string;
    text: string;
    type: string;
    depth: number;
    inlineStyleRanges: Array<{
      offset: number;
      length: number;
      style: string;
    }>;
    entityRanges: Array<{
      offset: number;
      length: number;
      key: number;
    }>;
  }>;
  entityMap: Record<string, any>;
}

export interface TranscriptEditorProps {
  transcriptData: TranscriptData | null;
  mediaUrl: string | null;
  mediaType?: 'audio' | 'video';
  handleTimeUpdate?: (currentTime: number) => void;
  handleAnalyticsEvents?: (event: AnalyticsEvent) => void;
  sttJsonType?: string;
  fileName?: string;
  spellCheck?: boolean;
  autoSaveContentType?: string;
  autoSaveContent?: boolean;
  autoSaveMethod?: string;
  autoSaveInterval?: number;
  placeholder?: string;
  title?: string;
  showTimecodes?: boolean;
  showSpeakers?: boolean;
  timecodeOffset?: number;
  isPauseWhileTypingOn?: boolean;
  rollBackValueInSeconds?: number;
  previewIsDisplayed?: boolean;
  mediaDuration?: string;
  gridDisplay?: React.CSSProperties | null;
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
  gridDisplay: React.CSSProperties | null;
}

export interface AnalyticsEvent {
  category: string;
  action: string;
  name: string;
}

export interface ExportOption {
  value: string;
  label: string;
}

export interface GridDisplay {
  display: string;
  gridTemplateColumns: string;
  gridColumnGap: string;
} 