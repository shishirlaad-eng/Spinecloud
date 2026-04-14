import { useState } from "react";
import { ArrowLeft, ChevronLeft, Upload, X } from "lucide-react";

interface AddPatientByStaffFlowProps {
  onComplete: (patientData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    countryCode: string;
    dateOfBirth: string;
    gender: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    emergencyName: string;
    emergencyContact: string;
    emergencyCountryCode: string;
    emergencyRelationship: string;
    insuranceProvider?: string;
    planNetworkName?: string;
    policyNumber?: string;
    groupNumber?: string;
    policyHolderName?: string;
    policyHolderDOB?: string;
    relationshipToPolicyholder?: string;
  }) => void;
  onCancel: () => void;
}

type Step = "basicInfo" | "demographics" | "insurance";

export function AddPatientByStaffFlow({
  onComplete,
  onCancel,
}: AddPatientByStaffFlowProps) {
  const [currentStep, setCurrentStep] = useState<Step>("basicInfo");

  // Basic Information
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [phone, setPhone] = useState("");

  // Demographics
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyCountryCode, setEmergencyCountryCode] = useState("+1");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyRelationship, setEmergencyRelationship] = useState("");

  // Insurance
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [planNetworkName, setPlanNetworkName] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [groupNumber, setGroupNumber] = useState("");
  const [policyHolderName, setPolicyHolderName] = useState("");
  const [policyHolderDOB, setPolicyHolderDOB] = useState("");
  const [relationshipToPolicyholder, setRelationshipToPolicyholder] = useState("");
  const [insuranceCardFront, setInsuranceCardFront] = useState<File | null>(null);
  const [insuranceCardBack, setInsuranceCardBack] = useState<File | null>(null);

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validate basic info
  const isBasicInfoValid = () => {
    const newErrors: { [key: string]: string } = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!phone.trim()) newErrors.phone = "Phone number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate demographics
  const isDemographicsValid = () => {
    const newErrors: { [key: string]: string } = {};

    if (!dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!gender) newErrors.gender = "Gender is required";
    if (!street.trim()) newErrors.street = "Street address is required";
    if (!city.trim()) newErrors.city = "City is required";
    if (!state.trim()) newErrors.state = "State is required";
    if (!zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    if (!country.trim()) newErrors.country = "Country is required";
    if (!emergencyName.trim()) newErrors.emergencyName = "Emergency contact name is required";
    if (!emergencyContact.trim()) newErrors.emergencyContact = "Emergency contact number is required";
    if (!emergencyRelationship.trim()) newErrors.emergencyRelationship = "Relationship is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBasicInfoContinue = () => {
    if (isBasicInfoValid()) {
      setCurrentStep("demographics");
    }
  };

  const handleDemographicsContinue = () => {
    if (isDemographicsValid()) {
      setCurrentStep("insurance");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: "front" | "back") => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }
      if (side === "front") {
        setInsuranceCardFront(file);
      } else {
        setInsuranceCardBack(file);
      }
    }
  };

  const handleRemoveFile = (side: "front" | "back") => {
    if (side === "front") {
      setInsuranceCardFront(null);
    } else {
      setInsuranceCardBack(null);
    }
  };

  const handleSkipInsurance = () => {
    onComplete({
      firstName,
      lastName,
      email,
      phone,
      countryCode,
      dateOfBirth,
      gender,
      street,
      city,
      state,
      zipCode,
      country,
      emergencyName,
      emergencyContact,
      emergencyCountryCode,
      emergencyRelationship,
    });
  };

  const handleInsuranceComplete = () => {
    onComplete({
      firstName,
      lastName,
      email,
      phone,
      countryCode,
      dateOfBirth,
      gender,
      street,
      city,
      state,
      zipCode,
      country,
      emergencyName,
      emergencyContact,
      emergencyCountryCode,
      emergencyRelationship,
      insuranceProvider: insuranceProvider || undefined,
      planNetworkName: planNetworkName || undefined,
      policyNumber: policyNumber || undefined,
      groupNumber: groupNumber || undefined,
      policyHolderName: policyHolderName || undefined,
      policyHolderDOB: policyHolderDOB || undefined,
      relationshipToPolicyholder: relationshipToPolicyholder || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={currentStep === "basicInfo" ? onCancel : () => {
              if (currentStep === "demographics") setCurrentStep("basicInfo");
              else if (currentStep === "insurance") setCurrentStep("demographics");
            }}
            className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {currentStep === "basicInfo" ? "Cancel" : "Back"}
          </button>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            Step {currentStep === "basicInfo" ? "1" : currentStep === "demographics" ? "2" : "3"} of 3
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 md:p-6">
        <div className="max-w-2xl mx-auto">
          {/* Basic Information Step */}
          {currentStep === "basicInfo" && (
            <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm">
              <div className="px-6 pt-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white text-center">
                  Add new patient
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center mt-1">
                  Enter patient basic information
                </p>
              </div>

              <div className="px-6 py-6 space-y-6">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
                  Basic information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      First name <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      onBlur={isBasicInfoValid}
                      placeholder="Enter first name"
                      className="w-full h-10 px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                      aria-invalid={!!errors.firstName}
                    />
                    {errors.firstName && (
                      <p className="text-xs text-destructive mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Last name <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      onBlur={isBasicInfoValid}
                      placeholder="Enter last name"
                      className="w-full h-10 px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                      aria-invalid={!!errors.lastName}
                    />
                    {errors.lastName && (
                      <p className="text-xs text-destructive mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Email address <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={isBasicInfoValid}
                    placeholder="Enter email address"
                    className="w-full h-10 px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Phone number <span className="text-destructive">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                    >
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+91">+91</option>
                    </select>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onBlur={isBasicInfoValid}
                      placeholder="(555) 000-0000"
                      className="flex-1 h-10 px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                      aria-invalid={!!errors.phone}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-destructive mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="px-6 pt-4 pb-6 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
                <button
                  onClick={handleBasicInfoContinue}
                  className="h-10 px-6 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Demographics Step */}
          {currentStep === "demographics" && (
            <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm">
              <div className="px-6 pt-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white text-center">
                  Patient demographics
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center mt-1">
                  Complete patient demographics and emergency contact
                </p>
              </div>

              <div className="px-6 py-6 space-y-6">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
                  Demographics
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Date of birth <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="dateOfBirth"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      onBlur={isDemographicsValid}
                      className="w-full h-10 px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                      aria-invalid={!!errors.dateOfBirth}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-xs text-destructive mt-1">{errors.dateOfBirth}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Gender <span className="text-destructive">*</span>
                    </label>
                    <select
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      onBlur={isDemographicsValid}
                      className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                      aria-invalid={!!errors.gender}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                    {errors.gender && (
                      <p className="text-xs text-destructive mt-1">{errors.gender}</p>
                    )}
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide pt-4">
                  Address
                </h4>

                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Street address <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="street"
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    onBlur={isDemographicsValid}
                    placeholder="Enter street address"
                    className="w-full h-10 px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                    aria-invalid={!!errors.street}
                  />
                  {errors.street && (
                    <p className="text-xs text-destructive mt-1">{errors.street}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      City <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      onBlur={isDemographicsValid}
                      placeholder="Enter city"
                      className="w-full h-10 px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                      aria-invalid={!!errors.city}
                    />
                    {errors.city && (
                      <p className="text-xs text-destructive mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      State <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="state"
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      onBlur={isDemographicsValid}
                      placeholder="Enter state"
                      className="w-full h-10 px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                      aria-invalid={!!errors.state}
                    />
                    {errors.state && (
                      <p className="text-xs text-destructive mt-1">{errors.state}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      ZIP code <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="zipCode"
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      onBlur={isDemographicsValid}
                      placeholder="Enter ZIP code"
                      className="w-full h-10 px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                      aria-invalid={!!errors.zipCode}
                    />
                    {errors.zipCode && (
                      <p className="text-xs text-destructive mt-1">{errors.zipCode}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Country <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="country"
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      onBlur={isDemographicsValid}
                      placeholder="Enter country"
                      className="w-full h-10 px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                      aria-invalid={!!errors.country}
                    />
                    {errors.country && (
                      <p className="text-xs text-destructive mt-1">{errors.country}</p>
                    )}
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide pt-4">
                  Emergency contact
                </h4>

                <div>
                  <label htmlFor="emergencyName" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Full name <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="emergencyName"
                    type="text"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    onBlur={isDemographicsValid}
                    placeholder="Enter emergency contact name"
                    className="w-full h-10 px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                    aria-invalid={!!errors.emergencyName}
                  />
                  {errors.emergencyName && (
                    <p className="text-xs text-destructive mt-1">{errors.emergencyName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="emergencyContact" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Contact number <span className="text-destructive">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={emergencyCountryCode}
                      onChange={(e) => setEmergencyCountryCode(e.target.value)}
                      className="h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                    >
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+91">+91</option>
                    </select>
                    <input
                      id="emergencyContact"
                      type="tel"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      onBlur={isDemographicsValid}
                      placeholder="(555) 000-0000"
                      className="flex-1 h-10 px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                      aria-invalid={!!errors.emergencyContact}
                    />
                  </div>
                  {errors.emergencyContact && (
                    <p className="text-xs text-destructive mt-1">{errors.emergencyContact}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="emergencyRelationship" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Relationship to patient <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="emergencyRelationship"
                    type="text"
                    value={emergencyRelationship}
                    onChange={(e) => setEmergencyRelationship(e.target.value)}
                    onBlur={isDemographicsValid}
                    placeholder="e.g., Spouse, Parent, Sibling"
                    className="w-full h-10 px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                    aria-invalid={!!errors.emergencyRelationship}
                  />
                  {errors.emergencyRelationship && (
                    <p className="text-xs text-destructive mt-1">{errors.emergencyRelationship}</p>
                  )}
                </div>
              </div>

              <div className="px-6 pt-4 pb-6 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
                <button
                  onClick={handleDemographicsContinue}
                  className="h-10 px-6 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Insurance Step */}
          {currentStep === "insurance" && (
            <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm">
              <div className="px-6 pt-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white text-center">
                  Insurance details
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center mt-1">
                  Add patient insurance information (optional)
                </p>
              </div>

              <div className="px-6 py-6 space-y-6">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
                  Insurance information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="insuranceProvider" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Insurance provider
                    </label>
                    <input
                      id="insuranceProvider"
                      type="text"
                      value={insuranceProvider}
                      onChange={(e) => setInsuranceProvider(e.target.value)}
                      placeholder="e.g., Blue Cross Blue Shield"
                      className="w-full h-10 px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                    />
                  </div>

                  <div>
                    <label htmlFor="planNetworkName" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Plan/Network name
                    </label>
                    <input
                      id="planNetworkName"
                      type="text"
                      value={planNetworkName}
                      onChange={(e) => setPlanNetworkName(e.target.value)}
                      placeholder="e.g., PPO, HMO"
                      className="w-full h-10 px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="policyNumber" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Policy number
                    </label>
                    <input
                      id="policyNumber"
                      type="text"
                      value={policyNumber}
                      onChange={(e) => setPolicyNumber(e.target.value)}
                      placeholder="Enter policy number"
                      className="w-full h-10 px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                    />
                  </div>

                  <div>
                    <label htmlFor="groupNumber" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Group number
                    </label>
                    <input
                      id="groupNumber"
                      type="text"
                      value={groupNumber}
                      onChange={(e) => setGroupNumber(e.target.value)}
                      placeholder="Enter group number"
                      className="w-full h-10 px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                    />
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide pt-4">
                  Policyholder information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="policyHolderName" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Policyholder name
                    </label>
                    <input
                      id="policyHolderName"
                      type="text"
                      value={policyHolderName}
                      onChange={(e) => setPolicyHolderName(e.target.value)}
                      placeholder="Enter policyholder name"
                      className="w-full h-10 px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                    />
                  </div>

                  <div>
                    <label htmlFor="policyHolderDOB" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Policyholder date of birth
                    </label>
                    <input
                      id="policyHolderDOB"
                      type="date"
                      value={policyHolderDOB}
                      onChange={(e) => setPolicyHolderDOB(e.target.value)}
                      className="w-full h-10 px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="relationshipToPolicyholder" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Relationship to policyholder
                  </label>
                  <select
                    id="relationshipToPolicyholder"
                    value={relationshipToPolicyholder}
                    onChange={(e) => setRelationshipToPolicyholder(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                  >
                    <option value="">Select relationship</option>
                    <option value="self">Self</option>
                    <option value="spouse">Spouse</option>
                    <option value="child">Child</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide pt-4">
                  Insurance card images
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Front of card
                    </label>
                    {insuranceCardFront ? (
                      <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
                        <span className="text-sm text-neutral-900 dark:text-white truncate">
                          {insuranceCardFront.name}
                        </span>
                        <button
                          onClick={() => handleRemoveFile("front")}
                          className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-600 dark:text-neutral-400 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "front")}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Back of card
                    </label>
                    {insuranceCardBack ? (
                      <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
                        <span className="text-sm text-neutral-900 dark:text-white truncate">
                          {insuranceCardBack.name}
                        </span>
                        <button
                          onClick={() => handleRemoveFile("back")}
                          className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-600 dark:text-neutral-400 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "back")}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-6 pt-4 pb-6 border-t border-neutral-200 dark:border-neutral-800 flex justify-between">
                <button
                  onClick={handleSkipInsurance}
                  className="h-10 px-6 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  Skip for now
                </button>
                <button
                  onClick={handleInsuranceComplete}
                  className="h-10 px-6 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  Add patient
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
