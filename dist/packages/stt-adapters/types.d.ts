export interface Word {
    start: number;
    end: number;
    confidence?: number;
    punct: string;
    word: string;
    text?: string;
    speaker?: string;
}
export interface SpeakerSegment {
    start: number;
    end: number;
    speaker: string;
}
export interface Paragraph {
    words: Word[];
    text: string[];
    speaker?: string;
}
export interface DraftJsContentBlock {
    text: string;
    type: string;
    data: {
        speaker: string;
        words: Word[];
        start: number;
    };
    entityRanges: EntityRange[];
}
export interface EntityRange {
    start: number;
    end: number;
    confidence?: number;
    text: string;
    offset: number;
    length: number;
    key: string;
}
export interface EntityMap {
    [key: string]: {
        type: string;
        mutability: string;
        data: any;
    };
}
export interface DraftJsContentBlock {
    text: string;
    type: string;
    data: {
        speaker: string;
        words: Word[];
        start: number;
    };
    entityRanges: EntityRange[];
}
export interface DraftJsTranscript {
    blocks: DraftJsContentBlock[];
    entityMap: EntityMap;
}
export interface BbcKaldiJson {
    retval?: {
        words: Word[];
        segmentation?: SpeakerSegment[];
    };
    words?: Word[];
    segmentation?: SpeakerSegment[];
}
export interface AutoEdit2Json {
    words: Word[];
    speakers?: SpeakerSegment[];
}
export interface SpeechmaticsJson {
    results: {
        alternatives: Array<{
            words: Array<{
                start_time: number;
                end_time: number;
                word: string;
                confidence?: number;
                speaker?: string;
            }>;
        }>;
    };
}
export interface AmazonTranscribeJson {
    results: {
        items: Array<{
            start_time: string;
            end_time: string;
            alternatives: Array<{
                content: string;
                confidence?: string;
            }>;
            type: string;
        }>;
        speaker_labels?: {
            segments: Array<{
                start_time: string;
                end_time: string;
                speaker_label: string;
                items: Array<{
                    start_time: string;
                    end_time: string;
                    speaker_label: string;
                }>;
            }>;
        };
    };
}
export interface IbmJson {
    results: Array<{
        alternatives: Array<{
            timestamps: Array<[string, number, number]>;
            transcript: string;
        }>;
    }>;
}
export interface DigitalPaperEditJson {
    words: Word[];
    speakers?: SpeakerSegment[];
}
export interface GoogleSttJson {
    results: Array<{
        alternatives: Array<{
            words: Array<{
                startTime: string;
                endTime: string;
                word: string;
                confidence?: number;
            }>;
        }>;
    }>;
}
export type SttJsonType = 'bbckaldi' | 'autoedit2' | 'speechmatics' | 'ibm' | 'draftjs' | 'amazontranscribe' | 'digitalpaperedit' | 'google-stt';
export type TranscriptData = BbcKaldiJson | AutoEdit2Json | SpeechmaticsJson | AmazonTranscribeJson | IbmJson | DigitalPaperEditJson | GoogleSttJson | DraftJsTranscript;
//# sourceMappingURL=types.d.ts.map