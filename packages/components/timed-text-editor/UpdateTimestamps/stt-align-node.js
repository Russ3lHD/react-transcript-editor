// code obtained from https://github.com/bbc/stt-align-node

import { toWords } from 'number-to-words';
import difflib from 'difflib';

/**
 * https://stackoverflow.com/questions/175739/built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
 * @param {*}  num
 * @return {boolean} - if it's a number true, if it's not false.
 */
function isANumber(num) {
  return !isNaN(num);
}

function removeTrailingPunctuation(str) {
  return str.replace(/\.$/, '');
}

/**
 * removes capitalization, punctuation and converts numbers to letters
 * @param {string} wordText - word text
 * @return {string}
 * handles edge case if word is undefined, and returns undefined in that instance
 */
function normaliseWord(wordText) {
  if (wordText) {
    const wordTextResult = wordText.toLowerCase().trim().replace(/[^a-z|0-9|.]+/g, '');
    if (isANumber(wordTextResult)) {
      const sanitizedWord = removeTrailingPunctuation(wordTextResult);
      if (sanitizedWord !== '') {
        return toWords(sanitizedWord);
      }
    }

    return wordTextResult;
  } else {
    return wordText;
  }
}

// using neighboring words to set missing start and end time when present
function interpolationOptimization(wordsList) {
  return wordsList.map((word, index) => {
    let wordTmp = word;
    // setting the start time of each unmatched word to the previous word’s end time - when present
    // does not first element in list edge case

    if (('start' in word) && (index !== 0)) {
      const previousWord = wordsList[index - 1];
      if ('end' in previousWord) {
        wordTmp = {
          start: previousWord.end,
          end: word.end,
          word: word.word
        };
      }
    }
    // TODO: handle first item ?
    // setting the end time of each unmatched word to the next word’s start time - when present
    // does handle last element in list edge case
    if (('end' in word) && (index !== (wordsList.length - 1))) {
      const nextWord = wordsList[index + 1];
      if ('start' in nextWord) {
        wordTmp = {
          end: nextWord.start,
          start: word.start,
          word: word.word
        };
      }
    }

    // TODO: handle last item ?
    return wordTmp;
  });
}

// after the interpolation, some words have overlapping timecodes.
// the end time of the previous word is greater then the start of the current word
// altho negligible when using in a transcript editor context
// we want to avoid this, coz it causes issues when using the time of the words to generate
// auto segmented captions. As it results in sentence
// boundaries overlapping on screen during playback
function adjustTimecodesBoundaries(words) {

  return words.map((word, index, arr) => {
    // excluding first element
    if (index != 0 ) {
      const previousWord = arr[index - 1];
      const currentWord = word;
      if (previousWord.end > currentWord.start) {
        word.start = previousWord.end;
      }

      return word;
    }

    return word;
  });
}

// Simple linear interpolation function to replace everpolate
function linearInterpolate(x, xValues, yValues) {
  const result = [];
  
  for (let i = 0; i < x.length; i++) {
    const targetX = x[i];
    
    // Find the two closest points
    let leftIndex = -1;
    let rightIndex = -1;
    
    for (let j = 0; j < xValues.length; j++) {
      if (xValues[j] <= targetX) {
        leftIndex = j;
      } else {
        rightIndex = j;
        break;
      }
    }
    
    // Handle edge cases
    if (leftIndex === -1) {
      // Target is before all known points, use the first point
      result.push(yValues[0]);
    } else if (rightIndex === -1) {
      // Target is after all known points, use the last point
      result.push(yValues[yValues.length - 1]);
    } else {
      // Linear interpolation between two points
      const x1 = xValues[leftIndex];
      const y1 = yValues[leftIndex];
      const x2 = xValues[rightIndex];
      const y2 = yValues[rightIndex];
      
      const slope = (y2 - y1) / (x2 - x1);
      const interpolatedY = y1 + slope * (targetX - x1);
      result.push(interpolatedY);
    }
  }
  
  return result;
}

function interpolate(wordsList) {
  const indicies = [ ...Array(wordsList.length).keys() ];
  const indiciesWithStart = [];
  const indiciesWithEnd = [];
  const startTimes = [];
  const endTimes = [];

  wordsList.forEach((word, index) => {
    if ('start' in word) {
      indiciesWithStart.push(index);
      startTimes.push(word.start);
    }

    if ('end' in word) {
      indiciesWithEnd.push(index);
      endTimes.push(word.end);
    }
  });
  
  // Use our custom linear interpolation instead of everpolate
  const outStartTimes = linearInterpolate(indicies, indiciesWithStart, startTimes);
  const outEndTimes = linearInterpolate(indicies, indiciesWithEnd, endTimes);
  
  const wordsResults = wordsList.map((word, index) => {
    if (!('start' in word)) {
      word.start = outStartTimes[index];
    }
    if (!('end' in word)) {
      word.end = outEndTimes[index];
    }

    return word;
  });

  return adjustTimecodesBoundaries(wordsResults);
}

/**
 *
 * @param {array} sttWords - array of STT words
 * @param {array} transcriptWords - array of base text accurate words
 */
function alignWords(sttWords, transcriptWords) {
  // # convert words to lowercase and remove numbers and special characters
  const sttWordsStripped = sttWords.map((word) => {
    return normaliseWord(word.word);
  });

  const transcriptWordsStripped = transcriptWords.map((word) => {
    return normaliseWord(word);
  });
  // # create empty list to receive data
  const transcriptData = [];
  // empty objects as place holder
  transcriptWords.forEach(() => {
    transcriptData.push({});
  });
  // # populate transcriptData with matching words
  // // if they are same length, just interpolate words ?
  // http://qiao.github.io/difflib.js/
  const matcher = new difflib.SequenceMatcher(null, sttWordsStripped, transcriptWordsStripped);
  const opCodes = matcher.getOpcodes();

  opCodes.forEach((opCode) => {
    const matchType = opCode[0];
    const sttStartIndex = opCode[1];
    const sttEndIndex = opCode[2];
    const baseTextStartIndex = opCode[3];

    if (matchType === 'equal' ) {
      // slice does not not include the end - hence +1
      const sttDataSegment = sttWords.slice(sttStartIndex, sttEndIndex);
      transcriptData.splice(baseTextStartIndex, sttDataSegment.length, ...sttDataSegment);
    }

    transcriptData.forEach((wordObject, index) => {
      wordObject.word = transcriptWords[index];
    });
    // # replace words with originals
  });

  // # fill in missing timestamps
  return interpolate(transcriptData);
}

export default alignWords;
