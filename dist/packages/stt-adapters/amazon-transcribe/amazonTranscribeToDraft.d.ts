import type { AmazonTranscribeJson, DraftJsContentBlock } from '../types';
export declare const stripLeadingSpace: (word: string) => string;
/**
 * Get the best alternative for a word based on confidence
 * @param word - Word object from Amazon Transcribe
 * @returns Best alternative with highest confidence
 */
export declare const getBestAlternativeForWord: (word: any) => any;
export declare const appendPunctuationToPreviousWord: (punctuation: any, previousWord: any) => any;
export declare const mapPunctuationItemsToWords: (words: any[]) => any[];
/**
 * Converts AWS Transcribe Json to DraftJs
 * @param amazonTranscribeJson - Amazon Transcribe JSON data
 * @returns Array of DraftJS content blocks
 */
declare const amazonTranscribeToDraft: (amazonTranscribeJson: AmazonTranscribeJson) => DraftJsContentBlock[];
export default amazonTranscribeToDraft;
//# sourceMappingURL=amazonTranscribeToDraft.d.ts.map