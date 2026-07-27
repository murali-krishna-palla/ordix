import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FiArrowLeft, FiArrowRight, FiCheck } from "react-icons/fi";

import FormField from "../../components/ui/FormField";
import Button from "../../components/ui/Button";
import useAuth from "../../hooks/useAuth";
import { registerSchema } from "../../utils/validationSchemas";

const STEPS = [
  { key: "restaurant", label: "Restaurant" },
  { key: "owner", label: "Owner" },
];

const RESTAURANT_FIELDS = ["name", "email", "phone", "address", "city", "state"];

const Register = () => {
  const navigate = useNavigate();
  const { registerOwner } = useAuth();
  const [step, setStep] = useState(0);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      restaurant: { name: "", email: "", phone: "", address: "", city: "", state: "" },
      owner: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      },
    },
  });

  const goNext = async () => {
    const valid = await trigger(RESTAURANT_FIELDS.map((f) => `restaurant.${f}`));
    if (valid) setStep(1);
  };

  const onSubmit = async (values) => {
    try {
      const { confirmPassword: _confirmPassword, ...owner } = values.owner;
      await registerOwner({ restaurant: values.restaurant, owner });
      toast.success("Restaurant created — welcome to ORDIX!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.message || "Unable to create your account.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Create your restaurant</h1>
      <p className="mt-1.5 text-[15px] text-muted">
        Already on ORDIX?{" "}
        <Link to="/login" className="font-medium text-brand-600 hover:underline">
          Log in
        </Link>
      </p>

      {/* Step indicator */}
      <ol className="mt-7 flex items-center gap-3">
        {STEPS.map((s, i) => (
          <li key={s.key} className="flex flex-1 items-center gap-3">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                i < step
                  ? "bg-brand-600 text-white"
                  : i === step
                  ? "bg-ink text-white"
                  : "bg-canvas text-muted border border-line"
              }`}
            >
              {i < step ? <FiCheck size={14} /> : i + 1}
            </span>
            <span className={`text-sm font-medium ${i === step ? "text-ink" : "text-muted"}`}>
              {s.label}
            </span>
            {i === 0 && <span className="h-px flex-1 bg-line" />}
          </li>
        ))}
      </ol>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
        <div className={step === 0 ? "space-y-4" : "hidden"}>
          <FormField
            label="Restaurant name"
            placeholder="The Copper Spoon"
            error={errors.restaurant?.name?.message}
            {...register("restaurant.name")}
          />
          <FormField
            label="Restaurant email"
            type="email"
            placeholder="hello@coppersoon.com"
            error={errors.restaurant?.email?.message}
            {...register("restaurant.email")}
          />
          <FormField
            label="Restaurant phone"
            placeholder="9876543210"
            error={errors.restaurant?.phone?.message}
            {...register("restaurant.phone")}
          />
          <FormField
            label="Address"
            placeholder="221B Baker Street"
            error={errors.restaurant?.address?.message}
            {...register("restaurant.address")}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="City"
              placeholder="Hyderabad"
              error={errors.restaurant?.city?.message}
              {...register("restaurant.city")}
            />
            <FormField
              label="State"
              placeholder="Telangana"
              error={errors.restaurant?.state?.message}
              {...register("restaurant.state")}
            />
          </div>

          <Button type="button" onClick={goNext} className="mt-2">
            Continue
            <FiArrowRight size={16} />
          </Button>
        </div>

        <div className={step === 1 ? "space-y-4" : "hidden"}>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="First name"
              placeholder="Asha"
              error={errors.owner?.firstName?.message}
              {...register("owner.firstName")}
            />
            <FormField
              label="Last name"
              placeholder="Rao"
              error={errors.owner?.lastName?.message}
              {...register("owner.lastName")}
            />
          </div>
          <FormField
            label="Your email"
            type="email"
            placeholder="asha@coppersoon.com"
            error={errors.owner?.email?.message}
            {...register("owner.email")}
          />
          <FormField
            label="Your phone"
            placeholder="9876543210"
            error={errors.owner?.phone?.message}
            {...register("owner.phone")}
          />
          <FormField
            label="Password"
            type="password"
            placeholder="At least 8 characters"
            error={errors.owner?.password?.message}
            {...register("owner.password")}
          />
          <FormField
            label="Confirm password"
            type="password"
            placeholder="Re-enter your password"
            error={errors.owner?.confirmPassword?.message}
            {...register("owner.confirmPassword")}
          />

          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => setStep(0)} className="w-auto px-4">
              <FiArrowLeft size={16} />
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Create restaurant
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
