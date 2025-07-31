export interface VideoPlayerProps {
  mediaUrl: string;
  onTimeUpdate: (event: React.SyntheticEvent<HTMLVideoElement>) => void;
  onClick?: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  onLoadedDataGetDuration: (event: React.SyntheticEvent<HTMLVideoElement>) => void;
  previewIsDisplayed: boolean;
  previewViewWidth?: string;
} 