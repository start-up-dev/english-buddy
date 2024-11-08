import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const {
      text,
      voice = "alloy", // alloy, echo, fable, onyx, nova, shimmer
      model = "tts-1", // tts-1 or tts-1-hd
      speed = 1.0, // 0.25 to 4.0
    } = await req.json();

    const mp3 = await openai.audio.speech.create({
      model: model,
      voice: voice,
      input: text,
      speed: speed,
    });

    // Convert the raw response to base64
    const buffer = Buffer.from(await mp3.arrayBuffer());
    const base64Audio = buffer.toString("base64");

    return NextResponse.json({ audio: base64Audio });
  } catch (error) {
    console.error("Speech generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    );
  }
}
