import { useState } from "react";
import { Building2, Mail, Phone, MapPin } from "lucide-react";

interface ClinicAdminRegisterScreenProps {
  onRegisterSuccess: (email: string) => void;
  onNavigateToLogin: () => void;
}

export function ClinicAdminRegisterScreen({
  onRegisterSuccess,
  onNavigateToLogin,
}: ClinicAdminRegisterScreenProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("US");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [countryCode, setCountryCode] = useState("+1");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const usStates = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
    "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ];

  const validateField = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "firstName":
      case "lastName":
      case "clinicName":
      case "city":
        if (!value.trim()) {
          error = "This field is required";
        }
        break;
      case "state":
        if (!value) {
          error = "Please select a state";
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
      clinicName.trim() &&
      city.trim() &&
      state &&
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
      onRegisterSuccess(email);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-primary-600 to-primary-700 p-12 flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">SpineCloudIQ</h1>
          <div className="w-20 h-1 bg-white rounded-full mb-8"></div>
          <h2 className="text-2xl font-semibold text-white mb-4">Clinic Admin Portal</h2>
          <p className="text-primary-100 text-sm leading-relaxed">
            Manage your clinic operations, patient appointments, and healthcare delivery all in one place.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-medium text-sm mb-1">Multi-clinic management</h3>
              <p className="text-primary-100 text-sm">Handle multiple clinic locations from one dashboard</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-medium text-sm mb-1">Secure communications</h3>
              <p className="text-primary-100 text-sm">HIPAA-compliant messaging and notifications</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-950">
        <div className="w-full max-w-lg">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
              Create admin account
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Register your clinic to get started with SpineCloudIQ
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide">
                Personal information
              </h3>
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
            </div>

            {/* Clinic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide">
                Clinic information
              </h3>
              <div>
                <label htmlFor="clinicName" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                  Clinic name <span className="text-destructive">*</span>
                </label>
                <input
                  id="clinicName"
                  type="text"
                  placeholder="Downtown Medical Center"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  onBlur={(e) => handleBlur("clinicName", e.target.value)}
                  aria-invalid={!!errors.clinicName}
                  className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                />
                {errors.clinicName && (
                  <p className="text-xs text-destructive mt-1">{errors.clinicName}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                    City <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="city"
                    type="text"
                    placeholder="New York"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onBlur={(e) => handleBlur("city", e.target.value)}
                    aria-invalid={!!errors.city}
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                  />
                  {errors.city && (
                    <p className="text-xs text-destructive mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="state" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                    State <span className="text-destructive">*</span>
                  </label>
                  <select
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    onBlur={(e) => handleBlur("state", e.target.value)}
                    aria-invalid={!!errors.state}
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                  >
                    <option value="">Select state</option>
                    {usStates.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="text-xs text-destructive mt-1">{errors.state}</p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="country" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                  Country <span className="text-destructive">*</span>
                </label>
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide">
                Contact information
              </h3>
              <div>
                <label htmlFor="email" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                  Email address <span className="text-destructive">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="admin@clinic.com"
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
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid()}
              className="w-full h-11 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              Continue to verification
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
              Email: <span className="font-mono">admin@clinic.com</span>
            </p>
            <p className="text-sm text-primary-600 dark:text-primary-300">
              Password: <span className="font-mono">Admin123!</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
