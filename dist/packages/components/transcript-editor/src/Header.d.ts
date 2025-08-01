import React from 'react';
export interface HeaderProps {
    showSettings: boolean;
    showShortcuts: boolean;
    showExportOptions: boolean;
    settings?: React.ReactNode;
    shortcuts?: React.ReactNode;
    exportOptions?: React.ReactNode;
    tooltip?: React.ReactNode;
    mediaUrl: string | null;
    mediaControls?: React.ReactNode;
    handleSettingsToggle: () => void;
    handleShortcutsToggle: () => void;
    handleExportToggle: () => void;
}
declare const _default: React.NamedExoticComponent<HeaderProps>;
export default _default;
//# sourceMappingURL=Header.d.ts.map