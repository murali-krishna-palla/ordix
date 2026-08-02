import { FiX, FiAlertTriangle } from "react-icons/fi";
import Button from "../ui/Button";

// Small reusable "are you sure?" dialog — used for destructive or
// state-changing actions (delete employee, deactivate, etc.) that don't
// need a reason/comment field like RejectRequestModal does.
const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  variant = "danger",
  loading = false,
  onClose,
  onConfirm,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />

      <div className="relative w-full max-w-sm rounded-xl border border-line bg-surface p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-danger/10 text-danger">
            <FiAlertTriangle size={16} />
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-muted hover:text-ink"
          >
            <FiX size={18} />
          </button>
        </div>

        <h2 className="mt-4 text-lg font-bold text-ink">{title}</h2>
        {description && (
          <p className="mt-1.5 text-sm text-muted">{description}</p>
        )}

        <div className="mt-6 flex gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant={variant}
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
