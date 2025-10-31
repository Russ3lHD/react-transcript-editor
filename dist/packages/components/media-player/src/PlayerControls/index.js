import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import { 
// eslint-disable-next-line no-unused-vars
faSave, faTv, faPlay, faPause, faBackward, faForward, faUndo, faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
// eslint-disable-next-line no-unused-vars
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// eslint-disable-next-line no-unused-vars
import PlaybackRate from '../PlaybackRate';
// eslint-disable-next-line no-unused-vars
import TimeBox from './TimeBox.js';
// Handle CSS module import with fallback for Storybook
let style;
try {
    style = require('./index.module.scss');
}
catch (error) {
    // Fallback styles for Storybook
    style = {
        playerControls: 'player-controls',
        playerButton: 'player-button',
        pip: 'player-button-pip',
        btnsGroup: 'player-buttons-group'
    };
}
class PlayerControls extends React.Component {
    shouldComponentUpdate = (nextProps) => {
        return !isEqual(this.props, nextProps);
    };
    setIntervalHelperBackward = () => {
        // this.props.skipBackward();
        this.interval = setInterval(() => {
            this.props.skipBackward();
        }, 300);
    };
    setIntervalHelperForward = () => {
        // this.props.skipForward();
        this.interval = setInterval(() => {
            this.props.skipForward();
        }, 300);
    };
    clearIntervalHelper = () => {
        clearInterval(this.interval);
    };
    render() {
        const pictureInPicture = ('pictureInPictureEnabled' in document) ? (_jsx("button", { value: "Picture-in-picture", title: "Picture-in-picture", className: `${style.playerButton} ${style.pip}`, onClick: this.props.pictureInPicture, children: _jsx(FontAwesomeIcon, { icon: faTv }) })) : null;
        return (_jsxs("div", { className: style.playerControls, children: [_jsx(TimeBox, { promptSetCurrentTime: this.props.promptSetCurrentTime, currentTime: this.props.currentTime, duration: this.props.duration }), _jsxs("div", { className: style.btnsGroup, children: [_jsx("button", { value: "seek backward by a set interval: alt r", title: "seek backward by a set interval: alt r", className: style.playerButton, onClick: this.props.rollback, children: _jsx(FontAwesomeIcon, { icon: faUndo }) }), _jsx("button", { value: "seek backward: alt j", title: "seek backward: alt j", className: style.playerButton, onMouseDown: this.setIntervalHelperBackward, onMouseUp: this.clearIntervalHelper, onClick: () => { this.props.skipBackward(); }, children: _jsx(FontAwesomeIcon, { icon: faBackward }) }), _jsx("button", { value: "Play/Pause: alt k", title: "Play/Pause: alt k", className: style.playerButton, onClick: this.props.playMedia, children: this.props.isPlaying ? _jsx(FontAwesomeIcon, { icon: faPause }) : _jsx(FontAwesomeIcon, { icon: faPlay }) }), _jsx("button", { value: "seek forward: alt l", title: "seek forward: alt l", className: style.playerButton, onMouseDown: this.setIntervalHelperForward, onMouseUp: this.clearIntervalHelper, onClick: () => { this.props.skipForward(); }, children: _jsx(FontAwesomeIcon, { icon: faForward }) })] }), _jsxs("div", { className: style.btnsGroup, children: [_jsx(PlaybackRate, { playbackRateOptions: this.props.playbackRateOptions, playbackRate: this.props.playbackRate, name: 'playbackRate', handlePlayBackRateChange: this.props.setPlayBackRate }), pictureInPicture, _jsx("button", { value: "Toggle Sound", title: "Toggle Sound", className: style.playerButton, onClick: this.props.handleMuteVolume, children: this.props.isMute ? _jsx(FontAwesomeIcon, { icon: faVolumeMute }) : _jsx(FontAwesomeIcon, { icon: faVolumeUp }) })] })] }));
    }
}
PlayerControls.propTypes = {
    playMedia: PropTypes.func,
    currentTime: PropTypes.string,
    timecodeOffset: PropTypes.string,
    promptSetCurrentTime: PropTypes.func,
    rollback: PropTypes.func,
    handleMuteVolume: PropTypes.func,
    duration: PropTypes.string,
    isPlaying: PropTypes.bool,
    isMute: PropTypes.bool,
    skipBackward: PropTypes.func,
    skipForward: PropTypes.func,
    playbackRate: PropTypes.number,
    playbackRateOptions: PropTypes.array,
    setPlayBackRate: PropTypes.func,
    pictureInPicture: PropTypes.func
};
export default PlayerControls;
//# sourceMappingURL=index.js.map