/**
 * Core type definitions for VibeCode framework
 */

// ============================================================================
// Context & Analysis Types
// ============================================================================

export interface UserRequest {
  message: string;
  projectContext?: ProjectContext;
  conversationHistory: ConversationMessage[];
}

export interface ProjectContext {
  id: string;
  name: string;
  files: ProjectFile[];
  templates?: string[];
  framework?: string;
  existingComponents?: string[];
}

export interface ProjectFile {
  path: string;
  content: string;
  type: 'component' | 'page' | 'api' | 'style' | 'config';
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// ============================================================================
// Context Gap Analysis
// ============================================================================

export type ContextGapCategory = 'style' | 'behavior' | 'data' | 'layout' | 'integration' | 'content';
export type ContextGapImportance = 'critical' | 'high' | 'medium' | 'low';

export interface ContextGap {
  category: ContextGapCategory;
  question: string;
  importance: ContextGapImportance;
  suggestedAnswers?: string[];
  canProceedWithout: boolean;
  reasoning?: string;
}

export interface IntentAnalysis {
  intent: string;
  confidence: number;
  category: 'create' | 'modify' | 'query' | 'delete' | 'export';
  targetComponent?: string;
  gaps: ContextGap[];
  canProceed: boolean;
  suggestions: string[];
}

// ============================================================================
// Question Engine
// ============================================================================

export type QuestionType = 'single_choice' | 'multiple_choice' | 'text' | 'boolean' | 'optional';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  default?: any;
  skipable: boolean;
  category: ContextGapCategory;
  validation?: (answer: any) => boolean | string;
}

export interface QuestionFlow {
  id: string;
  questions: Question[];
  currentIndex: number;
  answers: Record<string, any>;
  completed: boolean;
}

export interface EnrichedContext {
  originalRequest: UserRequest;
  intent: IntentAnalysis;
  answers: Record<string, any>;
  generationHints: string[];
}

// ============================================================================
// Agent Response
// ============================================================================

export type AgentResponseType = 'questions' | 'generation' | 'clarification' | 'error';

export interface AgentResponse {
  type: AgentResponseType;
  message: string;
  questions?: Question[];
  questionFlow?: QuestionFlow;
  code?: GeneratedCode;
  suggestions?: string[];
  error?: string;
}

export interface GeneratedCode {
  component: string;
  code: string;
  language: 'typescript' | 'javascript';
  framework: string;
  dependencies?: string[];
  preview?: boolean;
}

// ============================================================================
// Agent Configuration
// ============================================================================

export type AgentMode = 'proactive' | 'passive';

export interface AgentConfig {
  mode: AgentMode;
  mockFirst: boolean;
  questionThreshold: number;
  autoPreview: boolean;
  provider: 'mock' | 'claude' | 'gemini';
}

// ============================================================================
// Canvas & Element Types
// ============================================================================

export interface ElementNode {
  id: string;
  type: string;
  props: Record<string, any>;
  children: (ElementNode | string)[];
  path: number[];
  codeRange?: [number, number];
  metadata?: {
    editable: boolean;
    selectable: boolean;
    deletable: boolean;
  };
}

export interface ParsedComponent {
  ast: ElementNode;
  originalCode: string;
  language: 'tsx' | 'jsx';
  metadata: ComponentMetadata;
}

export interface ComponentMetadata {
  name: string;
  exports: string[];
  imports: Array<{
    source: string;
    specifiers: string[];
  }>;
  props?: Record<string, any>;
}

export interface ElementBounds {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  element: HTMLElement;
}

export interface SelectionState {
  selectedId: string | null;
  hoveredId: string | null;
  highlightedIds: string[];
}

// ============================================================================
// Property Editing
// ============================================================================

export type PropertyType = 'string' | 'number' | 'color' | 'boolean' | 'enum' | 'json';

export interface EditableProp {
  key: string;
  type: PropertyType;
  value: any;
  label: string;
  options?: string[];
  validation?: (value: any) => boolean | string;
  category?: 'style' | 'content' | 'behavior' | 'data';
}

export interface InspectorConfig {
  element: ElementNode;
  editableProps: EditableProp[];
  commonActions: Action[];
  aiSuggestions: string[];
}

export interface Action {
  id: string;
  label: string;
  icon?: string;
  execute: () => void | Promise<void>;
  disabled?: boolean;
}

// ============================================================================
// Provider Interface
// ============================================================================

export interface AIProvider {
  name: string;
  generate(prompt: string, context: EnrichedContext): Promise<GeneratedCode>;
  analyzeIntent(message: string, context: UserRequest): Promise<IntentAnalysis>;
  askQuestions(intent: IntentAnalysis): Promise<Question[]>;
}
