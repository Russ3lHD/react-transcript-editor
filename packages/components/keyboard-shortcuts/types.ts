export interface HotKey {
  priority: number;
  handler: () => void;
  displayKeyCombination: string;
  label: string;
}

export interface HotKeys {
  [key: string]: HotKey;
}

export interface KeyboardShortcutsProps {
  handleShortcutsToggle: () => void;
  handleAnalyticsEvents?: (event: AnalyticsEvent) => void;
  togglePlayMedia?: () => void;
  skipForward?: () => void;
  skipBackward?: () => void;
  decreasePlaybackRate?: () => void;
  increasePlaybackRate?: () => void;
  rollBack?: () => void;
  promptSetCurrentTime?: () => void;
}

export interface AnalyticsEvent {
  category: string;
  action: string;
  name: string;
  value?: string;
} 