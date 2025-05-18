import { createGroq } from "@ai-sdk/groq"
import { streamText } from "ai"
import { SCENES } from "@/lib/scenes";
import { google } from '@ai-sdk/google'; // Import Google Gemini provider


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// const LLAMA_MODEL = "llama-3.3-70b-versatile"
const QWEN_MODEL = "qwen-qwq-32b"
const GEMINI_MODEL = "gemini-2.5-flash-preview-04-17"

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

function createSystemPrompt(scene: string): string {
  const sceneObj = SCENES.find((s) => s.name === scene);

  // General translation instructions
  const baseInstructions = `
You are a highly reliable, professional translation assistant. Follow these strict rules:
- If the input contains any Chinese (even mixed), translate the entire content into US English.
- Otherwise, translate the entire content into Simplified Chinese.
- Only output the translated text. Do not include the original, comments, explanations, labels, greetings, or any extra formatting not present in the original, except as required by the specific scenario.
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
Context: ${sceneObj.name_en} - ${sceneObj.description}
Special Instructions: ${sceneObj.prompt}

Translate the following text according to these requirements:
`;
}


export async function POST(req: Request) {
  const { messages, model = GEMINI_MODEL, scene } = await req.json();
  const systemPrompt = createSystemPrompt(scene);
  console.log(messages, model, systemPrompt);

  // Select provider based on model
  const provider =
    model === GEMINI_MODEL
      ? google(model) // Use Gemini provider if GEMINI_MODEL is selected
      : groq(model); // Otherwise use Groq

  const result = streamText({
    model: provider,
    system: systemPrompt,
    temperature: 0.2,
    topP: 0.9,
    messages,
  });
  return result.toDataStreamResponse({ sendReasoning: false });
}


