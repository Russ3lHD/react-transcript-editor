# How to Use This Package in Your Project

## Step 1: Choose Your Integration Method

### Method A: GitHub Install (Easiest)

In your project directory:

```bash
npm install github:pmacom/react-transcript-editor
```

### Method B: Local Development Link

```bash
# In this react-transcript-editor directory
cd c:\Custom\react-transcript-editor\dist
npm link

# Then in your project directory
npm link pmacom-react-transcript-editor
```

### Method C: Direct Path Install

```bash
# In your project
npm install c:/Custom/react-transcript-editor/dist
```

## Step 2: Use in Your Code

### Basic Example

```jsx
import React, { useState } from 'react';
import { TranscriptEditor } from 'pmacom-react-transcript-editor';
import 'pmacom-react-transcript-editor/index.css';

export default function MyTranscriptPage() {
  const [transcript, setTranscript] = useState(null);

  return (
    <TranscriptEditor
      transcriptData={transcript}
      mediaUrl="https://your-audio-url.mp3"
      isEditable={true}
      handleAutoSaveChanges={setTranscript}
    />
  );
}
```

### With Whisper Data

```jsx
import React, { useState } from 'react';
import { TranscriptEditor, sttJsonAdapter } from 'pmacom-react-transcript-editor';
import 'pmacom-react-transcript-editor/index.css';

export default function MyTranscriptPage() {
  // Your Whisper transcription data
  const whisperData = {
    text: "Your transcript text",
    segments: [
      {
        id: 0,
        start: 0.0,
        end: 5.0,
        text: "Your transcript text",
        words: [
          { word: "Your", start: 0.0, end: 0.5 },
          { word: "transcript", start: 0.6, end: 1.5 },
          { word: "text", start: 1.6, end: 5.0 }
        ]
      }
    ]
  };

  // Convert to editor format
  const transcriptData = sttJsonAdapter({
    type: 'whisper',
    data: whisperData
  });

  const [transcript, setTranscript] = useState(transcriptData);

  return (
    <TranscriptEditor
      transcriptData={transcript}
      mediaUrl="https://your-audio-url.mp3"
      isEditable={true}
      handleAutoSaveChanges={setTranscript}
    />
  );
}
```

### Next.js Usage

```jsx
'use client'; // If using Next.js App Router

import { useState } from 'react';
import dynamic from 'next/dynamic';
import 'pmacom-react-transcript-editor/index.css';

// Avoid SSR issues with Draft.js
const TranscriptEditor = dynamic(
  () => import('pmacom-react-transcript-editor').then(m => m.TranscriptEditor),
  { ssr: false }
);

export default function TranscriptPage() {
  const [transcript, setTranscript] = useState(null);

  return (
    <div>
      <h1>My Transcript</h1>
      <TranscriptEditor
        transcriptData={transcript}
        mediaUrl="/audio/file.mp3"
        isEditable={true}
        handleAutoSaveChanges={setTranscript}
      />
    </div>
  );
}
```

## Step 3: That's It!

The component is fully self-contained and ready to use. All dependencies are bundled.

## Common Props

```jsx
<TranscriptEditor
  // Required
  transcriptData={data}              // Your transcript data
  mediaUrl="url-to-audio-or-video"   // Media file URL
  
  // Optional
  isEditable={true}                  // Enable editing
  showTimecodes={true}               // Show timecodes
  showSpeakers={true}                // Show speaker labels
  handleAutoSaveChanges={callback}   // Auto-save callback
  title="My Transcript"              // Title
  enableVirtualScrolling={true}      // For large transcripts
/>
```

## Available Exports

```jsx
// Components
import {
  TranscriptEditor,
  TimedTextEditor,
  MediaPlayer,
  VideoPlayer,
  Settings
} from 'pmacom-react-transcript-editor';

// Adapters
import {
  sttJsonAdapter,     // Convert STT formats
  exportAdapter       // Export to formats
} from 'pmacom-react-transcript-editor';

// Utilities
import {
  secondsToTimecode,
  timecodeToSeconds,
  shortTimecode
} from 'pmacom-react-transcript-editor';

// Styles
import 'pmacom-react-transcript-editor/index.css';
// or specific component styles:
import 'pmacom-react-transcript-editor/TranscriptEditor.css';
import 'pmacom-react-transcript-editor/MediaPlayer.css';
```

## Need More Help?

- **Quick Start Guide:** [QUICK_START.md](./QUICK_START.md)
- **Full Integration Guide:** [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
- **Framework Examples:** [FRAMEWORK_EXAMPLES.md](./FRAMEWORK_EXAMPLES.md)
- **Whisper Guide:** [WHISPER_FORMAT_INTEGRATION_GUIDE.md](./WHISPER_FORMAT_INTEGRATION_GUIDE.md)
