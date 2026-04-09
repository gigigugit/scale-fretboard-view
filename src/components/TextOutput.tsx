import { indexToNote, INTERVAL_LABELS, FRET_MARKERS } from "@/lib/music-data";

interface TextOutputProps {
  tuning: readonly string[];
  scaleNotes: number[];
  activeDegrees: boolean[];
  displayMode: "fret" | "note" | "interval";
  startFret: number;
  endFret: number;
  lowString: number;
  highString: number;
  instrumentName: string;
  tuningName: string;
  keyName: string;
  scaleName: string;
}

export function TextOutput({
  tuning,
  scaleNotes,
  activeDegrees,
  displayMode,
  startFret,
  endFret,
  lowString,
  highString,
  instrumentName,
  tuningName,
  keyName,
  scaleName,
}: TextOutputProps) {
  const generateTextOutput = (): string => {
    const header = `${keyName} ${scaleName} | ${instrumentName}: ${tuningName} | Frets ${startFret}-${endFret}`;
    
    const displayedStrings = tuning
      .slice(lowString - 1, highString)
      .reverse();
    
    const fretRange = Array.from(
      { length: endFret - startFret + 1 },
      (_, i) => startFret + i
    );

    const getFretContent = (stringIndex: number, fret: number): string => {
      const reversedIndex = highString - 1 - stringIndex;
      const openNote = tuning[reversedIndex];
      const fretNote = (pitchToIndex(openNote) + fret) % 12;

      const scaleIndex = scaleNotes.indexOf(fretNote);
      if (scaleIndex === -1 || !activeDegrees[scaleIndex]) {
        return "--";
      }

      if (displayMode === "fret") {
        return fret.toString().padStart(2, " ");
      } else if (displayMode === "note") {
        return indexToNote(fretNote).padEnd(2, " ");
      } else {
        return (INTERVAL_LABELS[scaleIndex] || "").padStart(2, " ");
      }
    };

    const fretMarkerLine = "Fret: " + fretRange
      .map(f => {
        if (FRET_MARKERS.includes(f)) {
          return f.toString().padStart(3, " ");
        }
        return "   ";
      })
      .join("");

    const divider = "━".repeat(6 + fretRange.length * 3);

    const stringLines = displayedStrings.map((openNote, stringIndex) => {
      const stringLabel = openNote.padEnd(4, " ");
      const fretData = fretRange
        .map(fret => getFretContent(stringIndex, fret))
        .map(content => content.padStart(3, " "))
        .join("");
      return stringLabel + "│" + fretData;
    });

    return [header, fretMarkerLine, divider, ...stringLines].join("\n");
  };

  const textContent = generateTextOutput();

  return (
    <div className="w-full">
      <pre className="font-mono text-[10px] md:text-xs text-foreground bg-secondary/30 p-3 md:p-4 rounded-lg border border-border overflow-x-auto whitespace-pre">
        {textContent}
      </pre>
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

export function generateTextForExport(
  tuning: readonly string[],
  scaleNotes: number[],
  activeDegrees: boolean[],
  displayMode: "fret" | "note" | "interval",
  startFret: number,
  endFret: number,
  lowString: number,
  highString: number,
  instrumentName: string,
  tuningName: string,
  keyName: string,
  scaleName: string
): string {
  const header = `${keyName} ${scaleName} | ${instrumentName}: ${tuningName} | Frets ${startFret}-${endFret}`;
  
  const displayedStrings = tuning
    .slice(lowString - 1, highString)
    .reverse();
  
  const fretRange = Array.from(
    { length: endFret - startFret + 1 },
    (_, i) => startFret + i
  );

  const getFretContent = (stringIndex: number, fret: number): string => {
    const reversedIndex = highString - 1 - stringIndex;
    const openNote = tuning[reversedIndex];
    const fretNote = (pitchToIndex(openNote) + fret) % 12;

    const scaleIndex = scaleNotes.indexOf(fretNote);
    if (scaleIndex === -1 || !activeDegrees[scaleIndex]) {
      return "--";
    }

    if (displayMode === "fret") {
      return fret.toString().padStart(2, " ");
    } else if (displayMode === "note") {
      return indexToNote(fretNote).padEnd(2, " ");
    } else {
      return (INTERVAL_LABELS[scaleIndex] || "").padStart(2, " ");
    }
  };

  const fretMarkerLine = "Fret: " + fretRange
    .map(f => {
      if (FRET_MARKERS.includes(f)) {
        return f.toString().padStart(3, " ");
      }
      return "   ";
    })
    .join("");

  const divider = "━".repeat(6 + fretRange.length * 3);

  const stringLines = displayedStrings.map((openNote, stringIndex) => {
    const stringLabel = openNote.padEnd(4, " ");
    const fretData = fretRange
      .map(fret => getFretContent(stringIndex, fret))
      .map(content => content.padStart(3, " "))
      .join("");
    return stringLabel + "│" + fretData;
  });

  return [header, fretMarkerLine, divider, ...stringLines].join("\n");
}
