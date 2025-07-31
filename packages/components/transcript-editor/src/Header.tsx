import React, { memo } from 'react';
import {
  faCog,
  faKeyboard,
  faShare,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import style from '../index.module.css';

export interface HeaderProps {
  showSettings: boolean;
  showShortcuts: boolean;
  showExportOptions: boolean;
  settings?: React.ReactNode;
  shortcuts?: React.ReactNode;
  exportOptions?: React.ReactNode;
  tooltip?: React.ReactNode;
  mediaUrl: string | null;
  mediaControls?: React.ReactNode;
  handleSettingsToggle: () => void;
  handleShortcutsToggle: () => void;
  handleExportToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({
  showSettings,
  showShortcuts,
  showExportOptions,
  settings,
  shortcuts,
  exportOptions,
  tooltip,
  mediaUrl,
  mediaControls,
  handleSettingsToggle,
  handleShortcutsToggle,
  handleExportToggle,
}) => {
  return (
    <>
      <header className={style.header}>
        {showSettings ? settings : null}
        {showShortcuts ? shortcuts : null}
        {showExportOptions ? exportOptions : null}
        {tooltip}
      </header>
      <nav className={style.nav}>
        {mediaUrl === null ? null : mediaControls}
      </nav>

      <div className={style.settingsContainer}>
        <button
          className={style.settingsButton}
          title="Settings"
          onClick={handleSettingsToggle}
        >
          <FontAwesomeIcon icon={faCog} />
        </button>
        <button
          className={`${style.settingsButton} ${style.keyboardShortcutsButon}`}
          title="view shortcuts"
          onClick={handleShortcutsToggle}
        >
          <FontAwesomeIcon icon={faKeyboard} />
        </button>
        <button
          className={`${style.settingsButton}`}
          title="Export"
          onClick={handleExportToggle}
        >
          <FontAwesomeIcon icon={faShare} />
        </button>
      </div>
    </>
  );
};

export default memo(Header); 