import React from 'react';
import bbcKaldiTranscript from './fixtures/bbc-kaldi.json';
import TimedTextEditor from '../index.js';

const meta = {
  title: 'Components/TimedTextEditor',
  component: TimedTextEditor,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    mediaUrl: { control: 'text' },
    isEditable: { control: 'boolean' },
    spellCheck: { control: 'boolean' },
    sttJsonType: { control: 'text' },
    currentTime: { control: { type: 'number', min: 0, step: 0.1 } },
    isScrollIntoViewOn: { control: 'boolean' },
    isPauseWhileTypingOn: { control: 'boolean' },
    timecodeOffset: { control: { type: 'number', min: -3600, max: 3600, step: 1 } },
    showSpeakers: { control: 'boolean' },
    showTimecodes: { control: 'boolean' },
    fileName: { control: 'text' },
    onWordClick: { action: 'onWordClick' },
    isPlaying: { action: 'isPlaying' },
    playMedia: { action: 'playMedia' },
    handleAnalyticsEvents: { action: 'handleAnalyticsEvents' }
  },
};

export default meta;

const mediaUrl = 'https://download.ted.com/talks/KateDarling_2018S-950k.mp4';

export const Default = {
  args: {
    transcriptData: bbcKaldiTranscript,
    mediaUrl: mediaUrl,
    isEditable: true,
    spellCheck: false,
    sttJsonType: 'bbckaldi',
    currentTime: 0,
    isScrollIntoViewOn: true,
    isPauseWhileTypingOn: true,
    timecodeOffset: 0,
    showSpeakers: true,
    showTimecodes: true,
    fileName: 'KateDarling_2018S-950k.mp4',
  },
};

export const EmptyDPE = {
  args: {
    transcriptData: { 'paragraphs': [], 'words': [] },
    mediaUrl: mediaUrl,
    isEditable: true,
    spellCheck: false,
    sttJsonType: 'digitalpaperedit',
    currentTime: 0,
    isScrollIntoViewOn: true,
    isPauseWhileTypingOn: true,
    timecodeOffset: 0,
    showSpeakers: true,
    showTimecodes: true,
    fileName: 'KateDarling_2018S-950k.mp4',
  },
};
