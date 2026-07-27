import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

import FormField from "../../components/ui/FormField";
import Button from "../../components/ui/Button";
import useAuth from "../../hooks/useAuth";
import authService from "../../services/auth.service";
import { loginSchema } from "../../utils/validationSchemas";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values) => {
    try {
      await login(values);
      toast.success("Welcome back!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
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
    </div>
  );
};

export default Login;
