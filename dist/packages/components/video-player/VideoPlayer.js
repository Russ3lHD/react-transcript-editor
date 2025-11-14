import React, { memo, useCallback } from 'react';
import styles from './index.module.css';
const VideoPlayer = ({ mediaUrl, onTimeUpdate, videoRef, onLoadedDataGetDuration, previewIsDisplayed, previewViewWidth, }) => {
    const handlePlayMedia = useCallback(() => {
        if (videoRef.current !== null) {
            return videoRef.current.paused
                ? videoRef.current.play()
                : videoRef.current.pause();
        }
    }, [videoRef]);
    const isDisplayed = previewIsDisplayed ? 'inline' : 'none';
    return (React.createElement("video", { id: "video", playsInline: true, src: mediaUrl || undefined, onTimeUpdate: onTimeUpdate, "data-testid": "media-player-id", onClick: handlePlayMedia, onLoadedData: onLoadedDataGetDuration, ref: videoRef, className: styles.videoEl, preload: "auto", style: {
            display: isDisplayed,
        } }));
};
export default memo(VideoPlayer);
//# sourceMappingURL=VideoPlayer.js.map