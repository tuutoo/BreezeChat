
import { createGroq } from "@ai-sdk/groq"
import { streamText } from "ai"
import { SCENES } from "@/lib/scenes";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const LLAMA_MODEL = "llama-3.3-70b-versatile"
const MISTRAL_MODEL = "mistral-saba-24b"
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

  if (!sceneObj) {
    return `You are a helpful assistant. Translate the following text. If it's in Chinese, translate it to English. If it's in any other language, translate it to Chinese.`;
  }

  return `
    You are an advanced AI translator assisting in the context of a ${sceneObj.name_en}. 
    
    Here’s how you should approach the translation:
    
    - **Input Language Detection**: If the input is in Chinese, translate it into English. If the input is in any other language (e.g., English, German, French), translate it into Chinese.
    - **Tone**: Ensure that the tone of the translation matches the context described below.
    - **Formality**: Pay attention to the level of formality. Some contexts may require formal language, while others may allow for a more casual tone.
    - **Clarity**: Be clear and concise, especially for professional or technical contexts.
    - **Conciseness**: If the context requires it (e.g., meetings), focus on being brief and to the point.
    - **Empathy and Approachability**: In certain contexts (e.g., customer communication), maintain a friendly, empathetic, and approachable tone.
    - **Technical Jargon**: If translating technical content (e.g., in support requests or discussions about requirements), ensure that the terminology is accurate and clear.

    Here’s a brief description of the scene:
    - **Context**: ${sceneObj.description}

    Translate the following text while considering the above guidelines.`;
}


export async function POST(req: Request) {
  
  const { messages,model=LLAMA_MODEL,scene  } = await req.json();
  console.log(messages,model,scene);
  const result = streamText({
    model: groq(model),
    system: createSystemPrompt(scene),
    temperature: 0.3,
    topP: 0.9,
    messages,
  });
  return result.toDataStreamResponse({sendReasoning: false});
}


