import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Play, ArrowRight, X } from 'lucide-react';
import { Activity } from '@/types/mood';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ActivityCardProps {
  activity: Activity;
  index?: number;
}

const categoryColors: Record<Activity['category'], string> = {
  meditation: 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
  workout: 'bg-red-500/20 text-red-600 dark:text-red-400',
  relaxation: 'bg-teal-500/20 text-teal-600 dark:text-teal-400',
  focus: 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
  social: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
  creative: 'bg-pink-500/20 text-pink-600 dark:text-pink-400',
};

export function ActivityCard({ activity, index = 0 }: ActivityCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStart = () => {
    if (activity.youtubeId) {
      setIsPlaying(true);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ x: 5 }}
        className="glass-card p-4 flex items-center gap-4 group cursor-pointer"
        onClick={handleStart}
      >
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl shrink-0">
          {activity.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground truncate">{activity.title}</h4>
          <p className="text-sm text-muted-foreground line-clamp-1">{activity.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {activity.duration}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${categoryColors[activity.category]}`}>
              {activity.category}
            </span>
          </div>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {activity.youtubeId ? <Play className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </Button>
      </motion.div>

      {/* YouTube Modal for Activities with Video */}
      <Dialog open={isPlaying} onOpenChange={setIsPlaying}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none">
          <div className="relative pt-[56.25%]">
            <button
              onClick={() => setIsPlaying(false)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <AnimatePresence>
              {isPlaying && activity.youtubeId && (
                <motion.iframe
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  src={`https://www.youtube.com/embed/${activity.youtubeId}?autoplay=1`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
