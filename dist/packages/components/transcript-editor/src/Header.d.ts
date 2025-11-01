import React from 'react';
type MediaControlsProps = {
    type: 'audio';
    mediaUrl: string | null;
    handleTimeUpdate: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
    handlePlayMedia: (isPlaying: boolean) => void;
    handleIsPlaying: () => boolean;
    onLoadedDataGetDuration: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
    currentTime: number;
    mediaDuration: string;
    videoRef: React.RefObject<HTMLVideoElement>;
} | {
    type: 'video';
    mediaUrl: string | null;
    onTimeUpdate: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
    videoRef: React.RefObject<HTMLVideoElement>;
    onLoadedDataGetDuration: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
    previewIsDisplayed: boolean;
};
export interface HeaderProps {
    showSettings: boolean;
    showShortcuts: boolean;
    showExportOptions: boolean;
    settings?: React.ReactNode;
    shortcuts?: React.ReactNode;
    exportOptions?: React.ReactNode;
    tooltip?: React.ReactNode;
    mediaUrl: string | null;
    mediaControlsProps?: MediaControlsProps;
    handleSettingsToggle: () => void;
    handleShortcutsToggle: () => void;
    handleExportToggle: () => void;
}
declare const _default: React.NamedExoticComponent<HeaderProps>;
export default _default;
//# sourceMappingURL=Header.d.ts.map