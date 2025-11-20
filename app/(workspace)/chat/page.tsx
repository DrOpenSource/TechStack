"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Loader2, Eye, Code2 } from "lucide-react";
import { useChatStore } from "@/lib/stores/chat-store";
import { useProjectStore } from "@/lib/stores/project-store";
import { ChatMessage } from "@/components/chat/chat-message";
import { QuestionFlow } from "@/app/components/agent/QuestionFlow";
import { ProactiveAgent } from "@/lib/agents/context-gatherer/agent/proactive-agent";
import { mockProvider } from "@/lib/agents/context-gatherer/providers/mock-provider";
import type { QuestionFlow as QuestionFlowType } from "@/lib/agents/context-gatherer/types";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeFlow, setActiveFlow] = useState<QuestionFlowType | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);
  const [showCode, setShowCode] = useState<Record<string, boolean>>({});
  const [generatedCode, setGeneratedCode] = useState<Record<string, any>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, addMessage } = useChatStore();
  const activeProject = useProjectStore((state) => state.activeProject);

  // Initialize proactive agent
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
    const userMsgId = `msg-${Date.now()}`;
    addMessage({
      role: "user",
      content: userMessage,
    });

    try {
      // Process with proactive agent (Context Gatherer - Agent #13)
      const response = await agent.process({
        message: userMessage,
        conversationHistory: messages,
      });

      // Handle different response types
      if (response.type === "questions" && response.questionFlow) {
        // AI needs clarification - show question flow
        setActiveFlow(response.questionFlow);
        setCurrentAnalysis(response);

        addMessage({
          role: "assistant",
          content: response.message,
          metadata: {
            hasQuestions: true,
            questionFlowId: response.questionFlow.id,
          },
        });
      } else if (response.type === "generation" && response.code) {
        // AI generated code - show with preview option
        setActiveFlow(null);

        const msgId = `msg-${Date.now()}`;
        setGeneratedCode((prev) => ({ ...prev, [msgId]: response.code }));

        addMessage({
          role: "assistant",
          content: response.message,
          metadata: {
            hasCode: true,
            codeId: msgId,
            suggestions: response.suggestions,
          },
        });
      } else if (response.type === "error") {
        addMessage({
          role: "assistant",
          content: response.message + (response.error ? `\n\nError: ${response.error}` : ""),
        });
      }
    } catch (error) {
      addMessage({
        role: "assistant",
        content: "Sorry, I encountered an error processing your request.",
      });
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
      const lastUserMessage = messages.find(m => m.role === "user" && !m.metadata?.hasQuestions);

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
        const msgId = `msg-${Date.now()}`;
        setGeneratedCode((prev) => ({ ...prev, [msgId]: response.code }));

        addMessage({
          role: "assistant",
          content: response.message,
          metadata: {
            hasCode: true,
            codeId: msgId,
            suggestions: response.suggestions,
          },
        });
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

  const openPreview = (codeId: string) => {
    const code = generatedCode[codeId];
    if (code) {
      // Store in session storage for preview page
      sessionStorage.setItem('preview-code', JSON.stringify(code));
      // Open in new tab or navigate
      window.open('/canvas-demo', '_blank');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] safe-top">
      <div className="border-b border-border px-4 py-3 bg-card">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <div>
            <h2 className="font-semibold text-foreground">
              {activeProject?.name || "Vibe Coding Assistant"}
            </h2>
            <p className="text-xs text-muted-foreground">
              Powered by Context Gatherer Agent • Mock Mode
            </p>
          </div>
        </div>
      </div>

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
              Let&apos;s build something amazing
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Describe what you want to create. I&apos;ll ask clarifying questions to understand your vision.
            </p>
            <div className="text-xs text-muted-foreground text-left max-w-md mx-auto space-y-1">
              <p className="font-medium">Try saying:</p>
              <ul className="space-y-1 ml-4">
                <li>• &quot;Create a login form&quot;</li>
                <li>• &quot;Build a dashboard&quot;</li>
                <li>• &quot;Make a product card&quot;</li>
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
                {message.metadata?.hasQuestions && activeFlow && (
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
                {message.metadata?.hasCode && message.metadata?.codeId && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCode(message.metadata!.codeId!)}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                      >
                        <Code2 className="w-4 h-4" />
                        {showCode[message.metadata!.codeId!] ? "Hide Code" : "Show Code"}
                      </button>
                      <button
                        onClick={() => openPreview(message.metadata!.codeId!)}
                        className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        Preview & Edit
                      </button>
                    </div>

                    {showCode[message.metadata!.codeId!] && generatedCode[message.metadata!.codeId!] && (
                      <motion.pre
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs"
                      >
                        <code>{generatedCode[message.metadata!.codeId!].code}</code>
                      </motion.pre>
                    )}
                  </div>
                )}

                {/* Suggestions */}
                {message.metadata?.suggestions && message.metadata.suggestions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-medium opacity-70">
                      Next steps:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {message.metadata.suggestions.map((suggestion: string, i: number) => (
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

      <div className="border-t border-border bg-card px-4 py-3 safe-bottom">
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
            placeholder="Describe your app idea..."
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
