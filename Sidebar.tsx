import { ScrollArea } from "@/components/ui/scroll-area";
import { useBeats, useDeleteBeat } from "@/hooks/use-beats";
import { useLessons } from "@/hooks/use-lessons";
import { cn } from "@/lib/utils";
import { Music2, BookOpen, Trash2, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface SidebarProps {
  onLoadBeat: (beat: any) => void;
  className?: string;
}

export function Sidebar({ onLoadBeat, className }: SidebarProps) {
  const { data: beats, isLoading: loadingBeats } = useBeats();
  const { data: lessons, isLoading: loadingLessons } = useLessons();
  const deleteBeat = useDeleteBeat();

  return (
    <div className={cn("flex flex-col h-full bg-card border-r border-border", className)}>
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          BeatMaker
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Start your journey</p>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-8 pb-8">
          {/* Lessons Section */}
          <section>
            <h2 className="flex items-center text-sm font-semibold text-foreground mb-4 px-2">
              <BookOpen className="w-4 h-4 mr-2 text-secondary" />
              Lessons
            </h2>
            <div className="space-y-2">
              {loadingLessons ? (
                Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl opacity-20" />
                ))
              ) : lessons?.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground border border-dashed border-border rounded-xl">
                  No lessons available yet.
                </div>
              ) : (
                lessons?.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="group relative p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer"
                    onClick={() => onLoadBeat(lesson)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
                          {lesson.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {lesson.description}
                        </p>
                      </div>
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full border",
                        lesson.difficulty === "Beginner" && "border-green-500/20 text-green-500",
                        lesson.difficulty === "Intermediate" && "border-yellow-500/20 text-yellow-500",
                        lesson.difficulty === "Advanced" && "border-red-500/20 text-red-500",
                      )}>
                        {lesson.difficulty}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Saved Beats Section */}
          <section>
            <h2 className="flex items-center text-sm font-semibold text-foreground mb-4 px-2">
              <Music2 className="w-4 h-4 mr-2 text-primary" />
              Your Beats
            </h2>
            <div className="space-y-2">
              {loadingBeats ? (
                Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-xl opacity-20" />
                ))
              ) : beats?.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground border border-dashed border-border rounded-xl">
                  Save your first beat to see it here!
                </div>
              ) : (
                beats?.map((beat) => (
                  <div
                    key={beat.id}
                    className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
                  >
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => onLoadBeat(beat)}
                    >
                      <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
                        {beat.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {beat.tempo} BPM
                      </p>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete "{beat.title}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteBeat.mutate(beat.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
}
