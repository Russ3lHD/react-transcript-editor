const asNumber = value => {
  if (value === undefined || value === null) {
    return undefined;
  }

  const num = typeof value === 'string' ? parseFloat(value) : value;
  return Number.isFinite(num) ? num : undefined;
};

const normaliseWord = (word, fallbackSpeaker) => {
  const text = (word.punct ?? word.text ?? word.word ?? '').toString().trim();

  return {
    word: text,
    start: asNumber(word.start) ?? 0,
    end: asNumber(word.end) ?? asNumber(word.start) ?? 0,
    probability: asNumber(word.probability) ?? asNumber(word.confidence),
    confidence: asNumber(word.confidence),
    speaker: word.speaker ?? fallbackSpeaker
  };
};

const computeSegmentConfidence = words => {
  const confidences = words
    .map(word => asNumber(word.confidence) ?? asNumber(word.probability))
    .filter(value => value !== undefined);

  if (!confidences.length) {
    return undefined;
  }

  const sum = confidences.reduce((acc, value) => acc + value, 0);
  return sum / confidences.length;
};

const draftToWhisper = blockData => {
  const segments = blockData.blocks || [];

  return segments
    .map((block, index) => {
      if (!block) {
        return null;
      }

      const speakerValue = block.data?.speaker;
      const speakerLabel =
        speakerValue === undefined || speakerValue === null
          ? ''
          : speakerValue.toString().trim();
      const resolvedSpeaker =
        speakerLabel.length > 0 ? speakerLabel : `TBC ${index}`;

      const wordsArray = Array.isArray(block.data?.words)
        ? block.data.words
        : [];

      const normalisedWords = wordsArray
        .map(word => normaliseWord(word, resolvedSpeaker))
        .filter(word => word.word.length > 0);

      const start =
        (normalisedWords[0] && asNumber(normalisedWords[0].start)) || 0;
      const end =
        (normalisedWords[normalisedWords.length - 1] &&
          asNumber(normalisedWords[normalisedWords.length - 1].end)) ||
        start;

      const derivedText = normalisedWords
        .map(word => word.word)
        .filter(Boolean)
        .join(' ')
        .trim();
      const text = block.text && block.text.trim().length > 0
        ? block.text.trim()
        : derivedText;

      if (!text && !normalisedWords.length) {
        return null;
      }

      return {
        id: index,
        segment_index: index,
        start,
        end,
        text,
        speaker_label: resolvedSpeaker,
        confidence: computeSegmentConfidence(normalisedWords),
        words: normalisedWords
      };
    })
    .filter(Boolean);
};

export default draftToWhisper;
