"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/page-transition";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  emailVerified: boolean; // Add this
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/user/me");

      if (!response.ok) {
        router.push("/login");
        return;
      }

      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsResending(true);
    setResendMessage("");

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setResendMessage("✅ Verification email sent! Check your inbox.");
        toast.success("Verification email sent! Check your inbox.");
      } else {
        toast.error(data.error || "Failed to send email");

        setResendMessage(`❌ ${data.error || "Failed to send email"}`);
      }
    } catch (error) {
      setResendMessage("❌ An unexpected error occurred");
    } finally {
      setIsResending(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      toast.success("Logged out successfully");

      router.push("/login");
    } catch (error) {
      toast.error("Logout failed");

      setIsLoggingOut(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-20" />
              </div>

              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>

            <div className="mt-6 bg-white shadow rounded-lg p-6">
              <Skeleton className="h-6 w-40 mb-3" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile-friendly header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Dashboard
            </h1>
            <div className="flex gap-3 w-full sm:w-auto">
              <Link
                href="/settings"
                className="flex-1 sm:flex-initial px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-center btn-hover"
              >
                ⚙️ Settings
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2 btn-hover"
              >
                {isLoggingOut && <Spinner className="w-4 h-4" />}
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </header>

        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8"
        >
          <div className="space-y-4 sm:space-y-6">
            {/* Mobile-friendly verification banner */}
            {!user.emailVerified && (
              <motion.div variants={itemVariants}>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex flex-col sm:flex-row">
                    <div className="flex-shrink-0 mb-2 sm:mb-0">
                      <svg
                        className="h-5 w-5 text-yellow-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="sm:ml-3 flex-1">
                      <p className="text-sm text-yellow-700">
                        <strong>Email not verified.</strong> Please check your
                        inbox.
                      </p>
                      <div className="mt-3">
                        <button
                          onClick={handleResendVerification}
                          disabled={isResending}
                          className="text-sm font-medium text-yellow-700 underline hover:text-yellow-600 disabled:opacity-50 transition-opacity"
                        >
                          {isResending
                            ? "Sending..."
                            : "Resend verification email"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Mobile-friendly user card */}
            <motion.div
              variants={itemVariants}
              className="bg-white shadow rounded-lg p-4 sm:p-6 card-hover"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                <h2 className="text-xl sm:text-2xl font-bold">Welcome back!</h2>
                {user.emailVerified && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 self-start sm:self-auto">
                    <svg
                      className="mr-1.5 h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Verified
                  </span>
                )}
              </div>

              <div className="space-y-3 text-gray-800 text-sm sm:text-base">
                <div className="break-words">
                  <span className="font-semibold">Name: </span>
                  <span>{user.name || "Not provided"}</span>
                </div>

                <div className="break-words">
                  <span className="font-semibold">Email: </span>
                  <span>{user.email}</span>
                </div>

                <div>
                  <span className="font-semibold">Email Status: </span>
                  <span
                    className={
                      user.emailVerified ? "text-green-600" : "text-yellow-600"
                    }
                  >
                    {user.emailVerified ? "✅ Verified" : "⚠️ Not verified"}
                  </span>
                </div>

                <div className="break-all">
                  <span className="font-semibold">User ID: </span>
                  <span className="text-xs sm:text-sm text-gray-600">
                    {user.id}
                  </span>
                </div>

                <div>
                  <span className="font-semibold">Member since: </span>
                  <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>

            {/* Mobile-friendly content card */}
            <motion.div
              variants={itemVariants}
              className="bg-white shadow rounded-lg p-4 sm:p-6 card-hover"
            >
              <h3 className="text-lg sm:text-xl font-bold mb-3">
                Protected Content
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                This is a protected page. Only authenticated users can see this
                content!
              </p>
            </motion.div>
          </div>
        </motion.main>
      </div>
    </PageTransition>
  );
}
