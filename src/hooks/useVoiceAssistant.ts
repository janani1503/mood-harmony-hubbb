import { useState, useCallback, useRef, useEffect } from 'react';
import { Mood } from '@/types/mood';

interface VoiceAssistantState {
  isListening: boolean;
  transcript: string;
  isSpeaking: boolean;
  error: string | null;
}

export function useVoiceAssistant(onMoodDetected?: (mood: Mood) => void) {
  const [state, setState] = useState<VoiceAssistantState>({
    isListening: false,
    transcript: '',
    isSpeaking: false,
    error: null,
  });
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
      
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        recognitionRef.current = new SpeechRecognitionAPI();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
      }
    }
  }, []);

  const moodKeywords: Record<string, Mood> = {
    'happy': 'happy',
    'joyful': 'happy',
    'excited': 'happy',
    'great': 'happy',
    'amazing': 'happy',
    'good': 'happy',
    'sad': 'sad',
    'down': 'sad',
    'depressed': 'sad',
    'unhappy': 'sad',
    'blue': 'sad',
    'stressed': 'stressed',
    'anxious': 'stressed',
    'worried': 'stressed',
    'overwhelmed': 'stressed',
    'tense': 'stressed',
    'calm': 'calm',
    'relaxed': 'calm',
    'peaceful': 'calm',
    'serene': 'calm',
    'tranquil': 'calm',
    'energetic': 'energetic',
    'pumped': 'energetic',
    'motivated': 'energetic',
    'active': 'energetic',
    'workout': 'energetic',
  };

  const parseMoodFromText = (text: string): Mood | null => {
    const lowerText = text.toLowerCase();
    
    for (const [keyword, mood] of Object.entries(moodKeywords)) {
      if (lowerText.includes(keyword)) {
        return mood;
      }
    }
    return null;
  };

  const speak = useCallback((text: string) => {
    if (!synthRef.current) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onstart = () => {
      setState(prev => ({ ...prev, isSpeaking: true }));
    };
    
    utterance.onend = () => {
      setState(prev => ({ ...prev, isSpeaking: false }));
    };

    synthRef.current.speak(utterance);
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setState(prev => ({
        ...prev,
        error: 'Speech recognition not supported in this browser',
      }));
      return;
    }

    setState(prev => ({ ...prev, isListening: true, transcript: '', error: null }));

    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      
      setState(prev => ({ ...prev, transcript }));

      // Check if we can detect a mood
      const detectedMood = parseMoodFromText(transcript);
      if (detectedMood && event.results[0].isFinal) {
        onMoodDetected?.(detectedMood);
        speak(`I understand you're feeling ${detectedMood}. Let me find some recommendations for you.`);
      }
    };

    recognitionRef.current.onerror = (event) => {
      setState(prev => ({
        ...prev,
        isListening: false,
        error: event.error === 'no-speech' ? 'No speech detected. Please try again.' : 'Error occurred during speech recognition.',
      }));
    };

    recognitionRef.current.onend = () => {
      setState(prev => ({ ...prev, isListening: false }));
    };

    recognitionRef.current.start();
  }, [onMoodDetected, speak]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setState(prev => ({ ...prev, isListening: false }));
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    speak,
  };
}

// Web Speech API types handled inline with 'any' for cross-browser compatibility
