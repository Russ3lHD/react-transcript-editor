import React from 'react';
import style from './index.module.css';
/**
 * Toggle component for boolean settings
 *
 * A modern, accessible toggle switch component that supports both
 * controlled and uncontrolled usage patterns.
 */
const Toggle = ({ handleToggle, label, defaultValue = false, checked, className = '', disabled = false, id, 'data-testid': testId, }) => {
    const inputId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;
    return (React.createElement("div", { className: `${style.switchContainer} ${className}`.trim() },
        React.createElement("label", { className: style.switch, htmlFor: inputId },
            React.createElement("input", { id: inputId, type: "checkbox", defaultChecked: defaultValue, checked: checked, onChange: handleToggle, disabled: disabled, "data-testid": testId, "aria-checked": checked ?? defaultValue, role: "switch" }),
            React.createElement("span", { className: style.slider, "aria-hidden": "true" }),
            label && (React.createElement("span", { className: style.label }, label)))));
};
export default Toggle;
//# sourceMappingURL=index.js.map