import { z } from "zod";

// Frontend Schema for User Signup
export const signupSchema = z.object({
  username: z
    .string()
    .min(5, "Username must be at least 5 characters long")
    .max(25, "Username cannot exceed 25 characters")
    .regex(/^(?!.*__)(?!.*_$)[A-Za-z0-9_]{1,30}$/, {
      message:
        "Username can only contain letters, numbers, and underscores, with no spaces or special characters.",
    }),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password cannot exceed 20 characters"),
});

// Frontend Schema for User Signin
const signinSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(20, "Password cannot exceed 20 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

// Frontend Schema for Password Reset Token Generation
export const forgetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Zod Schema for password reset validation
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/\d/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // This ensures the error appears under confirmPassword
  });
  
// Frontend Schema for Email Verification
export const verifyEmailSchema = z.object({
  code: z.string().min(1, "Token is required").max(6, "Token is too long"),
});

// Frontend Schema for Refreshing Tokens
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});
