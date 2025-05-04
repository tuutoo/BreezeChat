
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

function createSystemPrompt(scene: string) {
  const sceneObj = SCENES.find((s) => s.name === scene);

  // Base instructions for all translations
  const baseInstructions = `
You are a smart translation assistant.
- Detect the input language:
  • If it's in Chinese, output only the English translation.
  • If it's in any other language (e.g., English, German, French), output only the Chinese translation.
- Do not add explanations, commentary, or extra text—only the translated output.
`;

  if (!sceneObj) {
    return `
${baseInstructions}
Translate the following text:
`;
  }

  // Enriched scene-specific instructions
  return `
${baseInstructions}
Scenario: ${sceneObj.name_en}
Description: ${sceneObj.description}

Additional guidelines:
- Follow the tone, formality, and structure implied by this scenario.
- Use vocabulary and sentence patterns appropriate to the context.
- Respect any special formatting (e.g., greetings and closings for emails, headings for minutes).
- Keep the translation clear, concise, and natural.

Prompt blueprint:
${sceneObj.prompt}

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


