import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { faKeyboard, faQuestionCircle, faMousePointer, faICursor, faUserEdit, faSave, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tooltip from 'react-simple-tooltip';
import style from '../index.module.css';
const HowDoesThisWork = ({ handleAnalyticsEvents, }) => {
    const helpMessage = (_jsxs("div", { className: style.helpMessage, children: [_jsxs("span", { children: [_jsx(FontAwesomeIcon, { className: style.icon, icon: faMousePointer }), "Double click on a word or timestamp to jump to that point in the video."] }), _jsxs("span", { children: [_jsx(FontAwesomeIcon, { className: style.icon, icon: faICursor }), "Start typing to edit text."] }), _jsxs("span", { children: [_jsx(FontAwesomeIcon, { className: style.icon, icon: faUserEdit }), "You can add and change names of speakers in your transcript."] }), _jsxs("span", { children: [_jsx(FontAwesomeIcon, { className: style.icon, icon: faKeyboard }), "Use keyboard shortcuts for quick control."] }), _jsxs("span", { children: [_jsx(FontAwesomeIcon, { className: style.icon, icon: faSave }), "Save & export to get a copy to your desktop."] })] }));
    return (_jsxs(Tooltip, { className: style.help, content: helpMessage, fadeDuration: 250, fadeEasing: "ease-in", placement: "bottom", radius: 5, border: "#ffffff", background: "#f2f2f2", color: "#000000", onMouseOver: () => {
            if (handleAnalyticsEvents) {
                handleAnalyticsEvents({
                    category: 'TranscriptEditor',
                    action: 'hover',
                    name: 'howDoesThisWork',
                });
            }
        }, children: [_jsx(FontAwesomeIcon, { className: style.icon, icon: faQuestionCircle }), "How does this work?"] }));
};
export default HowDoesThisWork;
//# sourceMappingURL=HowDoesThisWork.js.map