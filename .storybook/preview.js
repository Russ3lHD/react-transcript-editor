import './styles/main.scss';

// Add fallback styles for demo app in Storybook
const style = document.createElement('style');
style.innerHTML = `
  .demo-container {
    height: 100vh;
    font-family: ReithSerif, sans-serif;
    padding: 0.5em;
  }
  .demo-nav {
    margin-top: 1rem;
    padding: 0 2rem;
    display: flex;
    justify-content: space-evenly;
  }
  .demo-nav-item {
    padding-right: 0.5rem;
    text-align: center;
  }
  .demo-section-label {
    display: block;
    font-size: 0.8em;
    font-weight: 500;
  }
  .demo-button {
    display: block;
    margin: 0.5rem auto;
    padding: 0.75em 1.5em;
    height: 30px;
    width: 120px !important;
    background-color: #74b567 !important;
    color: white;
    font-size: 0.7em;
    border: none;
    border-radius: 2px;
    box-sizing: border-box;
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
  }
  .demo-warning-button {
    background-color: #d25b56 !important;
    font-size: 0.6rem !important;
  }
  .demo-dropdown {
    display: block;
    margin: 0.5em auto;
    width: 100px;
  }
  .demo-file-name-label {
    display: block;
    text-align: center;
    font-size: 0.5em;
    margin: 0.5em;
  }
  .demo-title-label {
    margin-left: 0.5em;
    font-style: italic;
    font-size: 0.7em;
  }
  .demo-editable-label {
    font-size: 0.7em;
  }
  .demo-checkbox {
    display: block;
  }
  [type="file"] {
    position: absolute !important;
    overflow: hidden;
    height: 0;
    width: 0;
    padding: 0;
    clip: rect(0, 0, 0, 0);
    border: 0;
    white-space: nowrap;
  }
  [type="file"] + label {
    display: block;
    margin: 0.5rem auto;
    padding: 0.75em 1.5em;
    height: 30px;
    width: 120px !important;
    background-color: #5b97ef;
    color: white;
    font-size: 0.7em;
    box-sizing: border-box;
    border-radius: 2px;
    cursor: pointer;
  }
  .demo-nav-item button {
    display: block;
    margin: 0.5rem auto;
    padding: 0.75em 1.5em;
    height: 30px;
    width: 120px !important;
    background-color: #5b97ef;
    color: white;
    font-size: 0.7em;
    border: none;
    border-radius: 2px;
    box-sizing: border-box;
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
  }
  /* MediaPlayer fallback styles */
  .media-player-top-section {
    background: black;
  }
  .media-player-section {
    display: inline-flex;
    align-items: flex-start;
    width: 100%;
  }
  .media-player-controls-section {
    text-align: center;
    width: 100%;
    margin: auto;
    padding: 1em;
    position: relative;
  }
  .media-player-title {
    color: white;
    line-height: 1.2em;
    width: 60%;
    margin-top: 0;
    margin-bottom: 0.5em;
    font-size: 1.2em;
    overflow: hidden;
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  /* Settings component fallback styles */
  .settings-panel {
    background: white;
    border: 1px solid #ccc;
    padding: 1em;
    border-radius: 4px;
  }
  .settings-header {
    margin-top: 0;
    color: #333;
  }
  .settings-close-button {
    float: right;
    cursor: pointer;
    color: #666;
  }
  .settings-controls-container {
    margin-top: 1em;
  }
  .settings-element {
    margin-bottom: 1em;
  }
  .settings-label {
    display: block;
    margin-bottom: 0.5em;
    font-weight: bold;
  }
  .settings-rollback-value {
    width: 100%;
    padding: 0.5em;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  /* KeyboardShortcuts component fallback styles */
  .keyboard-shortcuts {
    background: white;
    border: 1px solid #ccc;
    padding: 1em;
    border-radius: 4px;
  }
  .keyboard-shortcuts-header {
    margin-top: 0;
    color: #333;
  }
  .keyboard-shortcuts-close-button {
    float: right;
    cursor: pointer;
    color: #666;
  }
  .keyboard-shortcuts-list {
    list-style: none;
    padding: 0;
  }
  .keyboard-shortcuts-list-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5em 0;
    border-bottom: 1px solid #eee;
  }
  .keyboard-shortcut {
    font-weight: bold;
    color: #333;
  }
  .keyboard-shortcut-label {
    color: #666;
  }
  /* TimedTextEditor component fallback styles */
  .timed-text-editor {
    background: white;
    padding: 1em;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  /* TranscriptEditor component fallback styles */
  .transcript-editor-container {
    background: white;
    padding: 1em;
  }
  .transcript-editor-grid {
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-gap: 1em;
  }
  .transcript-editor-row {
    display: contents;
  }
  .transcript-editor-aside {
    background: #f5f5f5;
    padding: 1em;
    border-radius: 4px;
  }
  .transcript-editor-main {
    background: white;
    padding: 1em;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .transcript-editor-main-with-audio {
    background: white;
    padding: 1em;
    border: 1px solid #ccc;
    border-radius: 4px;
    grid-column: 1 / -1;
  }
  /* PlayerControls component fallback styles */
  .player-controls {
    display: flex;
    flex-direction: column;
    gap: 1em;
    padding: 1em;
    background: #f5f5f5;
    border-radius: 4px;
  }
  .player-button {
    background: #5b97ef;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.5em 1em;
    cursor: pointer;
    font-size: 1em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    height: 40px;
  }
  .player-button:hover {
    background: #4f7bc0;
  }
  .player-button-pip {
    background: #666;
  }
  .player-button-pip:hover {
    background: #555;
  }
  .player-buttons-group {
    display: flex;
    gap: 0.5em;
    justify-content: center;
    align-items: center;
  }
  /* TimeBox component fallback styles */
  .time-box {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    padding: 0.5em;
    background: #333;
    color: white;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.9em;
  }
  .current-time {
    cursor: pointer;
    color: #69e3c2;
  }
  .current-time:hover {
    text-decoration: underline;
  }
  .time-separator {
    color: #999;
  }
  .duration {
    color: #ccc;
  }
  /* PlaybackRate component fallback styles */
  .playback-rate {
    display: inline-flex;
    align-items: center;
  }
  /* Select component fallback styles */
  .select-player-control {
    background: #333;
    color: white;
    border: 1px solid #555;
    border-radius: 4px;
    padding: 0.25em 0.5em;
    font-size: 0.8em;
  }
  .select-player-control:focus {
    outline: 2px solid #69e3c2;
    outline-offset: 1px;
  }
  /* ProgressBar component fallback styles */
  .progress-bar-wrapper {
    width: 100%;
    margin: 0.5em 0;
  }
  .progress-bar {
    width: 100%;
    height: 5px;
    border-radius: 5px;
    background: #5b97ef;
    outline: none;
    cursor: pointer;
  }
  .progress-bar::-webkit-slider-thumb {
    appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    border: 2px solid #5b97ef;
  }
  .progress-bar::-moz-range-thumb {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    border: 2px solid #5b97ef;
  }
  /* WrapperBlock component fallback styles */
  .wrapper-block {
    margin: 0.5em 0;
    position: relative;
  }
  .wrapper-block-markers {
    display: flex;
    gap: 0.5em;
    margin-bottom: 0.25em;
    font-family: monospace;
    font-size: 0.8em;
  }
  .wrapper-block-unselectable {
    user-select: none;
  }
  .wrapper-block-time {
    color: #666;
    cursor: pointer;
  }
  .wrapper-block-time:hover {
    color: #5b97ef;
    text-decoration: underline;
  }
  .wrapper-block-text {
    display: block;
  }
  /* SpeakerLabel component fallback styles */
  .speaker-label {
    display: inline-flex;
    align-items: center;
    gap: 0.25em;
    color: #666;
    font-weight: bold;
  }
  .speaker-label-editable {
    cursor: pointer;
  }
  .speaker-label-editable:hover {
    color: #5b97ef;
  }
  .speaker-label-not-editable {
    cursor: default;
  }
  .speaker-edit-label {
    font-size: 0.8em;
  }
`;
document.head.appendChild(style);

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: {
    autodocs: 'tag'
  },
  options: {
    panelPosition: 'bottom',
    sidebarAnimations: true
  },
  a11y: {
    config: {},
    options: {
      checks: {
        'color-contrast': { options: { noScroll: true } },
      },
    },
  },
  // Add TypeScript support for better development experience
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
};