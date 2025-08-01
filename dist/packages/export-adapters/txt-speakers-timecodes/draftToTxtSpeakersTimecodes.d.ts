import type { BlockData } from '../types';
/**
 * Convert DraftJS to plain text with timecodes and speaker names
 *
 * Example:
 ```
 F_S12 	 [00:00:13] 	 There is a day. About ten years ago when I asked a friend to hold a baby dinosaur robot upside down. It was a toy called plea. All
 ```
 *
 * @param blockData - DraftJS blocks data
 * @returns Formatted text with speakers and timecodes
 */
declare const draftToTxtSpeakersTimecodes: (blockData: BlockData) => string;
export default draftToTxtSpeakersTimecodes;
//# sourceMappingURL=draftToTxtSpeakersTimecodes.d.ts.map