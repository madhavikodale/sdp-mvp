"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedEvent {
  id: string;
  chain: string;
  type: "block" | "tx" | "log" | "health";
  message: string;
  timestamp: Date;
}

const chains = ["Solana", "Ethereum", "Base", "Arbitrum", "XDC", "Avalanche"];
const eventTypes: FeedEvent["type"][] = ["block", "tx", "log", "health"];

const messages: Record<FeedEvent["type"], string[]> = {
  block: ["New block #", "Finalized block #", "Slot ", "Epoch "],
  tx: ["Transfer ", "Swap ", "Stake ", "Bridge ", "Mint "],
  log: ["Contract event emitted", "Oracle update", "Governance vote", "Price feed update"],
  health: ["Endpoint healthy", "Latency optimized", "Failover activated", "Node synced"],
};

export function WebSocketFeed({ className = "" }: { className?: string }) {
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Simulate connection toggle
    const connectionInterval = setInterval(() => {
      setIsConnected((prev) => !prev);
    }, 8000);

    return () => clearInterval(connectionInterval);
  }, []);

  useEffect(() => {
    if (!isConnected) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const chain = chains[Math.floor(Math.random() * chains.length)];
      const messageList = messages[type];
      const baseMessage = messageList[Math.floor(Math.random() * messageList.length)];
      const suffix = type === "block" || type === "tx" ? Math.floor(Math.random() * 1000000).toString() : "";

      const newEvent: FeedEvent = {
        id: Math.random().toString(36).slice(2),
        chain,
        type,
        message: `${baseMessage}${suffix}`,
        timestamp: new Date(),
      };

      setEvents((prev) => [newEvent, ...prev].slice(0, 20));
    }, 1200);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isConnected]);

  const typeColors = {
    block: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    tx: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    log: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    health: "bg-sdp-accent/20 text-sdp-accent border-sdp-accent/30",
  };

  return (
    <div className={cn("rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm overflow-hidden", className)}>
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-sdp-accent" />
          <h3 className="font-medium text-white">Live Feed</h3>
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Wifi className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-xs text-emerald-400">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3.5 w-3.5 text-red-400" />
              <span className="text-xs text-red-400">Reconnecting...</span>
            </>
          )}
        </div>
      </div>
      <div className="h-[280px] overflow-y-auto p-2">
        <AnimatePresence initial={false}>
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-1.5 flex items-center gap-3 rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2"
            >
              <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border", typeColors[event.type])}>
                {event.type}
              </span>
              <span className="text-xs font-medium text-white/70">{event.chain}</span>
              <span className="flex-1 truncate text-xs text-white/50">{event.message}</span>
              <span className="text-[10px] text-white/30">
                {event.timestamp.toLocaleTimeString()}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        {events.length === 0 && (
          <div className="flex h-full items-center justify-center text-sm text-white/30">
            Waiting for events...
          </div>
        )}
      </div>
    </div>
  );
}
