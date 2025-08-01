import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import PropTypes from 'prop-types';
import style from './index.module.css';
class Toggle extends React.Component {
    render() {
        return (_jsx("div", { className: style.switchContainer, children: _jsxs("label", { className: style.switch, children: [_jsx("input", { type: 'checkbox', defaultChecked: this.props.defaultValue, onChange: this.props.handleToggle }), _jsx("span", { className: style.slider })] }) }));
    }
}
Toggle.propTypes = {
    handleToggle: PropTypes.func,
    label: PropTypes.string,
    defaultValue: PropTypes.bool
};
export default Toggle;
//# sourceMappingURL=index.js.map