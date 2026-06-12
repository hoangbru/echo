"use client";

import { useEffect, useRef } from "react";
import { Search } from "lucide-react";

interface PlaylistSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}

export function PlaylistSearchInput({
  value,
  onChange,
  autoFocus = true,
}: PlaylistSearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!autoFocus) return;
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [autoFocus]);

  return (
    <div className="p-2 border-b border-border">
      <div className="flex items-center gap-2 bg-background border border-border focus-within:border-primary transition-colors rounded-sm px-2.5 py-2">
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          placeholder="Tìm playlist..."
          className="bg-transparent text-[14px] font-medium text-foreground placeholder:text-muted-foreground outline-none w-full"
        />
      </div>
    </div>
  );
}
