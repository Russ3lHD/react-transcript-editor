import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import Select from './Select';
// Handle CSS module import with fallback for Storybook
let style;
try {
    style = require('./PlayerControls/index.module.scss');
}
catch {
    // Fallback styles for Storybook
    style = {
        playBackRate: 'playback-rate'
    };
}
class PlaybackRate extends React.Component {
    shouldComponentUpdate = (nextProps) => {
        return !isEqual(this.props, nextProps);
    };
    render() {
        return (React.createElement("span", { className: style.playBackRate, title: "Playback rate: alt - & alt + " },
            React.createElement(Select, { options: this.props.playbackRateOptions, currentValue: this.props.playbackRate.toString(), name: 'playbackRate', handleChange: this.props.handlePlayBackRateChange })));
    }
}
PlaybackRate.propTypes = {
    playbackRateOptions: PropTypes.array,
    playbackRate: PropTypes.number,
    handlePlayBackRateChange: PropTypes.func
};
export default PlaybackRate;
//# sourceMappingURL=PlaybackRate.js.map