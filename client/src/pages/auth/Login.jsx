import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FiArrowRight, FiClock } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

import FormField from "../../components/ui/FormField";
import Button from "../../components/ui/Button";
import useAuth from "../../hooks/useAuth";
import authService from "../../services/auth.service";
import { loginSchema } from "../../utils/validationSchemas";

// Codes the API may send back instead of a normal auth failure when a
// restaurant owner tries to log in before their request has been reviewed.
const PENDING_APPROVAL_CODES = ["PENDING_APPROVAL", "REGISTRATION_PENDING"];

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [pendingApproval, setPendingApproval] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values) => {
    setPendingApproval(false);
    try {
      await login(values);
      toast.success("Welcome back!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      const isPending =
        PENDING_APPROVAL_CODES.includes(error.code) ||
        /pending approval|registration.*pending/i.test(error.message || "");

      if (isPending) {
        // Don't redirect — just let them know, right on this page.
        setPendingApproval(true);
        return;
      }

      toast.error(error.message || "Unable to log in.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Log in to ORDIX</h1>
      <p className="mt-1.5 text-[15px] text-muted">
        New restaurant?{" "}
        <Link to="/register" className="font-medium text-brand-600 hover:underline">
          Set up your account
        </Link>
      </p>

      {pendingApproval && (
        <div className="animate-fade-in mt-6 flex gap-3 rounded-lg border border-ember-400/25 bg-ember-400/10 p-4">
          <FiClock size={18} className="mt-0.5 shrink-0 text-ember-500" />
          <div>
            <p className="text-sm font-semibold text-ink">
              Registration pending approval
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              Your restaurant's registration is still awaiting Super Admin
              review. You'll be able to log in as soon as it's approved.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <FormField
          label="Email"
          type="email"
          placeholder="you@restaurant.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <div>
          <FormField
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />
          <Link
            to="/forgot-password"
            className="mt-2 inline-block text-sm font-medium text-brand-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" loading={isSubmitting} className="mt-2">
          Log in
          <FiArrowRight size={16} />
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-xs uppercase tracking-wide text-muted">or</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <Button
        variant="secondary"
        onClick={() => {
          window.location.href = authService.googleLoginUrl();
        }}
      >
        <FcGoogle size={18} />
        Continue with Google
      </Button>

      <p className="mt-8 text-center text-xs text-muted">
        <Link to="/super-admin/login" className="hover:text-ink-soft hover:underline">
          Super Admin login
        </Link>
      </p>
    </div>
  );
};

export default Login;
