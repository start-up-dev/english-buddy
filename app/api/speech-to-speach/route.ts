import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(request: Request) {
  try {
    // Handle multipart form data
    const formData = await request.formData();
    const audioFile = formData.get("audio");

    if (!audioFile || !(audioFile instanceof Blob)) {
      return NextResponse.json(
        { error: "Invalid request - audio file is required" },
        { status: 400 }
      );
    }

    // First, convert speech to text using Whisper
    const transcription = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: audioFile,
      prompt: "বাংলা, English",
    });

    console.log("Transcription:", transcription.text);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-audio-preview",
      modalities: ["text", "audio"],
      audio: { voice: "alloy", format: "wav" },
      messages: [
        {
          role: "system",
          content:
            "You are a local English tutor living in Bangladesh. You speak Bengali and help users learn English. Please respond in Bangla. You have all the knowledge of the world.",
        },
        {
          role: "user",
          content: transcription.text,
        },
      ],
    });

    const audioData = response.choices[0].message.audio?.data;

    return NextResponse.json({
      audioData: audioData,
      transcription: transcription.text,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to process audio" },
      { status: 500 }
    );
  }
}
