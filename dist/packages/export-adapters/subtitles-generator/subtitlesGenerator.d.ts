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
import type { SubtitlesOptions } from '../types';
declare function subtitlesComposer({ words, type, numberOfCharPerLine }: SubtitlesOptions): any;
export { textSegmentation, addLineBreakBetweenSentences, foldWords, divideIntoTwoLines, getTextFromWordsList, preSegmentText, ttmlGeneratorPremiere, ttmlGenerator, ittGenerator, srtGenerator, vttGenerator, csvGenerator, subtitlesComposer, };
export default subtitlesComposer;
//# sourceMappingURL=subtitlesGenerator.d.ts.map