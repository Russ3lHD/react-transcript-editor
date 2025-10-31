import bbcKaldiToDraft from './bbc-kaldi/index';
import autoEdit2ToDraft from './autoEdit2/index';
import speechmaticsToDraft from './speechmatics/index';
import amazonTranscribeToDraft from './amazon-transcribe/index';
import ibmToDraft from './ibm/index';
import digitalPaperEditToDraft from './digital-paper-edit/index';
import createEntityMap from './create-entity-map/index';
import gcpSttToDraft from './google-stt/index';
import whisperToDraft from './whisper/index';

import type {
  TranscriptData,
  SttJsonType,
  DraftJsTranscript,
  BbcKaldiJson,
  AutoEdit2Json,
  SpeechmaticsJson,
  AmazonTranscribeJson,
  IbmJson,
  DigitalPaperEditJson,
  GoogleSttJson,
  WhisperJson,
} from './types';

/**
 * Adapters for STT conversion
 * @param transcriptData - A json transcript with some word accurate timecode
 * @param sttJsonType - the type of transcript supported by the available adapters
 * @returns DraftJs transcript format with blocks and entityMap
 */
const sttJsonAdapter = (
  transcriptData: TranscriptData,
  sttJsonType: SttJsonType
): DraftJsTranscript | null => {
  let blocks;

  try {
    switch (sttJsonType) {
      case 'bbckaldi':
        blocks = bbcKaldiToDraft(transcriptData as BbcKaldiJson);
        return { blocks, entityMap: createEntityMap(blocks) as any };

      case 'autoedit2':
        blocks = autoEdit2ToDraft(transcriptData as AutoEdit2Json);
        return { blocks, entityMap: createEntityMap(blocks) as any };

      case 'speechmatics':
        blocks = speechmaticsToDraft(transcriptData as SpeechmaticsJson);
        return { blocks, entityMap: createEntityMap(blocks) as any };

      case 'ibm':
        blocks = ibmToDraft(transcriptData as IbmJson);
        return { blocks, entityMap: createEntityMap(blocks) as any };

      case 'draftjs':
        return transcriptData as DraftJsTranscript;

      case 'amazontranscribe':
        blocks = amazonTranscribeToDraft(transcriptData as AmazonTranscribeJson);
        return { blocks, entityMap: createEntityMap(blocks) as any };

      case 'digitalpaperedit':
        blocks = digitalPaperEditToDraft(transcriptData as DigitalPaperEditJson);
        return { blocks, entityMap: createEntityMap(blocks) as any };

      case 'google-stt':
        blocks = gcpSttToDraft(transcriptData as GoogleSttJson);
        return { blocks, entityMap: createEntityMap(blocks) as any };

      case 'whisper':
        blocks = whisperToDraft(transcriptData as WhisperJson);
        return { blocks, entityMap: createEntityMap(blocks) as any };

      default:
        console.error(`Unsupported STT engine: ${sttJsonType}`);
        return null;
    }
  } catch (error) {
    console.error(`Error processing ${sttJsonType} transcript:`, error);
    return null;
  }
};

export default sttJsonAdapter;
export { createEntityMap }; 
