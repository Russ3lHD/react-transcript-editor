import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Editor, EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';

import CustomEditor from './CustomEditor';
import style from './index.module.css';

import type {
  TimedTextEditorProps,
  TranscriptData,
  AnalyticsEvent,
} from './types';

const TimedTextEditor: React.FC<TimedTextEditorProps> = ({
  transcriptData,
  handleWordClick,
  handleTimeUpdate,
  handlePlayMedia,
  handleIsPlaying,
  isScrollIntoViewOn,
  isPauseWhileTypingOn,
  rollBackValueInSeconds,
  timecodeOffset,
  showTimecodes,
  showSpeakers,
  sttJsonType,
  fileName = 'transcript',
  spellCheck = false,
  autoSaveContentType = 'json',
  autoSaveContent = false,
  autoSaveMethod = 'localStorageForEditors',
  autoSaveInterval = 30000,
  placeholder = 'Start typing...',
  title = 'Timed Text Editor',
  handleAutoSaveChanges,
  handleAnalyticsEvents,
}) => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [currentTime, setCurrentTime] = useState(0);
  const editorRef = useRef<Editor>(null);

  // Initialize editor with transcript data
  useEffect(() => {
    if (transcriptData) {
      try {
        const contentState = convertFromRaw(transcriptData);
        const newEditorState = EditorState.createWithContent(contentState);
        setEditorState(newEditorState);
      } catch (error) {
        console.error('Error converting transcript data:', error);
      }
    }
  }, [transcriptData]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveContent) return;

    const interval = setInterval(() => {
      const contentState = editorState.getCurrentContent();
      const rawContent = convertToRaw(contentState);
      
      if (handleAutoSaveChanges) {
        handleAutoSaveChanges(rawContent);
      }
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [editorState, autoSaveContent, autoSaveInterval, handleAutoSaveChanges]);

  // Handle word click
  const handleWordClickCallback = useCallback((startTime: number) => {
    handleWordClick(startTime);
    
    if (handleAnalyticsEvents) {
      handleAnalyticsEvents({
        category: 'TimedTextEditor',
        action: 'click',
        name: 'wordClick',
        value: startTime.toString(),
      });
    }
  }, [handleWordClick, handleAnalyticsEvents]);

  // Handle editor change
  const handleEditorChange = useCallback((newEditorState: EditorState) => {
    setEditorState(newEditorState);
    
    // Pause media while typing if enabled
    if (isPauseWhileTypingOn && handleIsPlaying()) {
      handlePlayMedia(false);
    }
  }, [isPauseWhileTypingOn, handleIsPlaying, handlePlayMedia]);

  // Handle time update
  const handleTimeUpdateCallback = useCallback((event: React.SyntheticEvent<HTMLVideoElement>) => {
    const newCurrentTime = event.currentTarget.currentTime;
    setCurrentTime(newCurrentTime);
    handleTimeUpdate(event);
  }, [handleTimeUpdate]);

  // Memoized custom editor component
  const customEditor = useMemo(() => (
    <CustomEditor
      transcriptData={transcriptData}
      handleWordClick={handleWordClickCallback}
      showTimecodes={showTimecodes}
      showSpeakers={showSpeakers}
      placeholder={placeholder}
      spellCheck={spellCheck}
      autoSaveContent={autoSaveContent}
      autoSaveInterval={autoSaveInterval}
      handleAutoSaveChanges={handleAutoSaveChanges}
    />
  ), [
    transcriptData,
    handleWordClickCallback,
    showTimecodes,
    showSpeakers,
    placeholder,
    spellCheck,
    autoSaveContent,
    autoSaveInterval,
    handleAutoSaveChanges,
  ]);

  return (
    <div className={style.timedTextEditor}>
      <div className={style.container}>
        <h3>{title}</h3>
        <div className={style.editor}>
          <Editor
            ref={editorRef}
            editorState={editorState}
            onChange={handleEditorChange}
            placeholder={placeholder}
            spellCheck={spellCheck}
          />
        </div>
        {customEditor}
      </div>
    </div>
  );
};

export default TimedTextEditor; 