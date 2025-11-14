import React, { memo } from 'react';
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
        return (React.createElement("li", { key: key, className: style.listItem },
            React.createElement("div", { className: style.shortcut }, shortcut.displayKeyCombination),
            React.createElement("div", { className: style.shortcutLabel }, shortcut.label)));
    });
    return (React.createElement("div", { className: style.shortcuts },
        React.createElement("h2", { className: style.header }, "Shortcuts"),
        React.createElement("div", { className: style.closeButton, onClick: handleShortcutsToggle },
            React.createElement(FontAwesomeIcon, { icon: faWindowClose })),
        React.createElement("ul", { className: style.list }, hotKeysCheatsheet)));
};
export default memo(KeyboardShortcuts);
//# sourceMappingURL=KeyboardShortcuts.js.map