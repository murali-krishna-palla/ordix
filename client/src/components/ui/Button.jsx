import clsx from "clsx";
import { FiLoader } from "react-icons/fi";

const VARIANTS = {
  primary:
    "bg-ink text-white hover:bg-brand-700 disabled:hover:bg-ink",
  secondary:
    "bg-white text-ink border border-line hover:bg-canvas",
  ghost: "bg-transparent text-ink-soft hover:bg-canvas",
};

const Button = ({
  children,
  variant = "primary",
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
        "inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[15px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
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
