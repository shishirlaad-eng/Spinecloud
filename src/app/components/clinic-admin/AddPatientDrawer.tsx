import { X, User, MapPin, Phone, Shield, FileCheck } from "lucide-react";
import { useState } from "react";

interface ConsentForm {
  id: string;
  title: string;
  status: "Active" | "Inactive";
}

interface AddPatientDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  availableConsentForms: ConsentForm[];
  onSave: (patientData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    phoneCountryCode: string;
    dateOfBirth: string;
    gender: string;
    address?: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    emergencyContact?: {
      name: string;
      phone: string;
      phoneCountryCode: string;
    };
    insurance?: {
      provider: string;
      policyNumber: string;
      policyHolderName: string;
      policyHolderDOB: string;
      relationshipToPolicyholder: string;
    };
    acceptedConsentIds: string[];
    source: "staff";
  }) => void;
}

export function AddPatientDrawer({ isOpen, onClose, availableConsentForms, onSave }: AddPatientDrawerProps) {
  // Required fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+1");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");

  // Optional address fields
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("United States");

  // Optional emergency contact
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyCountryCode, setEmergencyCountryCode] = useState("+1");
  const [emergencyPhone, setEmergencyPhone] = useState("");

  // Insurance fields (required if filling insurance)
  const [hasInsurance, setHasInsurance] = useState(false);
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [policyHolderName, setPolicyHolderName] = useState("");
  const [policyHolderDOB, setPolicyHolderDOB] = useState("");
  const [relationshipToPolicyholder, setRelationshipToPolicyholder] = useState("");

  // Consent - individual checkboxes for each consent form
  const [acceptedConsentIds, setAcceptedConsentIds] = useState<string[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const countryCodes = [
    { code: "+1", country: "US/Canada" },
    { code: "+44", country: "UK" },
    { code: "+61", country: "Australia" },
    { code: "+91", country: "India" },
    { code: "+81", country: "Japan" },
    { code: "+86", country: "China" },
    { code: "+33", country: "France" },
    { code: "+49", country: "Germany" },
  ];

  const usStates = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
    "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email format";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    if (!dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!gender) newErrors.gender = "Gender is required";

    // Insurance validation (if provided)
    if (hasInsurance) {
      if (!insuranceProvider.trim()) newErrors.insuranceProvider = "Insurance provider is required";
      if (!policyNumber.trim()) newErrors.policyNumber = "Policy number is required";
      if (!policyHolderName.trim()) newErrors.policyHolderName = "Policyholder name is required";
      if (!policyHolderDOB) newErrors.policyHolderDOB = "Policyholder date of birth is required";
      if (!relationshipToPolicyholder) newErrors.relationshipToPolicyholder = "Relationship is required";
    }

    // Consent validation
    if (availableConsentForms.some(form => form.status === "Active") && acceptedConsentIds.length === 0) {
      newErrors.consentsAgreed = "Consent must be agreed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const patientData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      phoneCountryCode,
      dateOfBirth,
      gender,
      ...(street || city || state || zipCode
        ? {
            address: {
              street: street.trim(),
              city: city.trim(),
              state: state.trim(),
              zip: zipCode.trim(),
              country,
            },
          }
        : {}),
      ...(emergencyName || emergencyPhone
        ? {
            emergencyContact: {
              name: emergencyName.trim(),
              phone: emergencyPhone.trim(),
              phoneCountryCode: emergencyCountryCode,
            },
          }
        : {}),
      ...(hasInsurance
        ? {
            insurance: {
              provider: insuranceProvider.trim(),
              policyNumber: policyNumber.trim(),
              policyHolderName: policyHolderName.trim(),
              policyHolderDOB,
              relationshipToPolicyholder,
            },
          }
        : {}),
      acceptedConsentIds,
      source: "staff",
    };

    onSave(patientData);
    handleClose();
  };

  const handleClose = () => {
    // Reset form
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneCountryCode("+1");
    setPhone("");
    setDateOfBirth("");
    setGender("");
    setStreet("");
    setCity("");
    setState("");
    setZipCode("");
    setCountry("United States");
    setEmergencyName("");
    setEmergencyCountryCode("+1");
    setEmergencyPhone("");
    setHasInsurance(false);
    setInsuranceProvider("");
    setPolicyNumber("");
    setPolicyHolderName("");
    setPolicyHolderDOB("");
    setRelationshipToPolicyholder("");
    setAcceptedConsentIds([]);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white dark:bg-neutral-900 z-50 overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Add new patient
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide">
                Basic information
              </h3>
            </div>
            <div className="space-y-4">
              {/* Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                    First name <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                    placeholder="Enter first name"
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
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="text-xs text-destructive mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                    placeholder="email@example.com"
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="phone" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                    Phone <span className="text-destructive">*</span>
                  </label>
                  <div className="flex">
                    <select
                      id="phoneCountryCode"
                      value={phoneCountryCode}
                      onChange={(e) => setPhoneCountryCode(e.target.value)}
                      className="flex h-10 w-16 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                    >
                      {countryCodes.map((code) => (
                        <option key={code.code} value={code.code}>
                          {code.country}
                        </option>
                      ))}
                    </select>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                      placeholder="123-456-7890"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-destructive mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Date of Birth & Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dob" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                    Date of birth <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="dob"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                  />
                  {errors.dateOfBirth && (
                    <p className="text-xs text-destructive mt-1">{errors.dateOfBirth}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="gender" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                    Gender <span className="text-destructive">*</span>
                  </label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  {errors.gender && (
                    <p className="text-xs text-destructive mt-1">{errors.gender}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Address (Optional) */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide">
                Address <span className="text-sm font-normal text-neutral-500">(Optional)</span>
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="street" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                  Street address
                </label>
                <input
                  id="street"
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                  placeholder="123 Main Street, Apt 4B"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                    State
                  </label>
                  <select
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                  >
                    <option value="">Select state</option>
                    {usStates.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="zip" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                    Zip code
                  </label>
                  <input
                    id="zip"
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                    placeholder="10001"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                    Country
                  </label>
                  <select
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact (Optional) */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Phone className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide">
                Emergency contact <span className="text-sm font-normal text-neutral-500">(Optional)</span>
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="emergencyName" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                  Emergency contact name
                </label>
                <input
                  id="emergencyName"
                  type="text"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="emergencyPhone" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                  Emergency contact number
                </label>
                <div className="flex">
                  <select
                    id="emergencyCountryCode"
                    value={emergencyCountryCode}
                    onChange={(e) => setEmergencyCountryCode(e.target.value)}
                    className="flex h-10 w-16 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                  >
                    {countryCodes.map((code) => (
                      <option key={code.code} value={code.code}>
                        {code.country}
                      </option>
                    ))}
                  </select>
                  <input
                    id="emergencyPhone"
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                    placeholder="123-456-7890"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Insurance Details (Optional) */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide">
                Insurance details <span className="text-sm font-normal text-neutral-500">(Optional)</span>
              </h3>
            </div>
            <div className="mb-4">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasInsurance}
                  onChange={(e) => setHasInsurance(e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-2 focus:ring-primary-500/10"
                />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Patient has insurance
                </span>
              </label>
            </div>
            {hasInsurance && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="insuranceProvider" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                    Insurance provider name <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="insuranceProvider"
                    type="text"
                    value={insuranceProvider}
                    onChange={(e) => setInsuranceProvider(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                    placeholder="e.g., Blue Cross Blue Shield, Aetna"
                  />
                  {errors.insuranceProvider && (
                    <p className="text-xs text-destructive mt-1">{errors.insuranceProvider}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="policyNumber" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                    Policy / Member ID number <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="policyNumber"
                    type="text"
                    value={policyNumber}
                    onChange={(e) => setPolicyNumber(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                    placeholder="Enter policy/member ID"
                  />
                  {errors.policyNumber && (
                    <p className="text-xs text-destructive mt-1">{errors.policyNumber}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="policyHolderName" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                    Name of policyholder <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="policyHolderName"
                    type="text"
                    value={policyHolderName}
                    onChange={(e) => setPolicyHolderName(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                    placeholder="Enter full name"
                  />
                  {errors.policyHolderName && (
                    <p className="text-xs text-destructive mt-1">{errors.policyHolderName}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="policyHolderDOB" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                      Policyholder date of birth <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="policyHolderDOB"
                      type="date"
                      value={policyHolderDOB}
                      onChange={(e) => setPolicyHolderDOB(e.target.value)}
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                    />
                    {errors.policyHolderDOB && (
                      <p className="text-xs text-destructive mt-1">{errors.policyHolderDOB}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="relationshipToPolicyholder" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                      Relationship to policyholder <span className="text-destructive">*</span>
                    </label>
                    <select
                      id="relationshipToPolicyholder"
                      value={relationshipToPolicyholder}
                      onChange={(e) => setRelationshipToPolicyholder(e.target.value)}
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                    >
                      <option value="">Select relationship</option>
                      <option value="Self">Self</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Child">Child</option>
                      <option value="Parent">Parent</option>
                    </select>
                    {errors.relationshipToPolicyholder && (
                      <p className="text-xs text-destructive mt-1">{errors.relationshipToPolicyholder}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Consent Forms */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FileCheck className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide">
                Consent forms
              </h3>
            </div>
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-neutral-50 dark:bg-neutral-950 space-y-4">
              {/* Staff Note */}
              <div className="bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg p-3">
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                  <span className="font-medium text-neutral-900 dark:text-white">Note:</span> By checking the consent forms below, you confirm that all required consents have been verbally communicated to and agreed upon by the patient.
                </p>
              </div>

              {/* Consent Form Checkboxes */}
              <div className="space-y-3">
                {availableConsentForms.filter(form => form.status === "Active").map(form => (
                  <label key={form.id} className="flex items-start gap-3 cursor-pointer p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-white dark:hover:bg-neutral-900 transition-colors">
                    <input
                      type="checkbox"
                      checked={acceptedConsentIds.includes(form.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAcceptedConsentIds([...acceptedConsentIds, form.id]);
                        } else {
                          setAcceptedConsentIds(acceptedConsentIds.filter(id => id !== form.id));
                        }
                      }}
                      className="w-4 h-4 mt-0.5 text-primary-600 border-neutral-300 rounded focus:ring-2 focus:ring-primary-500/10 shrink-0"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-neutral-900 dark:text-white block">
                        {form.title}
                      </span>
                      <span className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5 block">
                        Agreed by staff on behalf of the patient
                      </span>
                    </div>
                  </label>
                ))}
              </div>

              {errors.consentsAgreed && (
                <p className="text-xs text-destructive mt-2">{errors.consentsAgreed}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 -mx-6 -mb-6 px-6 py-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm"
            >
              Add patient
            </button>
          </div>
        </form>
      </div>
    </>
  );
}