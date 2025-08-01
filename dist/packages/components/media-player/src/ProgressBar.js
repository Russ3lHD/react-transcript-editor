import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import style from './ProgressBar.module.scss';
class ProgressBar extends React.Component {
    shouldComponentUpdate = (nextProps) => {
        return !isEqual(this.props, nextProps);
    };
    handleOnChange = (e) => {
        this.props.buttonClick(e);
    };
    render() {
        return (_jsx("div", { className: style.wrapper, children: _jsx("input", { type: 'range', className: style.bar, onChange: this.handleOnChange, value: this.props.value, min: '0', max: this.props.max.toString() }) }));
    }
}
ProgressBar.propTypes = {
    value: PropTypes.string,
    max: PropTypes.string,
    buttonClick: PropTypes.func
};
ProgressBar.defaultProps = {
    value: '0',
    max: '0'
};
export default ProgressBar;
//# sourceMappingURL=ProgressBar.js.map