import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { secondsToTimecode } from '../../util/timecode-converter';
import TimedTextEditor from '../timed-text-editor';
import MediaPlayer from '../media-player';
import VideoPlayer from '../video-player';
import Settings from '../settings';
import Shortcuts from '../keyboard-shortcuts';
import Header from './src/Header';
import ExportOptions, { ExportOption } from './src/ExportOptions';
import HowDoesThisWork from './src/HowDoesThisWork';
import style from './index.module.css';

import type {
  TranscriptEditorProps,
  TranscriptEditorState,
  AnalyticsEvent,
  GridDisplay,
} from './types';

const exportOptionsList: ExportOption[] = [
  { value: 'txt', label: 'Text file' },
  {
    value: 'txtspeakertimecodes',
    label: 'Text file - with Speakers and Timecodes',
  },
  { value: 'docx', label: 'MS Word' },
  { value: 'srt', label: 'Srt - Captions' },
  { value: 'ttml', label: 'TTML - Captions' },
  { value: 'premiereTTML', label: 'TTML for Adobe Premiere - Captions' },
  { value: 'itt', label: 'iTT - Captions' },
  { value: 'csv', label: 'CSV - Captions' },
  { value: 'vtt', label: 'VTT - Captions' },
  { value: 'pre-segment-txt', label: 'Pre segmented txt - Captions' },
  { value: 'json-captions', label: 'Json - Captions' },
  { value: 'draftjs', label: 'Draft Js - json' },
  { value: 'digitalpaperedit', label: 'Digital Paper Edit - Json' },
];

const TranscriptEditor: React.FC<TranscriptEditorProps> = ({
  transcriptData: initialTranscriptData,
  mediaUrl,
  mediaType = 'video',
  handleTimeUpdate,
  handleAnalyticsEvents,
  sttJsonType,
  fileName = 'transcript',
  spellCheck = false,
  autoSaveContentType = 'json',
  autoSaveContent = false,
  autoSaveMethod = 'localStorageForEditors',
  autoSaveInterval = 30000,
  placeholder = 'Start typing...',
  title = 'Transcript Editor',
  showTimecodes: initialShowTimecodes = true,
  showSpeakers: initialShowSpeakers = true,
  timecodeOffset: initialTimecodeOffset = 0,
  isPauseWhileTypingOn: initialIsPauseWhileTypingOn = true,
  rollBackValueInSeconds: initialRollBackValueInSeconds = 15,
  previewIsDisplayed: initialPreviewIsDisplayed = true,
  mediaDuration: initialMediaDuration = '00:00:00:00',
  gridDisplay: initialGridDisplay = null,
}) => {
  const videoRef = useRef<any>(null);
  const timedTextEditorRef = useRef<any>(null);

  const [state, setState] = useState<TranscriptEditorState>({
    currentTime: 0,
    transcriptData: initialTranscriptData,
    isScrollIntoViewOn: false,
    showSettings: false,
    showShortcuts: false,
    showExportOptions: false,
    isPauseWhileTypingOn: initialIsPauseWhileTypingOn,
    rollBackValueInSeconds: initialRollBackValueInSeconds,
    timecodeOffset: initialTimecodeOffset,
    showTimecodes: initialShowTimecodes,
    showSpeakers: initialShowSpeakers,
    previewIsDisplayed: initialPreviewIsDisplayed,
    mediaDuration: initialMediaDuration,
    gridDisplay: initialGridDisplay,
  });

  // Update transcript data when props change
  useEffect(() => {
    if (initialTranscriptData !== null) {
      setState(prev => ({ ...prev, transcriptData: initialTranscriptData }));
    }
  }, [initialTranscriptData]);

  // Update dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      let gridDisplay: GridDisplay | null = {
        display: 'grid',
        gridTemplateColumns: '1fr 3fr',
        gridColumnGap: '1em',
      };

      if (mediaType === 'audio') {
        console.log('mediaType is audio, extending TimedTextEditor to full width');
        gridDisplay = null;
      }

      setState(prev => ({ ...prev, gridDisplay }));
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [mediaType]);

  // Event handlers
  const handleWordClick = useCallback((startTime: number) => {
    if (videoRef.current && videoRef.current.current) {
      videoRef.current.current.currentTime = startTime;
      videoRef.current.current.play();
    }
  }, []);

  const handleTimeUpdateCallback = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    const currentTime = e.currentTarget.currentTime;
    setState(prev => ({ ...prev, currentTime }));
    if (handleTimeUpdate) {
      handleTimeUpdate(currentTime);
    }
  }, [handleTimeUpdate]);

  const handlePlayMedia = useCallback((isPlaying: boolean) => {
    if (videoRef.current && videoRef.current.current) {
      if (isPlaying) {
        videoRef.current.current.play();
      } else {
        videoRef.current.current.pause();
      }
    }
  }, []);

  const handleIsPlaying = useCallback(() => {
    return videoRef.current && videoRef.current.current ? !videoRef.current.current.paused : false;
  }, []);

  const handleIsScrollIntoViewChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, isScrollIntoViewOn: e.target.checked }));
  }, []);

  const handlePauseWhileTyping = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, isPauseWhileTypingOn: e.target.checked }));
  }, []);

  const handleRollBackValueInSeconds = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, rollBackValueInSeconds: parseInt(e.target.value, 10) }));
  }, []);

  const handleSetTimecodeOffset = useCallback((timecodeOffset: number) => {
    setState(prev => ({ ...prev, timecodeOffset }));
  }, []);

  const handleShowTimecodes = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, showTimecodes: e.target.checked }));
  }, []);

  const handleShowSpeakers = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, showSpeakers: e.target.checked }));
  }, []);

  const handleSettingsToggle = useCallback(() => {
    setState(prev => ({ ...prev, showSettings: !prev.showSettings }));
  }, []);

  const handleShortcutsToggle = useCallback(() => {
    setState(prev => ({ ...prev, showShortcuts: !prev.showShortcuts }));
  }, []);

  const handleExportToggle = useCallback(() => {
    setState(prev => ({ ...prev, showExportOptions: !prev.showExportOptions }));
  }, []);

  const handleExportOptionsChange = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const exportFormat = e.currentTarget.value;
    // Export logic would go here
    console.log('Exporting with format:', exportFormat);
  }, []);

  const handlePreviewIsDisplayed = useCallback(() => {
    setState(prev => ({ ...prev, previewIsDisplayed: !prev.previewIsDisplayed }));
  }, []);

  const onLoadedDataGetDuration = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    const duration = e.currentTarget.duration;
    const timecode = secondsToTimecode(duration);
    setState(prev => ({ ...prev, mediaDuration: timecode }));
  }, []);

  const handleAutoSaveChanges = useCallback((data: any) => {
    if (autoSaveContent) {
      localStorage.setItem('transcriptEditorAutoSave', JSON.stringify(data));
    }
  }, [autoSaveContent]);

  // Memoized components
  const mediaControls = useMemo(() => {
    if (mediaType === 'audio') {
      return (
                         <MediaPlayer
          mediaUrl={mediaUrl}
          handleTimeUpdate={handleTimeUpdateCallback}
          handlePlayMedia={handlePlayMedia}
          handleIsPlaying={handleIsPlaying}
          onLoadedDataGetDuration={onLoadedDataGetDuration}
          currentTime={state.currentTime}
          mediaDuration={state.mediaDuration}
          videoRef={videoRef}
        />
      );
    }
    return (
                   <VideoPlayer
        mediaUrl={mediaUrl}
        onTimeUpdate={handleTimeUpdateCallback}
        videoRef={videoRef}
        onLoadedDataGetDuration={onLoadedDataGetDuration}
        previewIsDisplayed={state.previewIsDisplayed}
      />
    );
  }, [
    mediaType,
    mediaUrl,
    handleTimeUpdateCallback,
    handlePlayMedia,
    handleIsPlaying,
    onLoadedDataGetDuration,
    state.currentTime,
    state.mediaDuration,
    state.previewIsDisplayed,
    videoRef,
  ]);

  const settings = useMemo(() => (
    <Settings
      showTimecodes={state.showTimecodes}
      showSpeakers={state.showSpeakers}
      timecodeOffset={state.timecodeOffset}
      handleShowTimecodes={handleShowTimecodes}
      handleShowSpeakers={handleShowSpeakers}
      handleSetTimecodeOffset={handleSetTimecodeOffset}
      handleSettingsToggle={handleSettingsToggle}
      handlePauseWhileTyping={handlePauseWhileTyping}
      handleIsScrollIntoViewChange={handleIsScrollIntoViewChange}
      handleRollBackValueInSeconds={handleRollBackValueInSeconds}
      defaultValueScrollSync={state.isScrollIntoViewOn}
      defaultValuePauseWhileTyping={state.isPauseWhileTypingOn}
      defaultRollBackValueInSeconds={state.rollBackValueInSeconds}
      previewIsDisplayed={state.previewIsDisplayed}
      handlePreviewIsDisplayed={handlePreviewIsDisplayed}
      handleAnalyticsEvents={handleAnalyticsEvents}
    />
  ), [
    state.showTimecodes,
    state.showSpeakers,
    state.timecodeOffset,
    state.isScrollIntoViewOn,
    state.isPauseWhileTypingOn,
    state.rollBackValueInSeconds,
    state.previewIsDisplayed,
    handleShowTimecodes,
    handleShowSpeakers,
    handleSetTimecodeOffset,
    handleSettingsToggle,
    handlePauseWhileTyping,
    handleIsScrollIntoViewChange,
    handleRollBackValueInSeconds,
    handlePreviewIsDisplayed,
    handleAnalyticsEvents,
  ]);

  const shortcuts = useMemo(() => (
    <Shortcuts handleShortcutsToggle={handleShortcutsToggle} />
  ), [handleShortcutsToggle]);

  const exportOptions = useMemo(() => (
    <ExportOptions
      exportOptionsList={exportOptionsList}
      handleExportOptionsChange={handleExportOptionsChange}
      handleExportToggle={handleExportToggle}
    />
  ), [handleExportOptionsChange, handleExportToggle]);

  const tooltip = useMemo(() => (
    <HowDoesThisWork handleAnalyticsEvents={handleAnalyticsEvents} />
  ), [handleAnalyticsEvents]);

  return (
    <div className={style.transcriptEditor} style={state.gridDisplay || undefined}>
      <Header
        showSettings={state.showSettings}
        showShortcuts={state.showShortcuts}
        showExportOptions={state.showExportOptions}
        settings={settings}
        shortcuts={shortcuts}
        exportOptions={exportOptions}
        tooltip={tooltip}
        mediaUrl={mediaUrl}
        mediaControls={mediaControls}
        handleSettingsToggle={handleSettingsToggle}
        handleShortcutsToggle={handleShortcutsToggle}
        handleExportToggle={handleExportToggle}
      />

      <div className={style.editorContainer}>
        <TimedTextEditor
          transcriptData={state.transcriptData}
          handleWordClick={handleWordClick}
          handleTimeUpdate={handleTimeUpdateCallback}
          handlePlayMedia={handlePlayMedia}
          handleIsPlaying={handleIsPlaying}
          isScrollIntoViewOn={state.isScrollIntoViewOn}
          isPauseWhileTypingOn={state.isPauseWhileTypingOn}
          rollBackValueInSeconds={state.rollBackValueInSeconds}
          timecodeOffset={state.timecodeOffset}
          showTimecodes={state.showTimecodes}
          showSpeakers={state.showSpeakers}
          sttJsonType={sttJsonType}
          fileName={fileName}
          spellCheck={spellCheck}
          autoSaveContentType={autoSaveContentType}
          autoSaveContent={autoSaveContent}
          autoSaveMethod={autoSaveMethod}
          autoSaveInterval={autoSaveInterval}
          placeholder={placeholder}
          title={title}
          handleAutoSaveChanges={handleAutoSaveChanges}
          handleAnalyticsEvents={handleAnalyticsEvents}
        />
      </div>
    </div>
  );
};

export default TranscriptEditor; 