
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

  // Base instructions for all translations - made more explicit
  const baseInstructions = `
You are an expert translation assistant. Your sole function is to translate text.
STRICT RULES:
1.  **Language Detection & Output:**
    *   IF the input text contains any Chinese characters (including mixed Chinese-English text), you MUST translate the entire text into English (US).
    *   IF the input text is in ANY other language (e.g., English, German, French, Japanese), you MUST translate it to Simplified Chinese (简体中文).
2.  **Output Content:** You MUST output ONLY the direct translation of the text.
    *   DO NOT include the original text.
    *   DO NOT add any explanations, comments, apologies, greetings, or any other text that is not part of the translation itself. For example, do not say "Here is the translation:" or "Translated to English:".
3.  **Formatting:**
    *   Preserve essential markdown formatting from the source text (like lists, bolding, italics) if it is relevant to the meaning and structure of the translated text.
    *   For special formats like emails or meeting minutes, the scene-specific instructions will guide the structure.
`;

  if (!sceneObj) {
    // Default prompt if no specific scene is matched
    return `
${baseInstructions}
Translate the following text, adhering to all the strict rules above:
`;
  }

  // Enriched scene-specific instructions
  return `
${baseInstructions}

You are now operating under a specific scenario. In addition to the strict rules above, you MUST adhere to the following contextual guidelines for your translation task:

**Scenario Context:**
*   **Scenario Name:** ${sceneObj.name_en}
*   **Scenario Description:** ${sceneObj.description}

**Specific Task & Style Guide for this Scenario:**
${sceneObj.prompt} 
// The sceneObj.prompt now contains detailed instructions like "Your task is to translate..."

Remember: Your final output must ONLY be the translated text, formatted according to these combined instructions.

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


