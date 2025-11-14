import React from 'react';
import isEqual from 'react-fast-compare';
// Handle CSS module import with fallback for Storybook
let style;
try {
    style = require('./index.module.scss');
}
catch {
    // Fallback styles for Storybook
    style = {
        timeBox: 'time-box',
        currentTime: 'current-time',
        separator: 'time-separator',
        duration: 'duration'
    };
}
class TimeBox extends React.Component {
    shouldComponentUpdate = (nextProps) => {
        return !isEqual(this.props, nextProps);
    };
    handleClick = (e) => {
        this.props.promptSetCurrentTime(e);
    };
    render() {
        return (React.createElement("div", { className: style.timeBox },
            React.createElement("span", { title: "Current time: alt t", className: style.currentTime, onClick: this.handleClick }, this.props.currentTime),
            React.createElement("span", { className: style.separator }, "|"),
            React.createElement("span", { title: "Clip duration", className: style.duration }, this.props.duration)));
    }
}
export default TimeBox;
//# sourceMappingURL=TimeBox.js.map