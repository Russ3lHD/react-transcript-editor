import generateEntitiesRanges from '../generate-entities-ranges/generateEntitiesRanges';
import { groupWordsBySpeaker } from './group-words-by-speakers';

import type {
  AmazonTranscribeJson,
  Word,
  DraftJsContentBlock,
} from '../types';

export const stripLeadingSpace = (word: string): string => {
  return word.replace(/^\s/, '');
};

/**
 * Get the best alternative for a word based on confidence
 * @param word - Word object from Amazon Transcribe
 * @returns Best alternative with highest confidence
 */
export const getBestAlternativeForWord = (word: any) => {
  if (/punctuation/.test(word.type)) {
    return Object.assign(word.alternatives[0], { confidence: 1 }); // Transcribe doesn't provide a confidence for punctuation
  }
  const wordWithHighestConfidence = word.alternatives.reduce((prev: any, current: any) => {
    return parseFloat(prev.confidence) > parseFloat(current.confidence) ? prev : current;
  });

  return wordWithHighestConfidence;
};

/**
 * Normalizes words so they can be used in
 * the generic generateEntitiesRanges() method
 */
const normalizeWord = (currentWord: any): Word => {
  const bestAlternative = getBestAlternativeForWord(currentWord);

  return {
    start: parseFloat(currentWord.start_time),
    end: parseFloat(currentWord.end_time),
    text: bestAlternative.content,
    confidence: parseFloat(bestAlternative.confidence),
    punct: bestAlternative.content,
    word: bestAlternative.content,
  };
};

export const appendPunctuationToPreviousWord = (punctuation: any, previousWord: any) => {
  const punctuationContent = punctuation.alternatives[0].content;

  return {
    ...previousWord,
    alternatives: previousWord.alternatives.map((w: any) => ({
      ...w,
      content: w.content + stripLeadingSpace(punctuationContent),
    })),
  };
};

export const mapPunctuationItemsToWords = (words: any[]) => {
  const itemsToRemove: number[] = [];
  const dirtyArray = words.map((word, index) => {
    let previousWord = {};
    if (word.type === 'punctuation') {
      itemsToRemove.push(index - 1);
      previousWord = words[index - 1];

      return appendPunctuationToPreviousWord(word, previousWord);
    } else {
      return word;
    }
  });

  return dirtyArray.filter((item, index) => {
    return !itemsToRemove.includes(index);
  });
};

/**
 * Groups words list from amazon transcribe transcript based on punctuation.
 * @todo To be more accurate, should introduce an honorifics library to do the splitting of the words.
 * @param words - Array of word objects from Amazon Transcribe transcript
 */
const groupWordsInParagraphs = (words: any[]) => {
  const results: any[] = [];
  let paragraph: { words: Word[]; text: string[] } = {
    words: [],
    text: [],
  };
  
  words.forEach((word) => {
    const content = getBestAlternativeForWord(word).content;
    const normalizedWord = normalizeWord(word);
    if (/[.?!]/.test(content)) {
      paragraph.words.push(normalizedWord);
      paragraph.text.push(content);
      results.push(paragraph);
      // reset paragraph
      paragraph = { words: [], text: [] };
    } else {
      paragraph.words.push(normalizedWord);
      paragraph.text.push(content);
    }
  });

  return results;
};

/**
 * Converts AWS Transcribe Json to DraftJs
 * @param amazonTranscribeJson - Amazon Transcribe JSON data
 * @returns Array of DraftJS content blocks
 */
const amazonTranscribeToDraft = (amazonTranscribeJson: AmazonTranscribeJson): DraftJsContentBlock[] => {
  const results: DraftJsContentBlock[] = [];
  const items = amazonTranscribeJson.results.items;
  const speakerLabels = amazonTranscribeJson.results.speaker_labels;

  // Map punctuation items to words
  const wordsWithPunctuation = mapPunctuationItemsToWords(items);

  let wordsByParagraphs: any[] = [];

  if (speakerLabels) {
    wordsByParagraphs = groupWordsBySpeaker(wordsWithPunctuation, speakerLabels);
  } else {
    wordsByParagraphs = groupWordsInParagraphs(wordsWithPunctuation);
  }

  wordsByParagraphs.forEach((paragraph, i) => {
    if (paragraph.words[0] !== undefined) {
      let speakerLabel = `TBC ${i}`;
      if (speakerLabels) {
        speakerLabel = paragraph.speaker || speakerLabel;
      }

      const draftJsContentBlockParagraph: DraftJsContentBlock = {
        text: paragraph.text.join(' '),
        type: 'paragraph',
        data: {
          speaker: speakerLabel,
          words: paragraph.words,
          start: paragraph.words[0].start,
        },
        entityRanges: generateEntitiesRanges(paragraph.words, 'text'),
      };
      results.push(draftJsContentBlockParagraph);
    }
  });

  return results;
};

export default amazonTranscribeToDraft; 