'use strict';
import tokenizer from 'sbd';
function textSegmentation(text, honorifics) {
    let optionalHonorifics = null;
    if (honorifics !== undefined) {
        optionalHonorifics = honorifics;
    }
    const options = {
        'newline_boundaries': true,
        'html_boundaries': false,
        'sanitize': false,
        'allowed_tags': false,
        //TODO: Here could open HONORIFICS file and pass them in here I think
        //abbreviations: list of abbreviations to override the original ones for use with other languages. Don't put dots in abbreviations.
        'abbreviations': optionalHonorifics
    };
    const sentences = tokenizer.sentences(text, options);
    const sentencesWithLineSpaces = sentences.join('\n');
    return sentencesWithLineSpaces;
}
export default textSegmentation;
//# sourceMappingURL=index.js.map