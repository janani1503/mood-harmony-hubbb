import { useState, useRef, useCallback, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { Mood, MoodData } from '@/types/mood';

const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';

export function useMoodDetection() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentMood, setCurrentMood] = useState<MoodData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load face detection models');
        setIsLoading(false);
      }
    };
    loadModels();
  }, []);

  // Map face-api expressions to our mood types
  const mapExpressionToMood = (expressions: faceapi.FaceExpressions): MoodData => {
    const expressionMap: Record<string, Mood> = {
      happy: 'happy',
      sad: 'sad',
      angry: 'stressed',
      fearful: 'stressed',
      disgusted: 'stressed',
      surprised: 'energetic',
      neutral: 'calm',
    };

    let dominantExpression = 'neutral';
    let maxConfidence = 0;

    Object.entries(expressions).forEach(([expression, confidence]) => {
      if (confidence > maxConfidence) {
        maxConfidence = confidence;
        dominantExpression = expression;
      }
    });

    return {
      mood: expressionMap[dominantExpression] || 'calm',
      confidence: maxConfidence,
      timestamp: new Date(),
    };
  };

  const startCamera = useCallback(async (videoElement: HTMLVideoElement) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });
      videoElement.srcObject = stream;
      videoRef.current = videoElement;
      return true;
    } catch (err) {
      setError('Camera access denied. Please enable camera permissions.');
      return false;
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsDetecting(false);
  }, []);

  const detectMood = useCallback(async () => {
    if (!videoRef.current || isLoading) return;

    setIsDetecting(true);
    
    const detect = async () => {
      if (!videoRef.current) return;

      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections) {
        const moodData = mapExpressionToMood(detections.expressions);
        setCurrentMood(moodData);
      }
    };

    // Run detection every 500ms
    intervalRef.current = window.setInterval(detect, 500);
    detect(); // Run immediately
  }, [isLoading]);

  return {
    isLoading,
    isDetecting,
    currentMood,
    error,
    startCamera,
    stopCamera,
    detectMood,
    videoRef,
    canvasRef,
    setCurrentMood,
  };
}
