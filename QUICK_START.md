# Quick Start Guide

Get up and running with React Transcript Editor in 5 minutes.

## 1. Install

```bash
npm install github:pmacom/react-transcript-editor
```

## 2. Basic Setup

```jsx
import React, { useState } from 'react';
import { TranscriptEditor } from 'pmacom-react-transcript-editor';
import 'pmacom-react-transcript-editor/TranscriptEditor.css';

function App() {
  const [transcriptData, setTranscriptData] = useState(null);

  return (
    <div className="App">
      <TranscriptEditor
        transcriptData={transcriptData}
        mediaUrl="https://download.ted.com/talks/KateDarling_2018S-950k.mp4"
        isEditable={true}
        handleAutoSaveChanges={(data) => setTranscriptData(data)}
      />
    </div>
  );
}

export default App;
```

## 3. With Existing Transcript Data

```jsx
import React, { useState } from 'react';
import { TranscriptEditor, sttJsonAdapter } from 'pmacom-react-transcript-editor';
import 'pmacom-react-transcript-editor/TranscriptEditor.css';

function App() {
  // Example: Whisper JSON data
  const whisperData = {
    text: "Hello, this is a test transcript.",
    segments: [
      {
        id: 0,
        start: 0.0,
        end: 3.5,
        text: "Hello, this is a test transcript.",
        words: [
          { word: "Hello,", start: 0.0, end: 0.5 },
          { word: "this", start: 0.6, end: 0.9 },
          { word: "is", start: 1.0, end: 1.2 },
          { word: "a", start: 1.3, end: 1.4 },
          { word: "test", start: 1.5, end: 1.9 },
          { word: "transcript.", start: 2.0, end: 3.5 }
        ]
      }
    ]
  };

  // Convert to editor format
  const initialData = sttJsonAdapter({
    type: 'whisper',
    data: whisperData
  });

  const [transcriptData, setTranscriptData] = useState(initialData);

  return (
    <TranscriptEditor
      transcriptData={transcriptData}
      mediaUrl="path/to/your/audio.mp3"
      isEditable={true}
      showTimecodes={true}
      showSpeakers={false}
      handleAutoSaveChanges={(data) => {
        console.log('Transcript updated:', data);
        setTranscriptData(data);
      }}
    />
  );
}

export default App;
```

## 4. Export Transcript

```jsx
import React, { useState } from 'react';
import { TranscriptEditor, exportAdapter } from 'pmacom-react-transcript-editor';
import 'pmacom-react-transcript-editor/TranscriptEditor.css';

function App() {
  const [transcriptData, setTranscriptData] = useState(null);

  const handleExport = (format) => {
    if (!transcriptData) return;

    const exported = exportAdapter({
      type: format, // 'txt', 'json', 'docx', 'vtt', 'srt'
      data: transcriptData,
      title: 'My Transcript'
    });

    // For text formats, create a download
    if (format === 'txt' || format === 'json') {
      const blob = new Blob([exported], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transcript.${format}`;
      a.click();
    }
  };

  return (
    <div>
      <div>
        <button onClick={() => handleExport('txt')}>Export as TXT</button>
        <button onClick={() => handleExport('json')}>Export as JSON</button>
        <button onClick={() => handleExport('vtt')}>Export as VTT</button>
      </div>
      
      <TranscriptEditor
        transcriptData={transcriptData}
        mediaUrl="path/to/audio.mp3"
        isEditable={true}
        handleAutoSaveChanges={setTranscriptData}
      />
    </div>
  );
}

export default App;
```

## 5. Common Props

```jsx
<TranscriptEditor
  // Required
  transcriptData={transcriptData}           // Transcript data object
  mediaUrl="path/to/media.mp3"              // Audio/video URL
  
  // Optional - Editor behavior
  isEditable={true}                         // Enable editing
  handleAutoSaveChanges={handleSave}        // Auto-save callback
  autoSaveContentType="draftjs"             // Save format
  
  // Optional - Display
  showTimecodes={true}                      // Show timecodes
  showSpeakers={true}                       // Show speaker labels
  title="My Transcript"                     // Editor title
  
  // Optional - Performance
  enableVirtualScrolling={true}             // Enable virtual scrolling
  chunkSize={100}                           // Words per chunk
  
  // Optional - Analytics
  handleAnalyticsEvents={(event) => {       // Analytics callback
    console.log(event);
  }}
/>
```

## Next Steps

- Read the full [Integration Guide](./INTEGRATION_GUIDE.md)
- Check out [Whisper Format Guide](./WHISPER_FORMAT_INTEGRATION_GUIDE.md)
- See [Performance Optimization](./QUICK_REFERENCE_LOADING_OPTIMIZATION.md)
- Review [component documentation](./docs/features-list.md)
