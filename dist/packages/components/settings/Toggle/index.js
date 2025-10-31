import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import style from './index.module.css';
/**
 * Toggle component for boolean settings
 *
 * A modern, accessible toggle switch component that supports both
 * controlled and uncontrolled usage patterns.
 */
const Toggle = ({ handleToggle, label, defaultValue = false, checked, className = '', disabled = false, id, 'data-testid': testId, }) => {
    const inputId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;
    return (_jsx("div", { className: `${style.switchContainer} ${className}`.trim(), children: _jsxs("label", { className: style.switch, htmlFor: inputId, children: [_jsx("input", { id: inputId, type: "checkbox", defaultChecked: defaultValue, checked: checked, onChange: handleToggle, disabled: disabled, "data-testid": testId, "aria-checked": checked ?? defaultValue, role: "switch" }), _jsx("span", { className: style.slider, "aria-hidden": "true" }), label && (_jsx("span", { className: style.label, children: label }))] }) }));
};
export default Toggle;
//# sourceMappingURL=index.js.map