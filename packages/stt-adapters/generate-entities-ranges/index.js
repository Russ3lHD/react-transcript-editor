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
let entityKeyCounter = 0;

const generateEntitiesRanges = (words, wordAttributeName) => {
  let position = 0;

  return words.map((word) => {
    const wordText = word[wordAttributeName] || '';
    const result = {
      start: parseFloat(word.start) || 0,
      end: parseFloat(word.end) || 0,
      confidence: word.confidence ? parseFloat(word.confidence) : undefined,
      text: wordText,
      offset: position,
      length: wordText.length,
      key: `entity_${entityKeyCounter++}`
    };
    // increase position counter - to determine word offset in paragraph
    position = position + wordText.length + 1;

    return result;
  });
};

export default generateEntitiesRanges;
