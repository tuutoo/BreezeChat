export interface Provider {
  providerName: string;
  envKey: string;
}

export const PROVIDERS: Provider[] = [
  {
    providerName: "google",
    envKey: "GOOGLE_GENERATIVE_AI_API_KEY"
  },
  {
    providerName: "openai",
    envKey: "OPENAI_API_KEY"
  },
  {
    providerName: "groq",
    envKey: "GROQ_API_KEY"
  },
  {
    providerName: "mistral",
    envKey: "MISTRAL_API_KEY"
  }
];