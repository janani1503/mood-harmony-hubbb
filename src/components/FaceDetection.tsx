import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CameraOff, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMoodDetection } from '@/hooks/useMoodDetection';
import { MoodDisplay } from '@/components/MoodCard';

interface FaceDetectionProps {
  onMoodDetected?: (mood: string, confidence: number) => void;
}

export function FaceDetection({ onMoodDetected }: FaceDetectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const {
    isLoading,
    isDetecting,
    currentMood,
    error,
    startCamera,
    stopCamera,
    detectMood,
  } = useMoodDetection();

  const handleStartCamera = async () => {
    if (videoRef.current) {
      const success = await startCamera(videoRef.current);
      if (success) {
        setCameraActive(true);
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          detectMood();
        };
      }
    }
  };

  const handleStopCamera = () => {
    stopCamera();
    setCameraActive(false);
  };

  useEffect(() => {
    if (currentMood && onMoodDetected) {
      onMoodDetected(currentMood.mood, currentMood.confidence);
    }
  }, [currentMood, onMoodDetected]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="space-y-6">
      <div className="relative aspect-video max-w-lg mx-auto overflow-hidden rounded-2xl bg-muted">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
        />
        
        {!cameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-muted to-muted/50">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center"
            >
              <Camera className="w-10 h-10 text-primary" />
            </motion.div>
            <p className="text-muted-foreground text-center max-w-xs">
              Enable your camera to detect your mood through facial expressions
            </p>
          </div>
        )}

        {isLoading && cameraActive && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {isDetecting && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Analyzing...</span>
          </div>
        )}

        {error && (
          <div className="absolute bottom-4 left-4 right-4 bg-destructive/20 text-destructive px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4">
        {!cameraActive ? (
          <Button
            onClick={handleStartCamera}
            disabled={isLoading}
            size="lg"
            className="gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Camera className="w-5 h-5" />
            )}
            {isLoading ? 'Loading Models...' : 'Start Camera'}
          </Button>
        ) : (
          <>
            <Button
              onClick={handleStopCamera}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <CameraOff className="w-5 h-5" />
              Stop Camera
            </Button>
            <Button
              onClick={detectMood}
              disabled={isDetecting}
              size="lg"
              className="gap-2"
            >
              <RefreshCw className={`w-5 h-5 ${isDetecting ? 'animate-spin' : ''}`} />
              Refresh Detection
            </Button>
          </>
        )}
      </div>

      <AnimatePresence mode="wait">
        {currentMood && (
          <motion.div
            key={currentMood.mood}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-6"
          >
            <MoodDisplay 
              mood={currentMood.mood} 
              confidence={currentMood.confidence} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
