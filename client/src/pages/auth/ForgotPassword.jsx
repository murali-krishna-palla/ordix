import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FiArrowLeft, FiMail } from "react-icons/fi";

import FormField from "../../components/ui/FormField";
import Button from "../../components/ui/Button";
import authService from "../../services/auth.service";
import { forgotPasswordSchema } from "../../utils/validationSchemas";

const ForgotPassword = () => {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values) => {
    try {
      await authService.forgotPassword(values);
      setSent(true);
    } catch (error) {
      toast.error(error.message || "Unable to send reset link.");
    }
  };

  if (sent) {
    return (
      <div>
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <FiMail size={20} />
        </span>
        <h1 className="mt-4 text-2xl font-bold text-ink">Check your inbox</h1>
        <p className="mt-1.5 text-[15px] text-muted">
          If an account exists for <span className="font-medium text-ink">{getValues("email")}</span>,
          a reset link is on its way. It expires in 15 minutes.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline"
        >
          <FiArrowLeft size={15} />
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Reset your password</h1>
      <p className="mt-1.5 text-[15px] text-muted">
        Enter the email on your account and we'll send a link to reset it.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <FormField
          label="Email"
          type="email"
          placeholder="you@restaurant.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Button type="submit" loading={isSubmitting}>
          Send reset link
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

export default ForgotPassword;
