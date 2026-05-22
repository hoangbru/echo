import { Crown } from "lucide-react";

interface ProBadgeProps {
  className?: string;
}

export const ProBadge = ({ className }: ProBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 border border-primary/40 text-primary text-[10px] font-bold uppercase tracking-widest ${className}`}
    >
      <Crown className="w-3 h-3" />
      Pro
    </span>
  );
};
