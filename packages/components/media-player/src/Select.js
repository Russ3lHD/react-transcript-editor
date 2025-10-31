import React from 'react';
import PropTypes from 'prop-types';

// Handle CSS module import with fallback for Storybook
let style;
try {
  style = require('./Select.module.scss');
} catch (error) {
  // Fallback styles for Storybook
  style = {
    selectPlayerControl: 'select-player-control'
  };
}

class Select extends React.Component {

  render() {
    const options = this.props.options.map((option, index) => {

      return <option key={ index } value={ option.value }>{option.label}</option>;
    });

    return (
      <select
        className={ style.selectPlayerControl }
        name={ this.props.name }
        value={ this.props.currentValue }
        onChange={ this.props.handleChange }
      >
        {options}
      </select>
    );
  }
}

Select.propTypes = {
  options: PropTypes.array,
  name: PropTypes.string,
  currentValue: PropTypes.string,
  handleChange: PropTypes.func
};

export default Select;
