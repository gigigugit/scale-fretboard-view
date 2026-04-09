import { useState, useMemo } from "react";
import { VisualFretboard } from "@/components/VisualFretboard";
import { TextOutput, generateTextForExport } from "@/components/TextOutput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { Copy, Download, ArrowCounterClockwise } from "@phosphor-icons/react";
import { toast } from "sonner";
import {
  INSTRUMENTS,
  SCALES,
  KEYS,
  ROMAN_NUMERALS,
  buildScale,
  InstrumentName,
  ScaleName,
} from "@/lib/music-data";

type DisplayMode = "fret" | "note" | "interval";

function App() {
  const [instrument, setInstrument] = useState<InstrumentName>("Guitar");
  const [tuningName, setTuningName] = useState("Standard");
  const [key, setKey] = useState("C");
  const [scale, setScale] = useState<ScaleName>("Major");
  const [displayMode, setDisplayMode] = useState<DisplayMode>("note");
  const [activeDegrees, setActiveDegrees] = useState<boolean[]>([
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ]);
  const [startFret, setStartFret] = useState(0);
  const [endFret, setEndFret] = useState(12);
  const [lowString, setLowString] = useState(1);
  const [highString, setHighString] = useState(6);
  const [maxFret, setMaxFret] = useState(18);

  const currentInstrument = INSTRUMENTS[instrument];
  const tuning = currentInstrument.tunings[tuningName as keyof typeof currentInstrument.tunings] || 
                 Object.values(currentInstrument.tunings)[0];
  const stringCount = tuning.length;

  const scaleNotes = useMemo(() => buildScale(key, scale), [key, scale]);
  const scaleLength = SCALES[scale].length;

  const handleInstrumentChange = (newInstrument: InstrumentName) => {
    setInstrument(newInstrument);
    const newInstrumentData = INSTRUMENTS[newInstrument];
    setTuningName(Object.keys(newInstrumentData.tunings)[0]);
    setMaxFret(newInstrumentData.defaultMaxFret);
    
    const newTuning = Object.values(newInstrumentData.tunings)[0];
    const newStringCount = newTuning.length;
    setLowString(1);
    setHighString(newStringCount);
  };

  const handleScaleChange = (newScale: ScaleName) => {
    setScale(newScale);
    const newScaleLength = SCALES[newScale].length;
    if (newScaleLength < 7) {
      setActiveDegrees((prev) =>
        prev.map((active, i) => (i < newScaleLength ? active : false))
      );
    }
  };

  const toggleDegree = (index: number) => {
    setActiveDegrees((prev) => {
      const newDegrees = [...prev];
      newDegrees[index] = !newDegrees[index];
      return newDegrees;
    });
  };

  const handleCopy = async () => {
    const text = generateTextForExport(
      tuning,
      scaleNotes,
      activeDegrees,
      displayMode,
      startFret,
      endFret,
      lowString,
      highString,
      instrument,
      tuningName,
      key,
      scale
    );
    
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleDownload = () => {
    const text = generateTextForExport(
      tuning,
      scaleNotes,
      activeDegrees,
      displayMode,
      startFret,
      endFret,
      lowString,
      highString,
      instrument,
      tuningName,
      key,
      scale
    );
    
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${key}_${scale}_${instrument}_fretboard.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  const handleReset = () => {
    setInstrument("Guitar");
    setTuningName("Standard");
    setKey("C");
    setScale("Major");
    setDisplayMode("note");
    setActiveDegrees([true, true, true, true, true, true, true]);
    setStartFret(0);
    setEndFret(12);
    setLowString(1);
    setHighString(6);
    setMaxFret(18);
    toast.info("Reset to defaults");
  };

  return (
    <div className="min-h-screen bg-background p-2 md:p-4">
      <Toaster />
      <div className="max-w-[1600px] mx-auto space-y-3">
        <header className="text-center space-y-1 py-2">
          <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
            Scale Fretboard Viewer
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            {key} {scale} | {instrument}: {tuningName}
          </p>
        </header>

        <Card>
          <CardContent className="p-3 md:p-4">
            <VisualFretboard
              tuning={tuning}
              scaleNotes={scaleNotes}
              activeDegrees={activeDegrees}
              displayMode={displayMode}
              startFret={startFret}
              endFret={endFret}
              lowString={lowString}
              highString={highString}
              maxFret={maxFret}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="space-y-1">
                <Label htmlFor="instrument" className="text-xs">Instrument</Label>
                <Select value={instrument} onValueChange={(v) => handleInstrumentChange(v as InstrumentName)}>
                  <SelectTrigger id="instrument" className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(INSTRUMENTS).map((inst) => (
                      <SelectItem key={inst} value={inst}>
                        {inst}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="tuning" className="text-xs">Tuning</Label>
                <Select value={tuningName} onValueChange={setTuningName}>
                  <SelectTrigger id="tuning" className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(currentInstrument.tunings).map((tuning) => (
                      <SelectItem key={tuning} value={tuning}>
                        {tuning}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="key" className="text-xs">Key</Label>
                <Select value={key} onValueChange={setKey}>
                  <SelectTrigger id="key" className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {KEYS.map((k) => (
                      <SelectItem key={k} value={k}>
                        {k}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="scale" className="text-xs">Scale</Label>
                <Select value={scale} onValueChange={(v) => handleScaleChange(v as ScaleName)}>
                  <SelectTrigger id="scale" className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(SCALES).map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="my-2" />

            <div className="space-y-2">
              <Label className="text-xs">Display Mode</Label>
              <div className="flex flex-wrap gap-1">
                <Button
                  variant={displayMode === "fret" ? "default" : "secondary"}
                  size="sm"
                  className="h-7 text-xs px-2"
                  onClick={() => setDisplayMode("fret")}
                >
                  Fret #
                </Button>
                <Button
                  variant={displayMode === "note" ? "default" : "secondary"}
                  size="sm"
                  className="h-7 text-xs px-2"
                  onClick={() => setDisplayMode("note")}
                >
                  Note
                </Button>
                <Button
                  variant={displayMode === "interval" ? "default" : "secondary"}
                  size="sm"
                  className="h-7 text-xs px-2"
                  onClick={() => setDisplayMode("interval")}
                >
                  Interval
                </Button>
              </div>
            </div>

            <Separator className="my-2" />

            <div className="space-y-2">
              <Label className="text-xs">Scale Degrees</Label>
              <div className="flex flex-wrap gap-2">
                {ROMAN_NUMERALS.map((numeral, index) => (
                  <div key={numeral} className="flex items-center space-x-1">
                    <Checkbox
                      id={`degree-${index}`}
                      checked={activeDegrees[index]}
                      onCheckedChange={() => toggleDegree(index)}
                      disabled={index >= scaleLength}
                      className="h-3 w-3"
                    />
                    <Label
                      htmlFor={`degree-${index}`}
                      className={`text-xs cursor-pointer ${index >= scaleLength ? "text-muted-foreground" : ""}`}
                    >
                      {numeral}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-2" />

            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              <div className="space-y-1">
                <Label htmlFor="start-fret" className="text-xs">Start</Label>
                <Input
                  id="start-fret"
                  type="number"
                  min={0}
                  max={maxFret}
                  value={startFret}
                  onChange={(e) => setStartFret(Math.max(0, Math.min(maxFret, parseInt(e.target.value) || 0)))}
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="end-fret" className="text-xs">End</Label>
                <Input
                  id="end-fret"
                  type="number"
                  min={0}
                  max={maxFret}
                  value={endFret}
                  onChange={(e) => setEndFret(Math.max(startFret, Math.min(maxFret, parseInt(e.target.value) || 0)))}
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="high-string" className="text-xs">High</Label>
                <Input
                  id="high-string"
                  type="number"
                  min={1}
                  max={stringCount}
                  value={highString}
                  onChange={(e) => setHighString(Math.max(lowString, Math.min(stringCount, parseInt(e.target.value) || 1)))}
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="low-string" className="text-xs">Low</Label>
                <Input
                  id="low-string"
                  type="number"
                  min={1}
                  max={stringCount}
                  value={lowString}
                  onChange={(e) => setLowString(Math.max(1, Math.min(highString, parseInt(e.target.value) || 1)))}
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="max-fret" className="text-xs">Max</Label>
                <Input
                  id="max-fret"
                  type="number"
                  min={12}
                  max={30}
                  value={maxFret}
                  onChange={(e) => setMaxFret(Math.max(12, Math.min(30, parseInt(e.target.value) || 18)))}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <Separator className="my-2" />

            <div className="flex flex-wrap gap-1">
              <Button onClick={handleCopy} variant="default" size="sm" className="h-7 text-xs">
                <Copy className="mr-1" size={14} />
                Copy
              </Button>
              <Button onClick={handleDownload} variant="default" size="sm" className="h-7 text-xs">
                <Download className="mr-1" size={14} />
                Download
              </Button>
              <Button onClick={handleReset} variant="secondary" size="sm" className="h-7 text-xs">
                <ArrowCounterClockwise className="mr-1" size={14} />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Text Output</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <TextOutput
              tuning={tuning}
              scaleNotes={scaleNotes}
              activeDegrees={activeDegrees}
              displayMode={displayMode}
              startFret={startFret}
              endFret={endFret}
              lowString={lowString}
              highString={highString}
              instrumentName={instrument}
              tuningName={tuningName}
              keyName={key}
              scaleName={scale}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
