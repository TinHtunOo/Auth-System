"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
      } else {
        setResendMessage(`❌ ${data.error || "Failed to send email"}`);
      }
    } catch (error) {
      setResendMessage("❌ An unexpected error occurred");
    } finally {
      setIsResending(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/login");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Verification Banner (only show if not verified) */}
          {!user.emailVerified && (
            <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
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
                <div className="ml-3 flex-1">
                  <p className="text-sm text-yellow-700">
                    <strong>Email not verified.</strong> Please check your inbox
                    and verify your email address.
                  </p>
                  <div className="mt-3">
                    <button
                      onClick={handleResendVerification}
                      disabled={isResending}
                      className="text-sm font-medium text-yellow-700 underline hover:text-yellow-600 disabled:opacity-50"
                    >
                      {isResending ? "Sending..." : "Resend verification email"}
                    </button>
                  </div>
                  {resendMessage && (
                    <p className="mt-2 text-sm">{resendMessage}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* User Info Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Welcome back!</h2>
              {user.emailVerified && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
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

            <div className="space-y-3">
              <div>
                <span className="font-semibold">Name: </span>
                <span>{user.name || "Not provided"}</span>
              </div>

              <div>
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

              <div>
                <span className="font-semibold">User ID: </span>
                <span className="text-sm text-gray-600">{user.id}</span>
              </div>

              <div>
                <span className="font-semibold">Member since: </span>
                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Protected Content Area */}
          <div className="mt-6 bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">Protected Content</h3>
            <p className="text-gray-600">
              This is a protected page. Only authenticated users can see this
              content!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
