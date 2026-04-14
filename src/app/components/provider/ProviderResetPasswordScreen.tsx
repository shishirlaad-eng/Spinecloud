import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

interface ProviderResetPasswordScreenProps {
  email: string;
  onResetPassword: (code: string, newPassword: string) => void;
  onBack: () => void;
}

export function ProviderResetPasswordScreen({
  email,
  onResetPassword,
  onBack,
}: ProviderResetPasswordScreenProps) {
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({
    code: false,
    newPassword: false,
    confirmPassword: false,
  });

  const validateCode = (value: string) => {
    if (!value) return "This field is required";
    if (value.length !== 6) return "Code must be 6 characters";
    return "";
  };

  const validateNewPassword = (value: string) => {
    if (!value) return "This field is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    return "";
  };

  const validateConfirmPassword = (value: string) => {
    if (!value) return "This field is required";
    if (value !== newPassword) return "Passwords do not match";
    return "";
  };

  const handleCodeBlur = () => {
    setTouched({ ...touched, code: true });
    setErrors({ ...errors, code: validateCode(code) });
  };

  const handleNewPasswordBlur = () => {
    setTouched({ ...touched, newPassword: true });
    setErrors({ ...errors, newPassword: validateNewPassword(newPassword) });
  };

  const handleConfirmPasswordBlur = () => {
    setTouched({ ...touched, confirmPassword: true });
    setErrors({
      ...errors,
      confirmPassword: validateConfirmPassword(confirmPassword),
    });
  };

  const isFormValid = () => {
    return (
      code &&
      newPassword &&
      confirmPassword &&
      !validateCode(code) &&
      !validateNewPassword(newPassword) &&
      !validateConfirmPassword(confirmPassword)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onResetPassword(code, newPassword);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-5 md:p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white">
            SpineCloudIQ
          </h1>
          <div className="w-16 h-1 bg-primary-600 rounded-full mx-auto mt-3"></div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-4">
            Provider Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm">
          {/* Back Button */}
          <div className="px-6 pt-6">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to forgot password
            </button>
          </div>

          {/* Header */}
          <div className="px-6 pt-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white text-center">
              Reset password
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center mt-1">
              Enter the code sent to {email}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
            {/* Reset Code */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Reset code
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onBlur={handleCodeBlur}
                placeholder="Enter 6-digit code"
                maxLength={6}
                aria-invalid={touched.code && !!errors.code}
                className="w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-invalid:border-destructive"
              />
              {touched.code && errors.code && (
                <p className="text-xs text-destructive mt-1">{errors.code}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                New password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onBlur={handleNewPasswordBlur}
                  placeholder="Enter new password"
                  aria-invalid={touched.newPassword && !!errors.newPassword}
                  className="w-full h-10 px-3 py-1 pr-10 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-invalid:border-destructive"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {touched.newPassword && errors.newPassword && (
                <p className="text-xs text-destructive mt-1">{errors.newPassword}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={handleConfirmPasswordBlur}
                  placeholder="Confirm new password"
                  aria-invalid={touched.confirmPassword && !!errors.confirmPassword}
                  className="w-full h-10 px-3 py-1 pr-10 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-invalid:border-destructive"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-xs text-destructive mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid()}
              className="w-full h-10 px-6 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              Reset password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
