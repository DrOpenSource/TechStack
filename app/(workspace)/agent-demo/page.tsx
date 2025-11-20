"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Loader2, Code2, Eye } from "lucide-react";
import { QuestionFlow } from "@/app/components/agent/QuestionFlow";
import { ProactiveAgent } from "@/packages/core/agent/proactive-agent";
import { mockProvider } from "@/packages/core/providers/mock-provider";
import type {
  AgentResponse,
  QuestionFlow as QuestionFlowType,
  ConversationMessage,
} from "@/packages/core/types";

interface Message extends ConversationMessage {
  component?: "questions";
  questionFlow?: QuestionFlowType;
  code?: any;
  suggestions?: string[];
}

export default function AgentDemoPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeFlow, setActiveFlow] = useState<QuestionFlowType | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);
  const [showCode, setShowCode] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [agent] = useState(() => new ProactiveAgent(mockProvider, {
    mode: "proactive",
    mockFirst: true,
    questionThreshold: 5,
    autoPreview: true,
  }));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage = input.trim();
    setInput("");
    setIsGenerating(true);

    // Add user message
    const newUserMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    try {
      // Process with proactive agent
      const response: AgentResponse = await agent.process({
        message: userMessage,
        conversationHistory: messages,
      });

      // Handle different response types
      if (response.type === "questions" && response.questionFlow) {
        setActiveFlow(response.questionFlow);
        setCurrentAnalysis(response); // Store for later

        const aiMessage: Message = {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: response.message,
          timestamp: new Date(),
          component: "questions",
          questionFlow: response.questionFlow,
          suggestions: response.suggestions,
        };

        setMessages((prev) => [...prev, aiMessage]);
      } else if (response.type === "generation" && response.code) {
        setActiveFlow(null);

        const aiMessage: Message = {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: response.message,
          timestamp: new Date(),
          code: response.code,
          suggestions: response.suggestions,
        };

        setMessages((prev) => [...prev, aiMessage]);
      } else if (response.type === "error") {
        const aiMessage: Message = {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: response.message + (response.error ? `\n\nError: ${response.error}` : ""),
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: "Sorry, I encountered an error processing your request.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswer = (questionId: string, answer: any) => {
    if (!activeFlow) return;

    // Update flow with answer
    const updatedFlow = {
      ...activeFlow,
      answers: { ...activeFlow.answers, [questionId]: answer },
      currentIndex: activeFlow.currentIndex + 1,
    };

    if (updatedFlow.currentIndex >= updatedFlow.questions.length) {
      updatedFlow.completed = true;
    }

    setActiveFlow(updatedFlow);
  };

  const handleQuestionComplete = async (answers: Record<string, any>) => {
    if (!activeFlow || !currentAnalysis) return;

    setIsGenerating(true);

    try {
      // Continue with agent using collected answers
      const lastUserMessage = messages.find((m) => m.role === "user" && !m.component);

      if (!lastUserMessage) return;

      const response = await agent.continueWithAnswers(
        { ...activeFlow, answers, completed: true },
        {
          message: lastUserMessage.content,
          conversationHistory: messages,
        },
        currentAnalysis
      );

      if (response.type === "generation" && response.code) {
        const aiMessage: Message = {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: response.message,
          timestamp: new Date(),
          code: response.code,
          suggestions: response.suggestions,
        };

        setMessages((prev) => [...prev, aiMessage]);
      }

      setActiveFlow(null);
      setCurrentAnalysis(null);
    } catch (error) {
      console.error("Error completing questions:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSkipAll = async () => {
    if (!activeFlow) return;

    const defaultAnswers = activeFlow.questions.reduce((acc, q) => {
      acc[q.id] = q.default || q.options?.[0] || "Skip";
      return acc;
    }, {} as Record<string, any>);

    await handleQuestionComplete(defaultAnswers);
  };

  const toggleCode = (messageId: string) => {
    setShowCode((prev) => ({ ...prev, [messageId]: !prev[messageId] }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="border-b border-border px-4 py-3 bg-card">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <div>
            <h2 className="font-semibold text-foreground">
              Proactive AI Agent Demo
            </h2>
            <p className="text-xs text-muted-foreground">
              AI asks clarifying questions before generating
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Try the Proactive Agent
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              The AI will ask questions to understand your needs better
            </p>
            <div className="max-w-md mx-auto space-y-2 text-left">
              <p className="text-sm text-muted-foreground">
                <strong>Try saying:</strong>
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• "Create a login form"</li>
                <li>• "Build a dashboard"</li>
                <li>• "Make a button component"</li>
              </ul>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-4 py-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                {/* Question Flow */}
                {message.component === "questions" && message.questionFlow && activeFlow && (
                  <div className="mt-3">
                    <QuestionFlow
                      flow={activeFlow}
                      onAnswer={handleAnswer}
                      onComplete={handleQuestionComplete}
                      onSkipAll={handleSkipAll}
                    />
                  </div>
                )}

                {/* Generated Code */}
                {message.code && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCode(message.id)}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                      >
                        <Code2 className="w-4 h-4" />
                        {showCode[message.id] ? "Hide Code" : "Show Code"}
                      </button>
                      <button
                        onClick={() => {
                          /* TODO: Open preview */
                        }}
                        className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                    </div>

                    {showCode[message.id] && (
                      <motion.pre
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs"
                      >
                        <code>{message.code.code}</code>
                      </motion.pre>
                    )}
                  </div>
                )}

                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-medium opacity-70">
                      Suggestions:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 bg-background/50 rounded-full"
                        >
                          {suggestion}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-muted-foreground"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">AI is thinking...</span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card px-4 py-3">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Describe what you want to build..."
            rows={1}
            className="flex-1 resize-none bg-background border border-input rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring max-h-32"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim() || isGenerating}
            className="p-3 bg-primary text-primary-foreground rounded-lg disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
