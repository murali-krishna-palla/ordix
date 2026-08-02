import { forwardRef } from "react";
import { FiChevronDown, FiAlertCircle } from "react-icons/fi";
import clsx from "clsx";

const Select = forwardRef(
  ({ label, error, className, children, ...props }, ref) => {
    return (
      <label className="block text-left">
        {label && (
          <span className="mb-1.5 block text-sm font-medium text-ink-soft">
            {label}
          </span>
        )}

        <span className="relative block">
          <select
            ref={ref}
            className={clsx(
              "w-full appearance-none rounded-lg border bg-surface px-3.5 py-2.5 pr-9 text-[15px] text-ink outline-none transition",
              "focus:border-brand-500 focus:ring-4 focus:ring-brand-100",
              error
                ? "border-danger/60 focus:border-danger focus:ring-danger-soft"
                : "border-line hover:border-faint",
              className
            )}
            {...props}
          >
            {children}
          </select>
          <FiChevronDown
            size={15}
            className="pointer-events-none absolute inset-y-0 right-3 my-auto text-muted"
          />
        </span>

        {error && (
          <span className="mt-1.5 flex items-center gap-1 text-xs font-medium text-danger">
            <FiAlertCircle size={12} />
            {error}
          </span>
        )}
      </label>
    );
  }
);

Select.displayName = "Select";

export default Select;
