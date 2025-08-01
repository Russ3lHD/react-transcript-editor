import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import style from './index.module.css';
const ExportOptions = ({ exportOptionsList, handleExportOptionsChange, handleExportToggle, }) => {
    return (_jsxs("div", { className: style.settings, children: [_jsx("h2", { className: style.header, children: "Export Options" }), _jsx("div", { className: style.closeButton, onClick: handleExportToggle, children: _jsx(FontAwesomeIcon, { icon: faWindowClose }) }), _jsx("div", { className: style.controlsContainer, children: exportOptionsList.map((opt, index) => (_jsxs(React.Fragment, { children: [_jsx("button", { title: opt.label, className: style.playerButton, onClick: handleExportOptionsChange, value: opt.value, children: opt.label }), _jsx("br", {})] }, `${opt.label}-${index}`))) })] }));
};
export default ExportOptions;
//# sourceMappingURL=ExportOptions.js.map