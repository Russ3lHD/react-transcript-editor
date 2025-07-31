import { shortTimecode } from '../../util/timecode-converter/index.js';

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
const draftToTxtSpeakersTimecodes = (blockData: BlockData): string => {
  const lines = blockData.blocks.map((block) => {
    return `${block.data.speaker} \t [${shortTimecode(block.data.start)}] \t ${block.text}`;
  });

  return lines.join('\n\n');
};

export default draftToTxtSpeakersTimecodes; 