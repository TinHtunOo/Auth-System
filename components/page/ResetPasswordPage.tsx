"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";
import { PageTransition } from "@/components/ui/page-transition";

type ResetStatus = "idle" | "loading" | "success" | "error";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<ResetStatus>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        toast.success("Password reset successfully!");
        setMessage(data.message);
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setStatus("error");
        toast.error(data.error || "Failed to reset password");
        setMessage(data.error || "Failed to reset password");
      }
    } catch (error) {
      setStatus("error");
      setMessage("An unexpected error occurred");
    }
  };

  // No token in URL
  if (!token && status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow text-center">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Invalid Link</h2>
          <p className="text-gray-600 mb-4">{message}</p>
          <Link
            href="/forgot-password"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  // Success state
  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            Password Reset!
          </h2>
          <p className="text-gray-600 mb-4">{message}</p>
          <p className="text-sm text-gray-500 mb-4">
            Redirecting to login in 3 seconds...
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Login Now
          </Link>
        </div>
      </div>
    );
  }

  // Reset form
  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
          <div>
            <h2 className="text-3xl font-bold text-center text-gray-800">
              Reset Password
            </h2>
            <p className="mt-2 text-center text-gray-600">
              Enter your new password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Error/Info message */}
            {message && status === "error" && (
              <div className="bg-red-50 text-red-600 p-3 rounded">
                {message}
              </div>
            )}

            {message && status !== "error" && (
              <div className="bg-yellow-50 text-yellow-700 p-3 rounded">
                {message}
              </div>
            )}

            {/* New Password field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <PasswordInput
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                showStrength={true} // Show strength meter
                disabled={status === "loading"}
                placeholder="At least 8 characters"
              />
            </div>

            {/* Confirm Password field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                showStrength={false} // No strength meter for confirmation
                disabled={status === "loading"}
                placeholder="Re-enter your password"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full btn-hover flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {status === "loading" && <Spinner className="w-4 h-4" />}

              {status === "loading" ? "Resetting..." : "Reset Password"}
            </button>

            {/* Link back to login */}
            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                ← Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}
