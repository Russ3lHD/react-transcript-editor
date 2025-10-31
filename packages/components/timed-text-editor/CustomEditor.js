import React from 'react';
// eslint-disable-next-line no-unused-vars
import PropTypes from 'prop-types';
// eslint-disable-next-line no-unused-vars
import { Editor } from 'draft-js';


import WrapperBlock from './WrapperBlock';

// NOTE: custom editor is in a separate class to minimise re-renders
// if considering refactoring, removing the separate class, please double check
// that doing so does not introduce uncessary re-renders first.
class CustomEditor extends React.Component {
  handleWordClick = e => {
    this.props.onWordClick(e);
  };

  renderBlockWithTimecodes = () => {
    return {
      component: WrapperBlock,
      editable: true,
      props: {
        // Note: showSpeakers, showTimecodes, timecodeOffset, and isEditable
        // are now provided via TranscriptDisplayContext instead of props
        // This improves performance by eliminating forceRenderDecorator() calls
        editorState: this.props.editorState,
        setEditorNewContentStateSpeakersUpdate: this.props.setEditorNewContentStateSpeakersUpdate,
        onWordClick: this.handleWordClick,
        handleAnalyticsEvents: this.props.handleAnalyticsEvents
      }
    };
  };

  shouldComponentUpdate(nextProps) {
    // https://stackoverflow.com/questions/39182657/best-performance-method-to-check-if-contentstate-changed-in-draftjs-or-just-edi
    if (nextProps.editorState !== this.props.editorState) {
      return true;
    }

    // Note: isEditable check removed as it now comes from context
    // Context changes automatically trigger WrapperBlock updates

    return false;
  }

  handleOnChange = e => {
    this.props.onChange(e);
  };

  render() {
    return (
      <Editor
        editorState={this.props.editorState}
        onChange={this.handleOnChange}
        stripPastedStyles
        blockRendererFn={this.renderBlockWithTimecodes}
        handleKeyCommand={this.props.handleKeyCommand}
        keyBindingFn={this.props.customKeyBindingFn}
        spellCheck={this.props.spellCheck}
      />
    );
  }
}

export default CustomEditor;
