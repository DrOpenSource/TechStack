"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import type { Question, QuestionFlow as QuestionFlowType } from "@/packages/core/types";

interface QuestionFlowProps {
  flow: QuestionFlowType;
  onAnswer: (questionId: string, answer: any) => void;
  onComplete: (answers: Record<string, any>) => void;
  onSkipAll: () => void;
  onBack?: () => void;
}

export function QuestionFlow({
  flow,
  onAnswer,
  onComplete,
  onSkipAll,
  onBack,
}: QuestionFlowProps) {
  const currentQuestion = flow.questions[flow.currentIndex];
  const progress = ((flow.currentIndex + 1) / flow.questions.length) * 100;
  const isLastQuestion = flow.currentIndex === flow.questions.length - 1;

  const [textAnswer, setTextAnswer] = useState("");

  if (!currentQuestion) {
    return null;
  }

  const handleAnswer = (answer: any) => {
    onAnswer(currentQuestion.id, answer);

    // Auto-proceed for single choice
    if (currentQuestion.type === "single_choice") {
      setTimeout(() => {
        if (isLastQuestion) {
          onComplete(flow.answers);
        }
      }, 300);
    }
  };

  const handleTextSubmit = () => {
    if (textAnswer.trim()) {
      handleAnswer(textAnswer);
      setTextAnswer("");

      if (isLastQuestion) {
        setTimeout(() => onComplete(flow.answers), 300);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg p-4 space-y-4 border border-blue-200 dark:border-blue-800"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Question {flow.currentIndex + 1} of {flow.questions.length}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Help me understand what you need
            </p>
          </div>
        </div>

        {currentQuestion.skipable && (
          <button
            onClick={onSkipAll}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Skip all
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
          className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-3"
        >
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {currentQuestion.text}
          </p>

          {/* Single Choice */}
          {currentQuestion.type === "single_choice" && currentQuestion.options && (
            <div className="space-y-2">
              {currentQuestion.options.map((option) => (
                <motion.button
                  key={option}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option)}
                  className="w-full text-left px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                >
                  <span className="text-gray-900 dark:text-gray-100 font-medium">
                    {option}
                  </span>
                </motion.button>
              ))}
            </div>
          )}

          {/* Text Input */}
          {currentQuestion.type === "text" && (
            <div className="space-y-2">
              <input
                type="text"
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleTextSubmit();
                  }
                }}
                placeholder="Type your answer..."
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={handleTextSubmit}
                disabled={!textAnswer.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLastQuestion ? "Finish" : "Continue"}
              </button>
            </div>
          )}

          {/* Boolean */}
          {currentQuestion.type === "boolean" && (
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(true)}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                Yes
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(false)}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                No
              </motion.button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onBack}
          disabled={flow.currentIndex === 0}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {currentQuestion.skipable && (
          <button
            onClick={() => handleAnswer(currentQuestion.default || "Skip")}
            className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Use default
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
