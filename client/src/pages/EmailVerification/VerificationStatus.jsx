import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function VerificationStatusPage() {
  const [status, setStatus] = useState("loading");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    checkVerificationStatus();
  }, []);

  const checkVerificationStatus = async () => {
    try {
      // Simulating an API call to check verification status
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // For demonstration, we'll randomly set a status
      const statuses = ["verified", "pending", "failed"];
      setStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    } catch (error) {
      setStatus("error");
    }
  };

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      // Simulating an API call to resend verification email
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setStatus("pending");
    } catch (error) {
      // Handle error
    } finally {
      setIsResending(false);
    }
  };

  const renderStatusContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="text-center">
            <Icons.spinner className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2">Checking verification status...</p>
          </div>
        );
      case "verified":
        return (
          <Alert variant="default">
            <Icons.checkCircle className="h-4 w-4" />
            <AlertTitle>Email Verified</AlertTitle>
            <AlertDescription>
              Your email has been successfully verified. You can now access all
              features of your account.
            </AlertDescription>
          </Alert>
        );
      case "pending":
        return (
          <Alert variant="warning">
            <Icons.alertTriangle className="h-4 w-4" />
            <AlertTitle>Verification Pending</AlertTitle>
            <AlertDescription>
              Your email verification is still pending. Please check your inbox
              and spam folder for the verification email.
              <Button
                variant="link"
                onClick={handleResendVerification}
                disabled={isResending}
              >
                {isResending ? "Resending..." : "Resend verification email"}
              </Button>
            </AlertDescription>
          </Alert>
        );
      case "failed":
        return (
          <Alert variant="destructive">
            <Icons.alertCircle className="h-4 w-4" />
            <AlertTitle>Verification Failed</AlertTitle>
            <AlertDescription>
              We couldn't verify your email. Please try again or contact support
              if the problem persists.
              <Button
                variant="link"
                onClick={handleResendVerification}
                disabled={isResending}
              >
                {isResending ? "Resending..." : "Resend verification email"}
              </Button>
            </AlertDescription>
          </Alert>
        );
      case "error":
        return (
          <Alert variant="destructive">
            <Icons.alertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              An error occurred while checking your verification status. Please
              try again later.
            </AlertDescription>
          </Alert>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Email Verification Status</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Check the current status of your email verification
        </p>
      </div>
      {renderStatusContent()}
      <div className="text-center">
        <Link to="/login" className="text-sm text-primary hover:underline">
          Go to Login
        </Link>
      </div>
    </div>
  );
}
