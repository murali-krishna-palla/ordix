import clsx from "clsx";
import { REGISTRATION_STATUS } from "../../constants";

const STYLES = {
  [REGISTRATION_STATUS.PENDING]: "bg-ember-400/10 text-ember-500 ring-1 ring-ember-400/20",
  [REGISTRATION_STATUS.APPROVED]: "bg-success-soft text-success ring-1 ring-success/20",
  [REGISTRATION_STATUS.REJECTED]: "bg-danger-soft text-danger ring-1 ring-danger/20",
};

const DOTS = {
  [REGISTRATION_STATUS.PENDING]: "bg-ember-500",
  [REGISTRATION_STATUS.APPROVED]: "bg-success",
  [REGISTRATION_STATUS.REJECTED]: "bg-danger",
};

const StatusBadge = ({ status, className }) => {
  const normalized = String(status || "").toLowerCase();

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
        STYLES[normalized] || "bg-canvas-alt text-muted ring-1 ring-line",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={clsx("h-1.5 w-1.5 rounded-full", DOTS[normalized] || "bg-faint")}
      />
      {normalized || "unknown"}
    </span>
  );
};

export default StatusBadge;
