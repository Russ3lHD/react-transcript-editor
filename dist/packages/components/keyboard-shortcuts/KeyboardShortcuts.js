import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo } from 'react';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import returnHotKeys from './hot-keys';
import style from './index.module.css';
export const getHotKeys = returnHotKeys;
const KeyboardShortcuts = ({ handleShortcutsToggle, handleAnalyticsEvents, togglePlayMedia, skipForward, skipBackward, decreasePlaybackRate, increasePlaybackRate, rollBack, promptSetCurrentTime, }) => {
    const context = {
        togglePlayMedia,
        skipForward,
        skipBackward,
        decreasePlaybackRate,
        increasePlaybackRate,
        rollBack,
        promptSetCurrentTime,
        props: { handleAnalyticsEvents },
    };
    const hotKeys = returnHotKeys(context);
    const hotKeysCheatsheet = Object.keys(hotKeys).map((key) => {
        const shortcut = hotKeys[key];
        return (_jsxs("li", { className: style.listItem, children: [_jsx("div", { className: style.shortcut, children: shortcut.displayKeyCombination }), _jsx("div", { className: style.shortcutLabel, children: shortcut.label })] }, key));
    });
    return (_jsxs("div", { className: style.shortcuts, children: [_jsx("h2", { className: style.header, children: "Shortcuts" }), _jsx("div", { className: style.closeButton, onClick: handleShortcutsToggle, children: _jsx(FontAwesomeIcon, { icon: faWindowClose }) }), _jsx("ul", { className: style.list, children: hotKeysCheatsheet })] }));
};
export default memo(KeyboardShortcuts);
//# sourceMappingURL=KeyboardShortcuts.js.map