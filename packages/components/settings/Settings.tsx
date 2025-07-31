import React, { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

import Toggle from './Toggle/';
import TimecodeOffset from './TimecodeOffset';

import style from './index.module.css';

import type { SettingsProps } from './types';

const Settings: React.FC<SettingsProps> = ({
  showTimecodes,
  showSpeakers,
  timecodeOffset,
  handleShowTimecodes,
  handleShowSpeakers,
  handleSetTimecodeOffset,
  handleSettingsToggle,
  handlePauseWhileTyping,
  handleIsScrollIntoViewChange,
  handleRollBackValueInSeconds,
  defaultValueScrollSync,
  defaultValuePauseWhileTyping,
  defaultRollBackValueInSeconds,
  previewIsDisplayed,
  handlePreviewIsDisplayed,
  handleAnalyticsEvents,
}) => {
  return (
    <div className={style.settings}>
      <h2 className={style.header}>Settings Panel</h2>
      <div className={style.closeButton} onClick={handleSettingsToggle}>
        <FontAwesomeIcon icon={faWindowClose} />
      </div>

      <div className={style.controlsContainer}>
        <section className={style.settingElement}>
          <div className={style.label}>Pause While Typing</div>
          <Toggle
            defaultValue={defaultValuePauseWhileTyping}
            label="Pause while typing"
            handleToggle={handlePauseWhileTyping}
          />
        </section>

        <section className={style.settingElement}>
          <div className={style.label}>Scroll Sync</div>
          <Toggle
            defaultValue={defaultValueScrollSync}
            label="ScrollSync"
            handleToggle={handleIsScrollIntoViewChange}
          />
        </section>

        <section className={style.settingElement}>
          <div className={style.label}>Rollback Interval (sec)</div>
          <input
            className={style.rollbackValue}
            type="number"
            step="1"
            max="60"
            min="1"
            value={defaultRollBackValueInSeconds}
            onChange={handleRollBackValueInSeconds}
            name="lname"
          />
        </section>

        <section className={style.settingElement}>
          <div className={style.label}>Show Timecodes</div>
          <Toggle
            defaultValue={showTimecodes}
            label="Hide Timecodes"
            handleToggle={handleShowTimecodes}
          />
        </section>

        <section className={style.settingElement}>
          <div className={style.label}>Show Speaker Labels</div>
          <Toggle
            defaultValue={showSpeakers}
            label="Hide Speaker Labels"
            handleToggle={handleShowSpeakers}
          />
        </section>

        <section className={style.settingElement}>
          <div className={style.label}>Display Preview</div>
          <Toggle
            defaultValue={previewIsDisplayed}
            label="Display Preview"
            handleToggle={handlePreviewIsDisplayed}
          />
        </section>

        <section className={style.settingElement}>
          <div className={style.timecodeLabel}>Timecode Offset ℹ</div>
          <TimecodeOffset
            timecodeOffset={timecodeOffset}
            handleSetTimecodeOffset={handleSetTimecodeOffset}
            handleAnalyticsEvents={handleAnalyticsEvents}
          />
        </section>
      </div>
    </div>
  );
};

export default memo(Settings); 