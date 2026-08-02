import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";

import FormField from "../../components/ui/FormField";
import Button from "../../components/ui/Button";
import authService from "../../services/auth.service";
import { resetPasswordSchema } from "../../utils/validationSchemas";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (values) => {
    try {
      await authService.resetPassword(token, values);
      setDone(true);
      toast.success("Password reset — please log in.");
    } catch (error) {
      toast.error(error.message || "That reset link is invalid or expired.");
    }
  };

  if (done) {
    return (
      <div>
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <FiCheckCircle size={20} />
        </span>
        <h1 className="mt-4 text-2xl font-bold text-ink">Password updated</h1>
        <p className="mt-1.5 text-[15px] text-muted">
          You can now log in with your new password.
        </p>
        <Button className="mt-6" onClick={() => navigate("/login", { replace: true })}>
          Go to login
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Set a new password</h1>
      <p className="mt-1.5 text-[15px] text-muted">
        Choose a new password for your ORDIX account.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <FormField
          label="New password"
          type="password"
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register("password")}
        />
        <FormField
          label="Confirm new password"
          type="password"
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button type="submit" loading={isSubmitting}>
          Reset password
        </Button>
      </form>

      <Link
        to="/login"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline"
      >
        <FiArrowLeft size={15} />
        Back to login
      </Link>
    </div>
  );
};

export default ResetPassword;
