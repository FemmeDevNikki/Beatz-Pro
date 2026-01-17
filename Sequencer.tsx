import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Play, Square, RefreshCcw, Save, Trash2, Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useSequencer } from "@/hooks/use-sequencer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useCreateBeat, useUpdateBeat } from "@/hooks/use-beats";

interface SequencerProps {
  sequencer: ReturnType<typeof useSequencer>;
  currentBeatId?: number | null;
  onSave?: (title: string) => void;
}

export function Sequencer({ sequencer, currentBeatId, onSave }: SequencerProps) {
  const {
    grid,
    toggleStep,
    currentStep,
    isPlaying,
    togglePlay,
    bpm,
    setBpm,
    clearGrid,
    instrumentNames,
  } = sequencer;

  const [saveTitle, setSaveTitle] = useState("");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const createBeat = useCreateBeat();
  const updateBeat = useUpdateBeat();

  const handleSave = async () => {
    if (currentBeatId) {
      // Update existing
      updateBeat.mutate({
        id: currentBeatId,
        data: { grid },
        tempo: bpm,
      });
    } else {
      // Create new
      if (!saveTitle) return;
      createBeat.mutate(
        {
          title: saveTitle,
          data: { grid },
          tempo: bpm,
          isCustom: true,
        },
        {
          onSuccess: () => setSaveDialogOpen(false),
        }
      );
    }
    if (onSave) onSave(saveTitle);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 rounded-3xl bg-card border border-border shadow-2xl space-y-8">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button
            size="lg"
            onClick={togglePlay}
            className={cn(
              "w-16 h-16 rounded-full transition-all duration-300 shadow-lg",
              isPlaying
                ? "bg-destructive hover:bg-destructive/90 shadow-destructive/20"
                : "bg-primary hover:bg-primary/90 shadow-primary/20 hover:scale-105"
            )}
          >
            {isPlaying ? (
              <Square className="fill-current w-6 h-6" />
            ) : (
              <Play className="fill-current w-8 h-8 ml-1" />
            )}
          </Button>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-widest">
              Tempo
              <span className="text-primary font-mono text-base">{bpm} BPM</span>
            </div>
            <Slider
              value={[bpm]}
              onValueChange={(vals) => setBpm(vals[0])}
              min={60}
              max={180}
              step={1}
              className="w-48"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={clearGrid}
            className="border-muted-foreground/20 hover:border-destructive/50 hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
          
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10">
                <Save className="w-4 h-4 mr-2" />
                {currentBeatId ? "Update Beat" : "Save Beat"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save your masterpiece</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Input
                  placeholder="Enter beat title..."
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                  className="bg-secondary/10 border-secondary/20"
                />
              </div>
              <DialogFooter>
                <Button onClick={handleSave} disabled={!saveTitle && !currentBeatId}>
                  {createBeat.isPending || updateBeat.isPending ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Sequencer Grid */}
      <div className="bg-background/50 rounded-2xl p-6 border border-border/50 shadow-inner overflow-x-auto">
        <div className="min-w-[800px] grid gap-4">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-4">
              {/* Instrument Label */}
              <div className="w-32 flex items-center justify-end gap-3 text-sm font-medium text-muted-foreground">
                {instrumentNames[rowIndex]}
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                  <Volume2 className="w-4 h-4" />
                </div>
              </div>

              {/* Steps */}
              <div className="flex-1 grid grid-cols-16 gap-1.5">
                {row.map((active, stepIndex) => {
                  const isCurrent = currentStep === stepIndex;
                  const isBeat = stepIndex % 4 === 0;
                  
                  return (
                    <motion.button
                      key={stepIndex}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleStep(rowIndex, stepIndex)}
                      className={cn(
                        "aspect-square rounded-md transition-all duration-100 relative",
                        active
                          ? "bg-primary shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                          : "bg-muted/40 hover:bg-muted/80",
                        isCurrent && !active && "bg-white/10 ring-1 ring-white/20",
                        isCurrent && active && "brightness-125 scale-110 ring-2 ring-white/50",
                        isBeat && !active && "bg-muted/60"
                      )}
                    >
                      {/* Step Indicator Dot */}
                      {isBeat && !active && (
                        <div className="absolute inset-0 m-auto w-1 h-1 rounded-full bg-white/10" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        {/* Step Numbers */}
        <div className="flex items-center gap-4 mt-2">
          <div className="w-32" /> {/* Spacer for labels */}
          <div className="flex-1 grid grid-cols-16 gap-1.5">
            {Array.from({ length: 16 }).map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "text-[10px] text-center font-mono transition-colors duration-200",
                  currentStep === i ? "text-primary font-bold" : "text-muted-foreground/30"
                )}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
