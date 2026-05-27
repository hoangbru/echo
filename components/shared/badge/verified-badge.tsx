import { CheckCircle2 } from "lucide-react";

export function VerifiedBadge() {
  return (
    <div title="Verified Artist" className="flex items-center">
      <CheckCircle2 className="w-4 h-4 fill-blue-500 text-white" />
    </div>
  );
}
