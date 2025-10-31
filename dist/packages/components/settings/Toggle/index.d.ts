import React from 'react';
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
declare const Toggle: React.FC<ToggleProps>;
export default Toggle;
//# sourceMappingURL=index.d.ts.map