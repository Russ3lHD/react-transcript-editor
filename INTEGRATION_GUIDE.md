# React Transcript Editor - Integration Guide

This guide will help you integrate the packaged React Transcript Editor into your application.

## 📦 Build Output

The build process has generated the following in the `dist/` folder:

### Main Files
- `index.js` + `index.css` - Full component bundle with all features
- `TranscriptEditor.js` + `TranscriptEditor.css` - Standalone transcript editor
- `TimedTextEditor.js` + `TimedTextEditor.css` - Timed text editor component
- `MediaPlayer.js` + `MediaPlayer.css` - Media player component
- `VideoPlayer.js` + `VideoPlayer.css` - Video player component
- TypeScript definitions in `packages/**/*.d.ts`

### Utilities
- `exportAdapter.js` - Export format adapters (JSON, TXT, DOCX, etc.)
- `sttJsonAdapter.js` - Speech-to-text format adapters (Whisper, BBC Kaldi, etc.)
- `timecodeConverter.js` - Timecode conversion utilities

## 🚀 Integration Methods

### Method 1: Install from GitHub (Recommended for Development)

```bash
# Using npm
npm install github:pmacom/react-transcript-editor

# Using yarn
yarn add github:pmacom/react-transcript-editor

# Using pnpm
pnpm add github:pmacom/react-transcript-editor
```

### Method 2: Local Package Integration

If you want to use the built `dist/` folder directly:

#### Option A: Link Locally
```bash
# In this project directory
npm link

# In your target project
npm link pmacom-react-transcript-editor
```

#### Option B: Install from Local Path
```bash
# In your target project
npm install C:/Custom/react-transcript-editor/dist
```

#### Option C: Copy dist/ folder
1. Copy the entire `dist/` folder to your project
2. Import directly from the copied location

### Method 3: Publish to NPM

If you want to publish this to npm:

```bash
# Update version in package.json if needed
npm version patch

# Build and publish
pnpm run pre:publish
npm publish dist --access public
```

## 💻 Usage Examples

### Basic Usage

```jsx
import React, { useState } from 'react';
import { TranscriptEditor } from 'pmacom-react-transcript-editor';
import 'pmacom-react-transcript-editor/TranscriptEditor.css';

function MyApp() {
  const [transcriptData, setTranscriptData] = useState(null);

  return (
    <TranscriptEditor
      transcriptData={transcriptData}
      mediaUrl="https://example.com/audio.mp3"
      isEditable={true}
      handleAutoSaveChanges={(data) => {
        console.log('Auto-save:', data);
        setTranscriptData(data);
      }}
    />
  );
}
```

### With Whisper Format Data

```jsx
import React, { useState } from 'react';
import { TranscriptEditor, sttJsonAdapter } from 'pmacom-react-transcript-editor';
import 'pmacom-react-transcript-editor/TranscriptEditor.css';

function WhisperTranscriptApp() {
  // Your Whisper JSON data
  const whisperData = {
    text: "Full transcript text",
    segments: [
      {
        id: 0,
        start: 0.0,
        end: 2.5,
        text: "Hello world",
        words: [
          { word: "Hello", start: 0.0, end: 1.0 },
          { word: "world", start: 1.2, end: 2.5 }
        ]
      }
    ]
  };

  // Convert to editor format
  const transcriptData = sttJsonAdapter({
    type: 'whisper',
    data: whisperData
  });

  return (
    <TranscriptEditor
      transcriptData={transcriptData}
      mediaUrl="path/to/audio.mp3"
      isEditable={true}
      showSpeakers={false}
      showTimecodes={true}
    />
  );
}
```

### Import Only What You Need

```jsx
// Import specific components
import { MediaPlayer } from 'pmacom-react-transcript-editor';
import 'pmacom-react-transcript-editor/MediaPlayer.css';

// Import utilities
import { 
  secondsToTimecode, 
  timecodeToSeconds 
} from 'pmacom-react-transcript-editor';

// Import adapters
import { 
  sttJsonAdapter, 
  exportAdapter 
} from 'pmacom-react-transcript-editor';
```

## 📚 Available Components

### TranscriptEditor
The main component with full editing capabilities.

**Props:**
- `transcriptData` - Transcript data in DraftJS format
- `mediaUrl` - URL to audio/video file
- `isEditable` - Enable/disable editing (default: true)
- `showTimecodes` - Show/hide timecodes (default: true)
- `showSpeakers` - Show/hide speaker labels (default: true)
- `handleAutoSaveChanges` - Callback for auto-save
- `handleAnalyticsEvents` - Callback for analytics
- And many more (see TypeScript definitions)

### TimedTextEditor
Simplified editor for timed text only.

### MediaPlayer
Audio/video player with transcript sync.

### VideoPlayer
Video player component.

### Settings
Settings panel component.

## 🔧 Utilities

### STT Adapters
Convert various speech-to-text formats to editor format:

```javascript
import { sttJsonAdapter } from 'pmacom-react-transcript-editor';

// Supported formats:
const transcriptData = sttJsonAdapter({
  type: 'whisper',        // OpenAI Whisper
  // type: 'bbc-kaldi',   // BBC Kaldi
  // type: 'speechmatics', // Speechmatics
  // type: 'assemblyai',   // AssemblyAI
  // type: 'rev',          // Rev.ai
  // type: 'gentle',       // Gentle
  data: yourSTTData
});
```

### Export Adapters
Export transcript to various formats:

```javascript
import { exportAdapter } from 'pmacom-react-transcript-editor';

const exported = exportAdapter({
  type: 'json',    // json, txt, docx, itt, vtt, srt, etc.
  data: transcriptData,
  title: 'My Transcript'
});
```

### Timecode Utilities
Convert between seconds and timecode:

```javascript
import { 
  secondsToTimecode, 
  timecodeToSeconds,
  shortTimecode 
} from 'pmacom-react-transcript-editor';

const tc = secondsToTimecode(125.5);  // "00:02:05.500"
const seconds = timecodeToSeconds("00:02:05.500");  // 125.5
const short = shortTimecode(125.5);   // "2:05"
```

## 📁 File Structure in dist/

```
dist/
├── index.js              # Main entry point (all components)
├── index.css             # Main styles
├── index.d.ts            # TypeScript definitions
├── TranscriptEditor.js   # Individual component bundles
├── TranscriptEditor.css
├── TimedTextEditor.js
├── TimedTextEditor.css
├── MediaPlayer.js
├── MediaPlayer.css
├── VideoPlayer.js
├── VideoPlayer.css
├── Settings.js
├── Settings.css
├── exportAdapter.js
├── sttJsonAdapter.js
├── timecodeConverter.js
├── package.json          # Package metadata
├── README.md
└── packages/             # TypeScript definitions
    └── **/*.d.ts
```

## 🎨 Styling

The editor uses CSS modules. Import the appropriate CSS file for your component:

```jsx
// For full editor
import 'pmacom-react-transcript-editor/TranscriptEditor.css';

// For individual components
import 'pmacom-react-transcript-editor/MediaPlayer.css';
import 'pmacom-react-transcript-editor/TimedTextEditor.css';
```

## ⚙️ TypeScript Support

The package includes TypeScript definitions. They should be automatically picked up:

```typescript
import { TranscriptEditor } from 'pmacom-react-transcript-editor';
import type { 
  TranscriptEditorProps,
  TranscriptData,
  Word,
  Speaker
} from 'pmacom-react-transcript-editor';
```

## 🔍 Supported Formats

### Input (STT) Formats
- ✅ Whisper (OpenAI) - **Recommended**
- ✅ BBC Kaldi
- ✅ Speechmatics
- ✅ AssemblyAI
- ✅ Rev.ai
- ✅ Amazon Transcribe
- ✅ Google Speech-to-Text
- ✅ IBM Watson
- ✅ Gentle

### Export Formats
- ✅ JSON (DraftJS format)
- ✅ Plain Text
- ✅ DOCX (Microsoft Word)
- ✅ WebVTT (.vtt)
- ✅ SubRip (.srt)
- ✅ iTunes Timed Text (.itt)
- ✅ Adobe Premiere (.csv)

## 📖 Additional Documentation

- [Whisper Format Integration](./WHISPER_FORMAT_INTEGRATION_GUIDE.md)
- [Performance Optimization](./QUICK_REFERENCE_LOADING_OPTIMIZATION.md)
- [Format Comparison](./TRANSCRIPT_FORMAT_PERFORMANCE_ANALYSIS.md)
- [Features List](./docs/features-list.md)

## 🐛 Troubleshooting

### CSS Not Loading
Make sure to import the CSS files:
```jsx
import 'pmacom-react-transcript-editor/TranscriptEditor.css';
```

### TypeScript Errors
Ensure `@types/react` and `@types/react-dom` are installed:
```bash
npm install --save-dev @types/react @types/react-dom
```

### Module Not Found
If using a bundler like Webpack, ensure it can resolve node_modules correctly.

### Large Bundle Size
Import only the components you need:
```jsx
// Instead of importing everything
import { TranscriptEditor } from 'pmacom-react-transcript-editor';

// Import specific component files if needed
import TranscriptEditor from 'pmacom-react-transcript-editor/TranscriptEditor';
```

## 📄 License

MIT - Same as the original BBC package

## 🤝 Support

For issues and questions:
- Check the [documentation](./docs/)
- Review [examples](./demo/)
- Open an issue on GitHub
