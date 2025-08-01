import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { memo } from 'react';
import { faCog, faKeyboard, faShare, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from '../index.module.css';
const Header = ({ showSettings, showShortcuts, showExportOptions, settings, shortcuts, exportOptions, tooltip, mediaUrl, mediaControls, handleSettingsToggle, handleShortcutsToggle, handleExportToggle, }) => {
    return (_jsxs(_Fragment, { children: [_jsxs("header", { className: style.header, children: [showSettings ? settings : null, showShortcuts ? shortcuts : null, showExportOptions ? exportOptions : null, tooltip] }), _jsx("nav", { className: style.nav, children: mediaUrl === null ? null : mediaControls }), _jsxs("div", { className: style.settingsContainer, children: [_jsx("button", { className: style.settingsButton, title: "Settings", onClick: handleSettingsToggle, children: _jsx(FontAwesomeIcon, { icon: faCog }) }), _jsx("button", { className: `${style.settingsButton} ${style.keyboardShortcutsButon}`, title: "view shortcuts", onClick: handleShortcutsToggle, children: _jsx(FontAwesomeIcon, { icon: faKeyboard }) }), _jsx("button", { className: `${style.settingsButton}`, title: "Export", onClick: handleExportToggle, children: _jsx(FontAwesomeIcon, { icon: faShare }) })] })] }));
};
export default memo(Header);
//# sourceMappingURL=Header.js.map