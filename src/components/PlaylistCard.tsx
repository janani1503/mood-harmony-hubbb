import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Play, X, Pause } from 'lucide-react';
import { Playlist } from '@/types/mood';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PlaylistCardProps {
  playlist: Playlist;
  index?: number;
}

export function PlaylistCard({ playlist, index = 0 }: PlaylistCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (playlist.youtubeId) {
      setIsPlaying(true);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -5 }}
        className="glass-card overflow-hidden group cursor-pointer"
        onClick={handlePlay}
      >
        <div className="relative aspect-square overflow-hidden">
          <img
            src={playlist.imageUrl}
            alt={playlist.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0"
          >
            <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
          </motion.button>
        </div>
        <div className="p-4 space-y-2">
          <h4 className="font-semibold text-foreground truncate">{playlist.title}</h4>
          <p className="text-sm text-muted-foreground line-clamp-2">{playlist.description}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
            <span className="flex items-center gap-1">
              <Music className="w-3.5 h-3.5" />
              {playlist.trackCount} tracks
            </span>
          </div>
        </div>
      </motion.div>

      <Dialog open={isPlaying} onOpenChange={setIsPlaying}>
        <DialogContent 
          className="sm:max-w-[800px] p-0 overflow-hidden bg-background/95 backdrop-blur-xl border-border/50"
          aria-describedby="playlist-dialog-description"
        >
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <img src={playlist.imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="block">{playlist.title}</span>
                <span className="text-sm font-normal text-muted-foreground">{playlist.description}</span>
              </div>
            </DialogTitle>
            <p id="playlist-dialog-description" className="sr-only">
              Playing {playlist.title} - {playlist.description}
            </p>
          </DialogHeader>
          <div className="p-4">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
              {isPlaying && playlist.youtubeId && (
                <iframe
                  src={`https://www.youtube.com/embed/${playlist.youtubeId}?autoplay=1&rel=0`}
                  title={playlist.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
