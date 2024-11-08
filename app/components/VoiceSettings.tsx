interface VoiceSettingsProps {
  voice: string;
  speed: number;
  model: string;
  onVoiceChange: (voice: string) => void;
  onSpeedChange: (speed: number) => void;
  onModelChange: (model: string) => void;
}

export default function VoiceSettings({
  voice,
  speed,
  model,
  onVoiceChange,
  onSpeedChange,
  onModelChange,
}: VoiceSettingsProps) {
  return (
    <div className="flex gap-4 p-4 border-b">
      <select
        value={voice}
        onChange={(e) => onVoiceChange(e.target.value)}
        className="p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600"
      >
        <option value="alloy">Alloy</option>
        <option value="echo">Echo</option>
        <option value="fable">Fable</option>
        <option value="onyx">Onyx</option>
        <option value="nova">Nova</option>
        <option value="shimmer">Shimmer</option>
      </select>

      <select
        value={model}
        onChange={(e) => onModelChange(e.target.value)}
        className="p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600"
      >
        <option value="tts-1">Standard</option>
        <option value="tts-1-hd">HD</option>
      </select>

      <input
        type="range"
        min="0.25"
        max="4.0"
        step="0.25"
        value={speed}
        onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
        className="w-32"
      />
      <span>{speed}x</span>
    </div>
  );
}
