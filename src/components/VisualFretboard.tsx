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
        <div className="flex gap-2 p-4">
          <div className="flex flex-col gap-2 items-end justify-start pt-8">
            {displayedStrings.map((openNote, stringIndex) => (
              <div key={stringIndex} className="h-12 flex items-center">
                <div className="text-foreground text-xs font-medium pr-2">
                  {openNote}
                </div>
              </div>
            ))}
          </div>

          {fretRange.map((fret, fretIndex) => (
            <div key={fret} className="flex flex-col gap-2 min-w-[48px]">
              <div className="h-6 flex items-center justify-center">
                {isFretMarked(fret) && (
                  <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-muted/50 text-muted-foreground text-[10px] font-medium">
                    {fret}
                  </div>
                )}
              </div>

              {displayedStrings.map((_, stringIndex) => {
                const { content, isActive } = getFretContent(stringIndex, fret);
                return (
                  <div
                    key={stringIndex}
                    className="relative h-12 flex items-center justify-center"
                  >
                    <div
                      className={`absolute left-0 right-0 h-[2px] ${
                        fret === 0 ? "bg-primary" : "bg-border"
                      }`}
                    />
                    <div
                      className={`absolute top-0 bottom-0 left-0 w-px bg-border ${
                        fretIndex === 0 ? "opacity-100" : "opacity-50"
                      }`}
                    />
                    {isActive && (
                      <div className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-lg">
                        {content}
                      </div>
                    )}
                  </div>
                );
              })}
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
