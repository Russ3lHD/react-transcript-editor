import { useState, useCallback, useRef, useEffect } from 'react';

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

const DEFAULT_PLAYBACK_RATES: PlaybackRateOption[] = [
  { value: 0.25, label: '0.25x' },
  { value: 0.5, label: '0.5x' },
  { value: 0.75, label: '0.75x' },
  { value: 1, label: '1x' },
  { value: 1.25, label: '1.25x' },
  { value: 1.5, label: '1.5x' },
  { value: 1.75, label: '1.75x' },
  { value: 2, label: '2x' },
];

/**
 * Custom hook for managing media player state and controls
 * 
 * This hook provides a comprehensive API for controlling video/audio playback,
 * including play/pause, seeking, volume control, and playback rate adjustment.
 * 
 * @param options - Configuration options for the media player
 * @returns Media player state and control functions
 */
export const useMediaPlayer = (
  options: UseMediaPlayerOptions = {}
): UseMediaPlayerReturn => {
  const {
    initialPlaybackRate = 1,
    initialVolume = 1,
    initialIsMuted = false,
    playbackRateOptions = DEFAULT_PLAYBACK_RATES,
    onTimeUpdate,
    onPlay,
    onPause,
    onEnded,
    onPlaybackRateChange,
    onVolumeChange,
  } = options;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<MediaPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    playbackRate: initialPlaybackRate,
    volume: initialVolume,
    isMuted: initialIsMuted,
    playbackRateOptions,
  });

  // Update video element when state changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = state.playbackRate;
    video.volume = state.isMuted ? 0 : state.volume;
    video.muted = state.isMuted;
  }, [state.playbackRate, state.volume, state.isMuted]);

  // Handle time updates
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const currentTime = video.currentTime;
    setState(prev => ({ ...prev, currentTime }));
    onTimeUpdate?.(currentTime);
  }, [onTimeUpdate]);

  // Handle loaded metadata
  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    setState(prev => ({ ...prev, duration: video.duration }));
  }, []);

  // Handle play event
  const handlePlay = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: true }));
    onPlay?.();
  }, [onPlay]);

  // Handle pause event
  const handlePause = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false }));
    onPause?.();
  }, [onPause]);

  // Handle ended event
  const handleEnded = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false }));
    onEnded?.();
  }, [onEnded]);

  // Set up event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [handleTimeUpdate, handleLoadedMetadata, handlePlay, handlePause, handleEnded]);

  // Control functions
  const play = useCallback(() => {
    const video = videoRef.current;
    if (video && video.paused) {
      video.play().catch(error => {
        console.error('Error playing video:', error);
      });
    }
  }, []);

  const pause = useCallback(() => {
    const video = videoRef.current;
    if (video && !video.paused) {
      video.pause();
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  const seek = useCallback((time: number) => {
    const video = videoRef.current;
    if (video && time >= 0 && time <= video.duration) {
      video.currentTime = time;
    }
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    const video = videoRef.current;
    const validRate = playbackRateOptions.find(option => option.value === rate);
    
    if (validRate && video) {
      setState(prev => ({ ...prev, playbackRate: rate }));
      onPlaybackRateChange?.(rate);
    }
  }, [playbackRateOptions, onPlaybackRateChange]);

  const increasePlaybackRate = useCallback(() => {
    const currentIndex = playbackRateOptions.findIndex(
      option => option.value === state.playbackRate
    );
    const nextIndex = Math.min(currentIndex + 1, playbackRateOptions.length - 1);
    const nextRate = playbackRateOptions[nextIndex].value;
    
    setPlaybackRate(nextRate);
  }, [state.playbackRate, playbackRateOptions, setPlaybackRate]);

  const decreasePlaybackRate = useCallback(() => {
    const currentIndex = playbackRateOptions.findIndex(
      option => option.value === state.playbackRate
    );
    const prevIndex = Math.max(currentIndex - 1, 0);
    const prevRate = playbackRateOptions[prevIndex].value;
    
    setPlaybackRate(prevRate);
  }, [state.playbackRate, playbackRateOptions, setPlaybackRate]);

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    setState(prev => ({ 
      ...prev, 
      volume: clampedVolume,
      isMuted: clampedVolume === 0
    }));
    onVolumeChange?.(clampedVolume);
  }, [onVolumeChange]);

  const toggleMute = useCallback(() => {
    setState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  }, []);

  const skipForward = useCallback((seconds = 10) => {
    const video = videoRef.current;
    if (video) {
      const newTime = Math.min(video.currentTime + seconds, video.duration);
      seek(newTime);
    }
  }, [seek]);

  const skipBackward = useCallback((seconds = 10) => {
    const video = videoRef.current;
    if (video) {
      const newTime = Math.max(video.currentTime - seconds, 0);
      seek(newTime);
    }
  }, [seek]);

  const getCurrentTime = useCallback(() => {
    return videoRef.current?.currentTime ?? 0;
  }, []);

  const getDuration = useCallback(() => {
    return videoRef.current?.duration ?? 0;
  }, []);

  const getFormattedTime = useCallback((seconds: number) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    
    if (hh > 0) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  }, []);

  return {
    state,
    videoRef: videoRef as React.RefObject<HTMLVideoElement>,
    play,
    pause,
    togglePlay,
    seek,
    setPlaybackRate,
    increasePlaybackRate,
    decreasePlaybackRate,
    setVolume,
    toggleMute,
    skipForward,
    skipBackward,
    getCurrentTime,
    getDuration,
    getFormattedTime,
  };
};

export default useMediaPlayer;