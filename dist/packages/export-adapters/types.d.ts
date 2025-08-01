import type { DraftJsContentBlock, Word } from '../stt-adapters/types';
export interface ExportResult {
    data: any;
    ext: string;
}
export interface BlockData {
    blocks: DraftJsContentBlock[];
    entityMap?: Record<string, any>;
}
export type ExportFormat = 'draftjs' | 'txt' | 'docx' | 'txtspeakertimecodes' | 'digitalpaperedit' | 'srt' | 'premiereTTML' | 'ttml' | 'itt' | 'csv' | 'vtt' | 'json-captions' | 'pre-segment-txt';
export interface SubtitlesOptions {
    words: Word[] | string;
    type: SubtitlesType;
    numberOfCharPerLine?: number;
}
export type SubtitlesType = 'premiere' | 'ttml' | 'itt' | 'srt' | 'vtt' | 'json' | 'csv' | 'pre-segment-txt' | 'txt';
export interface SubtitleLine {
    text: string;
    start: number;
    end: number;
}
export interface SubtitlesJson {
    ttml: string;
    premiere: string;
    itt: string;
    srt: string;
    vtt: string;
    json: SubtitleLine[];
}
export interface DigitalPaperEditData {
    words: Word[];
    speakers?: Array<{
        start: number;
        end: number;
        speaker: string;
    }>;
}
export interface DocxOptions {
    transcriptTitle?: string;
}
export interface TxtOptions {
    includeTimecodes?: boolean;
    includeSpeakers?: boolean;
}
export interface TxtSpeakersTimecodesOptions {
    includeTimecodes?: boolean;
    includeSpeakers?: boolean;
}
//# sourceMappingURL=types.d.ts.map