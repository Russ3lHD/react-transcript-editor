import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import { 
// eslint-disable-next-line no-unused-vars
faSave, faTv, faPlay, faPause, faBackward, faForward, faUndo, faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PlaybackRate from '../PlaybackRate';
import TimeBox from './TimeBox.js';
// Handle CSS module import with fallback for Storybook
let style;
try {
    style = require('./index.module.scss');
}
catch {
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
        const pictureInPicture = ('pictureInPictureEnabled' in document) ? (React.createElement("button", { value: "Picture-in-picture", title: "Picture-in-picture", className: `${style.playerButton} ${style.pip}`, onClick: this.props.pictureInPicture },
            React.createElement(FontAwesomeIcon, { icon: faTv }))) : null;
        return (React.createElement("div", { className: style.playerControls },
            React.createElement(TimeBox, { promptSetCurrentTime: this.props.promptSetCurrentTime, currentTime: this.props.currentTime, duration: this.props.duration }),
            React.createElement("div", { className: style.btnsGroup },
                React.createElement("button", { value: "seek backward by a set interval: alt r", title: "seek backward by a set interval: alt r", className: style.playerButton, onClick: this.props.rollback },
                    React.createElement(FontAwesomeIcon, { icon: faUndo })),
                React.createElement("button", { value: "seek backward: alt j", title: "seek backward: alt j", className: style.playerButton, onMouseDown: this.setIntervalHelperBackward, onMouseUp: this.clearIntervalHelper, onClick: () => { this.props.skipBackward(); } },
                    React.createElement(FontAwesomeIcon, { icon: faBackward })),
                React.createElement("button", { value: "Play/Pause: alt k", title: "Play/Pause: alt k", className: style.playerButton, onClick: this.props.playMedia }, this.props.isPlaying ? React.createElement(FontAwesomeIcon, { icon: faPause }) : React.createElement(FontAwesomeIcon, { icon: faPlay })),
                React.createElement("button", { value: "seek forward: alt l", title: "seek forward: alt l", className: style.playerButton, onMouseDown: this.setIntervalHelperForward, onMouseUp: this.clearIntervalHelper, onClick: () => { this.props.skipForward(); } },
                    React.createElement(FontAwesomeIcon, { icon: faForward }))),
            React.createElement("div", { className: style.btnsGroup },
                React.createElement(PlaybackRate, { playbackRateOptions: this.props.playbackRateOptions, playbackRate: this.props.playbackRate, name: 'playbackRate', handlePlayBackRateChange: this.props.setPlayBackRate }),
                pictureInPicture,
                React.createElement("button", { value: "Toggle Sound", title: "Toggle Sound", className: style.playerButton, onClick: this.props.handleMuteVolume }, this.props.isMute ? React.createElement(FontAwesomeIcon, { icon: faVolumeMute }) : React.createElement(FontAwesomeIcon, { icon: faVolumeUp })))));
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