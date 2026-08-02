import clsx from "clsx";

const Logo = ({ className, mark = "dark" }) => {
  const markColor = mark === "light" ? "text-white" : "text-ink";

  return (
    <span className={clsx("inline-flex items-center gap-2", className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700 text-sm font-extrabold text-white shadow-sm">
        O
      </span>
      <span className={clsx("font-display text-lg font-extrabold tracking-tight", markColor)}>
        ORDIX
      </span>
    </span>
  );
};

export default Logo;
