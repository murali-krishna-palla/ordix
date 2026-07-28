import clsx from "clsx";
import { REGISTRATION_STATUS } from "../../constants";

const STYLES = {
  [REGISTRATION_STATUS.PENDING]: "bg-ember-400/10 text-ember-500",
  [REGISTRATION_STATUS.APPROVED]: "bg-success/10 text-success",
  [REGISTRATION_STATUS.REJECTED]: "bg-danger/10 text-danger",
};

const DOTS = {
  [REGISTRATION_STATUS.PENDING]: "🟡",
  [REGISTRATION_STATUS.APPROVED]: "🟢",
  [REGISTRATION_STATUS.REJECTED]: "🔴",
};

const StatusBadge = ({ status, className }) => {
  const normalized = String(status || "").toLowerCase();

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
        STYLES[normalized] || "bg-canvas text-muted",
        className
      )}
    >
      <span aria-hidden="true">{DOTS[normalized] || "⚪"}</span>
      {normalized || "unknown"}
    </span>
  );
};

export default StatusBadge;
