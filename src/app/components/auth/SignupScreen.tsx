import { useState } from "react";
import { Mail, Phone, User as UserIcon, Heart } from "lucide-react";

interface SignupScreenProps {
  onNavigateToLogin: () => void;
  onSignupSuccess: (email: string) => void;
}

export function SignupScreen({ onNavigateToLogin, onSignupSuccess }: SignupScreenProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "firstName":
      case "lastName":
        if (!value.trim()) {
          error = "This field is required";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Enter a valid email address";
        }
        break;
      case "mobile":
        if (!value.trim()) {
          error = "Mobile number is required";
        } else if (!/^\d{10}$/.test(value.replace(/[-()\s]/g, ""))) {
          error = "Enter a valid 10-digit mobile number";
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  const handleBlur = (name: string, value: string) => {
    validateField(name, value);
  };

  const isFormValid = () => {
    return (
      firstName.trim() &&
      lastName.trim() &&
      email.trim() &&
      mobile.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      /^\d{10}$/.test(mobile.replace(/[-()\s]/g, "")) &&
      Object.values(errors).every((error) => !error)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onSignupSuccess(email);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-primary-600 to-primary-700 p-12 flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">SpineCloudIQ</h1>
          <div className="w-20 h-1 bg-white rounded-full mb-8"></div>
          <h2 className="text-2xl font-semibold text-white mb-4">Welcome to better health</h2>
          <p className="text-primary-100 text-sm leading-relaxed">
            Take control of your spine health journey with personalized care, easy appointment scheduling, and expert guidance.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-medium text-sm mb-1">Personalized care</h3>
              <p className="text-primary-100 text-sm">Tailored treatment plans for your unique needs</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <UserIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-medium text-sm mb-1">Expert providers</h3>
              <p className="text-primary-100 text-sm">Access to experienced healthcare professionals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-950">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
              Create account
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Start your journey to better spine health
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                  First name <span className="text-destructive">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={(e) => handleBlur("firstName", e.target.value)}
                  aria-invalid={!!errors.firstName}
                  className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                />
                {errors.firstName && (
                  <p className="text-xs text-destructive mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                  Last name <span className="text-destructive">*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={(e) => handleBlur("lastName", e.target.value)}
                  aria-invalid={!!errors.lastName}
                  className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                />
                {errors.lastName && (
                  <p className="text-xs text-destructive mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                Email address <span className="text-destructive">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={(e) => handleBlur("email", e.target.value)}
                aria-invalid={!!errors.email}
                className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label htmlFor="mobile" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                Mobile number <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="flex h-10 w-28 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                >
                  <option value="+1">+1 (US)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+61">+61 (AU)</option>
                  <option value="+91">+91 (IN)</option>
                </select>
                <input
                  id="mobile"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  onBlur={(e) => handleBlur("mobile", e.target.value)}
                  aria-invalid={!!errors.mobile}
                  className="flex h-10 flex-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                />
              </div>
              {errors.mobile && (
                <p className="text-xs text-destructive mt-1">{errors.mobile}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid()}
              className="w-full h-11 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              Continue
            </button>

            {/* Login Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                Already have an account? Login
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
