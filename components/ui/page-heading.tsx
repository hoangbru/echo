import { cn } from "@/lib/utils/helpers";
import { ReactNode } from "react";

interface PageHeadingProps {
  children: ReactNode;
  className?: string;
}

export function PageHeading({ children, className }: PageHeadingProps) {
  return (
    <h2
      className={cn(
        "text-3xl font-black text-foreground tracking-tight",
        className,
      )}
    >
      {children}
    </h2>
  );
}
