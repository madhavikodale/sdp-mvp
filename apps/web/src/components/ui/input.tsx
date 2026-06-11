import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, id, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).slice(2);
    return (
      <div className="grid gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-sdp-text-high">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "flex h-10 w-full rounded-lg border border-sdp-border bg-white px-3 py-2 text-sm text-sdp-text-high",
            "placeholder:text-sdp-text-extra-low",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sdp-accent/20 focus-visible:border-sdp-accent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-sdp-error-text focus-visible:border-sdp-error-text focus-visible:ring-red-200",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-sdp-error-text">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
