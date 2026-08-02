import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { FiLock } from "react-icons/fi";
import FormField from "../../components/ui/FormField";
import Button from "../../components/ui/Button";
import authService from "../../services/auth.service";
import { changePasswordSchema } from "../../utils/validationSchemas";

const SecurityTab = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (values) => {
    try {
      await authService.changePassword(values);
      toast.success("Password changed.");
      reset();
    } catch (error) {
      toast.error(error.message || "Unable to change your password.");
    }
  };

  return (
    <div className="max-w-sm">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <FiLock size={15} />
        </span>
        <h2 className="font-display text-base font-semibold text-ink">
          Change password
        </h2>
      </div>
      <p className="mt-0.5 pl-[42px] text-sm text-muted">
        Use a password you're not using anywhere else.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <FormField
          label="Current password"
          type="password"
          error={errors.currentPassword?.message}
          {...register("currentPassword")}
        />
        <FormField
          label="New password"
          type="password"
          placeholder="At least 8 characters"
          error={errors.newPassword?.message}
          {...register("newPassword")}
        />
        <FormField
          label="Confirm new password"
          type="password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button type="submit" loading={isSubmitting} className="w-auto px-6">
          Update password
        </Button>
      </form>
    </div>
  );
};

export default SecurityTab;
