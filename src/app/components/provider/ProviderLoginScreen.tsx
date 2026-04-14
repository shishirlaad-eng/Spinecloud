import { useState } from "react";
import { Eye, EyeOff, Stethoscope, Users } from "lucide-react";

interface ProviderLoginScreenProps {
  onLogin: (email: string, password: string) => void;
  onNavigateToForgotPassword: () => void;
  onSwitchToPatient?: () => void;
  onSwitchToClinicAdmin?: () => void;
}

export function ProviderLoginScreen({
  onLogin,
  onNavigateToForgotPassword,
  onSwitchToPatient,
  onSwitchToClinicAdmin,
}: ProviderLoginScreenProps) {
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
      onLogin(email, password);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-primary-600 to-primary-700 p-12 flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">SpineCloudIQ</h1>
          <div className="w-20 h-1 bg-white rounded-full mb-8"></div>
          <h2 className="text-2xl font-semibold text-white mb-4">Provider Portal</h2>
          <p className="text-primary-100 text-sm leading-relaxed">
            Access your provider account to manage patient care, view appointments, and deliver exceptional healthcare services.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-medium text-sm mb-1">Patient management</h3>
              <p className="text-primary-100 text-sm">Access patient records and care history</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-medium text-sm mb-1">Appointment overview</h3>
              <p className="text-primary-100 text-sm">View and manage your daily schedule</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-950">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
              Login to provider portal
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Enter your credentials to access your account
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
                placeholder="provider@clinic.com"
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
              className="w-full h-11 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none text-sm"
            >
              Login
            </button>

            {/* Portal Switcher */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 text-center">
                Switch portal
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onSwitchToPatient}
                  className="flex-1 h-9 px-3 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium transition-colors text-sm"
                >
                  Patient
                </button>
                <button
                  type="button"
                  onClick={onSwitchToClinicAdmin}
                  className="flex-1 h-9 px-3 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium transition-colors text-sm"
                >
                  Clinic admin
                </button>
              </div>
            </div>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg">
            <p className="text-sm font-medium text-primary-700 dark:text-primary-400 mb-2">
              Demo credentials
            </p>
            <p className="text-sm text-primary-600 dark:text-primary-300">
              Email: <span className="font-mono">provider@spinecloudiq.com</span>
            </p>
            <p className="text-sm text-primary-600 dark:text-primary-300">
              Password: <span className="font-mono">provider123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
