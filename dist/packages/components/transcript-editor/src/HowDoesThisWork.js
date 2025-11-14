import React from 'react';
import { faKeyboard, faQuestionCircle, faMousePointer, faICursor, faUserEdit, faSave, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tooltip from 'react-simple-tooltip';
import style from '../index.module.css';
const HowDoesThisWork = ({ handleAnalyticsEvents, }) => {
    const helpMessage = (React.createElement("div", { className: style.helpMessage },
        React.createElement("span", null,
            React.createElement(FontAwesomeIcon, { className: style.icon, icon: faMousePointer }),
            "Double click on a word or timestamp to jump to that point in the video."),
        React.createElement("span", null,
            React.createElement(FontAwesomeIcon, { className: style.icon, icon: faICursor }),
            "Start typing to edit text."),
        React.createElement("span", null,
            React.createElement(FontAwesomeIcon, { className: style.icon, icon: faUserEdit }),
            "You can add and change names of speakers in your transcript."),
        React.createElement("span", null,
            React.createElement(FontAwesomeIcon, { className: style.icon, icon: faKeyboard }),
            "Use keyboard shortcuts for quick control."),
        React.createElement("span", null,
            React.createElement(FontAwesomeIcon, { className: style.icon, icon: faSave }),
            "Save & export to get a copy to your desktop.")));
    return (React.createElement(Tooltip, { className: style.help, content: helpMessage, fadeDuration: 250, fadeEasing: "ease-in", placement: "bottom", radius: 5, border: "#ffffff", background: "#f2f2f2", color: "#000000", onMouseOver: () => {
            if (handleAnalyticsEvents) {
                handleAnalyticsEvents({
                    category: 'TranscriptEditor',
                    action: 'hover',
                    name: 'howDoesThisWork',
                });
            }
        } },
        React.createElement(FontAwesomeIcon, { className: style.icon, icon: faQuestionCircle }),
        "How does this work?"));
};
export default HowDoesThisWork;
//# sourceMappingURL=HowDoesThisWork.js.map