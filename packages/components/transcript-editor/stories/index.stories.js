import React from "react";
import bbcKaldiTranscript from "./fixtures/bbc-kaldi.json";
import TranscriptEditor from "../index.js";

const meta = {
  title: 'Components/TranscriptEditor',
  component: TranscriptEditor,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    mediaUrl: { control: 'text' },
    sttJsonType: { control: 'text' },
    isEditable: { control: 'boolean' },
    spellCheck: { control: 'boolean' },
    fileName: { control: 'text' },
    autoSaveContentType: { 
      control: 'select',
      options: [
        'draftjs',
        'digitalpaperedit',
        'txt',
        'txtspeakertimecodes',
        'srt',
        'html',
        'ttml',
        'premiereTTML',
        'itt',
        'csv',
        'vtt',
        'pre-segment-txt',
        'json-captions'
      ]
    },
    mediaType: { control: 'select', options: ['audio', 'video'] },
    handleAnalyticsEvents: { action: 'Analytics event' },
    handleAutoSaveChanges: { action: 'handleAutoSaveChange' }
  },
};

export default meta;

const mediaUrl = 'https://download.ted.com/talks/KateDarling_2018S-950k.mp4';

export const Default = {
  args: {
    title: 'Ted Talk',
    mediaUrl: mediaUrl,
    sttJsonType: 'bbckaldi',
    isEditable: true,
    spellCheck: false,
    fileName: 'KateDarling_2018S-950k.mp4',
    transcriptData: bbcKaldiTranscript,
    autoSaveContentType: 'digitalpaperedit',
    mediaType: 'video',
  },
};

export const AudioFile = {
  args: {
    title: 'Ted Talk',
    mediaUrl: mediaUrl,
    sttJsonType: 'bbckaldi',
    isEditable: true,
    spellCheck: false,
    fileName: 'KateDarling_2018S-950k.mp4',
    transcriptData: bbcKaldiTranscript,
    autoSaveContentType: 'digitalpaperedit',
    mediaType: 'audio',
  },
};
