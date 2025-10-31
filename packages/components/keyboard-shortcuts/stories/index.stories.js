import React from 'react';
import KeyboardShortcuts from '../index.js';

const meta = {
  title: 'Components/KeyboardShortcuts',
  component: KeyboardShortcuts,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    handleShortcutsToggle: { action: 'Shortcuts toggle' }
  },
};

export default meta;

export const Default = {
  args: {
    handleShortcutsToggle: (...args) => console.log('Shortcuts toggle', ...args),
  },
};
