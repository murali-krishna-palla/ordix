import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FiArrowRight, FiShield } from "react-icons/fi";

import FormField from "../../components/ui/FormField";
import Button from "../../components/ui/Button";
import Logo from "../../components/common/Logo";
import useSuperAdminAuth from "../../hooks/useSuperAdminAuth";
import { loginSchema } from "../../utils/validationSchemas";

// Standalone page — deliberately not wrapped in AuthLayout/PublicRoute,
// since those are keyed off the restaurant admin session, not this one.
const SuperAdminLogin = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useSuperAdminAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    document.title = "Super Admin Login — ORDIX";
  }, []);

  if (!loading && isAuthenticated) {
    return <Navigate to="/super-admin/dashboard" replace />;
  }

  const onSubmit = async (values) => {
    try {
      await login(values);
      toast.success("Welcome back, Admin.");
      navigate("/super-admin/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.message || "Unable to log in.");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas px-6 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-brand-100) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="animate-fade-in relative w-full max-w-sm rounded-2xl border border-line bg-surface p-8 shadow-[var(--shadow-card-hover)]">
        <div className="flex flex-col items-center text-center">
          <Logo />
          <span className="mt-3 flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
            <FiShield size={12} />
            Super Admin
          </span>
          <h1 className="mt-4 text-2xl font-bold text-ink">Admin console login</h1>
          <p className="mt-1.5 text-[15px] text-muted">
            Review and manage restaurant registration requests.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
          <FormField
            label="Email"
            type="email"
            placeholder="admin@ordix.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <FormField
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />

          <Button type="submit" loading={isSubmitting} className="mt-2">
            Log in
            <FiArrowRight size={16} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
