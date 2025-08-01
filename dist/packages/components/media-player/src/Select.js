import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import PropTypes from 'prop-types';
import style from './Select.module.scss';
class Select extends React.Component {
    render() {
        const options = this.props.options.map((option, index) => {
            return _jsx("option", { value: option.value, children: option.label }, index);
        });
        return (_jsx("select", { className: style.selectPlayerControl, name: this.props.name, value: this.props.currentValue, onChange: this.props.handleChange, children: options }));
    }
}
Select.propTypes = {
    options: PropTypes.array,
    name: PropTypes.string,
    currentValue: PropTypes.string,
    handleChange: PropTypes.func
};
export default Select;
//# sourceMappingURL=Select.js.map