interface ProBadgeProps {
  className?: string;
}

export const ProBadge = ({ className }: ProBadgeProps) => {
  return (
    <span
      className={`px-2 py-0.5 text-xs font-semibold rounded-md bg-primary text-primary-foreground shadow-sm shadow-ring ${className}`}
    >
      PRO
    </span>
  );
};
