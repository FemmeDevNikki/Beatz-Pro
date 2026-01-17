import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Sequencer } from "@/components/Sequencer";
import { useSequencer } from "@/hooks/use-sequencer";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Home() {
  const sequencer = useSequencer();
  const [currentBeatId, setCurrentBeatId] = useState<number | null>(null);
  const [activeTitle, setActiveTitle] = useState("Untitled Beat");

  const handleLoadBeat = (item: any) => {
    // Check if it's a lesson or a saved beat based on 'difficulty' field presence
    // In a real app, use a discriminated union or separate handlers
    
    // Parse grid data. 
    // If it's a beat from DB, grid is in `data.grid`.
    // If we seed lessons with grid data, handle that too.
    
    // For now assuming both shapes have `data: { grid: boolean[][] }`
    // If not, we'd fallback to empty.
    
    const loadedGrid = item.data?.grid;
    
    if (loadedGrid) {
      sequencer.loadGrid(loadedGrid, item.tempo || 120);
      
      // If it has difficulty, it's a lesson (read-only usually, so don't set ID)
      // If it's a user beat, set ID for updates
      if (item.difficulty) {
        setCurrentBeatId(null); // Treat lessons as templates (new save)
        setActiveTitle(`Lesson: ${item.title}`);
      } else {
        setCurrentBeatId(item.id);
        setActiveTitle(item.title);
      }
    }
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-72 h-full">
        <Sidebar onLoadBeat={handleLoadBeat} className="w-full h-full" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-sm z-10">
          <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            BeatMaker
          </span>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 border-r border-border bg-card">
              <Sidebar onLoadBeat={handleLoadBeat} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Ambient Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[100px]" />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 relative z-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto space-y-8"
          >
            <div className="text-center space-y-2 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{activeTitle}</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Create your rhythm. Click cells to toggle notes. Press play to listen.
              </p>
            </div>

            <Sequencer 
              sequencer={sequencer} 
              currentBeatId={currentBeatId}
              onSave={(title) => setActiveTitle(title)}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
