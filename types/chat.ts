/**
 * Chat Interface Types
 * TypeScript definitions for the vibecoding chat interface
 */

export type AIProvider = 'claude' | 'gemini' | 'mock';

export interface AIProviderConfig {
  id: AIProvider;
  name: string;
  description: string;
  costPerToken: number;
  available: boolean;
  maxTokens: number;
  icon?: string;
}

export type MessageRole = 'user' | 'assistant' | 'system';

export type MessageContentType = 'text' | 'code' | 'component' | 'image' | 'error';

export interface CodeContent {
  language: string;
  code: string;
  filename?: string;
  highlightLines?: number[];
}

export interface ComponentPreview {
  componentName: string;
  props?: Record<string, any>;
  previewUrl?: string;
}

export interface ComponentArtifact {
  type: 'component';
  code: string;
  name: string;
  language: 'tsx' | 'jsx';
  version: number;
}

export interface MessageContent {
  type: MessageContentType;
  text?: string;
  code?: CodeContent;
  component?: ComponentPreview;
  imageUrl?: string;
  error?: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: MessageContent[];
  timestamp: Date;
  provider?: AIProvider;
  tokens?: number;
  cost?: number;
  artifact?: ComponentArtifact;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  provider: AIProvider;
  totalTokens: number;
  totalCost: number;
}

export interface VoiceRecording {
  id: string;
  blob: Blob;
  duration: number;
  transcription?: string;
  timestamp: Date;
}

export interface ChatInputState {
  text: string;
  isRecording: boolean;
  attachments: File[];
  selectedProvider: AIProvider;
}

export interface ChatUIState {
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
  scrollToBottom: boolean;
}

export interface ProviderStatus {
  provider: AIProvider;
  available: boolean;
  responseTime?: number;
  errorRate?: number;
  lastChecked: Date;
}
