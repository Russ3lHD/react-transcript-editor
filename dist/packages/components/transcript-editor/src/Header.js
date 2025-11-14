import React, { memo } from 'react';
import { faCog, faKeyboard, faShare, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MediaPlayer from '../../media-player';
import VideoPlayer from '../../video-player';
import style from '../index.module.css';
const Header = ({ showSettings, showShortcuts, showExportOptions, settings, shortcuts, exportOptions, tooltip, mediaUrl, mediaControlsProps, handleSettingsToggle, handleShortcutsToggle, handleExportToggle, }) => {
    return (React.createElement(React.Fragment, null,
        React.createElement("header", { className: style.header },
            showSettings ? settings : null,
            showShortcuts ? shortcuts : null,
            showExportOptions ? exportOptions : null,
            tooltip),
        React.createElement("nav", { className: style.nav }, mediaUrl && mediaControlsProps ? (mediaControlsProps.type === 'audio' ? (React.createElement(MediaPlayer, { mediaUrl: mediaControlsProps.mediaUrl, handleTimeUpdate: mediaControlsProps.handleTimeUpdate, handlePlayMedia: mediaControlsProps.handlePlayMedia, handleIsPlaying: mediaControlsProps.handleIsPlaying, onLoadedDataGetDuration: mediaControlsProps.onLoadedDataGetDuration, currentTime: mediaControlsProps.currentTime, mediaDuration: mediaControlsProps.mediaDuration, videoRef: mediaControlsProps.videoRef })) : (React.createElement(VideoPlayer, { mediaUrl: mediaControlsProps.mediaUrl, onTimeUpdate: mediaControlsProps.onTimeUpdate, videoRef: mediaControlsProps.videoRef, onLoadedDataGetDuration: mediaControlsProps.onLoadedDataGetDuration, previewIsDisplayed: mediaControlsProps.previewIsDisplayed }))) : null),
        React.createElement("div", { className: style.settingsContainer },
            React.createElement("button", { className: style.settingsButton, title: "Settings", onClick: handleSettingsToggle },
                React.createElement(FontAwesomeIcon, { icon: faCog })),
            React.createElement("button", { className: `${style.settingsButton} ${style.keyboardShortcutsButon}`, title: "view shortcuts", onClick: handleShortcutsToggle },
                React.createElement(FontAwesomeIcon, { icon: faKeyboard })),
            React.createElement("button", { className: `${style.settingsButton}`, title: "Export", onClick: handleExportToggle },
                React.createElement(FontAwesomeIcon, { icon: faShare })))));
};
export default memo(Header);
//# sourceMappingURL=Header.js.map