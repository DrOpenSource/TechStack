/**
 * Proactive Agent - AI agent that asks clarifying questions before generating code
 */

import { ContextAnalyzer } from '../context/analyzer';
import { QuestionEngine } from './question-engine';
import type {
  UserRequest,
  AgentConfig,
  AgentResponse,
  QuestionFlow,
  EnrichedContext,
  AIProvider,
} from '../types';

// ============================================================================
// Proactive Agent Class
// ============================================================================

export class ProactiveAgent {
  private analyzer: ContextAnalyzer;
  private questionEngine: QuestionEngine;
  private provider: AIProvider;
  private config: AgentConfig;

  constructor(provider: AIProvider, config: Partial<AgentConfig> = {}) {
    this.analyzer = new ContextAnalyzer();
    this.questionEngine = new QuestionEngine();
    this.provider = provider;
    this.config = {
      mode: 'proactive',
      mockFirst: true,
      questionThreshold: 5,
      autoPreview: true,
      provider: 'mock',
      ...config,
    };
  }

  /**
   * Main entry point: Process user request
   */
  async process(request: UserRequest): Promise<AgentResponse> {
    try {
      // 1. Analyze for context gaps
      const analysis = await this.analyzer.analyze(request);

      // 2. In passive mode or if we can proceed, generate immediately
      if (this.config.mode === 'passive' || analysis.canProceed) {
        return await this.generateCode(request, analysis);
      }

      // 3. In proactive mode with gaps, ask questions
      if (this.config.mode === 'proactive' && analysis.gaps.length > 0) {
        // Limit questions based on threshold
        const relevantGaps = analysis.gaps.slice(0, this.config.questionThreshold);

        if (relevantGaps.length === 0) {
          return await this.generateCode(request, analysis);
        }

        const flow = this.questionEngine.createFlow(relevantGaps, `req-${Date.now()}`);

        return {
          type: 'questions',
          message: this.generateQuestionIntro(analysis),
          questionFlow: flow,
          questions: flow.questions,
          suggestions: analysis.suggestions,
        };
      }

      // 4. Default: generate with what we have
      return await this.generateCode(request, analysis);

    } catch (error) {
      return {
        type: 'error',
        message: 'I encountered an issue processing your request.',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Continue with answers from question flow
   */
  async continueWithAnswers(
    flow: QuestionFlow,
    request: UserRequest,
    analysis: any
  ): Promise<AgentResponse> {
    try {
      // Get enriched context
      const enrichedContext = this.questionEngine.getFinalContext(
        flow,
        request,
        analysis
      );

      // Generate code with enriched context
      const code = await this.provider.generate(
        request.message,
        enrichedContext
      );

      return {
        type: 'generation',
        message: this.generateSuccessMessage(enrichedContext),
        code,
        suggestions: this.generateNextSteps(code),
      };

    } catch (error) {
      return {
        type: 'error',
        message: 'I had trouble generating the code.',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Generate code directly
   */
  private async generateCode(
    request: UserRequest,
    analysis: any
  ): Promise<AgentResponse> {
    try {
      const enrichedContext: EnrichedContext = {
        originalRequest: request,
        intent: analysis,
        answers: {},
        generationHints: analysis.suggestions || [],
      };

      const code = await this.provider.generate(
        request.message,
        enrichedContext
      );

      return {
        type: 'generation',
        message: this.generateSuccessMessage(enrichedContext),
        code,
        suggestions: this.generateNextSteps(code),
      };

    } catch (error) {
      return {
        type: 'error',
        message: 'I had trouble generating the code.',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Generate friendly introduction for questions
   */
  private generateQuestionIntro(analysis: any): string {
    const intros = [
      "I can create that for you! Just a few quick questions to make it perfect:",
      "Great idea! Let me ask a few questions to understand exactly what you need:",
      "I'll build that! First, let me get some details to make it just right:",
      "Perfect! A few quick questions will help me create exactly what you're envisioning:",
    ];

    return intros[Math.floor(Math.random() * intros.length)];
  }

  /**
   * Generate success message after generation
   */
  private generateSuccessMessage(context: EnrichedContext): string {
    const messages = [
      "✨ Done! I've created your component based on your preferences.",
      "🎉 Your component is ready! Check it out in the preview.",
      "✅ All set! I've built the component you requested.",
      "🚀 Component created successfully! Take a look.",
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  }

  /**
   * Generate next step suggestions
   */
  private generateNextSteps(code: any): string[] {
    const suggestions = [
      "Preview it on different screen sizes",
      "Customize the colors or styling",
      "Add more interactive elements",
      "Export your project when ready",
    ];

    return suggestions;
  }

  /**
   * Update configuration
   */
  setConfig(config: Partial<AgentConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): AgentConfig {
    return { ...this.config };
  }

  /**
   * Set AI provider
   */
  setProvider(provider: AIProvider): void {
    this.provider = provider;
  }
}
