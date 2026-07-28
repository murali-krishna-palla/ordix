import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import FormField from "../../components/ui/FormField";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import restaurantService from "../../services/restaurant.service";
import { businessSettingsSchema } from "../../utils/validationSchemas";
import { CURRENCY_OPTIONS, LANGUAGE_OPTIONS, TIMEZONE_OPTIONS } from "../../constants";

const BusinessTab = ({ restaurant, onSaved }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(businessSettingsSchema),
    defaultValues: {
      currency: restaurant.currency || "INR",
      timezone: restaurant.timezone || "Asia/Kolkata",
      language: restaurant.language || "English",
      taxPercentage: restaurant.taxPercentage ?? 0,
      serviceCharge: restaurant.serviceCharge ?? 0,
    },
  });

  const onSubmit = async (values) => {
    try {
      const updated = await restaurantService.updateProfile(values);
      onSaved(updated);
      toast.success("Business settings updated.");
    } catch (error) {
      toast.error(error.message || "Unable to update business settings.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <section>
        <h2 className="font-display text-base font-semibold text-ink">
          Locale
        </h2>
        <p className="mt-0.5 text-sm text-muted">
          Controls how currency, dates, and menus are displayed.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Select label="Currency" error={errors.currency?.message} {...register("currency")}>
            {CURRENCY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>

          <Select label="Timezone" error={errors.timezone?.message} {...register("timezone")}>
            {TIMEZONE_OPTIONS.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </Select>

          <Select label="Language" error={errors.language?.message} {...register("language")}>
            {LANGUAGE_OPTIONS.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </Select>
        </div>
      </section>

      <section>
        <h2 className="font-display text-base font-semibold text-ink">
          Billing
        </h2>
        <p className="mt-0.5 text-sm text-muted">
          Applied automatically to every order at checkout.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Tax (%)"
            type="number"
            step="0.01"
            min="0"
            max="100"
            error={errors.taxPercentage?.message}
            {...register("taxPercentage")}
          />
          <FormField
            label="Service charge (%)"
            type="number"
            step="0.01"
            min="0"
            max="100"
            error={errors.serviceCharge?.message}
            {...register("serviceCharge")}
          />
        </div>
      </section>

      <div className="flex justify-end border-t border-line pt-5">
        <Button type="submit" loading={isSubmitting} disabled={!isDirty} className="w-auto px-6">
          Save changes
        </Button>
      </div>
    </form>
  );
};

export default BusinessTab;
