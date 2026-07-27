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
