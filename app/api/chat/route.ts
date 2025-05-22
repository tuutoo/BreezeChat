import { createGroq } from "@ai-sdk/groq"
import { streamText  } from "ai"
import { google } from '@ai-sdk/google'; // Import Google Gemini provider
import { openai } from '@ai-sdk/openai';
import { prisma } from '@/lib/prisma';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// const LLAMA_MODEL = "llama-3.3-70b-versatile"
const QWEN_MODEL = "qwen-qwq-32b"
const GEMINI_MODEL = "gemini-2.5-flash-preview-05-20"
const GPT_4_MODEL = "gpt-4o-mini"

const groq = createGroq({
  fetch: async (url, options) => {
    if (options?.body) {
      const body = JSON.parse(options.body as string)
      if (body?.model === QWEN_MODEL) {
        body.reasoning_format = "parsed"
        options.body = JSON.stringify(body)
      }
    }

    return fetch(url, options)
  },
})

async function createSystemPrompt(scene: string): Promise<string> {
  // 从数据库获取场景信息
  const sceneObj = await prisma.scene.findUnique({
    where: { name: scene }
  });

  // General translation instructions
  const baseInstructions = `
You are a highly reliable, professional translation assistant. Always identify the primary language of the input text based on comprehensive analysis of syntax, vocabulary, and linguistic patterns. Follow these strict rules:
- If the input's primary language is Chinese, translate the entire content into US English.
- If the input's primary language is not Chinese, translate the entire content into Simplified Chinese.
- Output only the translated text. Do not include the original text, comments, explanations, or any unnecessary formatting, unless specifically required by the scenario.
- Preserve important markdown, code, or structural formatting when present.
- If a specific structure or style is required by the scenario, strictly follow those requirements.
`;

  // If no matching scene, use general translation
  if (!sceneObj) {
    return `
${baseInstructions}
Translate the following text according to these rules:
`;
  }

  // If a matching scene is found, add context and special instructions
  return `
${baseInstructions}
Context: ${sceneObj.nameEn} - ${sceneObj.description}
Special Instructions: ${sceneObj.prompt}

Translate the following text according to these requirements:
`;
}

export async function POST(req: Request) {
  const { messages, model = GEMINI_MODEL, scene } = await req.json();
  const systemPrompt = await createSystemPrompt(scene);
  //console.log(messages, model, systemPrompt);

  // Select provider based on model
  let provider;
  switch (model) {
    case GEMINI_MODEL:
      provider = google(model);
      break;
    case GPT_4_MODEL:
      provider = openai(model);
      break;
    default:
      provider = groq(model);
  }

  const result = streamText({
    model: provider,
    system: systemPrompt,
    temperature: 0.2,
    topP: 0.9,
    messages,
  });
  return result.toDataStreamResponse({ sendReasoning: false });
}


