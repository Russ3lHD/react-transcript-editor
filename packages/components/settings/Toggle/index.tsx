import React from 'react';

import style from './index.module.css';

export interface ToggleProps {
  /** Callback function when toggle state changes */
  handleToggle?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Optional label for the toggle */
  label?: string;
  /** Initial checked state of the toggle */
  defaultValue?: boolean;
  /** Current checked state (for controlled component) */
  checked?: boolean;
  /** Additional CSS class name */
  className?: string;
  /** Whether the toggle is disabled */
  disabled?: boolean;
  /** Unique identifier for the input */
  id?: string;
  /** Test ID for testing purposes */
  'data-testid'?: string;
}

/**
 * Toggle component for boolean settings
 * 
 * A modern, accessible toggle switch component that supports both
 * controlled and uncontrolled usage patterns.
 */
const Toggle: React.FC<ToggleProps> = ({
  handleToggle,
  label,
  defaultValue = false,
  checked,
  className = '',
  disabled = false,
  id,
  'data-testid': testId,
}) => {
  const inputId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`${style.switchContainer} ${className}`.trim()}>
      <label 
        className={style.switch}
        htmlFor={inputId}
      >
        <input
          id={inputId}
          type="checkbox"
          defaultChecked={defaultValue}
          checked={checked}
          onChange={handleToggle}
          disabled={disabled}
          data-testid={testId}
          aria-checked={checked ?? defaultValue}
          role="switch"
        />
        <span className={style.slider} aria-hidden="true" />
        {label && (
          <span className={style.label}>
            {label}
          </span>
        )}
      </label>
    </div>
  );
};

export default Toggle;