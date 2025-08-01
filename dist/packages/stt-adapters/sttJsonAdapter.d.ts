import createEntityMap from './create-entity-map/index';
import type { TranscriptData, SttJsonType, DraftJsTranscript } from './types';
/**
 * Adapters for STT conversion
 * @param transcriptData - A json transcript with some word accurate timecode
 * @param sttJsonType - the type of transcript supported by the available adapters
 * @returns DraftJs transcript format with blocks and entityMap
 */
declare const sttJsonAdapter: (transcriptData: TranscriptData, sttJsonType: SttJsonType) => DraftJsTranscript | null;
export default sttJsonAdapter;
export { createEntityMap };
//# sourceMappingURL=sttJsonAdapter.d.ts.map