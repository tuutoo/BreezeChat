
import { createGroq } from "@ai-sdk/groq"
import { streamText } from "ai"
import { SCENES } from "@/lib/scenes";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const LLAMA_MODEL = "llama-3.3-70b-versatile"
const QWEN_MODEL = "qwen-qwq-32b"

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

  // baseInstructions mainly used for general translation
  const baseInstructions = `
You are a professional translation assistant. Follow these strict rules:
- If the input contains any Chinese (even mixed), translate the entire text to US English.
- Otherwise, translate everything to Simplified Chinese.
- Only output the translated text. Do not include the original, any comments, explanations, greetings, or formatting not present in the original (except for scene-specific structure).
- Preserve important markdown or structural formatting if relevant.
`;

  // No scene matched, using general translation
  if (!sceneObj) {
    return `
${baseInstructions}
Translate the following text according to these rules:
`;
  }

  // Scene matched, using scene-specific translation
  return `
${baseInstructions}
Context: ${sceneObj.name_en} - ${sceneObj.description}
Special Instructions: ${sceneObj.prompt}

Translate the following text:
`;
}


export async function POST(req: Request) {
  
  const { messages,model=LLAMA_MODEL,scene  } = await req.json();
  const systemPrompt=createSystemPrompt(scene);
  console.log(messages,model,systemPrompt);
  const result = streamText({
    model: groq(model),
    system: systemPrompt,
    temperature: 0.2,
    topP: 0.9,
    messages,
  });
  return result.toDataStreamResponse({sendReasoning: false});
}


