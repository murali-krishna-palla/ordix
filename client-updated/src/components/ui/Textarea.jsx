import { forwardRef } from "react";
import clsx from "clsx";

const Textarea = forwardRef(
  ({ label, error, className, rows = 4, ...props }, ref) => {
    return (
      <label className="block text-left">
        {label && (
          <span className="mb-1.5 block text-sm font-medium text-ink-soft">
            {label}
          </span>
        )}

        <textarea
          ref={ref}
          rows={rows}
          className={clsx(
            "w-full resize-none rounded-lg border bg-surface px-3.5 py-2.5 text-[15px] text-ink outline-none transition placeholder:text-muted/70",
            "focus:border-brand-500 focus:ring-4 focus:ring-brand-100",
            error ? "border-danger/60" : "border-line",
            className
          )}
          {...props}
        />

        {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
      </label>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
