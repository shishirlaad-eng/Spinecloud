import { useState } from "react";
import { Eye, EyeOff, Shield } from "lucide-react";
import logo from "@/assets/spinecloud-logo.png";

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
  const [activeInput, setActiveInput] = useState<"email" | "password" | null>(null);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (val: string) => {
    if (!val.trim()) return "Email address is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (val: string) => {
    if (!val) return "Password is required";
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);
    setSubmitted(true);
    if (!eErr && !pErr) {
      onLoginSuccess();
    }
  };

  const inputStyle = (field: "email" | "password", hasError: boolean) => ({
    height: "44px",
    borderRadius: "8px",
    border: hasError
      ? "1.5px solid #BA1A1A"
      : activeInput === field
      ? "1.5px solid #1D77B4"
      : "1.5px solid #DCE9FF",
    padding: field === "password" ? "0 44px 0 14px" : "0 14px",
    fontSize: "14px",
    color: "#404750",
    backgroundColor: hasError ? "#FFF8F7" : "#FFFFFF",
    boxShadow: hasError
      ? "0 0 0 3px rgba(186,26,26,0.08)"
      : activeInput === field
      ? "0 0 0 3px rgba(29, 119, 180, 0.12)"
      : "none",
    outline: "none",
    width: "100%",
    transition: "border-color 0.15s, box-shadow 0.15s",
  });

  return (
    <div
      style={{
        fontFamily: "'Avenir', 'Avenir Next', 'Nunito Sans', sans-serif",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
      }}
    >
      {/* Left Panel - Solid blue gradient matching OTPPasswordScreen */}
      <div
        className="hidden lg:flex lg:w-5/12 flex-col justify-between"
        style={{
          background: "linear-gradient(135deg, #1D77B4 0%, #1365a2 100%)",
          padding: "48px",
          overflow: "hidden",
          flexShrink: 0,
          height: "100vh",
        }}
      >
        <div>
          <img src={logo} alt="SpineCloud IQ" style={{ height: "60px", width: "auto" }} />
          <div style={{ width: "48px", height: "3px", backgroundColor: "rgba(255,255,255,0.5)", borderRadius: "2px", marginTop: "20px" }} />
        </div>

        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ color: "#FFFFFF", fontSize: "38px", fontWeight: 800, lineHeight: 1.15, marginBottom: "16px" }}>
            Your care,<br />simplified.
          </h1>
          <p style={{ color: "rgba(255,255,255,0.80)", fontSize: "15px", lineHeight: 1.7 }}>
            Access your health records, manage appointments, and stay connected with your care team.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Shield size={18} color="white" />
            </div>
            <div>
              <p style={{ color: "white", fontWeight: 600, fontSize: "13px", marginBottom: "2px" }}>Secure &amp; private</p>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "12px" }}>Your health data is encrypted and protected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div
        className="flex-1 lg:w-1/2 flex items-center justify-center bg-white"
        style={{ overflow: "hidden" }}
      >
        <div style={{ width: "100%", maxWidth: "400px", padding: "0 32px" }}>
          {/* Heading */}
          <div style={{ marginBottom: "28px" }}>
            <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#404750", marginBottom: "6px" }}>
              Welcome back!
            </h2>
            <p style={{ color: "rgba(64,71,80,0.65)", fontSize: "14px" }}>
              Log in to your account to continue
            </p>
          </div>

          {successMessage && (
            <div
              style={{
                marginBottom: "20px",
                padding: "12px 16px",
                borderRadius: "8px",
                backgroundColor: "rgba(140,198,63,0.1)",
                border: "1px solid #8CC63F",
              }}
            >
              <p style={{ color: "#5a8a1a", fontSize: "14px", fontWeight: 500 }}>{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 600, color: "#404750" }}
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (submitted) setEmailError(validateEmail(e.target.value));
                }}
                onFocus={() => setActiveInput("email")}
                onBlur={() => { setActiveInput(null); if (submitted) setEmailError(validateEmail(email)); }}
                style={inputStyle("email", !!emailError && submitted)}
              />
              {emailError && submitted && (
                <p style={{ color: "#BA1A1A", fontSize: "12px", marginTop: "4px" }}>{emailError}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 600, color: "#404750" }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (submitted) setPasswordError(validatePassword(e.target.value));
                  }}
                  onFocus={() => setActiveInput("password")}
                  onBlur={() => { setActiveInput(null); if (submitted) setPasswordError(validatePassword(password)); }}
                  style={inputStyle("password", !!passwordError && submitted)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "rgba(64,71,80,0.5)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordError && submitted && (
                <p style={{ color: "#BA1A1A", fontSize: "12px", marginTop: "4px" }}>{passwordError}</p>
              )}
            </div>

            {/* Forgot password */}
            <div style={{ textAlign: "right", marginTop: "-8px" }}>
              <button
                type="button"
                onClick={onNavigateToForgotPassword}
                style={{ color: "#8CC63F", fontSize: "13px", fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}
              >
                Forgot password?
              </button>
            </div>

            {/* Log in button */}
            <button
              type="submit"
              style={{
                height: "46px",
                borderRadius: "8px",
                backgroundColor: "#1D77B4",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "15px",
                border: "none",
                cursor: "pointer",
                width: "100%",
                transition: "background-color 0.15s",
                fontFamily: "inherit",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1563a0")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#1D77B4")}
            >
              Log in
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#DCE9FF" }} />
              <span style={{ fontSize: "12px", color: "rgba(64,71,80,0.45)", fontWeight: 500 }}>or</span>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#DCE9FF" }} />
            </div>

            {/* Create account */}
            <button
              type="button"
              onClick={onNavigateToSignup}
              style={{
                height: "46px",
                borderRadius: "8px",
                border: "1.5px solid #8CC63F",
                color: "#8CC63F",
                backgroundColor: "transparent",
                fontWeight: 700,
                fontSize: "15px",
                cursor: "pointer",
                width: "100%",
                transition: "background-color 0.15s",
                fontFamily: "inherit",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(140,198,63,0.07)")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              Create an account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
