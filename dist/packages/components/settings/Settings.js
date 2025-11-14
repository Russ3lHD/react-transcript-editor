import React, { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import Toggle from './Toggle/';
import TimecodeOffset from './TimecodeOffset';
import style from './index.module.css';
const Settings = ({ showTimecodes, showSpeakers, timecodeOffset, handleShowTimecodes, handleShowSpeakers, handleSetTimecodeOffset, handleSettingsToggle, handlePauseWhileTyping, handleIsScrollIntoViewChange, handleRollBackValueInSeconds, defaultValueScrollSync, defaultValuePauseWhileTyping, defaultRollBackValueInSeconds, previewIsDisplayed, handlePreviewIsDisplayed, handleAnalyticsEvents, }) => {
    return (React.createElement("div", { className: style.settings },
        React.createElement("h2", { className: style.header }, "Settings Panel"),
        React.createElement("div", { className: style.closeButton, onClick: handleSettingsToggle },
            React.createElement(FontAwesomeIcon, { icon: faWindowClose })),
        React.createElement("div", { className: style.controlsContainer },
            React.createElement("section", { className: style.settingElement },
                React.createElement("div", { className: style.label }, "Pause While Typing"),
                React.createElement(Toggle, { defaultValue: defaultValuePauseWhileTyping, label: "Pause while typing", handleToggle: handlePauseWhileTyping })),
            React.createElement("section", { className: style.settingElement },
                React.createElement("div", { className: style.label }, "Scroll Sync"),
                React.createElement(Toggle, { defaultValue: defaultValueScrollSync, label: "ScrollSync", handleToggle: handleIsScrollIntoViewChange })),
            React.createElement("section", { className: style.settingElement },
                React.createElement("div", { className: style.label }, "Rollback Interval (sec)"),
                React.createElement("input", { className: style.rollbackValue, type: "number", step: "1", max: "60", min: "1", value: defaultRollBackValueInSeconds, onChange: handleRollBackValueInSeconds, name: "lname" })),
            React.createElement("section", { className: style.settingElement },
                React.createElement("div", { className: style.label }, "Show Timecodes"),
                React.createElement(Toggle, { defaultValue: showTimecodes, label: "Hide Timecodes", handleToggle: handleShowTimecodes })),
            React.createElement("section", { className: style.settingElement },
                React.createElement("div", { className: style.label }, "Show Speaker Labels"),
                React.createElement(Toggle, { defaultValue: showSpeakers, label: "Hide Speaker Labels", handleToggle: handleShowSpeakers })),
            React.createElement("section", { className: style.settingElement },
                React.createElement("div", { className: style.label }, "Display Preview"),
                React.createElement(Toggle, { defaultValue: previewIsDisplayed, label: "Display Preview", handleToggle: handlePreviewIsDisplayed })),
            React.createElement("section", { className: style.settingElement },
                React.createElement("div", { className: style.timecodeLabel }, "Timecode Offset \u2139"),
                React.createElement(TimecodeOffset, { timecodeOffset: timecodeOffset, handleSetTimecodeOffset: handleSetTimecodeOffset, handleAnalyticsEvents: handleAnalyticsEvents })))));
};
export default memo(Settings);
//# sourceMappingURL=Settings.js.map