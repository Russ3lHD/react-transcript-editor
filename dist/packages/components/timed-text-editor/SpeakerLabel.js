import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// eslint-disable-next-line no-unused-vars
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line no-unused-vars
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit } from '@fortawesome/free-solid-svg-icons';
// Handle CSS module import with fallback for Storybook
let style;
try {
    style = require('./WrapperBlock.module.css');
}
catch (error) {
    // Fallback styles for Storybook
    style = {
        speaker: 'speaker-label',
        speakerEditable: 'speaker-label-editable',
        speakerNotEditable: 'speaker-label-not-editable',
        EditLabel: 'speaker-edit-label'
    };
}
class SpeakerLabel extends PureComponent {
    render() {
        return (_jsxs("span", { className: this.props.isEditable ? [style.speaker, style.speakerEditable].join(' ') : [style.speaker, style.speakerNotEditable].join(' '), title: this.props.name, onClick: this.props.isEditable ? this.props.handleOnClickEdit : null, children: [_jsx("span", { className: style.EditLabel, children: _jsx(FontAwesomeIcon, { icon: faUserEdit }) }), this.props.name] }));
    }
}
SpeakerLabel.propTypes = {
    name: PropTypes.string,
    handleOnClickEdit: PropTypes.func
};
export default SpeakerLabel;
//# sourceMappingURL=SpeakerLabel.js.map