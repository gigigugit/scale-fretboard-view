import { indexToNote, FRET_MARKERS, INTERVAL_LABELS } from "@/lib/music-data";

interface FretboardProps {
  tuning: readonly string[];
  scaleNotes: number[];
  activeDegrees: boolean[];
  displayMode: "fret" | "note" | "interval";
  startFret: number;
  endFret: number;
  lowString: number;
  highString: number;
  maxFret: number;
}

export function VisualFretboard({
  tuning,
  scaleNotes,
  activeDegrees,
  displayMode,
  startFret,
  endFret,
  lowString,
  highString,
  maxFret,
}: FretboardProps) {
  const stringCount = tuning.length;
  const displayedStrings = tuning
    .slice(lowString - 1, highString)
    .reverse();
  const fretRange = Array.from(
    { length: endFret - startFret + 1 },
    (_, i) => startFret + i
  );

  const getFretContent = (
    stringIndex: number,
    fret: number
  ): { content: string; isActive: boolean } => {
    const reversedIndex = highString - 1 - stringIndex;
    const openNote = tuning[reversedIndex];
    const pitchIndex = tuning.indexOf(openNote);
    const fretNote = (pitchToIndex(openNote) + fret) % 12;

    const scaleIndex = scaleNotes.indexOf(fretNote);
    if (scaleIndex === -1 || !activeDegrees[scaleIndex]) {
      return { content: "", isActive: false };
    }

    let content = "";
    if (displayMode === "fret") {
      content = fret.toString();
    } else if (displayMode === "note") {
      content = indexToNote(fretNote);
    } else {
      content = INTERVAL_LABELS[scaleIndex] || "";
    }

    return { content, isActive: true };
  };

  const isFretMarked = (fret: number) => FRET_MARKERS.includes(fret);

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full">
        <div className="flex flex-col gap-1 p-6 bg-card rounded-lg border border-border">
          <div className="flex items-center mb-2">
            <div className="w-16 text-muted-foreground text-sm font-semibold">
              String
            </div>
            {fretRange.map((fret) => (
              <div
                key={fret}
                className="flex-1 min-w-[60px] text-center text-muted-foreground text-xs font-medium"
              >
                {isFretMarked(fret) && (
                  <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted/50 text-muted-foreground">
                    {fret}
                  </div>
                )}
              </div>
            ))}
          </div>

          {displayedStrings.map((openNote, stringIndex) => (
            <div key={stringIndex} className="flex items-center gap-2">
              <div className="w-16 text-foreground text-sm font-medium">
                {openNote}
              </div>
              <div className="flex-1 flex items-center border-t-2 border-border">
                {fretRange.map((fret) => {
                  const { content, isActive } = getFretContent(stringIndex, fret);
                  return (
                    <div
                      key={fret}
                      className="flex-1 min-w-[60px] flex items-center justify-center relative py-3"
                    >
                      <div
                        className={`absolute left-0 w-px h-full ${
                          fret === 0 ? "bg-primary" : "bg-border"
                        }`}
                      />
                      {isActive && (
                        <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-lg">
                          {content}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function pitchToIndex(note: string): number {
  const pitches: Record<string, number> = {
    C: 0,
    "C#": 1,
    Db: 1,
    D: 2,
    "D#": 3,
    Eb: 3,
    E: 4,
    F: 5,
    "F#": 6,
    Gb: 6,
    G: 7,
    "G#": 8,
    Ab: 8,
    A: 9,
    "A#": 10,
    Bb: 10,
    B: 11,
  };
  return pitches[note] ?? 0;
}
