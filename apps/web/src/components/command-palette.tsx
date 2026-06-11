"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Command,
  Globe,
  Radio,
  LineChart,
  KeyRound,
  Wallet,
  Users,
  Zap,
  Brain,
  Flame,
  Shield,
  Layers,
  Handshake,
  Settings,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const commands = [
  { id: "rpc", label: "RPC Endpoints", href: "/dashboard/rpc", icon: Globe, shortcut: "R" },
  { id: "streams", label: "Streams", href: "/dashboard/streams", icon: Radio, shortcut: "S" },
  { id: "analytics", label: "Analytics", href: "/dashboard/analytics", icon: LineChart, shortcut: "A" },
  { id: "api-keys", label: "API Keys", href: "/dashboard/api-keys", icon: KeyRound, shortcut: "K" },
  { id: "wallets", label: "Wallets", href: "/dashboard/wallets", icon: Wallet, shortcut: "W" },
  { id: "team", label: "Team", href: "/dashboard/team", icon: Users, shortcut: "T" },
  { id: "gasless", label: "Gasless", href: "/dashboard/gasless", icon: Zap, shortcut: "G" },
  { id: "intents", label: "AI Intents", href: "/dashboard/intents", icon: Brain, shortcut: "I" },
  { id: "gas", label: "Gas Optimizer", href: "/dashboard/gas", icon: Flame, shortcut: "O" },
  { id: "compliance", label: "Compliance", href: "/dashboard/compliance", icon: Shield, shortcut: "C" },
  { id: "rollup", label: "Rollups", href: "/dashboard/rollup", icon: Layers, shortcut: "L" },
  { id: "partners", label: "Partners", href: "/dashboard/partners", icon: Handshake, shortcut: "P" },
  { id: "settings", label: "Settings", href: "/dashboard/settings", icon: Settings, shortcut: "," },
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = useCallback(
    (cmd: (typeof commands)[0]) => {
      router.push(cmd.href);
      setIsOpen(false);
      setQuery("");
    },
    [router]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filteredCommands[selectedIndex];
        if (cmd) handleSelect(cmd);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, handleSelect]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-sm text-white/40 transition-all hover:border-white/[0.12] hover:text-white/70"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="ml-2 hidden rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-mono sm:inline">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed left-1/2 top-[20%] z-50 w-full max-w-2xl -translate-x-1/2 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0f0f16]/95 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-4">
                <Command className="h-5 w-5 text-white/40" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search commands, pages..."
                  className="flex-1 bg-transparent text-lg text-white placeholder-white/30 outline-none"
                  autoFocus
                />
                <kbd className="rounded bg-white/[0.06] px-2 py-1 text-xs font-mono text-white/40">
                  ESC
                </kbd>
              </div>

              <div className="max-h-[400px] overflow-y-auto p-2">
                {filteredCommands.length === 0 ? (
                  <div className="py-8 text-center text-white/40">
                    No commands found
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredCommands.map((cmd, index) => {
                      const Icon = cmd.icon;
                      const isSelected = index === selectedIndex;
                      return (
                        <Link
                          key={cmd.id}
                          href={cmd.href}
                          onClick={(e) => {
                            e.preventDefault();
                            handleSelect(cmd);
                          }}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-150",
                            isSelected
                              ? "bg-sdp-accent/20 text-white"
                              : "text-white/60 hover:bg-white/[0.05] hover:text-white"
                          )}
                          onMouseEnter={() => setSelectedIndex(index)}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="flex-1 font-medium">{cmd.label}</span>
                          <kbd className="rounded bg-white/[0.06] px-1.5 py-0.5 text-xs font-mono">
                            {cmd.shortcut}
                          </kbd>
                          <ArrowRight
                            className={cn(
                              "h-3.5 w-3.5 transition-opacity",
                              isSelected ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
