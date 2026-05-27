"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Palette, Lock, Check } from "lucide-react";

import { THEME_OPTIONS } from "@/constants/themes";
import { useProfile } from "@/hooks/use-auth";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";

export default function ThemeSwitcher() {
  const { data: profile } = useProfile();
  const { theme, setTheme } = useTheme();
  const { onOpen } = useUpgradeModal();

  const [mounted, setMounted] = useState(false);

  const isPro = profile?.isPremium ?? false;

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const handleThemeChange = (themeId: string, isProTheme: boolean) => {
    if (isProTheme && !isPro) {
      onOpen({
        title: "Giao diện Độc quyền",
        description:
          "Các giao diện siêu ngầu như Neon, Midnight,... chỉ dành cho tài khoản Premium.",
      });
      return;
    }
    setTheme(themeId);
  };

  return (
    <div className="px-4 py-3 mb-2 border-b border-border">
      <p className="text-xs text-muted-foreground font-semibold mb-3 flex items-center gap-1">
        <Palette className="w-3 h-3" /> Giao diện cá nhân
      </p>

      <div className="flex items-center justify-between gap-1">
        {THEME_OPTIONS.map((t) => {
          const isActive = theme === t.id;

          return (
            <button
              key={t.id}
              onClick={() => handleThemeChange(t.id, t.pro)}
              className={`relative flex flex-col items-center gap-1.5 p-1 rounded-lg transition-all group ${
                isActive
                  ? "opacity-100"
                  : "opacity-70 hover:opacity-100 hover:bg-accent"
              }`}
              title={t.name}
            >
              <div
                className={`w-7 h-7 rounded-full shadow-inner flex items-center justify-center relative transition-transform group-hover:scale-110 ${
                  isActive
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-popover"
                    : "ring-1 ring-border"
                }`}
                style={{ backgroundColor: t.bgHex }}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: t.primaryHex }}
                />
              </div>

              <span
                className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}
              >
                {t.name}
              </span>

              {/* Icon Ổ khóa cho tài khoản thường */}
              {t.pro && !profile?.isPremium && (
                <div className="absolute -top-1 -right-1 bg-popover rounded-full p-[2px] shadow-sm z-10 border border-border">
                  <Lock className="w-2.5 h-2.5 text-yellow-500" />
                </div>
              )}

              {isActive && (
                <div className="absolute -top-1 -right-1 bg-primary rounded-full p-[2px] shadow-sm z-10">
                  <Check className="w-2.5 h-2.5 text-primary-foreground stroke-[3px]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
