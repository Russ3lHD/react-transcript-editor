export interface SettingsProps {
    showTimecodes: boolean;
    showSpeakers: boolean;
    timecodeOffset: number;
    handleShowTimecodes: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleShowSpeakers: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSetTimecodeOffset: (timecodeOffset: number) => void;
    handleSettingsToggle: () => void;
    handlePauseWhileTyping: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleIsScrollIntoViewChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleRollBackValueInSeconds: (event: React.ChangeEvent<HTMLInputElement>) => void;
    defaultValueScrollSync: boolean;
    defaultValuePauseWhileTyping: boolean;
    defaultRollBackValueInSeconds: number;
    previewIsDisplayed: boolean;
    handlePreviewIsDisplayed: () => void;
    handleAnalyticsEvents?: (event: AnalyticsEvent) => void;
}
export interface ToggleProps {
    defaultValue: boolean;
    label: string;
    handleToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
export interface TimecodeOffsetProps {
    timecodeOffset: number;
    handleSetTimecodeOffset: (timecodeOffset: number) => void;
    handleAnalyticsEvents?: (event: AnalyticsEvent) => void;
}
export interface AnalyticsEvent {
    category: string;
    action: string;
    name: string;
    value?: string;
}
//# sourceMappingURL=types.d.ts.map