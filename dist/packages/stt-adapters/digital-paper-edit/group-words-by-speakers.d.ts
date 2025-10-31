export default groupWordsInParagraphsBySpeakers;
/**
 edge cases
- more segments then words - not an issue if you start by matching words with segment
and handle edge case where it doesn't find a match
- more words then segments - orphan words?
*
* Takes in list of words and list of paragraphs (paragraphs have speakers info associated with it)
```js
{
  "words": [
    {
      "id": 0,
      "start": 13.02,
      "end": 13.17,
      "text": "There"
    },
    {
      "id": 1,
      "start": 13.17,
      "end": 13.38,
      "text": "is"
    },
    ...
    ],
  "paragraphs": [
    {
      "id": 0,
      "start": 13.02,
      "end": 13.86,
      "speaker": "TBC 00"
    },
    {
      "id": 1,
      "start": 13.86,
      "end": 19.58,
      "speaker": "TBC 1"
    },
    ...
  ]
}
```
*  and returns a list of words grouped into paragraphs, with words, text and speaker attribute
```js
[
  {
    "words": [
      {
        "id": 0,
        "start": 13.02,
        "end": 13.17,
        "text": "There"
      },
      {
        "id": 1,
        "start": 13.17,
        "end": 13.38,
        "text": "is"
      },
      {
        "id": 2,
        "start": 13.38,
        "end": 13.44,
        "text": "a"
      },
      {
        "id": 3,
        "start": 13.44,
        "end": 13.86,
        "text": "day."
      }
    ],
    "text": "There is a day.",
    "speaker": "TBC 00"
  },
  ...
  [
    {
        "confidence": 0.48,
        "created_at": "2025-10-14T22:28:23.354447",
        "end": 6.350968750000001,
        "end_time": 6350,
        "id": 6609,
        "index": 0,
        "language": "de",
        "media_file_id": 7,
        "segment_index": 0,
        "speaker_label": "SPEAKER_00",
        "start": 0.03096875,
        "start_time": 30,
        "text": "Und es wäre super, wenn du mir einmal bestätigen könntest, dass es in Ordnung ist, dass wir dich aufzeichnen.",
        "updated_at": "2025-10-14T22:28:23.354447",
        "words": [
            {
                "end": 0.37096875,
                "probability": 0.9111328125,
                "start": 0.03096875,
                "word": " Und"
            },
            {
                "end": 1.4109687499999999,
                "probability": 0.99853515625,
                "start": 0.37096875,
                "word": " es"
            },
            {
                "end": 1.59096875,
                "probability": 1.0,
                "start": 1.4109687499999999,
                "word": " wäre"
            },
            {
                "end": 1.87096875,
                "probability": 1.0,
                "start": 1.59096875,
                "word": " super,"
            },
            {
                "end": 2.07096875,
                "probability": 1.0,
                "start": 1.93096875,
                "word": " wenn"
            },
            {
                "end": 2.15096875,
                "probability": 0.99169921875,
                "start": 2.07096875,
                "word": " du"
            },
            {
                "end": 2.27096875,
                "probability": 1.0,
                "start": 2.15096875,
                "word": " mir"
            },
            {
                "end": 2.49096875,
                "probability": 0.99951171875,
                "start": 2.27096875,
                "word": " einmal"
            },
            {
                "end": 3.67096875,
                "probability": 1.0,
                "start": 2.49096875,
                "word": " bestätigen"
            },
            {
                "end": 4.1109687500000005,
                "probability": 1.0,
                "start": 3.67096875,
                "word": " könntest,"
            },
            {
                "end": 4.25096875,
                "probability": 1.0,
                "start": 4.1109687500000005,
                "word": " dass"
            },
            {
                "end": 4.350968750000001,
                "probability": 1.0,
                "start": 4.25096875,
                "word": " es"
            },
            {
                "end": 4.430968750000001,
                "probability": 1.0,
                "start": 4.350968750000001,
                "word": " in"
            },
            {
                "end": 4.810968750000001,
                "probability": 1.0,
                "start": 4.430968750000001,
                "word": " Ordnung"
            },
            {
                "end": 4.99096875,
                "probability": 1.0,
                "start": 4.810968750000001,
                "word": " ist,"
            },
            {
                "end": 5.21096875,
                "probability": 0.99609375,
                "start": 5.03096875,
                "word": " dass"
            },
            {
                "end": 5.41096875,
                "probability": 1.0,
                "start": 5.21096875,
                "word": " wir"
            },
            {
                "end": 5.6109687500000005,
                "probability": 1.0,
                "start": 5.41096875,
                "word": " dich"
            },
            {
                "end": 6.350968750000001,
                "probability": 0.9998372395833334,
                "start": 5.6109687500000005,
                "word": " aufzeichnen."
            }
        ]
    },
]
```
 */
declare function groupWordsInParagraphsBySpeakers(words: any, segments: any): {
    words: never[];
    text: string;
    speaker: string;
}[];
//# sourceMappingURL=group-words-by-speakers.d.ts.map