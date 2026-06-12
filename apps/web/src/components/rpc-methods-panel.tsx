"use client";

import { useState, useCallback } from "react";
import { Download, FileSpreadsheet, FileJson, FileCode } from "lucide-react";
import { SortableTable } from "./sortable-table";
import { EnhancedBarChart } from "./enhanced-bar-chart";
import { cn } from "@/lib/utils";

interface RpcMethod {
  id: string;
  method: string;
  requests: number;
  percentOfTotal: number;
  errorRate: number;
  avgLatency: number;
  category: "read" | "write" | "account" | "transaction";
}

interface RpcMethodsPanelProps {
  data: RpcMethod[];
  totalRequests: number;
  className?: string;
}

export function RpcMethodsPanel({ data, totalRequests, className = "" }: RpcMethodsPanelProps) {
  const [exportOpen, setExportOpen] = useState(false);

  const chartData = {
    labels: data.slice(0, 8).map((d) => d.method),
    datasets: [
      {
        label: "Requests",
        data: data.slice(0, 8).map((d) => d.requests),
        color: "#6366f1",
      },
      {
        label: "Errors",
        data: data.slice(0, 8).map((d) => Math.round(d.requests * (d.errorRate / 100))),
        color: "#ef4444",
      },
    ],
  };

  const exportCSV = useCallback(() => {
    const headers = ["Method", "Requests", "% of Total", "Error Rate", "Avg Latency", "Category"];
    const rows = data.map((d) => [
      d.method,
      d.requests,
      d.percentOfTotal.toFixed(2) + "%",
      d.errorRate.toFixed(2) + "%",
      d.avgLatency + "ms",
      d.category,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    downloadBlob(csv, "rpc-methods.csv", "text/csv");
  }, [data]);

  const exportJSON = useCallback(() => {
    const json = JSON.stringify(data, null, 2);
    downloadBlob(json, "rpc-methods.json", "application/json");
  }, [data]);

  const columns = [
    {
      key: "method",
      header: "Method",
      sortable: true,
      cell: (item: RpcMethod) => (
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "h-2 w-2 rounded-full shrink-0",
              item.category === "read" && "bg-blue-400",
              item.category === "write" && "bg-emerald-400",
              item.category === "account" && "bg-amber-400",
              item.category === "transaction" && "bg-violet-400"
            )}
          />
          <code className="text-xs font-mono text-white/80">{item.method}</code>
        </div>
      ),
    },
    {
      key: "requests",
      header: "Requests",
      sortable: true,
      cell: (item: RpcMethod) => (
        <span className="text-sm text-white tabular-nums">{item.requests.toLocaleString()}</span>
      ),
    },
    {
      key: "percentOfTotal",
      header: "% of Total",
      sortable: true,
      cell: (item: RpcMethod) => (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-sdp-accent/60"
              style={{ width: `${item.percentOfTotal}%` }}
            />
          </div>
          <span className="text-xs text-white/50 tabular-nums">{item.percentOfTotal.toFixed(1)}%</span>
        </div>
      ),
    },
    {
      key: "errorRate",
      header: "Error Rate",
      sortable: true,
      cell: (item: RpcMethod) => (
        <span
          className={cn(
            "text-xs font-medium tabular-nums",
            item.errorRate > 5 ? "text-rose-400" : item.errorRate > 1 ? "text-amber-400" : "text-emerald-400"
          )}
        >
          {item.errorRate.toFixed(2)}%
        </span>
      ),
    },
    {
      key: "avgLatency",
      header: "Avg Latency",
      sortable: true,
      cell: (item: RpcMethod) => (
        <span className="text-xs text-white/50 tabular-nums">{item.avgLatency}ms</span>
      ),
    },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Bar Chart */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">RPC Methods Analysis</h3>
          <span className="text-xs text-white/30">Top 8 methods</span>
        </div>
        <EnhancedBarChart data={chartData} />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div>
            <h3 className="text-sm font-semibold text-white">Top RPC Methods</h3>
            <p className="text-xs text-white/30 mt-0.5">
              {totalRequests.toLocaleString()} total requests across {data.length} methods
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => setExportOpen(!exportOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
            {exportOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setExportOpen(false)} />
                <div className="absolute right-0 top-full mt-1 z-50 w-40 rounded-lg border border-white/[0.1] bg-[#0f0f16]/95 backdrop-blur-sm shadow-xl overflow-hidden">
                  <button
                    onClick={() => { exportCSV(); setExportOpen(false); }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
                    CSV
                  </button>
                  <button
                    onClick={() => { exportJSON(); setExportOpen(false); }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors"
                  >
                    <FileJson className="h-3.5 w-3.5 text-blue-400" />
                    JSON
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <SortableTable
          columns={columns}
          data={data}
          keyExtractor={(item) => item.id}
        />
      </div>
    </div>
  );
}

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
