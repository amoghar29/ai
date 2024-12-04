import { useState } from "react";
import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { signupSchema } from "../../validation/userSchema"; // Import your Zod schema
// import { button } from "@/components/ui/button";
// import { input } from "@/components/ui/input";
// import { label } from "@/components/ui/label";
// import { Icons } from "@/components/ui/icons";
// import SocialButtons from "@/components/Auth/SocialButtons";

// Define form default values
const defaultValues = {
  username: "",
  email: "",
  password: "",
};

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      // Replace this with your API call
      console.log("Form Data:", data);
      // Simulate API call
      setTimeout(() => {
        alert("Signup successful!");
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Sign Up</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Create your account to get started
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            placeholder="JohnDoe"
            {...register("username")}
            disabled={isLoading}
          />
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            placeholder="john@example.com"
            type="email"
            {...register("email")}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            {...register("password")}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
        <button className="w-full" type="submit" disabled={isLoading}>
          {/* {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />} */}
          <p>loading</p>
          Sign Up
        </button>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
    </div>
  );
}
