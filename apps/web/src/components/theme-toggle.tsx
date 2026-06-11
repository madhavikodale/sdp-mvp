"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "./theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  const options = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ] as const;

  return (
    <div className={cn("flex items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.03] p-1", className)}>
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = theme === option.value;
        return (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md text-xs transition-all duration-200",
              isActive
                ? "bg-sdp-accent text-white shadow-lg shadow-sdp-accent/25"
                : "text-white/40 hover:text-white/70 hover:bg-white/5"
            )}
            title={option.label}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        );
      })}
    </div>
  );
}
