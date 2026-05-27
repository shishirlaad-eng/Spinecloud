import { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, ArrowLeft, RefreshCw, Shield, Pencil } from "lucide-react";

interface OTPPasswordScreenProps {
  email: string;
  context: "signup" | "forgotPassword";
  onSuccess: (message: string) => void;
  onBackToLogin: () => void;
  onBack: () => void;
}

export function OTPPasswordScreen({
  email,
  context,
  onSuccess,
  onBackToLogin,
  onBack,
}: OTPPasswordScreenProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Clear OTP error when user starts typing
    if (errors.otp) {
      setErrors((prev) => ({ ...prev, otp: "" }));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    // Focus last filled input or next empty
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const validatePassword = (value: string) => {
    if (!value) {
      return "Password is required";
    }
    if (value.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/(?=.*[a-z])/.test(value)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(value)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(value)) {
      return "Password must contain at least one number";
    }
    return "";
  };

  const handlePasswordBlur = () => {
    const error = validatePassword(password);
    setErrors((prev) => ({ ...prev, password: error }));
  };

  const handleConfirmPasswordBlur = () => {
    if (!confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Please confirm your password" }));
    } else if (confirmPassword !== password) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  const handleResendOtp = () => {
    if (resendCooldown > 0) return;
    
    // Simulate OTP resend
    console.log("Resending OTP to:", email);
    setResendCooldown(30);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const isFormValid = () => {
    const otpComplete = otp.every((digit) => digit !== "");
    const otpCorrect = otp.join("") === "123456"; // Dummy OTP validation
    const passwordValid = !validatePassword(password);
    const confirmPasswordValid = confirmPassword && confirmPassword === password;
    
    return otpComplete && otpCorrect && passwordValid && confirmPasswordValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate OTP
    if (otp.join("") !== "123456") {
      setErrors((prev) => ({ ...prev, otp: "Invalid OTP. Please try again." }));
      return;
    }

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setErrors((prev) => ({ ...prev, password: passwordError }));
      return;
    }

    // Validate confirm password
    if (confirmPassword !== password) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
      return;
    }

    if (isFormValid()) {
      const message = context === "signup" 
        ? "Account created successfully! Please login to continue."
        : "Password reset successfully! Please login with your new password.";
      onSuccess(message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-primary-600 to-primary-700 p-12 flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">SpineCloudIQ</h1>
          <div className="w-20 h-1 bg-white rounded-full mb-8"></div>
          <h2 className="text-2xl font-semibold text-white mb-4">
            {context === "signup" ? "Verify & secure your account" : "Reset your password"}
          </h2>
          <p className="text-primary-100 text-sm leading-relaxed">
            {context === "signup" 
              ? "We've sent a 6-digit verification code to your email address. Enter the code below to verify your account and set up your password."
              : "We've sent a 6-digit verification code to your email address. Enter the code below and create a new password for your account."}
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-medium text-sm mb-1">Secure verification</h3>
              <p className="text-primary-100 text-sm">Your data is encrypted and protected</p>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4 border border-white/20">
            <p className="text-primary-100 text-sm mb-2">Demo OTP for testing</p>
            <p className="text-white font-mono text-2xl tracking-wider">123456</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-950">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group mb-6"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back
          </button>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
              {context === "signup" ? "Verify email & set password" : "Reset password"}
            </h2>
            <div className="flex items-center gap-2">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Code sent to <span className="font-medium text-neutral-900 dark:text-white">{email}</span>
              </p>
              <button
                type="button"
                onClick={onBack}
                title="Edit email address"
                className="p-1 text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-3">
                Enter 6-digit code <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-2 justify-between">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-12 text-center text-lg font-semibold rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                  />
                ))}
              </div>
              {errors.otp && (
                <p className="text-xs text-destructive mt-2">{errors.otp}</p>
              )}
              
              {/* Resend OTP */}
              <div className="mt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0}
                  className="inline-flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
                >
                  <RefreshCw className="w-4 h-4" />
                  {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend code"}
                </button>
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                {context === "signup" ? "Create password" : "New password"} <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
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
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                Must be at least 8 characters with uppercase, lowercase, and number
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                Confirm password <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) {
                      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                    }
                  }}
                  onBlur={handleConfirmPasswordBlur}
                  aria-invalid={!!errors.confirmPassword}
                  className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 pr-10 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid()}
              className="w-full h-11 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              {context === "signup" ? "Verify & create account" : "Reset password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
