import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Activity, RefreshCw, TrendingUp, Clock, Sparkles, Globe, Heart, HeartOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { MoodCard, MoodDisplay } from '@/components/MoodCard';
import { PlaylistCard } from '@/components/PlaylistCard';
import { ActivityCard } from '@/components/ActivityCard';
import { Mood, Language, languageLabels } from '@/types/mood';
import { moodActivities, getPlaylistsByLanguage } from '@/data/recommendations';

const moods: Mood[] = ['happy', 'sad', 'stressed', 'calm', 'energetic', 'anxious', 'excited', 'tired', 'focused', 'romantic'];
const languages: Language[] = ['all', 'english', 'tamil', 'hindi'];

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const moodParam = searchParams.get('mood') as Mood | null;
  const [currentMood, setCurrentMood] = useState<Mood>(moodParam || 'calm');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('all');
  const [likedPlaylists, setLikedPlaylists] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const playlists = getPlaylistsByLanguage(currentMood, selectedLanguage);
  const activities = moodActivities[currentMood];

  const handleMoodChange = (mood: Mood) => {
    setIsLoading(true);
    setCurrentMood(mood);
    setTimeout(() => setIsLoading(false), 500);
  };

  const toggleLike = (playlistId: string) => {
    setLikedPlaylists(prev => {
      const newSet = new Set(prev);
      if (newSet.has(playlistId)) {
        newSet.delete(playlistId);
      } else {
        newSet.add(playlistId);
      }
      return newSet;
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
                Your <span className="gradient-text">Dashboard</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Personalized recommendations based on your mood
              </p>
            </div>
            
            <Link to="/detect">
              <Button variant="outline" className="gap-2 rounded-full">
                <RefreshCw className="w-4 h-4" />
                Detect New Mood
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Current Mood & Preferences */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6 rounded-3xl"
            >
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">Current Mood</h2>
              </div>
              
              <MoodDisplay mood={currentMood} showDescription />

              <div className="mt-8">
                <p className="text-sm text-muted-foreground mb-4 text-center">Change Mood</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {moods.map((mood) => (
                    <MoodCard
                      key={mood}
                      mood={mood}
                      size="sm"
                      isSelected={currentMood === mood}
                      onClick={() => handleMoodChange(mood)}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Language Preference */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6 rounded-3xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">Music Language</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Which language music do you prefer?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((lang) => (
                  <Button
                    key={lang}
                    variant={selectedLanguage === lang ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLanguage(lang)}
                    className="rounded-full capitalize"
                  >
                    {languageLabels[lang]}
                  </Button>
                ))}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 rounded-3xl space-y-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">Today's Summary</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/10 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{playlists.length}</p>
                  <p className="text-xs text-muted-foreground">Playlists</p>
                </div>
                <div className="bg-secondary/10 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-secondary">{activities.length}</p>
                  <p className="text-xs text-muted-foreground">Activities</p>
                </div>
              </div>

              <div className="bg-pink-500/10 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-pink-500">{likedPlaylists.size}</p>
                <p className="text-xs text-muted-foreground">Liked Songs</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                <Clock className="w-4 h-4" />
                <span>Last updated just now</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Recommendations */}
          <div className="lg:col-span-2 space-y-8">
            {/* Music Recommendations */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Music className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-display font-semibold">Music for You</h2>
                </div>
                <span className="text-sm text-muted-foreground">
                  {selectedLanguage !== 'all' ? languageLabels[selectedLanguage] : 'All Languages'}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentMood}-${selectedLanguage}`}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {playlists.length > 0 ? (
                    playlists.map((playlist, index) => (
                      <div key={playlist.id} className="relative">
                        <PlaylistCard playlist={playlist} index={index} />
                        <button
                          onClick={() => toggleLike(playlist.id)}
                          className="absolute top-3 right-3 z-10 bg-black/50 hover:bg-black/70 p-2 rounded-full transition-colors"
                        >
                          {likedPlaylists.has(playlist.id) ? (
                            <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                          ) : (
                            <Heart className="w-4 h-4 text-white" />
                          )}
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                      No playlists found for this language. Try selecting "All Languages".
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.section>

            {/* Activity Recommendations */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-6 h-6 text-secondary" />
                <h2 className="text-2xl font-display font-semibold">Suggested Activities</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Click on any activity to start! Activities with videos will play automatically.
              </p>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMood}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="space-y-3"
                >
                  {activities.map((activity, index) => (
                    <ActivityCard key={activity.id} activity={activity} index={index} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </motion.section>
          </div>
        </div>
      </main>
    </div>
  );
}
