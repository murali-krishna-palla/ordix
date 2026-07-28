import { z } from "zod";

// Mirrors server/validators/auth.validator.js so the client fails fast
// with the same rules the API will ultimately enforce.

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const restaurantStepSchema = z.object({
  name: z.string().trim().min(1, "Restaurant name is required"),
  email: z.string().trim().min(1, "Restaurant email is required").email("Enter a valid email"),
  phone: z
    .string()
    .trim()
    .min(1, "Restaurant phone is required")
    .length(10, "Restaurant phone must be 10 digits"),
  address: z.string().trim().min(1, "Address is required"),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().min(1, "State is required"),
});

export const ownerStepSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
    phone: z
      .string()
      .trim()
      .min(1, "Phone number is required")
      .length(10, "Phone number must be 10 digits"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const registerSchema = z.object({
  restaurant: restaurantStepSchema,
  owner: ownerStepSchema,
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().trim().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Mirrors server/validators/restaurant.validation.js — every field there is
// optional on a PUT, but we enforce the same shape when a value is present.
export const restaurantProfileSchema = z.object({
  name: z.string().trim().min(2, "Must be at least 2 characters").max(100),
  description: z.string().trim().max(1000, "Keep it under 1000 characters").optional().or(z.literal("")),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
  phone: z.string().trim().min(10, "Must be 10–15 digits").max(15),
  website: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || /^https?:\/\/.+/i.test(val), "Enter a full URL, e.g. https://example.com"),
  gstNumber: z.string().trim().max(20).optional().or(z.literal("")),
  fssaiNumber: z.string().trim().max(20).optional().or(z.literal("")),
  address: z.string().trim().min(5, "Address is too short"),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().min(1, "State is required"),
  country: z.string().trim().min(1, "Country is required"),
  postalCode: z.string().trim().max(10).optional().or(z.literal("")),
  facebook: z.string().trim().optional().or(z.literal("")),
  instagram: z.string().trim().optional().or(z.literal("")),
  twitter: z.string().trim().optional().or(z.literal("")),
});

export const businessSettingsSchema = z.object({
  currency: z.string().trim().min(1, "Currency is required"),
  timezone: z.string().trim().min(1, "Timezone is required"),
  language: z.string().trim().min(1, "Language is required"),
  taxPercentage: z.coerce.number().min(0).max(100, "Must be between 0 and 100"),
  serviceCharge: z.coerce.number().min(0).max(100, "Must be between 0 and 100"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
