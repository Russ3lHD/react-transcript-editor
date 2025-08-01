import generateEntitiesRanges from '../generate-entities-ranges/index.js';
import groupWordsInParagraphsBySpeakers from './group-words-by-speakers.js';
/**
 * Groups words list from kaldi transcript based on punctuation.
 * @todo To be more accurate, should introduce an honorifics library to do the splitting of the words.
 * @param words - Array of word objects from kaldi transcript
 * @returns Array of paragraphs
 */
const groupWordsInParagraphs = (words) => {
    const results = [];
    let paragraph = { words: [], text: [] };
    words.forEach(word => {
        // if word contains punctuation
        if (/[.?!]/.test(word.punct)) {
            paragraph.words.push(word);
            paragraph.text.push(word.punct);
            results.push(paragraph);
            // reset paragraph
            paragraph = { words: [], text: [] };
        }
        else {
            paragraph.words.push(word);
            paragraph.text.push(word.punct);
        }
    });
    return results;
};
/**
 * Convert BBC Kaldi json to draftJs
 * @param bbcKaldiJson - BBC Kaldi JSON data
 * @returns Array of DraftJS content blocks
 */
const bbcKaldiToDraft = (bbcKaldiJson) => {
    const results = [];
    let tmpWords;
    let speakerSegmentation = null;
    let wordsByParagraphs = [];
    // BBC Octo Labs API Response wraps Kaldi response around retval,
    // while kaldi contains word attribute at root
    if (bbcKaldiJson.retval !== undefined) {
        tmpWords = bbcKaldiJson.retval.words;
        if (bbcKaldiJson.retval.segmentation !== undefined) {
            speakerSegmentation = bbcKaldiJson.retval.segmentation;
        }
    }
    else {
        tmpWords = bbcKaldiJson.words;
        if (bbcKaldiJson.segmentation !== undefined) {
            speakerSegmentation = bbcKaldiJson.segmentation;
        }
    }
    if (speakerSegmentation === null) {
        wordsByParagraphs = groupWordsInParagraphs(tmpWords);
    }
    else {
        wordsByParagraphs = groupWordsInParagraphsBySpeakers(tmpWords, speakerSegmentation);
    }
    wordsByParagraphs.forEach((paragraph, i) => {
        // if paragraph contain words
        // eg sometimes the speaker segmentation might not contain words :man-shrugging:
        if (paragraph.words[0] !== undefined) {
            let speakerLabel = `TBC ${i}`;
            if (speakerSegmentation !== null) {
                speakerLabel = paragraph.speaker || speakerLabel;
            }
            const draftJsContentBlockParagraph = {
                text: Array.isArray(paragraph.text) ? paragraph.text.join(' ') : paragraph.text,
                type: 'paragraph',
                data: {
                    speaker: speakerLabel,
                    words: paragraph.words,
                    start: paragraph.words[0].start,
                },
                // the entities as ranges are each word in the space-joined text,
                // so it needs to be compute for each the offset from the beginning of the paragraph and the length
                entityRanges: generateEntitiesRanges(paragraph.words, 'punct'), // wordAttributeName
            };
            results.push(draftJsContentBlockParagraph);
        }
    });
    return results;
};
export default bbcKaldiToDraft;
//# sourceMappingURL=bbcKaldiToDraft.js.map