import clsx from "clsx";
import { FiLoader } from "react-icons/fi";

const VARIANTS = {
  primary:
    "bg-ink text-white shadow-sm hover:bg-brand-700 hover:shadow-md disabled:hover:bg-ink",
  secondary:
    "bg-white text-ink border border-line shadow-sm hover:border-brand-200 hover:bg-canvas-alt",
  ghost: "bg-transparent text-ink-soft hover:bg-canvas-alt",
  danger:
    "bg-danger text-white shadow-sm hover:bg-danger/90 hover:shadow-md disabled:hover:bg-danger",
  outline:
    "bg-transparent text-ink border border-line hover:border-ink/30 hover:bg-canvas-alt",
};

const SIZES = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-4 py-2.5 text-[15px] rounded-lg",
  lg: "px-5 py-3 text-[15px] rounded-lg",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className,
  disabled,
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={clsx(
        "inline-flex w-full items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100",
        SIZES[size],
        VARIANTS[variant],
        className
      )}
      {...props}
    >
      {loading && <FiLoader className="animate-spin" size={16} />}
      {children}
    </button>
  );
};

export default Button;
