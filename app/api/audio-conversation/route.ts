import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.audioData) {
      return NextResponse.json(
        { error: "No audio data provided" },
        { status: 400 }
      );
    }

    const cleanBase64 = body.audioData.replace(/^data:audio\/\w+;base64,/, "");

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please respond to this recording",
            },
            {
              type: "input_audio",
              input_audio: {
                data: cleanBase64,
                format: "wav",
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    if (!response.choices?.[0]?.message) {
      throw new Error("Invalid response from OpenAI");
    }

    return NextResponse.json({
      text: response.choices[0].message.content,
      audioData: response.choices[0].message.audio?.data || null,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to process audio conversation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
