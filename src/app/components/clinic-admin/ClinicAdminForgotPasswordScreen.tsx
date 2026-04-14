import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";

interface ClinicAdminForgotPasswordScreenProps {
  onSuccess: (email: string) => void;
  onBackToLogin: () => void;
}

export function ClinicAdminForgotPasswordScreen({
  onSuccess,
  onBackToLogin,
}: ClinicAdminForgotPasswordScreenProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      return "Email is required";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Enter a valid email address";
    }
    return "";
  };

  const handleEmailBlur = () => {
    const validationError = validateEmail(email);
    setError(validationError);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateEmail(email);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    onSuccess(email);
  };

  const isFormValid = () => {
    return email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !error;
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-primary-600 to-primary-700 p-12 flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">SpineCloudIQ</h1>
          <div className="w-20 h-1 bg-white rounded-full mb-8"></div>
          <h2 className="text-2xl font-semibold text-white mb-4">Reset your password</h2>
          <p className="text-primary-100 text-sm leading-relaxed">
            Enter your email address and we'll send you a verification code to reset your password.
          </p>
        </div>
        
        <div className="bg-white/10 rounded-lg p-4 border border-white/20">
          <p className="text-primary-100 text-sm mb-2">Need help?</p>
          <p className="text-white text-sm">Contact support at support@spinecloudiq.com</p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-950">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={onBackToLogin}
            className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group mb-6"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to login
          </button>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
              Forgot password
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              We'll send you a verification code to reset your password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                Email address <span className="text-destructive">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="admin@clinic.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) {
                    setError("");
                  }
                }}
                onBlur={handleEmailBlur}
                aria-invalid={!!error}
                className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
              />
              {error && (
                <p className="text-xs text-destructive mt-1">{error}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid()}
              className="w-full h-11 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              Send verification code
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg">
            <p className="text-sm font-medium text-primary-700 dark:text-primary-400 mb-2">
              Demo email for testing
            </p>
            <p className="text-sm text-primary-600 dark:text-primary-300">
              Email: <span className="font-mono">admin@clinic.com</span>
            </p>
            <p className="text-sm text-primary-600 dark:text-primary-300 mt-2">
              OTP: <span className="font-mono">123456</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
