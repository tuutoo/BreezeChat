export interface Provider {
  providerName: string;
  envKey: string;
}

export const PROVIDERS: Provider[] = [
  {
    providerName: "google",
    envKey: "GOOGLE_API_KEY"
  },
  {
    providerName: "openai",
    envKey: "OPENAI_API_KEY"
  },
  {
    providerName: "groq1",
    envKey: "GROQ_API_KEY"
  },
  {
    providerName: "mistral",
    envKey: "MISTRAL_API_KEY"
  }
];