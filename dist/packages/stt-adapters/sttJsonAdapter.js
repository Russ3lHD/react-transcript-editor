import bbcKaldiToDraft from './bbc-kaldi/index';
import autoEdit2ToDraft from './autoEdit2/index';
import speechmaticsToDraft from './speechmatics/index';
import amazonTranscribeToDraft from './amazon-transcribe/index';
import ibmToDraft from './ibm/index';
import digitalPaperEditToDraft from './digital-paper-edit/index';
import createEntityMap from './create-entity-map/index';
import gcpSttToDraft from './google-stt/index';
/**
 * Adapters for STT conversion
 * @param transcriptData - A json transcript with some word accurate timecode
 * @param sttJsonType - the type of transcript supported by the available adapters
 * @returns DraftJs transcript format with blocks and entityMap
 */
const sttJsonAdapter = (transcriptData, sttJsonType) => {
    let blocks;
    try {
        switch (sttJsonType) {
            case 'bbckaldi':
                blocks = bbcKaldiToDraft(transcriptData);
                return { blocks, entityMap: createEntityMap(blocks) };
            case 'autoedit2':
                blocks = autoEdit2ToDraft(transcriptData);
                return { blocks, entityMap: createEntityMap(blocks) };
            case 'speechmatics':
                blocks = speechmaticsToDraft(transcriptData);
                return { blocks, entityMap: createEntityMap(blocks) };
            case 'ibm':
                blocks = ibmToDraft(transcriptData);
                return { blocks, entityMap: createEntityMap(blocks) };
            case 'draftjs':
                return transcriptData;
            case 'amazontranscribe':
                blocks = amazonTranscribeToDraft(transcriptData);
                return { blocks, entityMap: createEntityMap(blocks) };
            case 'digitalpaperedit':
                blocks = digitalPaperEditToDraft(transcriptData);
                return { blocks, entityMap: createEntityMap(blocks) };
            case 'google-stt':
                blocks = gcpSttToDraft(transcriptData);
                return { blocks, entityMap: createEntityMap(blocks) };
            default:
                console.error(`Unsupported STT engine: ${sttJsonType}`);
                return null;
        }
    }
    catch (error) {
        console.error(`Error processing ${sttJsonType} transcript:`, error);
        return null;
    }
};
export default sttJsonAdapter;
export { createEntityMap };
//# sourceMappingURL=sttJsonAdapter.js.map