export interface TimedTextEditorProps {
  transcriptData: TranscriptData | null;
  handleWordClick: (startTime: number) => void;
  handleTimeUpdate: (event: React.SyntheticEvent<HTMLVideoElement>) => void;
  handlePlayMedia: (isPlaying: boolean) => void;
  handleIsPlaying: () => boolean;
  isScrollIntoViewOn: boolean;
  isPauseWhileTypingOn: boolean;
  rollBackValueInSeconds: number;
  timecodeOffset: number;
  showTimecodes: boolean;
  showSpeakers: boolean;
  sttJsonType?: string;
  fileName?: string;
  spellCheck?: boolean;
  autoSaveContentType?: string;
  autoSaveContent?: boolean;
  autoSaveMethod?: string;
  autoSaveInterval?: number;
  placeholder?: string;
  title?: string;
  handleAutoSaveChanges?: (data: any) => void;
  handleAnalyticsEvents?: (event: AnalyticsEvent) => void;
}

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

export interface WordProps {
  word: string;
  startTime: number;
  endTime: number;
  speaker: string;
  showTimecodes: boolean;
  showSpeakers: boolean;
  onWordClick: (startTime: number) => void;
  isCurrentWord: boolean;
}

export interface SpeakerLabelProps {
  speaker: string;
  showSpeakers: boolean;
}

export interface WrapperBlockProps {
  children: React.ReactNode;
  speaker: string;
  showSpeakers: boolean;
}

export interface CustomEditorProps {
  transcriptData: TranscriptData | null;
  handleWordClick: (startTime: number) => void;
  showTimecodes: boolean;
  showSpeakers: boolean;
  placeholder?: string;
  spellCheck?: boolean;
  autoSaveContent?: boolean;
  autoSaveInterval?: number;
  handleAutoSaveChanges?: (data: any) => void;
}

export interface AnalyticsEvent {
  category: string;
  action: string;
  name: string;
  value?: string;
} 