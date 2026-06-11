import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { type SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, ...props }, ref) => {
    const selectId = id || props.name || Math.random().toString(36).slice(2);
    return (
      <div className="grid gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-sdp-text-high">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "flex h-10 w-full appearance-none rounded-lg border border-sdp-border bg-white px-3 py-2 pr-10 text-sm text-sdp-text-high",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sdp-accent/20 focus-visible:border-sdp-accent",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-sdp-error-text focus-visible:border-sdp-error-text focus-visible:ring-red-200",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sdp-text-low" />
        </div>
        {error && <p className="text-xs text-sdp-error-text">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
