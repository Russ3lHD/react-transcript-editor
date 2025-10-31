import draftToTxt from './txt/index';
import draftToDocx from './docx/index';
import draftToTxtSpeakersTimecodes from './txt-speakers-timecodes/index';
import draftToDigitalPaperEdit from './draftjs-to-digital-paper-edit/index.js';
import subtitlesGenerator from './subtitles-generator/index.js';
import draftToWhisper from './draftjs-to-whisper/index';

import type {
  BlockData,
  ExportFormat,
  ExportResult,
  SubtitlesOptions,
} from './types';

/**
 * Adapters for Draft.js conversion
 * @param blockData - Draft.js blocks
 * @param exportFormat - the type of file supported by the available adapters
 * @param transcriptTitle - optional title for the transcript
 * @returns Export result with data and file extension
 */
const exportAdapter = (
  blockData: BlockData,
  exportFormat: ExportFormat,
  transcriptTitle?: string
): ExportResult | null => {
  try {
    switch (exportFormat) {
      case 'draftjs':
        return { data: blockData, ext: 'json' };

      case 'txt':
        return { data: draftToTxt(blockData), ext: 'txt' };

      case 'docx':
        return { data: draftToDocx(blockData, transcriptTitle), ext: 'docx' };

      case 'txtspeakertimecodes':
        return { data: draftToTxtSpeakersTimecodes(blockData), ext: 'txt' };

      case 'digitalpaperedit':
        return { data: draftToDigitalPaperEdit(blockData), ext: 'json' };

      case 'srt': {
        const { words } = draftToDigitalPaperEdit(blockData);
        const srtContent = subtitlesGenerator({ 
          words, 
          type: 'srt', 
          numberOfCharPerLine: 35 
        } as any);
        return { data: srtContent, ext: 'srt' };
      }

      case 'premiereTTML': {
        const { words } = draftToDigitalPaperEdit(blockData);
        const content = subtitlesGenerator({ 
          words, 
          type: 'premiere' 
        } as any);
        return { data: content, ext: 'ttml' };
      }

      case 'ttml': {
        const { words } = draftToDigitalPaperEdit(blockData);
        const content = subtitlesGenerator({ 
          words, 
          type: 'ttml' 
        } as any);
        return { data: content, ext: 'ttml' };
      }

      case 'itt': {
        const { words } = draftToDigitalPaperEdit(blockData);
        const content = subtitlesGenerator({ 
          words, 
          type: 'itt' 
        } as any);
        return { data: content, ext: 'itt' };
      }

      case 'csv': {
        const { words } = draftToDigitalPaperEdit(blockData);
        const content = subtitlesGenerator({ 
          words, 
          type: 'csv' 
        } as any);
        return { data: content, ext: 'csv' };
      }

      case 'vtt': {
        const { words } = draftToDigitalPaperEdit(blockData);
        const content = subtitlesGenerator({ 
          words, 
          type: 'vtt' 
        } as any);
        return { data: content, ext: 'vtt' };
      }

      case 'json-captions': {
        const { words } = draftToDigitalPaperEdit(blockData);
        const content = subtitlesGenerator({ 
          words, 
          type: 'json' 
        } as any);
        return { data: content, ext: 'json' };
      }

      case 'pre-segment-txt': {
        const { words } = draftToDigitalPaperEdit(blockData);
        const content = subtitlesGenerator({ 
          words, 
          type: 'pre-segment-txt' 
        } as any);
        return { data: content, ext: 'txt' };
      }

      case 'whisper':
        return { data: draftToWhisper(blockData), ext: 'json' };

      default:
        console.error(`Unsupported export format: ${exportFormat}`);
        return null;
    }
  } catch (error) {
    console.error(`Error exporting ${exportFormat}:`, error);
    return null;
  }
};

export default exportAdapter; 
