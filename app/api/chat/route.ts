import { createGroq } from "@ai-sdk/groq"
import { streamText  } from "ai"
import { google } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'
import { PROVIDERS } from '@/lib/providers'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

// const LLAMA_MODEL = "llama-3.3-70b-versatile"

async function createSystemPrompt(scene: string): Promise<string> {
  // General translation instructions
  const baseInstructions = `
You are a highly reliable, professional translation assistant. Always identify the primary language of the input text based on comprehensive analysis of syntax, vocabulary, and linguistic patterns. Follow these strict rules:
- If the input's primary language is Chinese, translate the entire content into US English.
- If the input's primary language is not Chinese, translate the entire content into Simplified Chinese.
- Output only the translated text. Do not include the original text, comments, explanations, or any unnecessary formatting, unless specifically required by the scenario.
- Preserve important markdown, code, or structural formatting when present.
- If a specific structure or style is required by the scenario, strictly follow those requirements.
`;

    return `
${baseInstructions}
Translate the following text according to these rules:
`;
}

export async function POST(req: Request) {
  const { messages, model: modelName, scene } = await req.json();

  // 获取提供商信息
  const provider = PROVIDERS.find(p => p.providerName === modelName.split('-')[0]);

  if (!provider) {
    return new Response(
      JSON.stringify({ error: 'Provider not found' }),
      { status: 404 }
    );
  }

  // 获取 API Key
  const apiKey = process.env[provider.providerKeyName];

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: `API key not found for provider ${provider.providerName}` }),
      { status: 401 }
    );
  }

  const systemPrompt = await createSystemPrompt(scene);

  // 根据提供商选择对应的客户端
  let aiProvider;
  switch (provider.providerName) {
    case 'google':
      aiProvider = google(modelName);
      break;
    case 'openai':
      aiProvider = openai(modelName);
      break;
    case 'groq':
      aiProvider = createGroq({
        apiKey,
        fetch: async (url, options) => {
          if (options?.body) {
            const body = JSON.parse(options.body as string)
            if (body?.model === modelName) {
              body.reasoning_format = "parsed"
              options.body = JSON.stringify(body)
            }
          }
          return fetch(url, options)
        },
      })(modelName);
      break;
    default:
      return new Response(
        JSON.stringify({ error: 'Unsupported provider' }),
        { status: 400 }
      );
  }

  const result = streamText({
    model: aiProvider,
    system: systemPrompt,
    temperature: 0.2,
    topP: 0.9,
    messages,
  });
  return result.toDataStreamResponse({ sendReasoning: false });
}


