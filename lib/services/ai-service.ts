import { useAIProviderStore } from "@/lib/stores/ai-provider-store";
import { generateMockAIResponse } from "@/lib/mock/ai-responses";

export interface AIRequest {
  message: string;
  context?: string[];
  provider?: "claude" | "gemini";
}

export interface AIResponse {
  content: string;
  provider: string;
  model: string;
  mock: boolean;
  tokens?: number;
}

export class AIService {
  private static instance: AIService;

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async sendMessage(request: AIRequest): Promise<AIResponse> {
    const { config, isMockMode } = useAIProviderStore.getState();

    if (isMockMode) {
      return this.sendMockMessage(request);
    }

    // Real API implementation would go here
    return this.sendMockMessage(request);
  }

  private async sendMockMessage(request: AIRequest): Promise<AIResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    const content = generateMockAIResponse(request.message);

    return {
      content,
      provider: "mock",
      model: "mock-model-v1",
      mock: true,
      tokens: content.length,
    };
  }

  async streamMessage(
    request: AIRequest,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    const response = await this.sendMessage(request);

    // Simulate streaming by breaking response into chunks
    const words = response.content.split(" ");
    for (let i = 0; i < words.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      onChunk(words[i] + " ");
    }
  }
}

export const aiService = AIService.getInstance();
