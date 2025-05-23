export interface Provider {
  providerName: string;
  providerKeyName: string;
}

export const PROVIDERS: Provider[] = [
  {
    providerName: "google",
    providerKeyName: "GOOGLE_GENERATIVE_AI_API_KEY"
  },
  {
    providerName: "groq",
    providerKeyName: "GROQ_API_KEY"
  },
  {
    providerName: "openai",
    providerKeyName: "OPENAI_API_KEY"
  },
  {
    providerName: "mistral",
    providerKeyName: "MISTRAL_API_KEY"
  }
];