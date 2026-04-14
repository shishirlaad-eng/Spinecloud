import { useState } from "react";
import { ArrowLeft, Building2, Globe } from "lucide-react";

interface OrganizationDetailsScreenProps {
  selectedPlan: {
    id: string;
    name: string;
    billingCycle: "monthly" | "yearly";
  };
  onContinue: (data: OrganizationData) => void;
  onBack: () => void;
}

export interface OrganizationData {
  organizationName: string;
  country: string;
  state: string;
  timezone: string;
  clinicPhone: string;
  clinicWebsite: string;
  firstName: string;
  lastName: string;
  email: string;
}

const usStates = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const timezones = [
  "America/New_York (EST/EDT)",
  "America/Chicago (CST/CDT)",
  "America/Denver (MST/MDT)",
  "America/Phoenix (MST)",
  "America/Los_Angeles (PST/PDT)",
  "America/Anchorage (AKST/AKDT)",
  "Pacific/Honolulu (HST)",
];

export function OrganizationDetailsScreen({
  selectedPlan,
  onContinue,
  onBack,
}: OrganizationDetailsScreenProps) {
  const [organizationName, setOrganizationName] = useState("");
  const [country, setCountry] = useState("US");
  const [state, setState] = useState("");
  const [timezone, setTimezone] = useState("");
  const [clinicPhone, setClinicPhone] = useState("");
  const [clinicWebsite, setClinicWebsite] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "organizationName":
      case "firstName":
      case "lastName":
        if (!value.trim()) {
          error = "This field is required";
        }
        break;
      case "state":
        if (!value) {
          error = "Please select a state";
        }
        break;
      case "timezone":
        if (!value) {
          error = "Please select a timezone";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Enter a valid email address";
        }
        break;
      case "clinicPhone":
        if (value && !/^\d{10}$/.test(value.replace(/[-().\s]/g, ""))) {
          error = "Enter a valid 10-digit phone number";
        }
        break;
      case "clinicWebsite":
        if (value && !/^https?:\/\/.+\..+/.test(value)) {
          error = "Enter a valid URL (e.g., https://example.com)";
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
      organizationName.trim() &&
      state &&
      timezone &&
      firstName.trim() &&
      lastName.trim() &&
      email.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      Object.values(errors).every((error) => !error)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onContinue({
        organizationName,
        country,
        state,
        timezone,
        clinicPhone,
        clinicWebsite,
        firstName,
        lastName,
        email,
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-primary-600 to-primary-700 p-12 flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">SpineCloudIQ</h1>
          <div className="w-20 h-1 bg-white rounded-full mb-8"></div>
          <h2 className="text-2xl font-semibold text-white mb-4">Welcome to SpineCloudIQ</h2>
          <p className="text-primary-100 text-sm leading-relaxed">
            Set up your organization details to get started with our comprehensive clinic management platform.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-medium text-sm mb-1">Multi-location support</h3>
              <p className="text-primary-100 text-sm">Manage multiple clinics from one central platform</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-medium text-sm mb-1">Global accessibility</h3>
              <p className="text-primary-100 text-sm">Access your clinic data securely from anywhere</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-950">
        <div className="w-full max-w-2xl">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors group mb-6"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back
          </button>

          {/* Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
              Organization details
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Tell us about your organization and primary administrator
            </p>
          </div>

          {/* Selected Plan Badge */}
          <div className="mb-6 p-4 bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary-900 dark:text-primary-100">Selected plan</p>
                <p className="text-sm text-primary-700 dark:text-primary-300">
                  {selectedPlan.name} - {selectedPlan.billingCycle === "monthly" ? "Monthly" : "Yearly"} billing
                </p>
              </div>
              <button
                onClick={onBack}
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                Change
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Organization Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide">
                Organization information
              </h3>

              <div>
                <label htmlFor="organizationName" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                  Organization/Clinic name <span className="text-destructive">*</span>
                </label>
                <input
                  id="organizationName"
                  type="text"
                  placeholder="Downtown Medical Center"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  onBlur={(e) => handleBlur("organizationName", e.target.value)}
                  aria-invalid={!!errors.organizationName}
                  className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                />
                {errors.organizationName && (
                  <p className="text-xs text-destructive mt-1">{errors.organizationName}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="country" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                    Country <span className="text-destructive">*</span>
                  </label>
                  <select
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                  </select>
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
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
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
                <label htmlFor="timezone" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                  Primary timezone <span className="text-destructive">*</span>
                </label>
                <select
                  id="timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  onBlur={(e) => handleBlur("timezone", e.target.value)}
                  aria-invalid={!!errors.timezone}
                  className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                >
                  <option value="">Select timezone</option>
                  {timezones.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
                {errors.timezone && (
                  <p className="text-xs text-destructive mt-1">{errors.timezone}</p>
                )}
              </div>

              <div>
                <label htmlFor="clinicPhone" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                  Primary clinic phone
                </label>
                <input
                  id="clinicPhone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={clinicPhone}
                  onChange={(e) => setClinicPhone(e.target.value)}
                  onBlur={(e) => handleBlur("clinicPhone", e.target.value)}
                  aria-invalid={!!errors.clinicPhone}
                  className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                />
                {errors.clinicPhone && (
                  <p className="text-xs text-destructive mt-1">{errors.clinicPhone}</p>
                )}
              </div>

              <div>
                <label htmlFor="clinicWebsite" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                  Primary clinic website
                </label>
                <input
                  id="clinicWebsite"
                  type="url"
                  placeholder="https://www.yourclinic.com"
                  value={clinicWebsite}
                  onChange={(e) => setClinicWebsite(e.target.value)}
                  onBlur={(e) => handleBlur("clinicWebsite", e.target.value)}
                  aria-invalid={!!errors.clinicWebsite}
                  className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                />
                {errors.clinicWebsite && (
                  <p className="text-xs text-destructive mt-1">{errors.clinicWebsite}</p>
                )}
              </div>
            </div>

            {/* Primary Admin User */}
            <div className="space-y-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide">
                Primary clinic admin user
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
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
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                  />
                  {errors.lastName && (
                    <p className="text-xs text-destructive mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                  Email <span className="text-destructive">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="admin@clinic.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={(e) => handleBlur("email", e.target.value)}
                  aria-invalid={!!errors.email}
                  className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid()}
              className="w-full h-11 px-4 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              Continue to verification
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}