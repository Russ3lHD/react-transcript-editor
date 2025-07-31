declare module 'react-keyboard-shortcuts' {
  import React from 'react';

  interface HotkeysProps {
    children: React.ReactNode;
  }

  export const hotkeys: React.ComponentType<HotkeysProps>;
} 