import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useMemo } from 'react';
import PlayerControls from './src/PlayerControls';
import ProgressBar from './src/ProgressBar';
import styles from './index.module.scss';
import { secondsToTimecode, timecodeToSeconds, } from '../../util/timecode-converter';
import PLAYBACK_RATES from './src/config/playbackRates.js';
const MediaPlayer = ({ mediaUrl, currentTime, mediaDuration, videoRef, handleTimeUpdate, handlePlayMedia, handleIsPlaying, onLoadedDataGetDuration, rollBackValueInSeconds = 15, timecodeOffset = 0, hookSeek, hookPlayMedia, hookIsPlaying, handleAnalyticsEvents, }) => {
    const [state, setState] = useState({
        playbackRate: 1,
        rollBackValueInSeconds,
        timecodeOffset,
        hotKeys: {},
        isPlaying: false,
        playbackRateOptions: PLAYBACK_RATES,
        previewIsDisplayed: true,
        isMute: false,
    });
    // Update state when props change
    useEffect(() => {
        if (timecodeOffset !== null) {
            let newCurrentTimeInSeconds = timecodeOffset;
            if (typeof newCurrentTimeInSeconds === 'string' &&
                newCurrentTimeInSeconds.includes(':') &&
                !newCurrentTimeInSeconds.includes('NaN')) {
                newCurrentTimeInSeconds = timecodeToSeconds(timecodeOffset);
            }
            setState(prev => ({
                ...prev,
                timecodeOffset: newCurrentTimeInSeconds,
                rollBackValueInSeconds,
            }));
        }
    }, [timecodeOffset, rollBackValueInSeconds]);
    // Set up hooks on mount
    useEffect(() => {
        if (hookSeek)
            hookSeek(setCurrentTime);
        if (hookPlayMedia)
            hookPlayMedia(togglePlayMedia);
        if (hookIsPlaying)
            hookIsPlaying(isPlaying);
    }, [hookSeek, hookPlayMedia, hookIsPlaying]);
    // Event handlers
    const setCurrentTime = useCallback((newCurrentTime) => {
        if (newCurrentTime !== '' && newCurrentTime !== null) {
            const newCurrentTimeInSeconds = timecodeToSeconds(newCurrentTime);
            const video = videoRef.current;
            if (video) {
                video.currentTime = newCurrentTimeInSeconds;
            }
        }
    }, [videoRef]);
    const promptSetCurrentTime = useCallback(() => {
        const currentTime = prompt('Enter time (hh:mm:ss:ff, mm:ss, m:ss, ss):');
        if (currentTime !== null) {
            setCurrentTime(currentTime);
        }
    }, [setCurrentTime]);
    const setTimeCodeOffset = useCallback((newTimeCodeOffSet) => {
        setState(prev => ({ ...prev, timecodeOffset: newTimeCodeOffSet }));
    }, []);
    const rollBack = useCallback(() => {
        const video = videoRef.current;
        if (video) {
            const newTime = video.currentTime - state.rollBackValueInSeconds;
            video.currentTime = Math.max(0, newTime);
        }
    }, [videoRef, state.rollBackValueInSeconds]);
    const handlePlayBackRateChange = useCallback((e) => {
        const newRate = parseFloat(e.target.value);
        setPlayBackRate(newRate);
    }, []);
    const setPlayBackRate = useCallback((input) => {
        const video = videoRef.current;
        if (video) {
            video.playbackRate = input;
            setState(prev => ({ ...prev, playbackRate: input }));
        }
    }, [videoRef]);
    const decreasePlaybackRate = useCallback(() => {
        const newRate = Math.max(0.25, state.playbackRate - 0.25);
        setPlayBackRate(newRate);
    }, [state.playbackRate, setPlayBackRate]);
    const increasePlaybackRate = useCallback(() => {
        const newRate = Math.min(4, state.playbackRate + 0.25);
        setPlayBackRate(newRate);
    }, [state.playbackRate, setPlayBackRate]);
    const handleChangeReplayRollbackValue = useCallback((e) => {
        setState(prev => ({ ...prev, rollBackValueInSeconds: parseInt(e.target.value, 10) }));
    }, []);
    const handleMuteVolume = useCallback(() => {
        const video = videoRef.current;
        if (video) {
            video.muted = !video.muted;
            setState(prev => ({ ...prev, isMute: video.muted }));
        }
    }, [videoRef]);
    const isPlaying = useCallback(() => {
        return videoRef.current ? !videoRef.current.paused : false;
    }, [videoRef]);
    const pauseMedia = useCallback(() => {
        const video = videoRef.current;
        if (video) {
            video.pause();
            setState(prev => ({ ...prev, isPlaying: false }));
            handlePlayMedia(false);
        }
    }, [videoRef, handlePlayMedia]);
    const playMedia = useCallback(() => {
        const video = videoRef.current;
        if (video) {
            video.play();
            setState(prev => ({ ...prev, isPlaying: true }));
            handlePlayMedia(true);
        }
    }, [videoRef, handlePlayMedia]);
    const togglePlayMedia = useCallback(() => {
        if (isPlaying()) {
            pauseMedia();
        }
        else {
            playMedia();
        }
    }, [isPlaying, pauseMedia, playMedia]);
    const skipForward = useCallback(() => {
        const video = videoRef.current;
        if (video) {
            video.currentTime += 10;
        }
    }, [videoRef]);
    const skipBackward = useCallback(() => {
        const video = videoRef.current;
        if (video) {
            video.currentTime -= 10;
        }
    }, [videoRef]);
    const handleProgressBarClick = useCallback((e) => {
        const video = videoRef.current;
        if (video) {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const clickTime = (clickX / width) * video.duration;
            video.currentTime = clickTime;
        }
    }, [videoRef]);
    const getMediaCurrentTime = useCallback(() => {
        const video = videoRef.current;
        if (video) {
            const offset = typeof state.timecodeOffset === 'string' ? parseFloat(state.timecodeOffset) : state.timecodeOffset;
            return secondsToTimecode(video.currentTime + offset);
        }
        return '00:00:00:00';
    }, [videoRef, state.timecodeOffset]);
    const handlePictureInPicture = useCallback(() => {
        const video = videoRef.current;
        if (video && document.pictureInPictureEnabled) {
            if (document.pictureInPictureElement) {
                document.exitPictureInPicture();
            }
            else {
                video.requestPictureInPicture();
            }
        }
    }, [videoRef]);
    const getProgressBarMax = useCallback(() => {
        const video = videoRef.current;
        return video ? parseInt(video.duration.toString()) : 0;
    }, [videoRef]);
    const getProgressBarValue = useCallback(() => {
        const video = videoRef.current;
        return video ? parseInt(video.currentTime.toString()) : 0;
    }, [videoRef]);
    // Memoized components
    const playerControls = useMemo(() => (_jsx(PlayerControls, { isPlaying: state.isPlaying, currentTime: currentTime, mediaDuration: mediaDuration, playbackRate: state.playbackRate, playbackRateOptions: state.playbackRateOptions, isMute: state.isMute, onPlayPause: togglePlayMedia, onSkipForward: skipForward, onSkipBackward: skipBackward, onPlaybackRateChange: setPlayBackRate, onMuteToggle: handleMuteVolume, onPictureInPicture: handlePictureInPicture, onProgressBarClick: handleProgressBarClick, onRollBack: rollBack, onSetCurrentTime: promptSetCurrentTime, rollBackValueInSeconds: state.rollBackValueInSeconds, handleAnalyticsEvents: handleAnalyticsEvents })), [
        state.isPlaying,
        currentTime,
        mediaDuration,
        state.playbackRate,
        state.playbackRateOptions,
        state.isMute,
        state.rollBackValueInSeconds,
        togglePlayMedia,
        skipForward,
        skipBackward,
        setPlayBackRate,
        handleMuteVolume,
        handlePictureInPicture,
        handleProgressBarClick,
        rollBack,
        promptSetCurrentTime,
        handleAnalyticsEvents,
    ]);
    const progressBar = useMemo(() => (_jsx(ProgressBar, { currentTime: getProgressBarValue(), duration: getProgressBarMax(), onProgressBarClick: handleProgressBarClick })), [getProgressBarValue, getProgressBarMax, handleProgressBarClick]);
    return (_jsxs("div", { className: styles.mediaPlayer, children: [_jsx("video", { ref: videoRef, className: styles.video, src: mediaUrl || undefined, onTimeUpdate: handleTimeUpdate, onLoadedData: onLoadedDataGetDuration, muted: state.isMute }), playerControls, progressBar] }));
};
export default MediaPlayer;
//# sourceMappingURL=MediaPlayer.js.map