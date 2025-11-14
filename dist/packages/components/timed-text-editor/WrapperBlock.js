import React from 'react';
import { EditorBlock, Modifier, EditorState, SelectionState, convertFromRaw, convertToRaw } from 'draft-js';
import SpeakerLabel from './SpeakerLabel';
import { TranscriptDisplayContext } from './TranscriptDisplayContext.js';
import { shortTimecode, secondsToTimecode } from '../../util/timecode-converter';
// Handle CSS module import with fallback for Storybook
let style;
try {
    style = require('./WrapperBlock.module.css');
}
catch {
    // Fallback styles for Storybook
    style = {
        WrapperBlock: 'wrapper-block',
        markers: 'wrapper-block-markers',
        unselectable: 'wrapper-block-unselectable',
        time: 'wrapper-block-time',
        text: 'wrapper-block-text'
    };
}
class WrapperBlock extends React.Component {
    // Subscribe to TranscriptDisplayContext for display preferences
    static contextType = TranscriptDisplayContext;
    constructor(props) {
        super(props);
        this.state = {
            speaker: '',
            start: 0,
            isEditing: false,
            tempSpeaker: '',
            uniqueSpeakers: [],
            actionType: null
        };
    }
    componentDidMount() {
        const { block } = this.props;
        const speaker = block.getData().get('speaker');
        const start = block.getData().get('start');
        this.setState({
            speaker,
            start
        });
        if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
            window.addEventListener('rte-speaker-editing', this.onEditingEvent);
        }
    }
    // reducing unnecessary re-renders
    shouldComponentUpdate = (nextProps, nextState, nextContext) => {
        if (nextProps.block.getText() !== this.props.block.getText()) {
            return true;
        }
        // Check context changes (display preferences)
        if (nextContext.showSpeakers !== this.context.showSpeakers) {
            return true;
        }
        if (nextContext.showTimecodes !== this.context.showTimecodes) {
            return true;
        }
        if (nextContext.timecodeOffset !== this.context.timecodeOffset) {
            return true;
        }
        if (nextContext.isEditable !== this.context.isEditable) {
            return true;
        }
        if (nextState.speaker !== this.state.speaker) {
            return true;
        }
        if (nextState.isEditing !== this.state.isEditing) {
            return true;
        }
        if (nextProps.block.getData().get('speaker') !== this.state.speaker) {
            return true;
        }
        return false;
    };
    componentDidUpdate = (prevProps, _prevState) => {
        // Update local state when speaker changes in block data
        const currentSpeaker = this.props.block.getData().get('speaker');
        if (prevProps.block.getData().get('speaker') !== currentSpeaker && currentSpeaker !== this.state.speaker) {
            this.setState({
                speaker: currentSpeaker
            });
        }
    };
    componentWillUnmount() {
        if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
            window.removeEventListener('rte-speaker-editing', this.onEditingEvent);
        }
    }
    onEditingEvent = (ev) => {
        const key = ev && ev.detail ? ev.detail.key : null;
        if (key && key !== this.props.block.getKey()) {
            if (this.state.isEditing) {
                this.setState({ isEditing: false, actionType: null });
            }
        }
    };
    getOtherSpeakers = () => {
        const contentState = this.props.contentState;
        const unique = new Set();
        contentState.getBlockMap().forEach(block => {
            unique.add(block.getData().get('speaker'));
        });
        return Array.from(unique).filter(Boolean).sort();
    };
    handleStartEditing = () => {
        const uniqueSpeakers = this.getOtherSpeakers();
        if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
            const CE = (typeof window.CustomEvent === 'function')
                ? window.CustomEvent
                : function (type, params) {
                    const e = document.createEvent('Event');
                    e.initEvent(type, params && params.bubbles || false, params && params.cancelable || false);
                    e.detail = params ? params.detail : undefined;
                    return e;
                };
            window.dispatchEvent(new CE('rte-speaker-editing', { detail: { key: this.props.block.getKey() } }));
        }
        this.setState({
            isEditing: true,
            uniqueSpeakers,
            tempSpeaker: this.state.speaker,
            actionType: null
        });
    };
    handleChangeTempSpeaker = (e) => {
        this.setState({ tempSpeaker: e.target.value });
    };
    handleKeyDown = (_e) => {
        // scope selection handled by explicit buttons
    };
    handleSwitchSegment = (newSpeakerName) => {
        const newName = newSpeakerName.trim();
        if (newName && newName !== this.state.speaker) {
            const keyForCurrentCurrentBlock = this.props.block.getKey();
            const currentBlockSelection = SelectionState.createEmpty(keyForCurrentCurrentBlock);
            const editorStateWithSelectedCurrentBlock = EditorState.acceptSelection(this.props.blockProps.editorState, currentBlockSelection);
            const currentBlockSelectionState = editorStateWithSelectedCurrentBlock.getSelection();
            const newBlockDataWithSpeakerName = { speaker: newName };
            const newContentState = Modifier.mergeBlockData(this.props.contentState, currentBlockSelectionState, newBlockDataWithSpeakerName);
            this.props.blockProps.setEditorNewContentStateSpeakersUpdate(newContentState);
            this.setState({ speaker: newName, isEditing: false, actionType: null });
            if (this.props.blockProps.handleAnalyticsEvents) {
                this.props.blockProps.handleAnalyticsEvents({
                    category: 'WrapperBlock',
                    action: 'switchSegment',
                    name: 'newSpeakerName',
                    value: newName
                });
            }
        }
        else {
            this.setState({ isEditing: false, actionType: null });
        }
    };
    handleRenameAll = () => {
        const oldName = this.state.speaker;
        const newName = this.state.tempSpeaker.trim();
        if (!newName || newName === oldName) {
            this.setState({ isEditing: false });
            return;
        }
        const raw = convertToRaw(this.props.contentState);
        raw.blocks.forEach(block => {
            const data = block.data || {};
            if (data.speaker === oldName) {
                data.speaker = newName;
                block.data = data;
            }
        });
        const newContentState = convertFromRaw(raw);
        this.props.blockProps.setEditorNewContentStateSpeakersUpdate(newContentState);
        this.setState({ speaker: newName, isEditing: false });
        if (this.props.blockProps.handleAnalyticsEvents) {
            this.props.blockProps.handleAnalyticsEvents({
                category: 'WrapperBlock',
                action: 'renameAll',
                name: 'newSpeakerName',
                value: newName
            });
        }
    };
    handleOptionSelect = (e) => {
        const value = e.target.value;
        if (value === '__rename__') {
            this.setState({ actionType: 'rename', tempSpeaker: this.state.speaker });
        }
        else if (value === '__add__') {
            this.setState({ actionType: 'add', tempSpeaker: '' });
        }
        else {
            this.handleSwitchSegment(value);
        }
    };
    applySegmentScope = () => {
        const newName = this.state.tempSpeaker;
        this.handleSwitchSegment(newName);
    };
    applyGlobalScope = () => {
        this.handleRenameAll();
    };
    handleTimecodeClick = () => {
        this.props.blockProps.onWordClick(this.state.start);
        if (this.props.blockProps.handleAnalyticsEvents) {
            this.props.blockProps.handleAnalyticsEvents({
                category: 'WrapperBlock',
                action: 'handleTimecodeClick',
                name: 'onWordClick',
                value: secondsToTimecode(this.state.start)
            });
        }
    };
    render() {
        // Get display preferences from context instead of props
        const { showSpeakers, showTimecodes, timecodeOffset, isEditable } = this.context;
        let startTimecode = this.state.start;
        if (timecodeOffset) {
            startTimecode += timecodeOffset;
        }
        let speakerElement;
        if (this.state.isEditing) {
            const listId = `${this.props.block.getKey()}-speakers-select`;
            speakerElement = (React.createElement(React.Fragment, null,
                React.createElement("select", { id: listId, defaultValue: this.state.speaker, onChange: this.handleOptionSelect },
                    this.state.uniqueSpeakers.map(s => (React.createElement("option", { key: s, value: s }, s))),
                    React.createElement("option", { value: "__rename__" }, "Rename\u2026"),
                    React.createElement("option", { value: "__add__" }, "Add speaker\u2026")),
                this.state.actionType ? (React.createElement(React.Fragment, null,
                    React.createElement("input", { type: "text", value: this.state.tempSpeaker, onChange: this.handleChangeTempSpeaker, onKeyDown: this.handleKeyDown, autoFocus: true }),
                    React.createElement("button", { type: "button", onClick: this.applySegmentScope }, "Segment only"),
                    React.createElement("button", { type: "button", onClick: this.applyGlobalScope }, "Global"))) : null));
        }
        else {
            speakerElement = (React.createElement(SpeakerLabel, { name: this.state.speaker, handleOnClickEdit: this.handleStartEditing, isEditable: isEditable }));
        }
        const timecodeElement = (React.createElement("span", { className: style.time, onClick: this.handleTimecodeClick }, shortTimecode(startTimecode)));
        // Determine speaker-change related CSS classes for spacing
        let speakerChangeClass = '';
        try {
            const contentState = this.props.contentState;
            if (contentState) {
                const prevBlock = contentState.getBlockBefore(this.props.block.getKey());
                if (!prevBlock) {
                    // First block in document
                    speakerChangeClass = 'speaker-block first-speaker-block';
                }
                else {
                    const prevSpeaker = prevBlock.getData().get('speaker');
                    const currSpeaker = this.state.speaker;
                    if (prevSpeaker !== currSpeaker) {
                        speakerChangeClass = 'speaker-block';
                    }
                    else {
                        speakerChangeClass = 'same-speaker-segment';
                    }
                }
            }
        }
        catch {
            // ignore and render without extra classes
        }
        return (React.createElement("div", { className: [style.WrapperBlock, speakerChangeClass].join(' ') },
            React.createElement("div", { className: [style.markers, 'speaker-timecode-flexbox', style.unselectable].join(' '), contentEditable: false },
                showSpeakers ? speakerElement : '',
                showTimecodes ? timecodeElement : ''),
            React.createElement("div", { className: style.text },
                React.createElement(EditorBlock, { ...this.props }))));
    }
}
export default WrapperBlock;
//# sourceMappingURL=WrapperBlock.js.map