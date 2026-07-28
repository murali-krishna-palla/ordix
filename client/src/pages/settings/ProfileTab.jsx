import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import FormField from "../../components/ui/FormField";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import restaurantService from "../../services/restaurant.service";
import { restaurantProfileSchema } from "../../utils/validationSchemas";

const ProfileTab = ({ restaurant, onSaved }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(restaurantProfileSchema),
    defaultValues: {
      name: restaurant.name || "",
      description: restaurant.description || "",
      email: restaurant.email || "",
      phone: restaurant.phone || "",
      website: restaurant.website || "",
      gstNumber: restaurant.gstNumber || "",
      fssaiNumber: restaurant.fssaiNumber || "",
      address: restaurant.address || "",
      city: restaurant.city || "",
      state: restaurant.state || "",
      country: restaurant.country || "India",
      postalCode: restaurant.postalCode || "",
      facebook: restaurant.facebook || "",
      instagram: restaurant.instagram || "",
      twitter: restaurant.twitter || "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const updated = await restaurantService.updateProfile(values);
      onSaved(updated);
      toast.success("Profile updated.");
    } catch (error) {
      toast.error(error.message || "Unable to update your profile.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <section>
        <h2 className="font-display text-base font-semibold text-ink">
          Basic information
        </h2>
        <p className="mt-0.5 text-sm text-muted">
          How your restaurant appears across ORDIX.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Restaurant name"
            error={errors.name?.message}
            {...register("name")}
          />
          <FormField
            label="Website"
            placeholder="https://your-restaurant.com"
            error={errors.website?.message}
            {...register("website")}
          />
          <FormField
            label="Restaurant email"
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <FormField
            label="Restaurant phone"
            error={errors.phone?.message}
            {...register("phone")}
          />
        </div>

        <div className="mt-4">
          <Textarea
            label="Description"
            placeholder="Tell customers what makes your restaurant worth the visit."
            error={errors.description?.message}
            {...register("description")}
          />
        </div>
      </section>

      <section>
        <h2 className="font-display text-base font-semibold text-ink">
          Address
        </h2>
        <p className="mt-0.5 text-sm text-muted">Where guests can find you.</p>

        <div className="mt-4 space-y-4">
          <FormField
            label="Address"
            error={errors.address?.message}
            {...register("address")}
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <FormField label="City" error={errors.city?.message} {...register("city")} />
            <FormField label="State" error={errors.state?.message} {...register("state")} />
            <FormField
              label="Country"
              error={errors.country?.message}
              {...register("country")}
            />
            <FormField
              label="Postal code"
              error={errors.postalCode?.message}
              {...register("postalCode")}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display text-base font-semibold text-ink">
          Legal &amp; social
        </h2>
        <p className="mt-0.5 text-sm text-muted">
          Optional — shown on invoices and your public page.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="GST number"
            error={errors.gstNumber?.message}
            {...register("gstNumber")}
          />
          <FormField
            label="FSSAI number"
            error={errors.fssaiNumber?.message}
            {...register("fssaiNumber")}
          />
          <FormField
            label="Facebook"
            placeholder="https://facebook.com/yourpage"
            error={errors.facebook?.message}
            {...register("facebook")}
          />
          <FormField
            label="Instagram"
            placeholder="https://instagram.com/yourpage"
            error={errors.instagram?.message}
            {...register("instagram")}
          />
          <FormField
            label="Twitter / X"
            placeholder="https://x.com/yourpage"
            error={errors.twitter?.message}
            {...register("twitter")}
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

export default ProfileTab;
