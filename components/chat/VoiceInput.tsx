'use client';

/**
 * VoiceInput Component
 * Voice recording interface with waveform visualization
 * Uses Web Speech API (with mock fallback for demo)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onCancel: () => void;
  className?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  onCancel,
  className = '',
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [duration, setDuration] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>([]);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const waveformRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Speech Recognition (with fallback)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

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

          setTranscript(finalTranscript || interimTranscript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Start recording
  const startRecording = () => {
    setIsRecording(true);
    setTranscript('');
    setDuration(0);

    // Start speech recognition if available
    if (recognitionRef.current) {
      recognitionRef.current.start();
    } else {
      // Mock transcript for demo
      setTimeout(() => {
        setTranscript('This is a mock voice input...');
      }, 1500);
    }

    // Start timer
    timerRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    // Animate waveform
    waveformRef.current = setInterval(() => {
      setWaveformData(
        Array.from({ length: 20 }, () => Math.random() * 100)
      );
    }, 100);
  };

  // Stop recording
  const stopRecording = () => {
    setIsRecording(false);

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (waveformRef.current) {
      clearInterval(waveformRef.current);
    }

    setWaveformData([]);
  };

  // Cancel recording
  const handleCancel = () => {
    stopRecording();
    setTranscript('');
    onCancel();
  };

  // Send transcript
  const handleSend = () => {
    if (transcript.trim()) {
      onTranscript(transcript);
      stopRecording();
      setTranscript('');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isRecording) {
    return (
      <button
        onClick={startRecording}
        className={`flex items-center justify-center min-w-[44px] min-h-[44px] p-2
                   bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                   text-white rounded-full transition-all active:scale-95
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   ${className}`}
        aria-label="Start voice recording"
      >
        <Mic className="w-5 h-5" />
      </button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`fixed inset-x-0 bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 z-50 ${className}`}
      >
        {/* Recording Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Pulsing Mic Icon */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex items-center justify-center w-10 h-10 bg-red-600 rounded-full"
            >
              <Mic className="w-5 h-5 text-white" />
            </motion.div>

            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Recording...
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDuration(duration)}
              </p>
            </div>
          </div>

          {/* Cancel Button */}
          <button
            onClick={handleCancel}
            className="flex items-center justify-center min-w-[40px] min-h-[40px] p-2
                     text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
                     rounded-full hover:bg-gray-100 dark:hover:bg-gray-800
                     transition-all active:scale-95"
            aria-label="Cancel recording"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Waveform Visualization */}
        <div className="flex items-center justify-center gap-1 h-16 mb-4">
          {waveformData.map((height, index) => (
            <motion.div
              key={index}
              className="w-1 bg-blue-600 rounded-full"
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.1 }}
            />
          ))}
        </div>

        {/* Transcript Preview */}
        {transcript && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">{transcript}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Stop Recording */}
          <button
            onClick={stopRecording}
            className="flex-1 flex items-center justify-center gap-2 min-h-[48px] px-4 py-3
                     bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600
                     text-gray-900 dark:text-gray-100 rounded-lg font-medium
                     transition-all active:scale-[0.98]"
          >
            <Square className="w-4 h-4" />
            Stop
          </button>

          {/* Send Transcript */}
          <button
            onClick={handleSend}
            disabled={!transcript.trim()}
            className="flex-1 flex items-center justify-center gap-2 min-h-[48px] px-4 py-3
                     bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                     text-white rounded-lg font-medium
                     transition-all active:scale-[0.98]
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VoiceInput;
