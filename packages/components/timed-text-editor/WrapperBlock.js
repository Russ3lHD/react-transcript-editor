import React from 'react';
import {
  // eslint-disable-next-line no-unused-vars
  EditorBlock,
  Modifier,
  EditorState,
  SelectionState,
  convertFromRaw,
  convertToRaw
} from 'draft-js';

// eslint-disable-next-line no-unused-vars
import SpeakerLabel from './SpeakerLabel';
import { TranscriptDisplayContext } from './TranscriptDisplayContext.js';

import {
  shortTimecode,
  secondsToTimecode
} from '../../util/timecode-converter';

// Handle CSS module import with fallback for Storybook
let style;
try {
  style = require('./WrapperBlock.module.css');
} catch (error) {
  // Fallback styles for Storybook
  style = {
    WrapperBlock: 'wrapper-block',
    markers: 'wrapper-block-markers',
    unselectable: 'wrapper-block-unselectable',
    time: 'wrapper-block-time',
    text: 'wrapper-block-text'
  };
}

const updateSpeakerName = (oldName, newName, state) => {
  const contentToUpdate = convertToRaw(state);

  contentToUpdate.blocks.forEach(block => {
    if (block.data.speaker === oldName) {
      block.data.speaker = newName;
    }
  });

  return convertFromRaw(contentToUpdate);
};


class WrapperBlock extends React.Component {
  // Subscribe to TranscriptDisplayContext for display preferences
  static contextType = TranscriptDisplayContext;

  constructor(props) {
    super(props);

    this.state = {
      speaker: '',
      start: 0
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

    if(nextProps.block.getData().get('speaker') !== this.state.speaker){
      return true;
    }
    return false;
  };

  componentDidUpdate  = (prevProps, prevState) => {
    // Update local state when speaker changes in block data
    const currentSpeaker = this.props.block.getData().get('speaker');
    
    if(prevProps.block.getData().get('speaker') !== currentSpeaker && currentSpeaker !== this.state.speaker){
      this.setState({
        speaker: currentSpeaker
      });
    }
  };

  handleOnClickEdit = () => {
    const oldSpeakerName = this.state.speaker;
    const newSpeakerName = prompt('New Speaker Name?', this.state.speaker);
    if (newSpeakerName !== '' && newSpeakerName !== null) {
      this.setState({ speaker: newSpeakerName });
      const isUpdateAllSpeakerInstances = confirm(`Would you like to replace all occurrences of ${oldSpeakerName} with ${newSpeakerName}?`);

      if (this.props.blockProps.handleAnalyticsEvents) {
        this.props.blockProps.handleAnalyticsEvents({
          category: 'WrapperBlock',
          action: 'handleOnClickEdit',
          name: 'newSpeakerName',
          value: newSpeakerName
        });
      }

      if(isUpdateAllSpeakerInstances){
        const ContentState = this.props.blockProps.editorState.getCurrentContent();
        const contentToUpdateWithSpekaers = updateSpeakerName(oldSpeakerName, newSpeakerName, ContentState);
        this.props.blockProps.setEditorNewContentStateSpeakersUpdate(contentToUpdateWithSpekaers);
      }
      else{
        // From docs: https://draftjs.org/docs/api-reference-selection-state#keys-and-offsets
        // selection points are tracked as key/offset pairs,
        // where the key value is the key of the ContentBlock where the point is positioned
        // and the offset value is the character offset within the block.

        // Get key of the currentBlock
        const keyForCurrentCurrentBlock = this.props.block.getKey();
        // create empty selection for current block
        // https://draftjs.org/docs/api-reference-selection-state#createempty
        const currentBlockSelection = SelectionState.createEmpty(
          keyForCurrentCurrentBlock
        );
        const editorStateWithSelectedCurrentBlock = EditorState.acceptSelection(
          this.props.blockProps.editorState,
          currentBlockSelection
        );

        const currentBlockSelectionState = editorStateWithSelectedCurrentBlock.getSelection();
        const newBlockDataWithSpeakerName = { speaker: newSpeakerName };

        // https://draftjs.org/docs/api-reference-modifier#mergeblockdata
        const newContentState = Modifier.mergeBlockData(
          this.props.contentState,
          currentBlockSelectionState,
          newBlockDataWithSpeakerName
        );

        this.props.blockProps.setEditorNewContentStateSpeakersUpdate(newContentState);
      }
    }
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

    const speakerElement = (
      <SpeakerLabel
        name={ this.state.speaker }
        handleOnClickEdit={ this.handleOnClickEdit }
        isEditable={isEditable}
      />
    );

    const timecodeElement = (
      <span className={ style.time } onClick={ this.handleTimecodeClick }>
        {shortTimecode(startTimecode)}
      </span>
    );

    return (
      <div className={ style.WrapperBlock }>
        <div
          className={ [ style.markers, style.unselectable ].join(' ') }
          contentEditable={ false }
        >
          {showSpeakers ? speakerElement : ''}

          {showTimecodes ? timecodeElement : ''}
        </div>
        <div className={ style.text }>
          <EditorBlock { ...this.props } />
        </div>
      </div>
    );
  }
}

export default WrapperBlock;
