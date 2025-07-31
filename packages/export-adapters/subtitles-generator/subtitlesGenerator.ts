import textSegmentation from './presegment-text/text-segmentation/index.js';
import addLineBreakBetweenSentences from './presegment-text/line-break-between-sentences/index.js';
import foldWords from './presegment-text/fold/index.js';
import divideIntoTwoLines from './presegment-text/divide-into-two-lines/index.js';
import preSegmentText, { getTextFromWordsList } from './presegment-text/index.js';

import ttmlGeneratorPremiere from './compose-subtitles/premiere.js';
import ittGenerator from './compose-subtitles/itt.js';
import ttmlGenerator from './compose-subtitles/ttml.js';
import srtGenerator from './compose-subtitles/srt.js';
import vttGenerator from './compose-subtitles/vtt.js';
import csvGenerator from './compose-subtitles/csv.js';

import type { SubtitlesOptions, SubtitlesType, SubtitleLine } from '../types';
import type { Word } from '../../stt-adapters/types';

function segmentedTextToList(text: string): string[] {
  let result = text.split('\n\n');
  result = result.map(line => {
    return line.trim();
  });

  return result;
}

function countWords(text: string): number {
  return text
    .trim()
    .replace(/\n /g, '')
    .replace(/\n/g, ' ')
    .split(' ').length;
}

function addTimecodesToLines(wordsList: Word[], lines: string[]): SubtitleLine[] {
  let startWordCounter = 0;
  let endWordCounter = 0;
  const results = lines.map((line) => {
    endWordCounter += countWords(line);

    const jsonLine: SubtitleLine = { text: line.trim(), start: 0, end: 0 };
    jsonLine.start = wordsList[startWordCounter].start;
    jsonLine.end = wordsList[endWordCounter - 1].end;
    startWordCounter = endWordCounter;

    return jsonLine;
  });

  return results;
}

function preSegmentTextJson(wordsList: Word[], numberOfCharPerLine: number): SubtitleLine[] {
  const result = preSegmentText(wordsList, numberOfCharPerLine);
  const segmentedTextArray = segmentedTextToList(result);

  return addTimecodesToLines(wordsList, segmentedTextArray);
}

function subtitlesComposer({ words, type, numberOfCharPerLine }: SubtitlesOptions): any {
  const subtitlesJson = preSegmentTextJson(words as Word[], numberOfCharPerLine || 35);
  
  if (typeof words === 'string') {
    return preSegmentText(words, numberOfCharPerLine || 35);
  }
  
  switch (type) {
    case 'premiere':
      return ttmlGeneratorPremiere(subtitlesJson);
    case 'ttml':
      return ttmlGenerator(subtitlesJson);
    case 'itt':
      return ittGenerator(subtitlesJson);
    case 'srt':
      return srtGenerator(subtitlesJson);
    case 'vtt':
      return vttGenerator(subtitlesJson);
    case 'json':
      return subtitlesJson;
    case 'csv':
      return csvGenerator(subtitlesJson);
    case 'pre-segment-txt':
      return preSegmentText(words as Word[], numberOfCharPerLine || 35);
    case 'txt':
      return preSegmentText(words as Word[], numberOfCharPerLine || 35);
    default:
      return {
        ttml: ttmlGenerator(subtitlesJson),
        premiere: ttmlGeneratorPremiere(subtitlesJson),
        itt: ittGenerator(subtitlesJson),
        srt: srtGenerator(subtitlesJson),
        vtt: vttGenerator(subtitlesJson),
        json: subtitlesJson,
      };
  }
}

export {
  textSegmentation,
  addLineBreakBetweenSentences,
  foldWords,
  divideIntoTwoLines,
  getTextFromWordsList,
  preSegmentText,
  ttmlGeneratorPremiere,
  ttmlGenerator,
  ittGenerator,
  srtGenerator,
  vttGenerator,
  csvGenerator,
  subtitlesComposer,
};

export default subtitlesComposer; 