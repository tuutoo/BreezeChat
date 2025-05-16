import { NextRequest } from "next/server";
import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
  throw new Error('Missing GROQ_API_KEY environment variable')
}
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { text, model = "playai-tts", voice = "Arista-PlayAI", response_format = "wav" } = await req.json();

  if (!text) {
    return new Response("Missing text", { status: 400 });
  }

  try {
    const response = await groq.audio.speech.create({
      model,
      voice,
      input: text,
      response_format,
    });

    const buffer = Buffer.from(await response.arrayBuffer());

    return new Response(buffer, {
      headers: {
        "Content-Type": "audio/wav",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new Response("TTS Error", { status: 500 });
  }
}