import { Crown } from "lucide-react";

interface ProBadgeProps {
  className?: string;
}

export const ProBadge = ({ className = "" }: ProBadgeProps) => {
  return (
    <span
      className={`flex items-center justify-center p-1 rounded-full bg-primary/20 text-yellow-300 ${className}`}
    >
      <Crown className="w-3 h-3 fill-current" />
    </span>
  );
};
