import { useState } from "react";
import { ArrowLeft } from "lucide-react";

interface ProviderForgotPasswordScreenProps {
  onSendResetCode: (email: string) => void;
  onBack: () => void;
}

export function ProviderForgotPasswordScreen({
  onSendResetCode,
  onBack,
}: ProviderForgotPasswordScreenProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

  const validateEmail = (value: string) => {
    if (!value) return "This field is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address";
    return "";
  };

  const handleEmailBlur = () => {
    setTouched(true);
    setError(validateEmail(email));
  };

  const isFormValid = () => {
    return email && !validateEmail(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onSendResetCode(email);
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
              Back to login
            </button>
          </div>

          {/* Header */}
          <div className="px-6 pt-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white text-center">
              Forgot password
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center mt-1">
              Enter your email to receive a reset code
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                placeholder="Enter email address"
                aria-invalid={touched && !!error}
                className="w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-invalid:border-destructive"
              />
              {touched && error && (
                <p className="text-xs text-destructive mt-1">{error}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid()}
              className="w-full h-10 px-6 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              Send reset code
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
