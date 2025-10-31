export interface PlaybackRateOption {
    value: number;
    label: string;
}
export interface MediaPlayerState {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    playbackRate: number;
    volume: number;
    isMuted: boolean;
    playbackRateOptions: PlaybackRateOption[];
}
export interface UseMediaPlayerOptions {
    initialPlaybackRate?: number;
    initialVolume?: number;
    initialIsMuted?: boolean;
    playbackRateOptions?: PlaybackRateOption[];
    onTimeUpdate?: (currentTime: number) => void;
    onPlay?: () => void;
    onPause?: () => void;
    onEnded?: () => void;
    onPlaybackRateChange?: (rate: number) => void;
    onVolumeChange?: (volume: number) => void;
}
export interface UseMediaPlayerReturn {
    state: MediaPlayerState;
    videoRef: React.RefObject<HTMLVideoElement>;
    play: () => void;
    pause: () => void;
    togglePlay: () => void;
    seek: (time: number) => void;
    setPlaybackRate: (rate: number) => void;
    increasePlaybackRate: () => void;
    decreasePlaybackRate: () => void;
    setVolume: (volume: number) => void;
    toggleMute: () => void;
    skipForward: (seconds?: number) => void;
    skipBackward: (seconds?: number) => void;
    getCurrentTime: () => number;
    getDuration: () => number;
    getFormattedTime: (seconds: number) => string;
}
/**
 * Custom hook for managing media player state and controls
 *
 * This hook provides a comprehensive API for controlling video/audio playback,
 * including play/pause, seeking, volume control, and playback rate adjustment.
 *
 * @param options - Configuration options for the media player
 * @returns Media player state and control functions
 */
export declare const useMediaPlayer: (options?: UseMediaPlayerOptions) => UseMediaPlayerReturn;
export default useMediaPlayer;
//# sourceMappingURL=useMediaPlayer.d.ts.map