import { z } from "zod";

// Schema for User Signup
export const signupSchema = z.object({
  body: z.object({
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
  }),
});

// Schema for User Signin
export const signinSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(20, "Password cannot exceed 20 characters"),
  }),
});

// Schema for Password Reset Token Generation
export const forgetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
  }),
});

// Schema for Resetting Password
export const resetPasswordSchema = z.object({
  body: z.object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(20, "Password cannot exceed 20 characters"),
  }),
  params: z.object({
    token: z
      .string()
      .min(1, "Reset token is required.")
      .max(20, "Token is too long"),
  }),
});

// Schema for Email Verification
export const verifyEmailSchema = z.object({
  body: z.object({
    code: z.string().min(1, "Token is required").max(6, "Token is too long"),
  }),
});

// Schema for Refreshing Tokens
export const refreshTokenSchema = z.object({
  cookies: z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
  }),
});
