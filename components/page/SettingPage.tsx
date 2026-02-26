"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { PageTransition } from "@/components/ui/page-transition";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";

interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  emailVerified: boolean;
}

type Tab = "profile" | "security" | "account";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab") as Tab | null;
  const [activeTab, setActiveTab] = useState<Tab>(tabFromUrl || "profile");

  // Profile form
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Delete account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/user/me", {
        cache: "no-store",
      });

      if (!response.ok) {
        router.push("/login");
        return;
      }

      const data = await response.json();
      setUser(data.user);
      setProfileData({
        name: data.user.name || "",
        email: data.user.email,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);

    try {
      const response = await fetch("/api/user/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Profile updated successfully!");
        setUser(data.user);
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password changed successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(data.error || "Failed to change password");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm");
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch("/api/user/delete-account", {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Account deleted successfully");
        router.push("/");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete account");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Account Settings
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Manage your account preferences
                </p>
              </div>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <nav className="space-y-1 bg-white rounded-lg shadow p-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full text-left px-4 py-3 rounded-md font-medium transition-colors ${
                    activeTab === "profile"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  👤 Profile
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full text-left px-4 py-3 rounded-md font-medium transition-colors ${
                    activeTab === "security"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  🔒 Security
                </button>
                <button
                  onClick={() => setActiveTab("account")}
                  className={`w-full text-left px-4 py-3 rounded-md font-medium transition-colors ${
                    activeTab === "account"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  ⚙️ Account
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-6">
                      Profile Information
                    </h2>

                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              name: e.target.value,
                            })
                          }
                          className="block w-full px-3 py-2 border text-gray-500 border-gray-300 rounded-md shadow-sm focus:outline-none input-focus"
                          placeholder="Your name"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              email: e.target.value,
                            })
                          }
                          className="block w-full px-3 py-2 border text-gray-500 border-gray-300 rounded-md shadow-sm focus:outline-none input-focus"
                          placeholder="you@example.com"
                        />
                        {!user.emailVerified && (
                          <p className="mt-2 text-sm text-yellow-600">
                            ⚠️ Email not verified
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isUpdatingProfile}
                        className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2 btn-hover"
                      >
                        {isUpdatingProfile && <Spinner className="w-4 h-4" />}
                        {isUpdatingProfile ? "Saving..." : "Save Changes"}
                      </button>
                    </form>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-6">Change Password</h2>

                    <form onSubmit={handlePasswordUpdate} className="space-y-6">
                      <div>
                        <label
                          htmlFor="currentPassword"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Current Password
                        </label>
                        <PasswordInput
                          id="currentPassword"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            })
                          }
                          required
                          showStrength={false}
                          placeholder="Enter current password"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="newPassword"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          New Password
                        </label>
                        <PasswordInput
                          id="newPassword"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          required
                          showStrength={true}
                          placeholder="Enter new password"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Confirm New Password
                        </label>
                        <PasswordInput
                          id="confirmPassword"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          required
                          showStrength={false}
                          placeholder="Confirm new password"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isUpdatingPassword}
                        className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2 btn-hover"
                      >
                        {isUpdatingPassword && <Spinner className="w-4 h-4" />}
                        {isUpdatingPassword ? "Changing..." : "Change Password"}
                      </button>
                    </form>
                  </div>
                )}

                {/* Account Tab */}
                {activeTab === "account" && (
                  <div className="space-y-6">
                    {/* Account Info */}
                    <div className="bg-white rounded-lg shadow p-6">
                      <h2 className="text-xl font-bold mb-6">
                        Account Information
                      </h2>

                      <div className="space-y-4 text-gray-800">
                        <div className="flex justify-between py-3 border-b">
                          <span className="font-medium">User ID</span>
                          <span className="text-sm text-gray-600 break-all max-w-xs text-right">
                            {user.id}
                          </span>
                        </div>
                        <div className="flex justify-between py-3 border-b">
                          <span className="font-medium">Email Status</span>
                          <span
                            className={
                              user.emailVerified
                                ? "text-green-600"
                                : "text-yellow-600"
                            }
                          >
                            {user.emailVerified
                              ? "✅ Verified"
                              : "⚠️ Not verified"}
                          </span>
                        </div>
                        <div className="flex justify-between py-3 border-b">
                          <span className="font-medium">Member Since</span>
                          <span>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between py-3">
                          <span className="font-medium">Account Type</span>
                          <span>Standard</span>
                        </div>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                      <h2 className="text-xl font-bold text-red-900 mb-2">
                        Danger Zone
                      </h2>
                      <p className="text-sm text-red-700 mb-4">
                        Once you delete your account, there is no going back.
                        Please be certain.
                      </p>

                      {!showDeleteConfirm ? (
                        <button
                          onClick={() => setShowDeleteConfirm(true)}
                          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors btn-hover"
                        >
                          Delete Account
                        </button>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-red-900 mb-2">
                              Type{" "}
                              <span className="font-mono font-bold">
                                DELETE
                              </span>{" "}
                              to confirm
                            </label>
                            <input
                              type="text"
                              value={deleteConfirmText}
                              onChange={(e) =>
                                setDeleteConfirmText(e.target.value)
                              }
                              className="block w-full px-3 py-2 border-2 text-red-700 border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                              placeholder="DELETE"
                            />
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={handleDeleteAccount}
                              disabled={
                                isDeleting || deleteConfirmText !== "DELETE"
                              }
                              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
                            >
                              {isDeleting && <Spinner className="w-4 h-4" />}
                              {isDeleting ? "Deleting..." : "Confirm Delete"}
                            </button>
                            <button
                              onClick={() => {
                                setShowDeleteConfirm(false);
                                setDeleteConfirmText("");
                              }}
                              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
