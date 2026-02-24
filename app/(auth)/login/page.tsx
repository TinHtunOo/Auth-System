"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { PasswordInput } from "@/components/ui/password-input";
import { PageTransition } from "@/components/ui/page-transition";

export default function LoginPage() {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "", // ✅ Removed unnecessary 'name'
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show error with suggestion
        toast.error(data.error, {
          description: data.suggestion,
          duration: 5000, // Longer duration for messages with suggestions
        });
        setIsLoading(false);
        return;
      }

      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err) {
      toast.error("Unable to connect to server", {
        description: "Please check your internet connection and try again.",
      });
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 sm:space-y-8 p-6 sm:p-8 bg-white rounded-lg shadow-lg">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
              Welcome Back
            </h2>
            <p className="mt-2 text-center text-sm sm:text-base text-gray-600">
              Sign in to your account
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 sm:mt-8 space-y-5 sm:space-y-6"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2.5 sm:py-2 text-base sm:text-sm border text-gray-800 border-gray-300 rounded-md shadow-sm focus:outline-none input-focus"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password *
              </label>
              <PasswordInput
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                showStrength={false}
                disabled={isLoading}
                placeholder="Enter your password"
              />

              <div className="mt-2 text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-2.5 sm:py-2 px-4 border border-transparent rounded-md shadow-sm text-base sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed btn-hover"
            >
              {isLoading && <Spinner className="w-4 h-4" />}
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}
