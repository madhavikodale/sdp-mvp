"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

type SortDirection = "asc" | "desc" | null;

interface Column<T> {
  key: string;
  header: ReactNode;
  cell: (item: T) => ReactNode;
  sortable?: boolean;
}

interface SortableTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  className?: string;
}

export function SortableTable<T>({
  columns,
  data,
  keyExtractor,
  className = "",
}: SortableTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (columnKey: string) => {
    const column = columns.find((c) => c.key === columnKey);
    if (!column?.sortable) return;

    if (sortColumn === columnKey) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortColumn(null);
        setSortDirection(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;

    const aValue = getSortValue(a, sortColumn);
    const bValue = getSortValue(b, sortColumn);

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm",
        className
      )}
    >
      <table className="w-full text-sm">
        <thead className="bg-white/[0.03]">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => handleSort(column.key)}
                className={cn(
                  "px-4 py-3 text-left font-medium text-white/40",
                  column.sortable &&
                    "cursor-pointer select-none hover:text-white/70 transition-colors"
                )}
              >
                <div className="flex items-center gap-1">
                  {column.header}
                  {column.sortable && (
                    <span className="flex flex-col">
                      <ChevronUp
                        className={cn(
                          "h-3 w-3 -mb-1 transition-colors",
                          sortColumn === column.key && sortDirection === "asc"
                            ? "text-sdp-accent"
                            : "text-white/20"
                        )}
                      />
                      <ChevronDown
                        className={cn(
                          "h-3 w-3 transition-colors",
                          sortColumn === column.key && sortDirection === "desc"
                            ? "text-sdp-accent"
                            : "text-white/20"
                        )}
                      />
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.06]">
          {sortedData.map((item, index) => (
            <tr
              key={keyExtractor(item)}
              className="group hover:bg-white/[0.03] transition-colors"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3">
                  {column.cell(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getSortValue(item: unknown, key: string): string | number {
  if (item && typeof item === "object") {
    const value = (item as Record<string, unknown>)[key];
    if (typeof value === "string" || typeof value === "number") {
      return value;
    }
  }
  return "";
}
