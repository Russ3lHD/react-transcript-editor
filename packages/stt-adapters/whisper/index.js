import generateEntitiesRanges from '../generate-entities-ranges/index.js';

const asNumber = value => {
  if (value === undefined || value === null) {
    return undefined;
  }

  const num = typeof value === 'string' ? parseFloat(value) : value;
  return Number.isFinite(num) ? num : undefined;
};

const normaliseWords = (segment, segmentIndex) => {
  if (Array.isArray(segment.words) && segment.words.length > 0) {
    return segment.words
      .map((word, index) => {
        const rawText = (word.word ?? word.text ?? '').toString().trim();
        if (!rawText) {
          return null;
        }

        const start =
          asNumber(word.start) ??
          asNumber(word.start_time) ??
          asNumber(segment.start);
        const end =
          asNumber(word.end) ??
          asNumber(word.end_time) ??
          start ??
          asNumber(segment.end);

        const confidence =
          asNumber(word.probability) ??
          asNumber(word.confidence) ??
          asNumber(segment.confidence);

        return {
          start: start ?? 0,
          end: end ?? start ?? 0,
          confidence: confidence ?? undefined,
          punct: rawText,
          word: rawText,
          text: rawText,
          speaker: word.speaker ?? word.speaker_label ?? segment.speaker_label
        };
      })
      .filter(Boolean);
  }

  const fallbackText = (segment.text ?? '').trim();
  if (!fallbackText) {
    return [];
  }

  const start = asNumber(segment.start) ?? 0;
  const end = asNumber(segment.end) ?? start;

  return [
    {
      start,
      end,
      confidence: asNumber(segment.confidence) ?? undefined,
      punct: fallbackText,
      word: fallbackText,
      text: fallbackText,
      speaker: segment.speaker_label ?? `TBC ${segmentIndex}`
    }
  ];
};

const extractSegments = whisperJson => {
  if (!whisperJson) {
    return [];
  }

  if (Array.isArray(whisperJson)) {
    return whisperJson;
  }

  if (Array.isArray(whisperJson.segments)) {
    return whisperJson.segments;
  }

  if (whisperJson.results && Array.isArray(whisperJson.results.segments)) {
    return whisperJson.results.segments;
  }

  return [];
};

const whisperToDraft = whisperJson => {
  const segments = extractSegments(whisperJson);

  const blocks = segments
    .map((segment, index) => {
      const words = normaliseWords(segment, index);
      if (!words.length) {
        return null;
      }

      const text = words.map(word => word.punct).join(' ').trim();
      const startTime = words[0].start ?? 0;
      const speakerLabel =
        (segment.speaker_label && segment.speaker_label.trim()) ||
        (words[0].speaker && words[0].speaker.trim()) ||
        `TBC ${index}`;

      return {
        text,
        type: 'paragraph',
        data: {
          speaker: speakerLabel,
          words,
          start: startTime
        },
        entityRanges: generateEntitiesRanges(words, 'punct')
      };
    })
    .filter(Boolean);

  // Merge consecutive blocks with the same speaker
  const mergedBlocks = [];
  for (let i = 0; i < blocks.length; i++) {
    const currentBlock = blocks[i];
    
    // If this is the first block or speaker changed, add it
    if (mergedBlocks.length === 0 || mergedBlocks[mergedBlocks.length - 1].data.speaker !== currentBlock.data.speaker) {
      mergedBlocks.push(currentBlock);
    } else {
      // Same speaker as previous block - merge them
      const previousBlock = mergedBlocks[mergedBlocks.length - 1];
      previousBlock.text = previousBlock.text + ' ' + currentBlock.text;
      previousBlock.data.words = [...previousBlock.data.words, ...currentBlock.data.words];
      previousBlock.entityRanges = generateEntitiesRanges(previousBlock.data.words, 'punct');
    }
  }

  return mergedBlocks;
};

export default whisperToDraft;
