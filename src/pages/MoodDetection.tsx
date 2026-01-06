import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Mic2, Hand, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navbar } from '@/components/Navbar';
import { FaceDetection } from '@/components/FaceDetection';
import { VoiceAssistant } from '@/components/VoiceAssistant';
import { MoodCard, MoodDisplay } from '@/components/MoodCard';
import { Mood, moodEmojis } from '@/types/mood';

const moods: Mood[] = ['happy', 'sad', 'stressed', 'calm', 'energetic', 'anxious', 'excited', 'tired', 'focused', 'romantic'];

export default function MoodDetection() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [detectionMethod, setDetectionMethod] = useState<'face' | 'voice' | 'manual'>('face');

  const handleMoodDetected = useCallback((mood: string | Mood, confidence?: number) => {
    setSelectedMood(mood as Mood);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            How Are You <span className="gradient-text">Feeling?</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose how you'd like us to detect your mood
          </p>
        </motion.div>

        <Tabs
          value={detectionMethod}
          onValueChange={(v) => setDetectionMethod(v as typeof detectionMethod)}
          className="max-w-3xl mx-auto"
        >
          <TabsList className="grid grid-cols-3 w-full mb-8 glass-card p-1.5 rounded-2xl">
            <TabsTrigger
              value="face"
              className="gap-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Face Scan</span>
            </TabsTrigger>
            <TabsTrigger
              value="voice"
              className="gap-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Mic2 className="w-4 h-4" />
              <span className="hidden sm:inline">Voice</span>
            </TabsTrigger>
            <TabsTrigger
              value="manual"
              className="gap-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Hand className="w-4 h-4" />
              <span className="hidden sm:inline">Manual</span>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="face" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card p-6 md:p-8 rounded-3xl"
              >
                <FaceDetection onMoodDetected={handleMoodDetected} />
              </motion.div>
            </TabsContent>

            <TabsContent value="voice" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card p-6 md:p-8 rounded-3xl"
              >
                <VoiceAssistant onMoodDetected={handleMoodDetected} />
              </motion.div>
            </TabsContent>

            <TabsContent value="manual" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card p-6 md:p-8 rounded-3xl"
              >
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold mb-2">Select Your Mood</h3>
                  <p className="text-muted-foreground">
                    Choose the emotion that best describes how you feel right now
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8">
                  {moods.map((mood) => (
                    <MoodCard
                      key={mood}
                      mood={mood}
                      isSelected={selectedMood === mood}
                      onClick={() => setSelectedMood(mood)}
                      size="md"
                    />
                  ))}
                </div>

                <AnimatePresence>
                  {selectedMood && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="pt-6 border-t border-border"
                    >
                      <MoodDisplay mood={selectedMood} showDescription />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>

        {/* Continue to Dashboard */}
        <AnimatePresence>
          {selectedMood && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8 text-center"
            >
              <div className="inline-flex items-center gap-2 text-green-500 mb-4">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Mood detected successfully!</span>
              </div>
              <div>
                <Link to={`/dashboard?mood=${selectedMood}`}>
                  <Button
                    size="lg"
                    className="gap-2 rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                  >
                    View Recommendations
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
