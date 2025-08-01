import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import PropTypes from 'prop-types';
import style from './index.module.css';
import { timecodeToSeconds, secondsToTimecode } from '../../../util/timecode-converter';
class TimecodeOffset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timecodeOffset: secondsToTimecode(this.props.timecodeOffset)
        };
    }
    handleChange = e => {
        this.setState({
            timecodeOffset: e.target.value
        });
    };
    resetTimecodeOffset = () => {
        const resetTimecodeOffsetValue = 0;
        if (this.props.handleAnalyticsEvents !== undefined) {
            this.props.handleAnalyticsEvents({
                category: 'TimecodeOffset',
                action: 'resetTimecodeOffset',
                name: 'resetTimecodeOffset',
                value: 0
            });
        }
        this.setState({
            timecodeOffset: secondsToTimecode(resetTimecodeOffsetValue)
        }, () => {
            this.props.handleSetTimecodeOffset(resetTimecodeOffsetValue);
        });
    };
    setTimecodeOffset = () => {
        if (this.props.handleAnalyticsEvents !== undefined) {
            this.props.handleAnalyticsEvents({
                category: 'TimecodeOffset',
                action: 'setTimecodeOffset',
                name: 'setTimecodeOffset',
                value: this.state.timecodeOffset
            });
        }
        let newCurrentTimeInSeconds = this.state.timecodeOffset;
        if (typeof newCurrentTimeInSeconds === 'string' &&
            newCurrentTimeInSeconds.includes(':') &&
            !newCurrentTimeInSeconds.includes('NaN')) {
            newCurrentTimeInSeconds = timecodeToSeconds(newCurrentTimeInSeconds);
        }
        this.props.handleSetTimecodeOffset(newCurrentTimeInSeconds);
    };
    render() {
        return (_jsxs("div", { className: style.offsetContainer, children: [_jsx("input", { className: style.inputBox, type: "text", value: this.state.timecodeOffset, onChange: this.handleChange, name: "lname" }), _jsx("span", { className: style.button, onClick: this.resetTimecodeOffset, children: _jsx("u", { children: "Reset" }) }), _jsx("span", { children: " | " }), _jsx("span", { className: style.button, onClick: this.setTimecodeOffset, children: _jsx("u", { children: "Save" }) })] }));
    }
}
TimecodeOffset.propTypes = {
    handleSetTimecodeOffset: PropTypes.func,
    onChange: PropTypes.func,
    timecodeOffset: PropTypes.number,
    handleAnalyticsEvents: PropTypes.func
};
export default TimecodeOffset;
//# sourceMappingURL=index.js.map