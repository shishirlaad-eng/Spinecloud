import React, { useState } from "react";
import { ArrowLeft, Lock, Bell, CheckCircle2 } from "lucide-react";

interface SettingsScreenProps {
  onBack: () => void;
  onNavigate?: (menu: "dashboard" | "appointments" | "invoices" | "notifications" | "settings") => void;
  onLogout?: () => void;
  currentEntity?: "patient" | "clinicAdmin" | "provider" | "clinic-staff";
  onEntitySwitch?: (entity: "patient" | "clinicAdmin" | "provider" | "clinic-staff") => void;
  onNavigateToProfile?: () => void;
}

import { DashboardLayout } from "../layout/DashboardLayout";

export function SettingsScreen({ 
  onBack, 
  onNavigate, 
  onLogout,
  currentEntity,
  onEntitySwitch,
  onNavigateToProfile
}: SettingsScreenProps) {
  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Notification preferences state
  const [emailNotifications, setEmailNotifications] = useState({
    appointments: true,
    reminders: true,
    results: true,
    billing: true,
    marketing: false,
  });
  const [smsNotifications, setSmsNotifications] = useState({
    appointments: true,
    reminders: true,
    results: false,
    billing: false,
  });
  const [notificationSuccess, setNotificationSuccess] = useState(false);

  // Password validation
  const validateCurrentPassword = (value: string) => {
    if (!value.trim()) {
      return "Current password is required";
    }
    return "";
  };

  const validateNewPassword = (value: string) => {
    if (!value.trim()) {
      return "New password is required";
    }
    if (value.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
      return "Password must contain uppercase, lowercase, and number";
    }
    return "";
  };

  const validateConfirmPassword = (value: string) => {
    if (!value.trim()) {
      return "Please confirm your new password";
    }
    if (value !== newPassword) {
      return "Passwords do not match";
    }
    return "";
  };

  const handlePasswordBlur = (field: string) => {
    let error = "";
    if (field === "currentPassword") {
      error = validateCurrentPassword(currentPassword);
    } else if (field === "newPassword") {
      error = validateNewPassword(newPassword);
    } else if (field === "confirmPassword") {
      error = validateConfirmPassword(confirmPassword);
    }

    setPasswordErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const isPasswordFormValid = () => {
    return (
      currentPassword.trim() !== "" &&
      newPassword.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      !passwordErrors.currentPassword &&
      !passwordErrors.newPassword &&
      !passwordErrors.confirmPassword &&
      newPassword === confirmPassword &&
      newPassword.length >= 8 &&
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)
    );
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordFormValid()) return;

    // Simulate API call
    setTimeout(() => {
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordErrors({});
      setTimeout(() => setPasswordSuccess(false), 5000);
    }, 500);
  };

  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate API call
    setTimeout(() => {
      setNotificationSuccess(true);
      setTimeout(() => setNotificationSuccess(false), 5000);
    }, 500);
  };

  return (
    <DashboardLayout 
      activeMenu="settings" 
      onNavigate={onNavigate as any} 
      onLogout={onLogout}
      currentEntity={currentEntity}
      onEntitySwitch={onEntitySwitch}
      onNavigateToProfile={onNavigateToProfile}
    >
      <div className="max-w-4xl">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 mb-2">
            <span>Home</span>
            <span className="mx-1">›</span>
            <span className="font-medium text-[#0b1c30] dark:text-white">Settings</span>
          </div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
            Settings
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Change Password Section */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
            <div className="px-6 pt-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#eff4ff] dark:bg-primary-950/30">
                  <Lock className="w-5 h-5 text-[#1d77b4] dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Change password
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Update your password to keep your account secure
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-6">
              {passwordSuccess && (
                <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-success-700">
                      Password updated successfully
                    </p>
                    <p className="text-sm text-success-600 mt-1">
                      Your password has been changed. Please use your new
                      password for future logins.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {/* Current Password */}
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-neutral-700 mb-1.5"
                  >
                    Current password{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    onBlur={() => handlePasswordBlur("currentPassword")}
                    placeholder="Enter current password"
                    className={`w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-800 border rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 outline-none transition-[border-color,box-shadow] ${
                      passwordErrors.currentPassword
                        ? "border-destructive dark:border-destructive"
                        : "border-neutral-200 dark:border-neutral-700 focus:border-[#1d77b4] focus:ring-2 focus:ring-[#1d77b4]/10"
                    }`}
                    aria-invalid={!!passwordErrors.currentPassword}
                  />
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-xs text-destructive">
                      {passwordErrors.currentPassword}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-neutral-700 mb-1.5"
                  >
                    New password <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onBlur={() => handlePasswordBlur("newPassword")}
                    placeholder="Enter new password"
                    className={`w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-800 border rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 outline-none transition-[border-color,box-shadow] ${
                      passwordErrors.newPassword
                        ? "border-destructive dark:border-destructive"
                        : "border-neutral-200 dark:border-neutral-700 focus:border-[#1d77b4] focus:ring-2 focus:ring-[#1d77b4]/10"
                    }`}
                    aria-invalid={!!passwordErrors.newPassword}
                  />
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-xs text-destructive">
                      {passwordErrors.newPassword}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-neutral-500">
                    Must be at least 8 characters with uppercase, lowercase, and
                    number
                  </p>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-neutral-700 mb-1.5"
                  >
                    Confirm new password{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => handlePasswordBlur("confirmPassword")}
                    placeholder="Re-enter new password"
                    className={`w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-800 border rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 outline-none transition-[border-color,box-shadow] ${
                      passwordErrors.confirmPassword
                        ? "border-destructive dark:border-destructive"
                        : "border-neutral-200 dark:border-neutral-700 focus:border-[#1d77b4] focus:ring-2 focus:ring-[#1d77b4]/10"
                    }`}
                    aria-invalid={!!passwordErrors.confirmPassword}
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-xs text-destructive">
                      {passwordErrors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={!isPasswordFormValid()}
                    className="h-10 px-6 bg-[#1d77b4] hover:opacity-90 active:opacity-80 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                  >
                    Update password
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Notification Preferences Section */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
            <div className="px-6 pt-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#eff4ff] dark:bg-primary-950/30">
                  <Bell className="w-5 h-5 text-[#1d77b4] dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Notification preferences
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Choose how you want to receive notifications
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-6">
              {notificationSuccess && (
                <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-success-700">
                      Preferences saved
                    </p>
                    <p className="text-sm text-success-600 mt-1">
                      Your notification preferences have been updated
                      successfully.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleNotificationSubmit} className="space-y-6">
                {/* Email Notifications */}
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
                    Email notifications
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="email-appointments"
                        className="text-sm text-neutral-700 dark:text-neutral-300 cursor-pointer"
                      >
                        Appointment confirmations and updates
                      </label>
                      <input
                        type="checkbox"
                        id="email-appointments"
                        checked={emailNotifications.appointments}
                        onChange={(e) =>
                          setEmailNotifications({
                            ...emailNotifications,
                            appointments: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-[#1d77b4] focus:ring-2 focus:ring-[#1d77b4]/20 cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="email-reminders"
                        className="text-sm text-neutral-700 dark:text-neutral-300 cursor-pointer"
                      >
                        Appointment reminders
                      </label>
                      <input
                        type="checkbox"
                        id="email-reminders"
                        checked={emailNotifications.reminders}
                        onChange={(e) =>
                          setEmailNotifications({
                            ...emailNotifications,
                            reminders: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-[#1d77b4] focus:ring-2 focus:ring-[#1d77b4]/20 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="email-billing"
                        className="text-sm text-neutral-700 dark:text-neutral-300 cursor-pointer"
                      >
                        Billing and payment notifications
                      </label>
                      <input
                        type="checkbox"
                        id="email-billing"
                        checked={emailNotifications.billing}
                        onChange={(e) =>
                          setEmailNotifications({
                            ...emailNotifications,
                            billing: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-[#1d77b4] focus:ring-2 focus:ring-[#1d77b4]/20 cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="email-marketing"
                        className="text-sm text-neutral-700 dark:text-neutral-300 cursor-pointer"
                      >
                        Promotional emails and newsletters
                      </label>
                      <input
                        type="checkbox"
                        id="email-marketing"
                        checked={emailNotifications.marketing}
                        onChange={(e) =>
                          setEmailNotifications({
                            ...emailNotifications,
                            marketing: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-[#1d77b4] focus:ring-2 focus:ring-[#1d77b4]/20 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="h-10 px-6 bg-[#1d77b4] hover:opacity-90 active:opacity-80 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Save preferences
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
