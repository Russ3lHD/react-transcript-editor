import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import style from './index.module.css';
const ExportOptions = ({ exportOptionsList, handleExportOptionsChange, handleExportToggle, }) => {
    return (React.createElement("div", { className: style.settings },
        React.createElement("h2", { className: style.header }, "Export Options"),
        React.createElement("div", { className: style.closeButton, onClick: handleExportToggle },
            React.createElement(FontAwesomeIcon, { icon: faWindowClose })),
        React.createElement("div", { className: style.controlsContainer }, exportOptionsList.map((opt, index) => (React.createElement(React.Fragment, { key: `${opt.label}-${index}` },
            React.createElement("button", { title: opt.label, className: style.playerButton, onClick: handleExportOptionsChange, value: opt.value }, opt.label),
            React.createElement("br", null)))))));
};
export default ExportOptions;
//# sourceMappingURL=ExportOptions.js.map