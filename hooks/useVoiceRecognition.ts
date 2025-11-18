/**
 * useVoiceRecognition Hook
 * Custom hook for managing Web Speech API voice recognition
 */

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseVoiceRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
  onTranscript?: (transcript: string) => void;
  onError?: (error: Error) => void;
}

export const useVoiceRecognition = (options: UseVoiceRecognitionOptions = {}) => {
  const {
    continuous = true,
    interimResults = true,
    language = 'en-US',
    onTranscript,
    onError,
  } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = continuous;
      recognitionRef.current.interimResults = interimResults;
      recognitionRef.current.lang = language;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece;
          } else {
            interimTranscript += transcriptPiece;
          }
        }

        const fullTranscript = finalTranscript || interimTranscript;
        setTranscript(fullTranscript);

        if (finalTranscript && onTranscript) {
          onTranscript(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);

        if (onError) {
          onError(new Error(event.error));
        }
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [continuous, interimResults, language, onTranscript, onError]);

  // Start recording
  const startRecording = useCallback(() => {
    if (!isSupported || !recognitionRef.current) {
      console.warn('Speech recognition not supported');
      return;
    }

    try {
      setTranscript('');
      setIsRecording(true);
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsRecording(false);
    }
  }, [isSupported]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  // Cancel recording
  const cancelRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      setIsRecording(false);
      setTranscript('');
    }
  }, []);

  return {
    isSupported,
    isRecording,
    transcript,
    startRecording,
    stopRecording,
    cancelRecording,
  };
};
