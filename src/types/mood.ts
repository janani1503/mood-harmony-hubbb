export type Mood = 'happy' | 'sad' | 'stressed' | 'calm' | 'energetic' | 'anxious' | 'excited' | 'tired' | 'focused' | 'romantic';

export type Language = 'english' | 'tamil' | 'hindi' | 'all';

export interface MoodData {
  mood: Mood;
  confidence: number;
  timestamp: Date;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: 'meditation' | 'workout' | 'relaxation' | 'focus' | 'social' | 'creative';
  icon: string;
  youtubeId?: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  trackCount: number;
  mood: Mood;
  youtubeId?: string;
  language: Language;
}

export interface MoodHistory {
  mood: Mood;
  timestamp: Date;
}

export const moodColors: Record<Mood, string> = {
  happy: 'mood-happy',
  sad: 'mood-sad',
  stressed: 'mood-stressed',
  calm: 'mood-calm',
  energetic: 'mood-energetic',
  anxious: 'mood-anxious',
  excited: 'mood-excited',
  tired: 'mood-tired',
  focused: 'mood-focused',
  romantic: 'mood-romantic',
};

export const moodEmojis: Record<Mood, string> = {
  happy: '😊',
  sad: '😢',
  stressed: '😰',
  calm: '😌',
  energetic: '⚡',
  anxious: '😟',
  excited: '🤩',
  tired: '😴',
  focused: '🎯',
  romantic: '💕',
};

export const moodDescriptions: Record<Mood, string> = {
  happy: 'You seem to be in a great mood!',
  sad: 'Feeling a bit down? Let\'s lift your spirits.',
  stressed: 'Take a deep breath. Let\'s help you relax.',
  calm: 'You\'re feeling peaceful and centered.',
  energetic: 'You\'re full of energy! Let\'s channel it.',
  anxious: 'Feeling worried? Let\'s calm those nerves.',
  excited: 'You\'re buzzing with excitement!',
  tired: 'Need some rest? Let\'s wind down.',
  focused: 'You\'re in the zone! Let\'s keep it going.',
  romantic: 'Feeling the love? Let\'s set the mood.',
};

export const languageLabels: Record<Language, string> = {
  english: 'English',
  tamil: 'Tamil',
  hindi: 'Hindi',
  all: 'All Languages',
};
