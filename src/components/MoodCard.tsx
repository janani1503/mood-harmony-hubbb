import { motion } from 'framer-motion';
import { Mood, moodEmojis, moodDescriptions } from '@/types/mood';
import { cn } from '@/lib/utils';

interface MoodCardProps {
  mood: Mood;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const moodGradients: Record<Mood, string> = {
  happy: 'from-amber-400 to-orange-500',
  sad: 'from-blue-400 to-indigo-500',
  stressed: 'from-red-400 to-rose-500',
  calm: 'from-teal-400 to-cyan-500',
  energetic: 'from-orange-400 to-red-500',
  anxious: 'from-yellow-400 to-amber-500',
  excited: 'from-pink-400 to-purple-500',
  tired: 'from-slate-400 to-gray-500',
  focused: 'from-blue-500 to-indigo-600',
  romantic: 'from-rose-400 to-pink-500',
};

export function MoodCard({ mood, isSelected, onClick, size = 'md' }: MoodCardProps) {
  const sizeClasses = {
    sm: 'w-16 h-16 sm:w-20 sm:h-20',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-28 h-28 sm:w-36 sm:h-36',
  };

  const textSizes = {
    sm: 'text-xl sm:text-2xl',
    md: 'text-3xl sm:text-4xl',
    lg: 'text-4xl sm:text-5xl',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'relative rounded-2xl flex flex-col items-center justify-center gap-1 sm:gap-2 transition-all duration-300',
        sizeClasses[size],
        isSelected
          ? `bg-gradient-to-br ${moodGradients[mood]} shadow-lg`
          : 'glass-card hover:border-primary/50'
      )}
    >
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          layoutId="mood-selected"
        />
      )}
      <span className={cn(textSizes[size])}>{moodEmojis[mood]}</span>
      <span className={cn(
        'text-[10px] sm:text-xs font-medium capitalize',
        isSelected ? 'text-white' : 'text-muted-foreground'
      )}>
        {mood}
      </span>
    </motion.button>
  );
}

interface MoodDisplayProps {
  mood: Mood;
  confidence?: number;
  showDescription?: boolean;
}

const moodDisplayGradients: Record<Mood, string> = moodGradients;

export function MoodDisplay({ mood, confidence, showDescription = true }: MoodDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-4"
    >
      <div className="relative inline-block">
        <motion.div
          className={cn(
            'w-32 h-32 rounded-full flex items-center justify-center text-6xl',
            `bg-gradient-to-br ${moodDisplayGradients[mood]}`
          )}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {moodEmojis[mood]}
        </motion.div>
        {confidence !== undefined && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-card px-3 py-1 rounded-full text-xs font-medium border border-border">
            {Math.round(confidence * 100)}% confident
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-display font-semibold capitalize">{mood}</h3>
        {showDescription && (
          <p className="text-muted-foreground mt-1">{moodDescriptions[mood]}</p>
        )}
      </div>
    </motion.div>
  );
}
