import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiX } from "react-icons/fi";

import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import { rejectReasonSchema } from "../../utils/validationSchemas";

// Shared by RegistrationRequests.jsx and RequestDetails.jsx so the reject
// flow (and its validation) only lives in one place.
const RejectRequestModal = ({ open, restaurantName, onClose, onConfirm }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(rejectReasonSchema),
    defaultValues: { reason: "" },
  });

  if (!open) return null;

  const handleClose = () => {
    reset();
    onClose();
  };

  const submit = async (values) => {
    await onConfirm(values.reason);
    reset();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-ink/40" onClick={handleClose} />

      <div className="relative w-full max-w-md rounded-xl border border-line bg-surface p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">Reject registration</h2>
            {restaurantName && (
              <p className="mt-1 text-sm text-muted">{restaurantName}</p>
            )}
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="text-muted hover:text-ink"
          >
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(submit)} className="mt-5 space-y-4">
          <Textarea
            label="Reason for rejection"
            placeholder="Let the owner know why this request is being rejected…"
            error={errors.reason?.message}
            {...register("reason")}
          />

          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" loading={isSubmitting}>
              Reject request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RejectRequestModal;
