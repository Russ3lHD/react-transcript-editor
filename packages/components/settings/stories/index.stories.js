import React from 'react';

import Settings from '../index.js';

const meta = {
  title: 'Settings',
  component: Settings,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    showTimecodes: { control: 'boolean' },
    showSpeakers: { control: 'boolean' },
    timecodeOffset: { control: 'number' },
    defaultValueScrollSync: { control: 'boolean' },
    defaultValuePauseWhileTyping: { control: 'boolean' },
    defaultRollBackValueInSeconds: { control: 'number' },
    previewIsDisplayed: { control: 'boolean' },
  },
};

export default meta;

export const Default = {
  args: {
    showTimecodes: true,
    showSpeakers: true,
    timecodeOffset: 3600,
    defaultValueScrollSync: true,
    defaultValuePauseWhileTyping: true,
    defaultRollBackValueInSeconds: 10,
    previewIsDisplayed: true,
    handleSettingsToggle: (...args) => console.log('Toggle settings', ...args),
    handleShowTimecodes: (...args) => console.log('handleShowTimecodes', ...args),
    handleShowSpeakers: (...args) => console.log('handleShowSpeakers', ...args),
    handleSetTimecodeOffset: (...args) => console.log('handleSetTimecodeOffset', ...args),
    handlePauseWhileTyping: (...args) => console.log('handlePauseWhileTyping', ...args),
    handleIsScrollIntoViewChange: (...args) => console.log('handleIsScrollIntoViewChange', ...args),
    handleRollBackValueInSeconds: (...args) => console.log('handleRollBackValueInSeconds', ...args),
    handlePreviewIsDisplayed: (...args) => console.log('handlePreviewIsDisplayed', ...args),
    handleChangePreviewViewWidth: (...args) => console.log('handleChangePreviewViewWidth', ...args),
    handleAnalyticsEvents: (...args) => console.log('handleAnalyticsEvents', ...args),
  },
};
