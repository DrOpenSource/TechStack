/**
 * Context Analyzer - Analyzes user requests to identify missing context
 */

import type {
  UserRequest,
  IntentAnalysis,
  ContextGap,
  ContextGapCategory,
  ContextGapImportance,
} from '../types';

// ============================================================================
// Intent Patterns
// ============================================================================

interface IntentPattern {
  keywords: string[];
  intent: string;
  category: 'create' | 'modify' | 'query' | 'delete' | 'export';
  requiredContext: ContextGapCategory[];
}

const INTENT_PATTERNS: IntentPattern[] = [
  {
    keywords: ['create', 'build', 'make', 'generate', 'new'],
    intent: 'create_component',
    category: 'create',
    requiredContext: ['style', 'layout', 'content'],
  },
  {
    keywords: ['login', 'auth', 'authentication', 'signin', 'signup'],
    intent: 'create_auth_form',
    category: 'create',
    requiredContext: ['behavior', 'integration', 'style'],
  },
  {
    keywords: ['dashboard', 'home', 'overview'],
    intent: 'create_dashboard',
    category: 'create',
    requiredContext: ['data', 'layout', 'style'],
  },
  {
    keywords: ['form', 'input', 'submit'],
    intent: 'create_form',
    category: 'create',
    requiredContext: ['behavior', 'data', 'style'],
  },
  {
    keywords: ['button', 'card', 'modal', 'dialog'],
    intent: 'create_ui_component',
    category: 'create',
    requiredContext: ['style', 'behavior'],
  },
  {
    keywords: ['list', 'grid', 'table', 'gallery'],
    intent: 'create_data_display',
    category: 'create',
    requiredContext: ['data', 'layout', 'style'],
  },
  {
    keywords: ['edit', 'update', 'change', 'modify'],
    intent: 'modify_component',
    category: 'modify',
    requiredContext: ['content'],
  },
  {
    keywords: ['export', 'download', 'save'],
    intent: 'export_project',
    category: 'export',
    requiredContext: [],
  },
];

// ============================================================================
// Context Gap Templates
// ============================================================================

interface GapTemplate {
  category: ContextGapCategory;
  question: string;
  importance: ContextGapImportance;
  suggestedAnswers: string[];
  canProceedWithout: boolean;
  applicableIntents: string[];
}

const GAP_TEMPLATES: GapTemplate[] = [
  // Style gaps
  {
    category: 'style',
    question: 'What visual style would you prefer?',
    importance: 'medium',
    suggestedAnswers: ['Modern & Minimal', 'Professional', 'Playful & Colorful', 'Dark & Sleek', 'Surprise me!'],
    canProceedWithout: true,
    applicableIntents: ['create_component', 'create_auth_form', 'create_dashboard', 'create_ui_component'],
  },
  {
    category: 'style',
    question: 'What color scheme should I use?',
    importance: 'low',
    suggestedAnswers: ['Blue (Professional)', 'Green (Fresh)', 'Purple (Creative)', 'Neutral (Gray)', 'Match my brand'],
    canProceedWithout: true,
    applicableIntents: ['create_component', 'create_auth_form', 'create_dashboard'],
  },

  // Behavior gaps
  {
    category: 'behavior',
    question: 'Should this include "Remember me" and "Forgot password" options?',
    importance: 'high',
    suggestedAnswers: ['Yes, both', 'Just forgot password', 'Just remember me', 'Neither'],
    canProceedWithout: false,
    applicableIntents: ['create_auth_form'],
  },
  {
    category: 'behavior',
    question: 'How should the form validation work?',
    importance: 'high',
    suggestedAnswers: ['Real-time as user types', 'On submit only', 'After field loses focus', 'No validation needed'],
    canProceedWithout: true,
    applicableIntents: ['create_form', 'create_auth_form'],
  },
  {
    category: 'behavior',
    question: 'What should happen when the button is clicked?',
    importance: 'critical',
    suggestedAnswers: ['Submit a form', 'Navigate to another page', 'Show a modal', 'Toggle something', 'Custom action'],
    canProceedWithout: false,
    applicableIntents: ['create_ui_component'],
  },

  // Data gaps
  {
    category: 'data',
    question: 'Where will the data come from?',
    importance: 'high',
    suggestedAnswers: ['Mock data for now', 'API endpoint (I\'ll provide URL)', 'Database query', 'User input only'],
    canProceedWithout: true,
    applicableIntents: ['create_dashboard', 'create_data_display', 'create_form'],
  },
  {
    category: 'data',
    question: 'What kind of data should be displayed?',
    importance: 'high',
    suggestedAnswers: ['User profiles', 'Analytics/Stats', 'Product listings', 'Blog posts', 'Custom data'],
    canProceedWithout: true,
    applicableIntents: ['create_dashboard', 'create_data_display'],
  },

  // Layout gaps
  {
    category: 'layout',
    question: 'How should items be arranged?',
    importance: 'medium',
    suggestedAnswers: ['Single column (mobile-first)', 'Grid (2-3 columns)', 'Masonry layout', 'List view', 'Let AI decide'],
    canProceedWithout: true,
    applicableIntents: ['create_data_display', 'create_dashboard'],
  },

  // Integration gaps
  {
    category: 'integration',
    question: 'Are you using a specific authentication service?',
    importance: 'high',
    suggestedAnswers: ['Firebase', 'Auth0', 'Supabase', 'Custom API', 'Not sure yet (use mock)'],
    canProceedWithout: true,
    applicableIntents: ['create_auth_form'],
  },

  // Content gaps
  {
    category: 'content',
    question: 'What should the button text say?',
    importance: 'medium',
    suggestedAnswers: ['Submit', 'Continue', 'Get Started', 'Sign In', 'Custom text'],
    canProceedWithout: true,
    applicableIntents: ['create_ui_component', 'create_form'],
  },
];

// ============================================================================
// Context Analyzer Class
// ============================================================================

export class ContextAnalyzer {
  /**
   * Analyze user request for missing context
   */
  analyze(request: UserRequest): IntentAnalysis {
    const lowerMessage = request.message.toLowerCase();

    // 1. Detect intent
    const intentPattern = this.detectIntent(lowerMessage);

    // 2. Extract existing context from message
    const extractedContext = this.extractContext(lowerMessage);

    // 3. Identify gaps based on intent
    const gaps = this.identifyGaps(intentPattern, extractedContext, request);

    // 4. Generate suggestions
    const suggestions = this.generateSuggestions(intentPattern, gaps);

    // 5. Determine if we can proceed
    const canProceed = this.canProceedWithGaps(gaps);

    return {
      intent: intentPattern.intent,
      confidence: this.calculateConfidence(intentPattern, lowerMessage),
      category: intentPattern.category,
      targetComponent: this.extractComponentName(lowerMessage),
      gaps,
      canProceed,
      suggestions,
    };
  }

  /**
   * Detect user intent from message
   */
  private detectIntent(message: string): IntentPattern {
    let bestMatch: IntentPattern | null = null;
    let maxMatches = 0;

    for (const pattern of INTENT_PATTERNS) {
      const matches = pattern.keywords.filter(keyword =>
        message.includes(keyword)
      ).length;

      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = pattern;
      }
    }

    // Default to generic create if no match
    return bestMatch || INTENT_PATTERNS[0];
  }

  /**
   * Extract context already provided in message
   */
  private extractContext(message: string): Set<ContextGapCategory> {
    const provided = new Set<ContextGapCategory>();

    // Style indicators
    if (/modern|minimal|dark|light|colorful|professional/i.test(message)) {
      provided.add('style');
    }

    // Behavior indicators
    if (/click|submit|validate|toggle|animate/i.test(message)) {
      provided.add('behavior');
    }

    // Data indicators
    if (/api|database|mock|data|fetch/i.test(message)) {
      provided.add('data');
    }

    // Layout indicators
    if (/grid|column|row|flex|layout|responsive/i.test(message)) {
      provided.add('layout');
    }

    // Integration indicators
    if (/firebase|auth0|supabase|endpoint/i.test(message)) {
      provided.add('integration');
    }

    return provided;
  }

  /**
   * Identify missing context gaps
   */
  private identifyGaps(
    intentPattern: IntentPattern,
    providedContext: Set<ContextGapCategory>,
    request: UserRequest
  ): ContextGap[] {
    const gaps: ContextGap[] = [];

    // Get applicable gap templates for this intent
    const applicableGaps = GAP_TEMPLATES.filter(template =>
      template.applicableIntents.includes(intentPattern.intent)
    );

    // Check each required context area
    for (const template of applicableGaps) {
      // Skip if context already provided
      if (providedContext.has(template.category)) {
        continue;
      }

      // Skip low importance gaps if we already have many
      if (template.importance === 'low' && gaps.length > 2) {
        continue;
      }

      gaps.push({
        category: template.category,
        question: template.question,
        importance: template.importance,
        suggestedAnswers: template.suggestedAnswers,
        canProceedWithout: template.canProceedWithout,
        reasoning: `This helps me create a better ${intentPattern.intent.replace('create_', '')}`,
      });
    }

    // Sort by importance
    return gaps.sort((a, b) => {
      const importanceOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return importanceOrder[b.importance] - importanceOrder[a.importance];
    });
  }

  /**
   * Generate helpful suggestions
   */
  private generateSuggestions(intentPattern: IntentPattern, gaps: ContextGap[]): string[] {
    const suggestions: string[] = [];

    if (intentPattern.intent === 'create_auth_form') {
      suggestions.push('Include social login buttons (Google, GitHub)');
      suggestions.push('Add form validation with helpful error messages');
      suggestions.push('Make it mobile-responsive');
    } else if (intentPattern.intent === 'create_dashboard') {
      suggestions.push('Add quick stats cards at the top');
      suggestions.push('Include a recent activity section');
      suggestions.push('Make it interactive with animations');
    } else if (intentPattern.intent === 'create_ui_component') {
      suggestions.push('Add loading and disabled states');
      suggestions.push('Include accessibility features');
      suggestions.push('Make it reusable with variants');
    }

    return suggestions;
  }

  /**
   * Check if we have enough context to proceed
   */
  private canProceedWithGaps(gaps: ContextGap[]): boolean {
    // Can't proceed if any critical gaps exist
    const hasCriticalGaps = gaps.some(gap =>
      gap.importance === 'critical' && !gap.canProceedWithout
    );

    if (hasCriticalGaps) {
      return false;
    }

    // Can't proceed if too many high importance gaps
    const highImportanceGaps = gaps.filter(gap =>
      gap.importance === 'high' && !gap.canProceedWithout
    );

    return highImportanceGaps.length <= 1;
  }

  /**
   * Calculate confidence in intent detection
   */
  private calculateConfidence(pattern: IntentPattern, message: string): number {
    const matches = pattern.keywords.filter(keyword =>
      message.includes(keyword)
    ).length;

    return Math.min(0.5 + (matches * 0.2), 1.0);
  }

  /**
   * Extract component name from message
   */
  private extractComponentName(message: string): string | undefined {
    // Look for quoted strings
    const quoted = message.match(/"([^"]+)"|'([^']+)'/);
    if (quoted) {
      return quoted[1] || quoted[2];
    }

    // Look for "called X" or "named X"
    const named = message.match(/(?:called|named)\s+(\w+)/i);
    if (named) {
      return named[1];
    }

    return undefined;
  }
}

// ============================================================================
// Export
// ============================================================================

export const contextAnalyzer = new ContextAnalyzer();
