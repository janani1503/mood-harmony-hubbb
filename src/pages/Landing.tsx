import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Brain, Music, Mic2, Camera, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';

const features = [
  {
    icon: Camera,
    title: 'Face Detection',
    description: 'AI-powered facial expression analysis to detect your current mood',
  },
  {
    icon: Mic2,
    title: 'Voice Commands',
    description: 'Tell us how you feel using natural voice interactions',
  },
  {
    icon: Music,
    title: 'Music Recommendations',
    description: 'Curated playlists that match and enhance your emotional state',
  },
  {
    icon: Activity,
    title: 'Activity Suggestions',
    description: 'Meditation, workouts, and relaxation tailored to your mood',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              y: [0, 50, 0],
            }}
            transition={{ duration: 25, repeat: Infinity }}
            className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, 50, 0],
              y: [0, 100, 0],
            }}
            transition={{ duration: 30, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Mood Analysis</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight"
            >
              Your Mood, <br />
              <span className="gradient-text">Your Music,</span>
              <br />
              <span className="gradient-text-secondary">Your Flow</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              Experience personalized music and activity recommendations powered by AI that 
              understands how you feel through facial expressions and voice commands.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/detect">
                <Button size="lg" className="gap-2 text-lg px-8 py-6 rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="gap-2 text-lg px-8 py-6 rounded-full">
                  View Dashboard
                  <Brain className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating mood emojis */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {['😊', '😌', '⚡', '🎵', '🧘'].map((emoji, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-30"
              initial={{
                x: `${20 + i * 20}%`,
                y: '100%',
              }}
              animate={{
                y: '-100%',
              }}
              transition={{
                duration: 15 + i * 2,
                repeat: Infinity,
                delay: i * 3,
                ease: 'linear',
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced AI technology that understands and responds to your emotional state
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="glass-card p-6 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
            <div className="relative z-10">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="text-6xl mb-6"
              >
                🎭
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Ready to Feel Better?
              </h2>
              <p className="text-xl text-muted-foreground max-w-xl mx-auto mb-8">
                Let AI understand your emotions and guide you to the perfect music and activities
              </p>
              <Link to="/detect">
                <Button size="lg" className="gap-2 text-lg px-10 py-6 rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎭</span>
              <span className="font-display font-semibold gradient-text">MoodFlow</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 MoodFlow. Built with ❤️ for SDG 9: Industry, Innovation & Infrastructure
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
