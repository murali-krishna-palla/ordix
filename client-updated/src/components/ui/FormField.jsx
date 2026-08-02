import { forwardRef, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import clsx from "clsx";

const FormField = forwardRef(
  ({ label, error, type = "text", className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <label className="block text-left">
        {label && (
          <span className="mb-1.5 block text-sm font-medium text-ink-soft">
            {label}
          </span>
        )}

        <span className="relative block">
          <input
            ref={ref}
            type={inputType}
            className={clsx(
              "w-full rounded-lg border bg-surface px-3.5 py-2.5 text-[15px] text-ink outline-none transition placeholder:text-muted/70",
              "focus:border-brand-500 focus:ring-4 focus:ring-brand-100",
              error ? "border-danger/60" : "border-line",
              isPassword && "pr-10",
              className
            )}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted hover:text-ink-soft"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
            </button>
          )}
        </span>

        {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
      </label>
    );
  }
);

FormField.displayName = "FormField";

export default FormField;
