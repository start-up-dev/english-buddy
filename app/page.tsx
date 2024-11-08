import AudioInterface from "@/components/AudioInterface";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8 text-center">
        OpenAI Audio Interface
      </h1>
      <AudioInterface />
    </main>
  );
}
