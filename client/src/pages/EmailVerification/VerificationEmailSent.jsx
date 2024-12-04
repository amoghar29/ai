import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";

// Frontend Schema for Email Verification
const verifyEmailSchema = z.object({
  code: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must only contain digits"),
});

export default function VerificationEmailSentPage() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { code: "" },
  });

  const onSubmit = async (data) => {
    try {
      console.log("Submitted data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Email verified successfully!");
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Verify Your Email</h1>
        <p className="text-gray-500 dark:text-gray-400">
          We've sent a verification email to your registered email address.
          Please check your inbox and enter the OTP provided below.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">Enter 6-digit OTP</Label>
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                className="w-full text-center"
                placeholder="Enter OTP"
              />
            )}
          />
          {errors.code && (
            <p className="text-sm text-red-500">{errors.code.message}</p>
          )}
        </div>
        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Verify Email
        </Button>
      </form>
      <p className="text-sm text-center text-muted-foreground">
        This OTP expires in 1 hour.
      </p>
      <div className="text-center">
        <Link to="/signin" className="text-sm text-primary hover:underline">
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
