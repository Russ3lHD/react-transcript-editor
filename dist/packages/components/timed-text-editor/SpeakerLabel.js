// eslint-disable-next-line no-unused-vars
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit } from '@fortawesome/free-solid-svg-icons';
// Handle CSS module import with fallback for Storybook
let style;
try {
    style = require('./WrapperBlock.module.css');
}
catch {
    // Fallback styles for Storybook
    style = {
        speaker: 'speaker-label',
        speakerEditable: 'speakerEditable',
        speakerNotEditable: 'speaker-label-not-editable',
        EditLabel: 'speaker-edit-label'
    };
}
class SpeakerLabel extends PureComponent {
    render() {
        return (React.createElement("span", { className: this.props.isEditable ? [style.speaker, style.speakerEditable].join(' ') : [style.speaker, style.speakerNotEditable].join(' '), title: this.props.name, onClick: this.props.isEditable ? this.props.handleOnClickEdit : null },
            React.createElement("span", { className: style.EditLabel },
                React.createElement(FontAwesomeIcon, { icon: faUserEdit })),
            this.props.name));
    }
}
SpeakerLabel.propTypes = {
    name: PropTypes.string,
    handleOnClickEdit: PropTypes.func
};
export default SpeakerLabel;
//# sourceMappingURL=SpeakerLabel.js.map