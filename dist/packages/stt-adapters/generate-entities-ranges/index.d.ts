export default generateEntitiesRanges;
/**
 * Helper function to generate draft.js entities,
 * see unit test for example data structure
 * it adds offset and length to recognise word in draftjs
 */
/**
*  @param {json} words  - List of words
*  @param {string} wordAttributeName - eg 'punct' or 'text' or etc.
* attribute for the word object containing the text. eg word ={ punct:'helo', ... }
*  or eg word ={ text:'helo', ... }
*/
declare function generateEntitiesRanges(words: json, wordAttributeName: string): any;
//# sourceMappingURL=index.d.ts.map