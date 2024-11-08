"use client";

import { useState, useRef } from "react";

export default function AudioInterface() {
  const [prompt, setPrompt] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioInput, setAudioInput] = useState<Blob | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleTextToSpeech = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const { audioData, text } = await response.json();

      const audioBlob = new Blob([Buffer.from(audioData, "base64")], {
        type: "audio/wav",
      });
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        setAudioInput(audioBlob);
        handleSpeechToSpeech(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const handleSpeechToSpeech = async (recording: Blob) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("audio", recording);

      const response = await fetch("/api/speech-to-speach", {
        method: "POST",
        body: formData,
      });

      const { audioData, transcription } = await response.json();

      // Update the prompt with the AI's response
      setPrompt(transcription);

      // Create and play the audio response
      const audioBlob = new Blob([Buffer.from(audioData, "base64")], {
        type: "audio/mp3",
      });
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      // Optional: log the transcription for debugging
      console.log("Transcription:", transcription);
    } catch (error) {
      console.error("Error converting speech to text:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">English Buddy</h2>

          <textarea
            className="w-full text-black p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter text to convert to speech..."
            rows={4}
          />

          <div className="flex gap-2 mb-4">
            <button
              className={`mt-4 px-6 py-2 rounded-md text-white transition-colors ${
                loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              }`}
              onClick={handleTextToSpeech}
              disabled={loading}
            >
              {loading ? "Generating response..." : "Send"}
            </button>
            <button
              className={`px-6 py-2 rounded-md text-white transition-colors ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
              onClick={handleRecording}
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </button>
          </div>
          {audioUrl && (
            <div className="mt-4">
              <audio
                ref={audioRef}
                className="w-full"
                controls
                src={audioUrl}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
