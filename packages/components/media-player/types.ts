export interface MediaPlayerProps {
  mediaUrl: string;
  currentTime: number;
  mediaDuration: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  handleTimeUpdate: (event: React.SyntheticEvent<HTMLVideoElement>) => void;
  handlePlayMedia: (isPlaying: boolean) => void;
  handleIsPlaying: () => boolean;
  onLoadedDataGetDuration: (event: React.SyntheticEvent<HTMLVideoElement>) => void;
  rollBackValueInSeconds?: number;
  timecodeOffset?: number | string;
  hookSeek?: (callback: (time: string | number) => void) => void;
  hookPlayMedia?: (callback: () => void) => void;
  hookIsPlaying?: (callback: () => boolean) => void;
  handleAnalyticsEvents?: (event: AnalyticsEvent) => void;
}

export interface MediaPlayerState {
  playbackRate: number;
  rollBackValueInSeconds: number;
  timecodeOffset: number;
  hotKeys: Record<string, any>;
  isPlaying: boolean;
  playbackRateOptions: PlaybackRateOption[];
  previewIsDisplayed: boolean;
  isMute: boolean;
}

export interface PlaybackRateOption {
  value: number;
  label: string;
}

export interface AnalyticsEvent {
  category: string;
  action: string;
  name: string;
  value?: string;
}

export interface PlayerControlsProps {
  isPlaying: boolean;
  currentTime: number;
  mediaDuration: string;
  playbackRate: number;
  playbackRateOptions: PlaybackRateOption[];
  isMute: boolean;
  onPlayPause: () => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
  onPlaybackRateChange: (rate: number) => void;
  onMuteToggle: () => void;
  onPictureInPicture: () => void;
  onProgressBarClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  onRollBack: () => void;
  onSetCurrentTime: () => void;
  rollBackValueInSeconds: number;
  handleAnalyticsEvents?: (event: AnalyticsEvent) => void;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onProgressBarClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export interface SelectProps {
  options: PlaybackRateOption[];
  value: number;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export interface PlaybackRateProps {
  playbackRate: number;
  playbackRateOptions: PlaybackRateOption[];
  onPlaybackRateChange: (rate: number) => void;
} 