import React from 'react';
import isEqual from 'react-fast-compare';

// Handle CSS module import with fallback for Storybook
let style;
try {
  style = require('./index.module.scss');
} catch {
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
    return (
      <div className={ style.timeBox }>
        <span
          title="Current time: alt t"
          className={ style.currentTime }
          onClick={ this.handleClick }>
          { this.props.currentTime }</span>
        <span className={ style.separator }>|</span>
        <span
          title="Clip duration"
          className={ style.duration }>
          {this.props.duration}</span>
      </div>
    );
  }
}

export default TimeBox;
