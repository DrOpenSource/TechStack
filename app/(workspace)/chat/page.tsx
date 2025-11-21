"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Loader2, Eye, ChevronDown, ChevronUp, X, ArrowLeft } from "lucide-react";
import { useChatStore } from "@/lib/stores/chat-store";
import { useProjectStore } from "@/lib/stores/project-store";
import { QuestionFlow } from "@/app/components/agent/QuestionFlow";
import { AgentTeam } from "@/app/components/team/AgentTeam";
import { InteractivePreview } from "@/app/components/canvas/InteractivePreview";
import { ElementInspector } from "@/app/components/canvas/ElementInspector";
import { ProactiveAgent } from "@/lib/agents/context-gatherer/agent/proactive-agent";
import { mockProvider } from "@/lib/agents/context-gatherer/providers/mock-provider";
import type { QuestionFlow as QuestionFlowType } from "@/lib/agents/context-gatherer/types";
import type { ElementNode } from "@/lib/agents/context-gatherer/types";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeFlow, setActiveFlow] = useState<QuestionFlowType | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);
  const [generatedCode, setGeneratedCode] = useState<Record<string, any>>({});
  const [showTeam, setShowTeam] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  // Canvas mode state
  const [canvasMode, setCanvasMode] = useState(false);
  const [canvasCode, setCanvasCode] = useState<string>("");
  const [selectedElement, setSelectedElement] = useState<ElementNode | null>(null);

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

  const openPreview = (codeId: string) => {
    const code = generatedCode[codeId];
    if (code) {
      setCanvasCode(code.code);
      setCanvasMode(true);
    }
  };

  const closeCanvas = () => {
    setCanvasMode(false);
    setSelectedElement(null);
  };

  const handleElementUpdate = (elementId: string, property: string, value: any) => {
    // TODO: Update code with new property value
    console.log("Update element:", elementId, property, value);
  };

  // If in canvas mode, show canvas view
  if (canvasMode) {
    return (
      <div className="flex h-[calc(100vh-4rem)] safe-top">
        {/* Canvas Preview */}
        <div className="flex-1 flex flex-col">
          <div className="border-b border-border px-4 py-3 bg-card flex items-center gap-3">
            <button
              onClick={closeCanvas}
              className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Chat
            </button>
            <div className="flex-1">
              <h2 className="font-semibold text-foreground">Interactive Canvas</h2>
              <p className="text-xs text-muted-foreground">
                Click any element to edit its properties
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <InteractivePreview
              code={canvasCode}
              onElementSelect={(id) => {
                // TODO: Get element node by ID
                setSelectedElement(null);
              }}
            />
          </div>
        </div>

        {/* Element Inspector */}
        <div className="w-80 border-l border-border bg-card overflow-y-auto">
          <ElementInspector
            element={selectedElement}
            onUpdate={handleElementUpdate}
            onClose={() => setSelectedElement(null)}
          />
        </div>
      </div>
    );
  }

  // Chat mode (default)
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] safe-top">
      {/* Header with Team Toggle */}
      <div className="border-b border-border px-4 py-3 bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <div>
              <h2 className="font-semibold text-foreground">
                {activeProject?.name || "Vibe Coding Assistant"}
              </h2>
              <p className="text-xs text-muted-foreground">
                Powered by {selectedAgents.length || 14} AI Agents
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowTeam(!showTeam)}
            className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium"
          >
            {showTeam ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Hide Team
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                View Team
              </>
            )}
          </button>
        </div>

        {/* Agent Team Display */}
        <AnimatePresence>
          {showTeam && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 overflow-hidden"
            >
              <AgentTeam
                selectedAgents={selectedAgents}
                onSelectionChange={setSelectedAgents}
                mode="select"
              />
            </motion.div>
          )}
        </AnimatePresence>
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
              Let&apos;s build something amazing
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Describe what you want to create. Your AI team will ask questions and build it for you.
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

                {/* Generated Component - BEAUTIFUL PREVIEW ONLY */}
                {message.metadata?.hasCode && message.metadata?.codeId && generatedCode[message.metadata.codeId] && (
                  <div className="mt-3 space-y-3">
                    {/* Beautiful Preview Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                          {generatedCode[message.metadata.codeId].component || "Component"} Created!
                        </h4>
                      </div>

                      <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                        Your component is ready. Click below to preview and customize it visually.
                      </p>

                      <button
                        onClick={() => openPreview(message.metadata!.codeId!)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 text-sm font-medium shadow-lg"
                      >
                        <Eye className="w-5 h-5" />
                        Open in Interactive Canvas
                      </button>

                      {/* Small code link for developers */}
                      <div className="mt-3 text-center">
                        <details className="text-xs text-blue-600 dark:text-blue-400">
                          <summary className="cursor-pointer hover:underline">
                            View code (for developers)
                          </summary>
                          <pre className="mt-2 bg-gray-900 text-gray-100 p-3 rounded text-left overflow-x-auto">
                            <code>{generatedCode[message.metadata.codeId].code}</code>
                          </pre>
                        </details>
                      </div>
                    </div>
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
                        <button
                          key={i}
                          onClick={() => setInput(suggestion)}
                          className="text-xs px-3 py-1.5 bg-background/50 hover:bg-background rounded-full border border-border transition-colors"
                        >
                          {suggestion}
                        </button>
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
            <span className="text-sm">Your AI team is working...</span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
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
