"use client";

import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

interface GlassHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function GlassHeader({
  title,
  description,
  children,
  className = "",
}: GlassHeaderProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <div
      className={cn(
        "sticky top-0 z-30 -mx-6 mb-8 border-b border-white/[0.06] bg-sdp-bg/80 px-6 py-4 backdrop-blur-xl",
        className
      )}
    >
      {/* Breadcrumb */}
      <nav className="mb-3 flex items-center gap-1.5 text-xs text-white/40">
        <Link
          href="/dashboard"
          className="flex items-center gap-1 transition-colors hover:text-white/70"
        >
          <Home className="h-3 w-3" />
          Home
        </Link>
        {segments.slice(1).map((segment, index) => {
          const href = "/dashboard/" + segments.slice(1, index + 2).join("/");
          const isLast = index === segments.slice(1).length - 1;
          const label = segment.charAt(0).toUpperCase() + segment.slice(1);
          return (
            <span key={segment + index} className="flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3" />
              {isLast ? (
                <span className="text-white/70">{label}</span>
              ) : (
                <Link
                  href={href}
                  className="transition-colors hover:text-white/70"
                >
                  {label}
                </Link>
              )}
            </span>
          );
        })}
      </nav>

      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 text-sm text-white/40">{description}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
