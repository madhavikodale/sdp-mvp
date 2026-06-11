"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { type ReactNode } from "react";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  accent: string;
}

const accentGradients: Record<string, string> = {
  indigo: "from-indigo-500/20 to-indigo-500/5 text-indigo-400",
  violet: "from-violet-500/20 to-violet-500/5 text-violet-400",
  emerald: "from-emerald-500/20 to-emerald-500/5 text-emerald-400",
  amber: "from-amber-500/20 to-amber-500/5 text-amber-400",
  sky: "from-sky-500/20 to-sky-500/5 text-sky-400",
  rose: "from-rose-500/20 to-rose-500/5 text-rose-400",
  yellow: "from-yellow-500/20 to-yellow-500/5 text-yellow-400",
  fuchsia: "from-fuchsia-500/20 to-fuchsia-500/5 text-fuchsia-400",
  cyan: "from-cyan-500/20 to-cyan-500/5 text-cyan-400",
  orange: "from-orange-500/20 to-orange-500/5 text-orange-400",
  teal: "from-teal-500/20 to-teal-500/5 text-teal-400",
  purple: "from-purple-500/20 to-purple-500/5 text-purple-400",
};

export function QuickActionCard({
  title,
  description,
  icon,
  href,
  accent,
}: QuickActionCardProps) {
  return (
    <div
      className="group rounded-xl border border-white/[0.06] p-5 transition-all duration-300 hover:border-white/[0.15] card-lift card-spotlight gradient-border"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty(
          "--mouse-x",
          `${e.clientX - rect.left}px`
        );
        e.currentTarget.style.setProperty(
          "--mouse-y",
          `${e.clientY - rect.top}px`
        );
      }}
      style={{
        background: "rgba(20, 20, 30, 0.6)",
        backdropFilter: "blur(20px) saturate(180%)",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${
            accentGradients[accent] || accentGradients.indigo
          }`}
        >
          {icon}
        </div>
        <h3 className="font-medium text-white">{title}</h3>
      </div>
      <p className="mt-3 text-sm text-white/40">{description}</p>
      <div className="mt-4">
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          Manage
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
