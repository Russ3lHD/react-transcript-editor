import React, { memo } from 'react';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import returnHotKeys from './hot-keys';
import style from './index.module.css';

import type { KeyboardShortcutsProps } from './types';

export const getHotKeys = returnHotKeys;

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  handleShortcutsToggle,
  handleAnalyticsEvents,
  togglePlayMedia,
  skipForward,
  skipBackward,
  decreasePlaybackRate,
  increasePlaybackRate,
  rollBack,
  promptSetCurrentTime,
}) => {
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

    return (
      <li key={key} className={style.listItem}>
        <div className={style.shortcut}>{shortcut.displayKeyCombination}</div>
        <div className={style.shortcutLabel}>{shortcut.label}</div>
      </li>
    );
  });

  return (
    <div className={style.shortcuts}>
      <h2 className={style.header}>Shortcuts</h2>
      <div className={style.closeButton} onClick={handleShortcutsToggle}>
        <FontAwesomeIcon icon={faWindowClose} />
      </div>
      <ul className={style.list}>{hotKeysCheatsheet}</ul>
    </div>
  );
};

export default memo(KeyboardShortcuts); 