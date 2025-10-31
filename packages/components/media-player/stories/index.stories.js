import React from 'react';
import MediaPlayer from '../index.js';

const meta = {
  title: 'Components/MediaPlayer',
  component: MediaPlayer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    mediaUrl: { control: 'text' },
    rollBackValueInSeconds: { control: { type: 'number', min: 0, max: 60, step: 1 } },
    timecodeOffset: { control: { type: 'number', min: -3600, max: 3600, step: 1 } },
    mediaDuration: { control: 'text' },
    hookSeek: { action: 'hookSeek' },
    hookPlayMedia: { action: 'hookPlayMedia' },
    hookIsPlaying: { action: 'hookIsPlaying' },
    hookOnTimeUpdate: { action: 'hookOnTimeUpdate' },
    handleAnalyticsEvents: { action: 'handleAnalyticsEvents' },
    handleSaveTranscript: { action: 'handleSaveTranscript' }
  },
};

export default meta;

const mediaUrl = 'https://download.ted.com/talks/KateDarling_2018S-950k.mp4';

export const Default = {
  render:(args) => {
    const videoRef = React.createRef();
    
    return (
      <React.Fragment>
        <MediaPlayer {...args} videoRef={videoRef} />
        <br/>
        <video ref={videoRef} style={{ width: '50%' }}>
          <source type="video/mp4" src={args.mediaUrl} />
        </video>
      </React.Fragment>
    );
  },
  args:{
    title:'Ted Talk',
    mediaUrl:"file:///C:/Custom/transcriptiontool/data/KGG/Castingvideo_1_Jan (Dream) Nwattu.mp4",
    rollBackValueInSeconds:10,
    timecodeOffset:0,
    mediaDuration:'01:00:00:00',
    handleAnalyticsEvents:(...args) => console.log('handleAnalyticsEvents', ...args),
    handleSaveTranscript:(...args) => console.log('handleSaveTranscript', ...args),
  },
};
