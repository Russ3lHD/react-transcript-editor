import React from "react";

import TranscriptEditor from "../packages/components/transcript-editor";
import SttTypeSelect from "./select-stt-json-type";
import ExportFormatSelect from "./select-export-format";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { getCacheManager } from "../packages/util/CacheManager.js";

import {
  loadLocalSavedData,
  isPresentInLocalStorage,
  localSave
} from "./local-storage.js";

const DEMO_TRANSCRIPT = {
  "retval": {
    "words": [
      {"word": "Sample", "start": 0, "end": 1, "conf": 1},
      {"word": "transcript", "start": 1, "end": 2, "conf": 1},
      {"word": "with", "start": 2, "end": 3, "conf": 1},
      {"word": "speakers.", "start": 3, "end": 4, "conf": 1}
    ],
    "segmentation": {
      "segments": [
        {
          "@type": "Segment",
          "start": 0,
          "duration": 4,
          "speaker": {"@id": "S0", "gender": "F"}
        }
      ]
    }
  }
};
const DEMO_MEDIA_URL =
  "https://download.ted.com/talks/KateDarling_2018S-950k.mp4";
const DEMO_TITLE =
  "TED Talk | Kate Darling - Why we have an emotional connection to robots";

// Handle CSS module import with fallback for Storybook
let style;
try {
  style = require("./index.module.scss");
} catch (error) {
  // Fallback styles for Storybook
  style = {
    container: 'demo-container',
    demoNav: 'demo-nav',
    demoNavItem: 'demo-nav-item',
    dropdown: 'demo-dropdown',
    sectionLabel: 'demo-section-label',
    fileNameLabel: 'demo-file-name-label',
    titleLabel: 'demo-title-label',
    editableLabel: 'demo-editable-label',
    warningButton: 'demo-warning-button',
    demoButton: 'demo-button',
    checkbox: 'demo-checkbox'
  };
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      transcriptData: null,
      mediaUrl: null,
      isTextEditable: true,
      spellCheck: false,
      sttType: "bbckaldi",
      analyticsEvents: [],
      title: "",
      fileName: "",
      autoSaveData: {},
      autoSaveContentType: "draftjs",
      autoSaveExtension: "json",
      cacheStats: null
    };

    this.transcriptEditorRef = React.createRef();
  }

  componentDidMount() {
    // Load cache stats on mount
    this.updateCacheStats();
  }

  updateCacheStats = async () => {
    const cacheManager = getCacheManager();
    const stats = await cacheManager.getCacheStats();
    this.setState({ cacheStats: stats });
  };

  loadDemo = () => {
    if(isPresentInLocalStorage(DEMO_MEDIA_URL)){
      const transcriptDataFromLocalStorage = loadLocalSavedData(DEMO_MEDIA_URL)
      this.setState({
        transcriptData: transcriptDataFromLocalStorage,
        mediaUrl: DEMO_MEDIA_URL,
        title: DEMO_TITLE,
        sttType: 'draftjs'
      });
    }
    else{
       this.setState({
        transcriptData: DEMO_TRANSCRIPT,
        mediaUrl: DEMO_MEDIA_URL,
        title: DEMO_TITLE,
        sttType: "bbckaldi"
      });
    }
   
  };

  // https://stackoverflow.com/questions/8885701/play-local-hard-drive-video-file-with-html5-video-tag
  handleLoadMedia = files => {
    const file = files[0];
    const videoNode = document.createElement("video");
    const canPlay = videoNode.canPlayType(file.type);

    if (canPlay) {
      const fileURL = URL.createObjectURL(file);
      this.setState({
        // transcriptData: DEMO_TRANSCRIPT,
        mediaUrl: fileURL,
        fileName: file.name
      });
    } else {
      alert("Select a valid audio or video file.");
    }
  };

  handleLoadMediaUrl = () => {
    const fileURL = prompt("Paste the URL you'd like to use here:");

    this.setState({
      // transcriptData: DEMO_TRANSCRIPT,
      mediaUrl: fileURL
    });
  };

  handleLoadTranscriptJson = files => {
    const file = files[0];

    if (file.type === "application/json") {
      const fileReader = new FileReader();

      fileReader.onload = event => {
        this.setState({
          transcriptData: JSON.parse(event.target.result)
        });
      };

      fileReader.readAsText(file);
    } else {
      alert("Select a valid JSON file.");
    }
  };

  handleIsTextEditable = e => {
    this.setState({
      isTextEditable: e.target.checked
    });
  };

  handleSpellCheck = e => {
    this.setState({
      spellCheck: e.target.checked
    });
  };

  // https://stackoverflow.com/questions/21733847/react-jsx-selecting-selected-on-selected-select-option
  handleSttTypeChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleExportFormatChange = event => {
    console.log(event.target.name, event.target.value);
    this.setState({ [event.target.name]: event.target.value });
  };

  exportTranscript = () => {
    console.log("export");
    // eslint-disable-next-line react/no-string-refs
    const { data, ext } = this.transcriptEditorRef.current.getEditorContent(
      this.state.exportFormat
    );
    let tmpData = data;
    if (ext === "json") {
      tmpData = JSON.stringify(data, null, 2);
    }
    if (ext !== "docx") {
      this.download(tmpData, `${this.state.mediaUrl}.${ext}`);
    }
  };

  // https://stackoverflow.com/questions/2897619/using-html5-javascript-to-generate-and-save-a-file
  download = (content, filename, contentType) => {
    console.log("download");
    const type = contentType || "application/octet-stream";
    const link = document.createElement("a");
    const blob = new Blob([content], { type: type });

    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    // Firefox fix - cannot do link.click() if it's not attached to DOM in firefox
    // https://stackoverflow.com/questions/32225904/programmatical-click-on-a-tag-not-working-in-firefox
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  clearLocalStorage = () => {
    localStorage.clear();
    console.info("Cleared local storage.");
  };

  clearIndexedDBCache = async () => {
    const cacheManager = getCacheManager();
    await cacheManager.clearAllCache();
    await this.updateCacheStats();
    console.info("Cleared IndexedDB cache.");
    alert("IndexedDB cache cleared successfully!");
  };

  handleAnalyticsEvents = event => {
    this.setState({ analyticsEvents: [...this.state.analyticsEvents, event] });
  };

  handleChangeTranscriptTitle = newTitle => {
    this.setState({
      title: newTitle
    });
  };

  handleChangeTranscriptName = value => {
    this.setState({ fileName: value });
  };

  handleAutoSaveChanges = newAutoSaveData => {
    console.log("handleAutoSaveChanges", newAutoSaveData);
    const { data, ext } = newAutoSaveData;
    this.setState({ autoSaveData: data, autoSaveExtension: ext });
    // Saving to local storage 
    localSave(this.state.mediaUrl, this.state.fileName, data);
  };
  render() {
    return (
      <div className={style.container}>
        <span>React Transcript Editor Demo </span>
        <a
          href="https://github.com/bbc/react-transcript-editor"
          rel="noopener noreferrer"
          target="_blank"
        >
          <FontAwesomeIcon icon={faGithub} />
        </a>
        <div className={style.demoNav}>
          <section className={style.demoNavItem}>
            <label className={style.sectionLabel}>Start</label>
            <button
              className={style.demoButton}
              onClick={() => this.loadDemo()}
            >
              Load Demo
            </button>
          </section>

          <section className={style.demoNavItem}>
            <label className={style.sectionLabel}>Load Media</label>
            <button onClick={() => this.handleLoadMediaUrl()}> From URL</button>
            <input
              type={"file"}
              id={"mediaFile"}
              onChange={e => this.handleLoadMedia(e.target.files)}
            />
            <label htmlFor="mediaFile">From Computer</label>
            {this.state.fileName !== "" ? (
              <label className={style.fileNameLabel}>
                {this.state.fileName}
              </label>
            ) : null}
          </section>

          <section className={style.demoNavItem}>
            <label className={style.sectionLabel}>Load Transcript</label>
            <SttTypeSelect
              className={style.dropdown}
              name={"sttType"}
              value={this.state.sttType}
              handleChange={this.handleSttTypeChange}
            />

            <input
              type={"file"}
              id={"transcriptFile"}
              onChange={e => this.handleLoadTranscriptJson(e.target.files)}
            />
            <label htmlFor="transcriptFile">From Computer</label>
            {this.state.transcriptData !== null ? (
              <label className={style.fileNameLabel}>Transcript loaded.</label>
            ) : null}
          </section>

          <section className={style.demoNavItem}>
            <label className={style.sectionLabel}>Export Transcript</label>
            <ExportFormatSelect
              className={style.dropdown}
              name={"exportFormat"}
              value={this.state.exportFormat}
              handleChange={this.handleExportFormatChange}
            />
            <button onClick={() => this.exportTranscript()}>Export File</button>
          </section>

          <section className={style.demoNavItem}>
            <label className={style.sectionLabel}>
              Transcript Title
              <span className={style.titleLabel}>(Optional)</span>
            </label>
            <input
              type="text"
              value={this.state.title}
              onChange={e => this.handleChangeTranscriptTitle(e.target.value)}
            />
          </section>

          <section className={style.demoNavItem}>
            <label className={style.sectionLabel}>Options</label>

            <div className={style.checkbox}>
              <label
                className={style.editableLabel}
                htmlFor={"textIsEditableCheckbox"}
              >
                Text Is Editable
              </label>
              <input
                id={"textIsEditableCheckbox"}
                type="checkbox"
                checked={this.state.isTextEditable}
                onChange={this.handleIsTextEditable}
              />
            </div>

            <div className={style.checkbox}>
              <label
                className={style.editableLabel}
                htmlFor={"spellCheckCheckbox"}
              >
                Spell Check
              </label>
              <input
                id={"spellCheckCheckbox"}
                type="checkbox"
                checked={this.state.spellCheck}
                onChange={this.handleSpellCheck}
              />
            </div>

            <button
              className={style.warningButton}
              onClick={() => this.clearLocalStorage()}
            >
              Clear Local Storage
            </button>

            <button
              className={style.warningButton}
              onClick={() => this.clearIndexedDBCache()}
              title="Clear cached transcript data from IndexedDB"
            >
              Clear IndexedDB Cache
            </button>
          </section>

          {this.state.cacheStats && this.state.cacheStats.isSupported && (
            <section className={style.demoNavItem}>
              <label className={style.sectionLabel}>Cache Stats</label>
              <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
                <div>📦 Cached Transcripts: {this.state.cacheStats.entryCount || 0} / {this.state.cacheStats.maxEntries}</div>
                <div>💾 Storage Used: {this.state.cacheStats.totalSizeFormatted || '0 Bytes'}</div>
                <div>✨ Version: {this.state.cacheStats.version}</div>
              </div>
              <button
                style={{ marginTop: '5px', fontSize: '11px', padding: '3px 8px' }}
                onClick={() => this.updateCacheStats()}
              >
                Refresh Stats
              </button>
            </section>
          )}
        </div>

        <TranscriptEditor
          transcriptData={this.state.transcriptData}
          fileName={this.state.fileName}
          mediaUrl={this.state.mediaUrl}
          isEditable={this.state.isTextEditable}
          spellCheck={this.state.spellCheck}
          sttJsonType={this.state.sttType}
          handleAnalyticsEvents={this.handleAnalyticsEvents}
          title={this.state.title}
          ref={this.transcriptEditorRef}
          handleAutoSaveChanges={this.handleAutoSaveChanges}
          autoSaveContentType={this.state.autoSaveContentType}
          mediaType={ 'video' }
        />

        <section style={{ height: "250px", width: "50%", float: "left" }}>
          <h3>Components Analytics</h3>
          <textarea
            style={{ height: "100%", width: "100%" }}
            value={JSON.stringify(this.state.analyticsEvents, null, 2)}
            disabled
          />
        </section>

        <section style={{ height: "250px", width: "50%", float: "right" }}>
          <h3>
            Auto Save data:{" "}
            <code>
              {this.state.autoSaveContentType}| {this.state.autoSaveExtension}
            </code>
          </h3>
          <textarea
            style={{ height: "100%", width: "100%" }}
            value={
              this.state.autoSaveExtension === "json"
                ? JSON.stringify(this.state.autoSaveData, null, 2)
                : this.state.autoSaveData
            }
            disabled
          />
        </section>
      </div>
    );
  }
}

export default App;