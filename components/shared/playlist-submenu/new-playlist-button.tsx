"use client";

import { Plus, Loader2 } from "lucide-react";

interface NewPlaylistButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function NewPlaylistButton({
  onClick,
  disabled = false,
}: NewPlaylistButtonProps) {
  return (
    <button
      className="flex items-center gap-2.5 p-3 text-[14px] font-medium text-foreground hover:bg-muted transition-colors text-left w-full border-b border-border disabled:opacity-60"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="w-5 h-5 rounded-sm bg-muted flex items-center justify-center shrink-0 border border-border">
        {disabled ? (
          <Loader2 className="w-3.5 h-3.5 text-foreground animate-spin" />
        ) : (
          <Plus className="w-4 h-4 text-foreground" />
        )}
      </span>
      <span>Tạo playlist mới</span>
    </button>
  );
}
