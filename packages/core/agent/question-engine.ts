/**
 * Question Engine - Generates and manages question flows
 */

import type {
  ContextGap,
  Question,
  QuestionFlow,
  EnrichedContext,
  UserRequest,
  IntentAnalysis,
} from '../types';

// ============================================================================
// Question Engine Class
// ============================================================================

export class QuestionEngine {
  /**
   * Create question flow from context gaps
   */
  createFlow(gaps: ContextGap[], requestId: string): QuestionFlow {
    const questions = gaps.map((gap, index) => this.gapToQuestion(gap, index));

    return {
      id: `flow-${requestId}-${Date.now()}`,
      questions,
      currentIndex: 0,
      answers: {},
      completed: false,
    };
  }

  /**
   * Convert context gap to question
   */
  private gapToQuestion(gap: ContextGap, index: number): Question {
    const baseQuestion: Question = {
      id: `q-${index}-${gap.category}`,
      text: gap.question,
      type: gap.suggestedAnswers ? 'single_choice' : 'text',
      options: gap.suggestedAnswers,
      skipable: gap.canProceedWithout,
      category: gap.category,
    };

    // Set default based on importance
    if (gap.suggestedAnswers && gap.canProceedWithout) {
      if (gap.importance === 'low' || gap.importance === 'medium') {
        // Auto-select "surprise me" or last option as default
        const surpriseOption = gap.suggestedAnswers.find(a =>
          a.toLowerCase().includes('surprise') || a.toLowerCase().includes('decide')
        );
        baseQuestion.default = surpriseOption || gap.suggestedAnswers[gap.suggestedAnswers.length - 1];
      }
    }

    return baseQuestion;
  }

  /**
   * Process answer and update flow
   */
  processAnswer(
    flow: QuestionFlow,
    questionId: string,
    answer: any
  ): QuestionFlow {
    const updatedFlow = {
      ...flow,
      answers: {
        ...flow.answers,
        [questionId]: answer,
      },
    };

    // Move to next question
    const currentQuestion = flow.questions.find(q => q.id === questionId);
    if (currentQuestion) {
      const currentIdx = flow.questions.indexOf(currentQuestion);
      updatedFlow.currentIndex = currentIdx + 1;

      // Check if completed
      if (updatedFlow.currentIndex >= flow.questions.length) {
        updatedFlow.completed = true;
      }
    }

    return updatedFlow;
  }

  /**
   * Skip current question (use default)
   */
  skipQuestion(flow: QuestionFlow): QuestionFlow {
    const currentQuestion = flow.questions[flow.currentIndex];

    if (!currentQuestion || !currentQuestion.skipable) {
      return flow;
    }

    return this.processAnswer(
      flow,
      currentQuestion.id,
      currentQuestion.default || 'Skip'
    );
  }

  /**
   * Skip all remaining questions
   */
  skipAll(flow: QuestionFlow): QuestionFlow {
    let updatedFlow = { ...flow };

    while (!updatedFlow.completed) {
      const currentQuestion = updatedFlow.questions[updatedFlow.currentIndex];

      if (!currentQuestion) break;

      if (currentQuestion.skipable) {
        updatedFlow = this.skipQuestion(updatedFlow);
      } else {
        // For non-skipable questions, use first option as default
        const defaultAnswer = currentQuestion.default ||
                            currentQuestion.options?.[0] ||
                            'Default';
        updatedFlow = this.processAnswer(
          updatedFlow,
          currentQuestion.id,
          defaultAnswer
        );
      }
    }

    return updatedFlow;
  }

  /**
   * Go back to previous question
   */
  goBack(flow: QuestionFlow): QuestionFlow {
    if (flow.currentIndex > 0) {
      return {
        ...flow,
        currentIndex: flow.currentIndex - 1,
        completed: false,
      };
    }
    return flow;
  }

  /**
   * Check if flow is complete
   */
  isComplete(flow: QuestionFlow): boolean {
    return flow.completed && flow.currentIndex >= flow.questions.length;
  }

  /**
   * Get enriched context from completed flow
   */
  getFinalContext(
    flow: QuestionFlow,
    originalRequest: UserRequest,
    intent: IntentAnalysis
  ): EnrichedContext {
    const generationHints: string[] = [];

    // Generate hints based on answers
    for (const [questionId, answer] of Object.entries(flow.answers)) {
      const question = flow.questions.find(q => q.id === questionId);
      if (!question) continue;

      // Skip "skip" or "surprise me" answers
      if (typeof answer === 'string' &&
          (answer.toLowerCase().includes('skip') ||
           answer.toLowerCase().includes('surprise') ||
           answer.toLowerCase().includes('decide'))) {
        continue;
      }

      // Create hint based on category
      switch (question.category) {
        case 'style':
          generationHints.push(`Use ${answer} visual style`);
          break;
        case 'behavior':
          generationHints.push(`Include behavior: ${answer}`);
          break;
        case 'data':
          generationHints.push(`Data source: ${answer}`);
          break;
        case 'layout':
          generationHints.push(`Layout: ${answer}`);
          break;
        case 'integration':
          generationHints.push(`Integrate with: ${answer}`);
          break;
        case 'content':
          generationHints.push(`Content: ${answer}`);
          break;
      }
    }

    return {
      originalRequest,
      intent,
      answers: flow.answers,
      generationHints,
    };
  }

  /**
   * Get progress percentage
   */
  getProgress(flow: QuestionFlow): number {
    return (flow.currentIndex / flow.questions.length) * 100;
  }

  /**
   * Get current question
   */
  getCurrentQuestion(flow: QuestionFlow): Question | null {
    return flow.questions[flow.currentIndex] || null;
  }
}

// ============================================================================
// Export
// ============================================================================

export const questionEngine = new QuestionEngine();
