# Framework Integration Examples

Examples of integrating React Transcript Editor into various frameworks.

## React (Create React App)

```jsx
// src/App.js
import React, { useState } from 'react';
import { TranscriptEditor } from 'pmacom-react-transcript-editor';
import 'pmacom-react-transcript-editor/TranscriptEditor.css';
import './App.css';

function App() {
  const [transcriptData, setTranscriptData] = useState(null);

  return (
    <div className="App">
      <h1>My Transcript Editor</h1>
      <TranscriptEditor
        transcriptData={transcriptData}
        mediaUrl="https://example.com/audio.mp3"
        isEditable={true}
        handleAutoSaveChanges={setTranscriptData}
      />
    </div>
  );
}

export default App;
```

## Next.js (App Router)

```jsx
// app/transcript/page.tsx
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import 'pmacom-react-transcript-editor/TranscriptEditor.css';

// Dynamic import to avoid SSR issues with Draft.js
const TranscriptEditor = dynamic(
  () => import('pmacom-react-transcript-editor').then(mod => mod.TranscriptEditor),
  { ssr: false }
);

export default function TranscriptPage() {
  const [transcriptData, setTranscriptData] = useState(null);

  return (
    <div className="container">
      <h1>Transcript Editor</h1>
      <TranscriptEditor
        transcriptData={transcriptData}
        mediaUrl="/audio/sample.mp3"
        isEditable={true}
        handleAutoSaveChanges={setTranscriptData}
      />
    </div>
  );
}
```

## Next.js (Pages Router)

```jsx
// pages/transcript.js
import { useState } from 'react';
import dynamic from 'next/dynamic';
import 'pmacom-react-transcript-editor/TranscriptEditor.css';

const TranscriptEditor = dynamic(
  () => import('pmacom-react-transcript-editor').then(mod => mod.TranscriptEditor),
  { ssr: false }
);

export default function TranscriptPage() {
  const [transcriptData, setTranscriptData] = useState(null);

  return (
    <div>
      <h1>Transcript Editor</h1>
      <TranscriptEditor
        transcriptData={transcriptData}
        mediaUrl="/audio/sample.mp3"
        isEditable={true}
        handleAutoSaveChanges={setTranscriptData}
      />
    </div>
  );
}
```

## Vite + React

```jsx
// src/App.tsx
import { useState } from 'react';
import { TranscriptEditor } from 'pmacom-react-transcript-editor';
import 'pmacom-react-transcript-editor/TranscriptEditor.css';

function App() {
  const [transcriptData, setTranscriptData] = useState(null);

  return (
    <>
      <h1>Transcript Editor</h1>
      <TranscriptEditor
        transcriptData={transcriptData}
        mediaUrl="/audio/sample.mp3"
        isEditable={true}
        handleAutoSaveChanges={setTranscriptData}
      />
    </>
  );
}

export default App;
```

## Remix

```jsx
// app/routes/transcript.tsx
import { useState } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [{ title: 'Transcript Editor' }];
};

function TranscriptEditorComponent() {
  const [transcriptData, setTranscriptData] = useState(null);
  
  // Dynamic import to avoid SSR issues
  const { TranscriptEditor } = require('pmacom-react-transcript-editor');
  require('pmacom-react-transcript-editor/TranscriptEditor.css');

  return (
    <TranscriptEditor
      transcriptData={transcriptData}
      mediaUrl="/audio/sample.mp3"
      isEditable={true}
      handleAutoSaveChanges={setTranscriptData}
    />
  );
}

export default function TranscriptRoute() {
  return (
    <div>
      <h1>Transcript Editor</h1>
      <ClientOnly fallback={<div>Loading editor...</div>}>
        {() => <TranscriptEditorComponent />}
      </ClientOnly>
    </div>
  );
}
```

## TypeScript + React

```tsx
// App.tsx
import React, { useState } from 'react';
import { TranscriptEditor } from 'pmacom-react-transcript-editor';
import type { TranscriptData } from 'pmacom-react-transcript-editor';
import 'pmacom-react-transcript-editor/TranscriptEditor.css';

interface AppProps {
  initialMediaUrl?: string;
}

const App: React.FC<AppProps> = ({ initialMediaUrl = '' }) => {
  const [transcriptData, setTranscriptData] = useState<TranscriptData | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string>(initialMediaUrl);

  const handleSave = (data: TranscriptData) => {
    console.log('Saving transcript:', data);
    setTranscriptData(data);
    
    // Save to backend
    fetch('/api/transcripts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  };

  return (
    <div className="app-container">
      <header>
        <h1>Transcript Editor</h1>
        <input
          type="text"
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
          placeholder="Media URL"
        />
      </header>
      
      {mediaUrl && (
        <TranscriptEditor
          transcriptData={transcriptData}
          mediaUrl={mediaUrl}
          isEditable={true}
          showTimecodes={true}
          showSpeakers={true}
          handleAutoSaveChanges={handleSave}
        />
      )}
    </div>
  );
};

export default App;
```

## With Redux

```jsx
// components/TranscriptEditor.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TranscriptEditor } from 'pmacom-react-transcript-editor';
import { updateTranscript } from '../store/transcriptSlice';
import 'pmacom-react-transcript-editor/TranscriptEditor.css';

function TranscriptEditorContainer() {
  const dispatch = useDispatch();
  const transcriptData = useSelector(state => state.transcript.data);
  const mediaUrl = useSelector(state => state.transcript.mediaUrl);

  const handleChange = (data) => {
    dispatch(updateTranscript(data));
  };

  return (
    <TranscriptEditor
      transcriptData={transcriptData}
      mediaUrl={mediaUrl}
      isEditable={true}
      handleAutoSaveChanges={handleChange}
    />
  );
}

export default TranscriptEditorContainer;
```

```js
// store/transcriptSlice.js
import { createSlice } from '@reduxjs/toolkit';

const transcriptSlice = createSlice({
  name: 'transcript',
  initialState: {
    data: null,
    mediaUrl: '',
    isLoading: false,
  },
  reducers: {
    updateTranscript: (state, action) => {
      state.data = action.payload;
    },
    setMediaUrl: (state, action) => {
      state.mediaUrl = action.payload;
    },
  },
});

export const { updateTranscript, setMediaUrl } = transcriptSlice.actions;
export default transcriptSlice.reducer;
```

## With Context API

```jsx
// contexts/TranscriptContext.jsx
import React, { createContext, useState, useContext } from 'react';

const TranscriptContext = createContext();

export function TranscriptProvider({ children }) {
  const [transcriptData, setTranscriptData] = useState(null);
  const [mediaUrl, setMediaUrl] = useState('');

  const value = {
    transcriptData,
    mediaUrl,
    updateTranscript: setTranscriptData,
    updateMediaUrl: setMediaUrl,
  };

  return (
    <TranscriptContext.Provider value={value}>
      {children}
    </TranscriptContext.Provider>
  );
}

export function useTranscript() {
  const context = useContext(TranscriptContext);
  if (!context) {
    throw new Error('useTranscript must be used within TranscriptProvider');
  }
  return context;
}
```

```jsx
// components/TranscriptEditor.jsx
import React from 'react';
import { TranscriptEditor } from 'pmacom-react-transcript-editor';
import { useTranscript } from '../contexts/TranscriptContext';
import 'pmacom-react-transcript-editor/TranscriptEditor.css';

function TranscriptEditorComponent() {
  const { transcriptData, mediaUrl, updateTranscript } = useTranscript();

  return (
    <TranscriptEditor
      transcriptData={transcriptData}
      mediaUrl={mediaUrl}
      isEditable={true}
      handleAutoSaveChanges={updateTranscript}
    />
  );
}

export default TranscriptEditorComponent;
```

## Common Issues and Solutions

### Issue: "Module not found" errors

**Solution:** Make sure the package is installed correctly:

```bash
npm install github:pmacom/react-transcript-editor
```

### Issue: CSS not loading

**Solution:** Import CSS files explicitly:

```jsx
import 'pmacom-react-transcript-editor/TranscriptEditor.css';
```

### Issue: SSR errors with Next.js

**Solution:** Use dynamic imports with `ssr: false`:

```jsx
const TranscriptEditor = dynamic(
  () => import('pmacom-react-transcript-editor').then(mod => mod.TranscriptEditor),
  { ssr: false }
);
```

### Issue: TypeScript errors

**Solution:** Install type definitions:

```bash
npm install --save-dev @types/react @types/react-dom
```

### Issue: Build errors with webpack

**Solution:** Add fallbacks for Node.js core modules:

```js
// webpack.config.js
module.exports = {
  resolve: {
    fallback: {
      buffer: require.resolve('buffer/'),
      process: require.resolve('process/browser.js'),
    }
  }
};
```

## Performance Tips

1. **Use virtual scrolling for large transcripts:**
   ```jsx
   <TranscriptEditor
     enableVirtualScrolling={true}
     chunkSize={100}
   />
   ```

2. **Lazy load the component:**
   ```jsx
   const TranscriptEditor = lazy(() => 
     import('pmacom-react-transcript-editor').then(mod => ({ 
       default: mod.TranscriptEditor 
     }))
   );
   ```

3. **Debounce auto-save:**
   ```jsx
   import { debounce } from 'lodash';
   
   const handleSave = debounce((data) => {
     // Save logic
   }, 1000);
   ```
