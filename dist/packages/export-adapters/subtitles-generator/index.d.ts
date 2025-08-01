export default subtitlesComposer;
import textSegmentation from './presegment-text/text-segmentation/index.js';
import addLineBreakBetweenSentences from './presegment-text/line-break-between-sentences/index.js';
import foldWords from './presegment-text/fold/index.js';
import divideIntoTwoLines from './presegment-text/divide-into-two-lines/index.js';
import { getTextFromWordsList } from './presegment-text/index.js';
import preSegmentText from './presegment-text/index.js';
import ttmlGeneratorPremiere from './compose-subtitles/premiere.js';
import ttmlGenerator from './compose-subtitles/ttml.js';
import ittGenerator from './compose-subtitles/itt.js';
import srtGenerator from './compose-subtitles/srt.js';
import vttGenerator from './compose-subtitles/vtt.js';
declare function subtitlesComposer({ words, type, numberOfCharPerLine }: {
    words: any;
    type: any;
    numberOfCharPerLine: any;
}): any;
export { textSegmentation, addLineBreakBetweenSentences, foldWords, divideIntoTwoLines, getTextFromWordsList, preSegmentText, ttmlGeneratorPremiere, ttmlGenerator, ittGenerator, srtGenerator, vttGenerator };
//# sourceMappingURL=index.d.ts.map