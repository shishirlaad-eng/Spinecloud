import { useState } from "react";
import { Eye, EyeOff, Calendar, Clock } from "lucide-react";

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onNavigateToForgotPassword: () => void;
  onNavigateToSignup: () => void;
  successMessage?: string;
}

export function LoginScreen({
  onLoginSuccess,
  onNavigateToForgotPassword,
  onNavigateToSignup,
  successMessage,
}: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    const error = validateEmail(email);
    setErrors((prev) => ({ ...prev, email: error }));
  };

  const handlePasswordBlur = () => {
    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const isFormValid = () => {
    return (
      email.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      password &&
      Object.values(errors).every((error) => !error)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onLoginSuccess();
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-primary-600 to-primary-700 p-12 flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">SpineCloudIQ</h1>
          <div className="w-20 h-1 bg-white rounded-full mb-8"></div>
          <h2 className="text-2xl font-semibold text-white mb-4">Welcome back</h2>
          <p className="text-primary-100 text-sm leading-relaxed">
            Sign in to access your health records, manage appointments, and continue your care journey.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-medium text-sm mb-1">Easy scheduling</h3>
              <p className="text-primary-100 text-sm">Book and manage appointments with ease</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-medium text-sm mb-1">24/7 access</h3>
              <p className="text-primary-100 text-sm">View your health information anytime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-950">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
              Login to your account
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Enter your credentials to continue
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-success-50 dark:bg-success-950/30 border border-success-200 dark:border-success-800 rounded-lg">
              <p className="text-sm text-success-700 dark:text-success-400">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                Email address <span className="text-destructive">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="patient@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }
                }}
                onBlur={handleEmailBlur}
                aria-invalid={!!errors.email}
                className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                Password <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors((prev) => ({ ...prev, password: "" }));
                    }
                  }}
                  onBlur={handlePasswordBlur}
                  aria-invalid={!!errors.password}
                  className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 pr-10 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive mt-1">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onNavigateToForgotPassword}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={!isFormValid()}
              className="w-full h-11 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              Login
            </button>

            {/* Signup Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={onNavigateToSignup}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                Don't have an account? Sign up
              </button>
            </div>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg">
            <p className="text-sm font-medium text-primary-700 dark:text-primary-400 mb-2">
              Demo credentials
            </p>
            <p className="text-sm text-primary-600 dark:text-primary-300">
              Email: <span className="font-mono">patient@example.com</span>
            </p>
            <p className="text-sm text-primary-600 dark:text-primary-300">
              Password: <span className="font-mono">Patient123!</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
