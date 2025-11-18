import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AIProvider = "claude" | "gemini" | "mock";

export interface AIProviderConfig {
  provider: AIProvider;
  model: string;
  apiKey?: string;
  temperature?: number;
  maxTokens?: number;
}

interface AIProviderStore {
  config: AIProviderConfig;
  setProvider: (provider: AIProvider) => void;
  setModel: (model: string) => void;
  setConfig: (config: Partial<AIProviderConfig>) => void;
  isMockMode: boolean;
  setMockMode: (enabled: boolean) => void;
}

export const useAIProviderStore = create<AIProviderStore>()(
  persist(
    (set) => ({
      config: {
        provider: "claude",
        model: "claude-3-5-sonnet-20241022",
        temperature: 0.7,
        maxTokens: 4096,
      },
      isMockMode: true,

      setProvider: (provider) =>
        set((state) => ({
          config: { ...state.config, provider },
        })),

      setModel: (model) =>
        set((state) => ({
          config: { ...state.config, model },
        })),

      setConfig: (config) =>
        set((state) => ({
          config: { ...state.config, ...config },
        })),

      setMockMode: (enabled) => set({ isMockMode: enabled }),
    }),
    {
      name: "ai-provider-storage",
    }
  )
);
