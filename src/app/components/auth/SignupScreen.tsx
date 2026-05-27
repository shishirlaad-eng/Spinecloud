import { useState } from "react";
import { Shield } from "lucide-react";
import logo from "@/assets/spinecloud-logo.png";

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
  const [submitted, setSubmitted] = useState(false);

  const validate = (name: string, value: string): string => {
    switch (name) {
      case "firstName":
      case "lastName":
        return value.trim() ? "" : "This field is required";
      case "email":
        if (!value.trim()) return "Email address is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email address";
        return "";
      case "mobile":
        if (!value.trim()) return "Mobile number is required";
        if (!/^\d{10}$/.test(value.replace(/[-()\s]/g, ""))) return "Enter a valid 10-digit number";
        return "";
      default:
        return "";
    }
  };

  const isFormValid = () =>
    firstName.trim() &&
    lastName.trim() &&
    email.trim() &&
    mobile.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    /^\d{10}$/.test(mobile.replace(/[-()\s]/g, "")) &&
    Object.values(errors).every((e) => !e);

  const handleBlur = (name: string, value: string) => {
    const error = validate(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const newErrors: Record<string, string> = {};
    ["firstName", "lastName", "email", "mobile"].forEach((field) => {
      const val = { firstName, lastName, email, mobile }[field] ?? "";
      newErrors[field] = validate(field, val);
    });
    setErrors(newErrors);
    if (Object.values(newErrors).every((e) => !e)) {
      onSignupSuccess(email);
    }
  };

  const inputStyle = (field: string, hasError: boolean): React.CSSProperties => ({
    height: "44px",
    borderRadius: "8px",
    border: hasError
      ? "1.5px solid #BA1A1A"
      : "1.5px solid #DCE9FF",
    padding: "0 14px",
    fontSize: "14px",
    color: "#404750",
    backgroundColor: hasError ? "#FFF8F7" : "#FFFFFF",
    boxShadow: hasError ? "0 0 0 3px rgba(186,26,26,0.08)" : "none",
    outline: "none",
    width: "100%",
    fontFamily: "inherit",
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
        style={{ overflow: "auto" }}
      >
        <div style={{ width: "100%", maxWidth: "420px", padding: "32px" }}>
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#404750", marginBottom: "6px" }}>
              Create account
            </h2>
            <p style={{ color: "rgba(64,71,80,0.65)", fontSize: "14px" }}>
              Start your journey to better spine health
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Name row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 600, color: "#404750" }}>
                  First name <span style={{ color: "#BA1A1A" }}>*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={(e) => handleBlur("firstName", e.target.value)}
                  style={inputStyle("firstName", !!(errors.firstName && submitted))}
                />
                {errors.firstName && submitted && (
                  <p style={{ color: "#BA1A1A", fontSize: "12px", marginTop: "4px" }}>{errors.firstName}</p>
                )}
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 600, color: "#404750" }}>
                  Last name <span style={{ color: "#BA1A1A" }}>*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={(e) => handleBlur("lastName", e.target.value)}
                  style={inputStyle("lastName", !!(errors.lastName && submitted))}
                />
                {errors.lastName && submitted && (
                  <p style={{ color: "#BA1A1A", fontSize: "12px", marginTop: "4px" }}>{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 600, color: "#404750" }}>
                Email address <span style={{ color: "#BA1A1A" }}>*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={(e) => handleBlur("email", e.target.value)}
                style={inputStyle("email", !!(errors.email && submitted))}
              />
              {errors.email && submitted && (
                <p style={{ color: "#BA1A1A", fontSize: "12px", marginTop: "4px" }}>{errors.email}</p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 600, color: "#404750" }}>
                Mobile number <span style={{ color: "#BA1A1A" }}>*</span>
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  style={{
                    height: "44px",
                    borderRadius: "8px",
                    border: "1.5px solid #DCE9FF",
                    padding: "0 10px",
                    fontSize: "13px",
                    color: "#404750",
                    backgroundColor: "#FFFFFF",
                    outline: "none",
                    width: "90px",
                    fontFamily: "inherit",
                    flexShrink: 0,
                  }}
                >
                  <option value="+1">+1 US</option>
                  <option value="+44">+44 UK</option>
                  <option value="+61">+61 AU</option>
                  <option value="+91">+91 IN</option>
                </select>
                <input
                  id="mobile"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  onBlur={(e) => handleBlur("mobile", e.target.value)}
                  style={{ ...inputStyle("mobile", !!(errors.mobile && submitted)), width: "auto", flex: 1 }}
                />
              </div>
              {errors.mobile && submitted && (
                <p style={{ color: "#BA1A1A", fontSize: "12px", marginTop: "4px" }}>{errors.mobile}</p>
              )}
            </div>

            {/* Submit */}
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
                marginTop: "4px",
                fontFamily: "inherit",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1563a0")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#1D77B4")}
            >
              Continue
            </button>

            {/* Back to login */}
            <div style={{ textAlign: "center" }}>
              <button
                type="button"
                onClick={onNavigateToLogin}
                style={{
                  color: "#1D77B4",
                  fontSize: "13px",
                  fontWeight: 500,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Already have an account? <span style={{ fontWeight: 700 }}>Log in</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
