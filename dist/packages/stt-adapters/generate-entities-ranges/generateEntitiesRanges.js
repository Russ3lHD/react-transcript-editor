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
const generateEntitiesRanges = (words, wordAttributeName) => {
    let position = 0;
    return words.map((word) => {
        const wordText = String(word[wordAttributeName]);
        const result = {
            start: word.start,
            end: word.end,
            confidence: word.confidence,
            text: wordText,
            offset: position,
            length: wordText.length,
            key: Math.random()
                .toString(36)
                .substring(6),
        };
        // increase position counter - to determine word offset in paragraph
        position = position + wordText.length + 1;
        return result;
    });
};
export default generateEntitiesRanges;
//# sourceMappingURL=generateEntitiesRanges.js.map