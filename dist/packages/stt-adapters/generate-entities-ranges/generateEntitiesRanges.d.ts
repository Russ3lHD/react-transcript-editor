import type { Word, EntityRange } from '../types';
/**
 * Helper function to generate draft.js entities,
 * see unit test for example data structure
 * it adds offset and length to recognise word in draftjs
 * @param words - List of words
 * @param wordAttributeName - eg 'punct' or 'text' or etc.
 * attribute for the word object containing the text. eg word ={ punct:'helo', ... }
 * or eg word ={ text:'helo', ... }
 * @returns Array of entity ranges
 */
declare const generateEntitiesRanges: (words: Word[], wordAttributeName: keyof Word) => EntityRange[];
export default generateEntitiesRanges;
//# sourceMappingURL=generateEntitiesRanges.d.ts.map