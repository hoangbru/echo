import { INTENT_LABELS } from "@/constants/search";
import { SearchIntent } from "@/types";

export function IntentBadge({
  intent,
  confidence,
}: {
  intent: SearchIntent;
  confidence: number;
}) {
  return (
    <div className="absolute top-full mt-1.5 left-4 flex items-center gap-1.5">
      <span className="text-xs text-gray-400 bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5">
        {INTENT_LABELS[intent] ?? "🔍 Tìm kiếm"}
      </span>
      {confidence < 0.6 && (
        <span className="text-xs text-yellow-400/70">độ chắc thấp</span>
      )}
    </div>
  );
}
