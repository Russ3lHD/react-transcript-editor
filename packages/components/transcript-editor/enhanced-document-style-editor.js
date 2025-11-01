import React from 'react';
import { TranscriptEditor } from 'pmacom-react-transcript-editor';
import { Card, CardContent } from '../ui/card';
import '../../styles/pmacom-transcript-editor.css';

/**
 * Document-style editor with integrated video player
 * Uses pmacom-react-transcript-editor library
 */

const EnhancedDocumentStyleEditor = ({ file }) => {
  const [transcriptData, setTranscriptData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let mounted = true;
    
    const loadTranscript = async () => {
      if (!file?.filename) {
        if (mounted) {
          setTranscriptData(null);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `http://localhost:8000/api/transcript/${encodeURIComponent(file.filename)}/whisper`
        );
        
        if (!res.ok) {
          throw new Error(`Failed to load transcript: ${res.status} ${res.statusText}`);
        }
        
        const json = await res.json();
        
        if (mounted) {
          setTranscriptData(json);
          setIsLoading(false);
        }
      } catch (e) {
        console.error('Error loading transcript:', e);
        if (mounted) {
          setError(e.message);
          setIsLoading(false);
        }
      }
    };

    loadTranscript();
    
    return () => {
      mounted = false;
    };
  }, [file?.filename]);

  if (isLoading) {
    return (
      <Card className="h-full flex flex-col bg-card border-0 shadow-none">
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading transcript...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full flex flex-col bg-card border-0 shadow-none">
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-destructive">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!transcriptData || !transcriptData.segments) {
    return (
      <Card className="h-full flex flex-col bg-card border-0 shadow-none">
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">No transcript data available</div>
        </CardContent>
      </Card>
    );
  }

  // Render TranscriptEditor with integrated video player and all features
  return (
    <Card className="h-full flex flex-col bg-card border-0 shadow-none">
      <CardContent className="flex-1 overflow-hidden p-0">
        <div className="h-full w-full">
          <TranscriptEditor
            transcriptData={transcriptData}
            mediaUrl={`http://localhost:8000/api/video/${file?.filename || ''}`}
            sttJsonType="whisper"
            fileName={file?.filename || 'transcript'}
            handleAutoSaveChanges={(content) => {
              console.log('Transcript changed:', content);
            }}
            handleAnalyticsEvents={(eventName, data) => {
              console.log('Analytics event:', eventName, data);
            }}
            isEditable={true}
            spellCheck={true}
            title={file?.filename || 'Transcript Editor'}
            mediaType="video"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedDocumentStyleEditor;