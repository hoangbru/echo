const intentLabels: Record<string, string> = {
  song_name: "🎵 Tên bài hát",
  artist: "🎤 Ca sĩ / nghệ sĩ",
  lyrics: "📝 Lời bài hát",
  humming: "🎼 Giai điệu",
  mood: "💫 Tâm trạng / thể loại",
  unknown: "🔍 Tìm kiếm",
};

export function IntentBadge({
  intent,
  confidence,
}: {
  intent: string;
  confidence: number;
}) {
  return (
    <div className="absolute top-full mt-1.5 left-4 flex items-center gap-1.5">
      <span className="text-xs text-gray-400 bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5">
        {intentLabels[intent] ?? "🔍 Tìm kiếm"}
      </span>
      {confidence < 0.6 && (
        <span className="text-xs text-yellow-400/70">độ chắc thấp</span>
      )}
    </div>
  );
}
