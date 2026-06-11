"use client";

import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  glowColor?: string;
}

export function GlowButton({
  children,
  variant = "primary",
  size = "md",
  glowColor = "rgba(99, 102, 241, 0.4)",
  className = "",
  ...props
}: GlowButtonProps) {
  const baseStyles =
    "relative inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 overflow-hidden group";

  const variants = {
    primary:
      "bg-gradient-to-r from-sdp-accent to-violet-500 text-white shadow-lg hover:shadow-xl hover:brightness-110",
    secondary:
      "border border-white/[0.08] bg-white/[0.05] text-white/80 hover:bg-white/[0.08] hover:text-white hover:border-white/[0.12]",
    ghost: "text-white/60 hover:text-white hover:bg-white/[0.05]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      style={
        variant === "primary"
          ? { boxShadow: `0 4px 20px ${glowColor}` }
          : undefined
      }
      {...props}
    >
      {variant === "primary" && (
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
