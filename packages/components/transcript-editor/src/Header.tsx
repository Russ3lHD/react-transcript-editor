import React, { memo } from 'react';
import {
  faCog,
  faKeyboard,
  faShare,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import MediaPlayer from '../../media-player';
import VideoPlayer from '../../video-player';
import style from '../index.module.css';

type MediaControlsProps = {
  type: 'audio';
  mediaUrl: string | null;
  handleTimeUpdate: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
  handlePlayMedia: (isPlaying: boolean) => void;
  handleIsPlaying: () => boolean;
  onLoadedDataGetDuration: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
  currentTime: number;
  mediaDuration: string;
  videoRef: React.RefObject<HTMLVideoElement>;
} | {
  type: 'video';
  mediaUrl: string | null;
  onTimeUpdate: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  onLoadedDataGetDuration: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
  previewIsDisplayed: boolean;
};

export interface HeaderProps {
  showSettings: boolean;
  showShortcuts: boolean;
  showExportOptions: boolean;
  settings?: React.ReactNode;
  shortcuts?: React.ReactNode;
  exportOptions?: React.ReactNode;
  tooltip?: React.ReactNode;
  mediaUrl: string | null;
  mediaControlsProps?: MediaControlsProps;
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
  mediaControlsProps,
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
        {mediaUrl && mediaControlsProps ? (
          mediaControlsProps.type === 'audio' ? (
            <MediaPlayer
              mediaUrl={mediaControlsProps.mediaUrl}
              handleTimeUpdate={mediaControlsProps.handleTimeUpdate}
              handlePlayMedia={mediaControlsProps.handlePlayMedia}
              handleIsPlaying={mediaControlsProps.handleIsPlaying}
              onLoadedDataGetDuration={mediaControlsProps.onLoadedDataGetDuration}
              currentTime={mediaControlsProps.currentTime}
              mediaDuration={mediaControlsProps.mediaDuration}
              videoRef={mediaControlsProps.videoRef}
            />
          ) : (
            <VideoPlayer
              mediaUrl={mediaControlsProps.mediaUrl}
              onTimeUpdate={mediaControlsProps.onTimeUpdate}
              videoRef={mediaControlsProps.videoRef}
              onLoadedDataGetDuration={mediaControlsProps.onLoadedDataGetDuration}
              previewIsDisplayed={mediaControlsProps.previewIsDisplayed}
            />
          )
        ) : null}
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