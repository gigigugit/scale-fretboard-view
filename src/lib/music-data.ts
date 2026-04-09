export const DISPLAY_NOTES = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];

export const PITCH_TO_INDEX: Record<string, number> = {
  "C": 0,
  "C#": 1,
  "Db": 1,
  "D": 2,
  "D#": 3,
  "Eb": 3,
  "E": 4,
  "F": 5,
  "F#": 6,
  "Gb": 6,
  "G": 7,
  "G#": 8,
  "Ab": 8,
  "A": 9,
  "A#": 10,
  "Bb": 10,
  "B": 11,
};

export const SCALES = {
  "Major": [0, 2, 4, 5, 7, 9, 11],
  "Minor": [0, 2, 3, 5, 7, 8, 10],
  "Pentatonic Major": [0, 2, 4, 7, 9],
  "Pentatonic Minor": [0, 3, 5, 7, 10],
} as const;

export type ScaleName = keyof typeof SCALES;

export const INSTRUMENTS = {
  "Guitar": {
    tunings: {
      "Standard": ["E", "A", "D", "G", "B", "E"],
      "Drop D": ["D", "A", "D", "G", "B", "E"],
      "Open G": ["D", "G", "D", "G", "B", "D"],
    },
    defaultMaxFret: 18,
  },
  "Banjo": {
    tunings: {
      "Standard": ["G", "D", "G", "B", "D"],
    },
    defaultMaxFret: 22,
  },
} as const;

export type InstrumentName = keyof typeof INSTRUMENTS;
export type TuningName<T extends InstrumentName> = keyof typeof INSTRUMENTS[T]["tunings"];

export const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII"];
export const INTERVAL_LABELS = ["1", "2", "3", "4", "5", "6", "7"];

export const FRET_MARKERS = [0, 1, 3, 5, 7, 9, 12, 15, 17];

export const KEYS = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];

export function pitchToIndex(note: string): number {
  return PITCH_TO_INDEX[note] ?? 0;
}

export function indexToNote(index: number): string {
  return DISPLAY_NOTES[((index % 12) + 12) % 12];
}

export function buildScale(rootNote: string, scaleName: ScaleName): number[] {
  const rootIndex = pitchToIndex(rootNote);
  const intervals = SCALES[scaleName];
  return intervals.map(interval => (rootIndex + interval) % 12);
}

export function getFretNote(openStringNote: string, fret: number): number {
  const openIndex = pitchToIndex(openStringNote);
  return (openIndex + fret) % 12;
}
