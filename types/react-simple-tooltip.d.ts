declare module 'react-simple-tooltip' {
  import React from 'react';

  interface TooltipProps {
    content: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    fadeDuration?: number;
    fadeEasing?: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    radius?: number;
    border?: string;
    background?: string;
    color?: string;
    onMouseOver?: () => void;
  }

  const Tooltip: React.FC<TooltipProps>;
  export default Tooltip;
} 