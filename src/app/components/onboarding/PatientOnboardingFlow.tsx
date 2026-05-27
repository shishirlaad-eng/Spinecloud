import { useState } from "react";
import { Check, ChevronLeft, Upload, X, CheckCircle, MapPin, Clock, Stethoscope, Shield } from "lucide-react";
import logo from "@/assets/spinecloud-logo.png";

interface PatientOnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
  onBack?: () => void;
  wizardData?: any;
  services: any[];
  branches: any[];
  providers: any[];
}

interface OnboardingData {
  profile: any;
  insurance: any;
  selectedClinic: any;
  selectedProvider: any;
  appointmentDetails: any;
}

type Step = {
  id: number;
  title: string;
  description: string;
};

const steps: Step[] = [
  { id: 1, title: "Basic Details", description: "Demographics & Address" },
  { id: 2, title: "Insurance Details", description: "Coverage info" },
  { id: 3, title: "Book Appointment", description: "Schedule visit" },
];

export function PatientOnboardingFlow({ 
  onComplete, 
  onBack, 
  services,
  branches,
  providers,
}: PatientOnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Profile data (Step 1)
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("United States");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyCountryCode, setEmergencyCountryCode] = useState("+1");

  // Insurance data (Step 2 - all optional)
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [planNetworkName, setPlanNetworkName] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [groupNumber, setGroupNumber] = useState("");
  const [policyHolderName, setPolicyHolderName] = useState("");
  const [policyHolderDOB, setPolicyHolderDOB] = useState("");
  const [relationshipToPolicyholder, setRelationshipToPolicyholder] = useState("");
  const [insuranceCardFront, setInsuranceCardFront] = useState<File | null>(null);
  const [insuranceCardBack, setInsuranceCardBack] = useState<File | null>(null);

  // Booking data (Step 3)
  const [bookingBranchId, setBookingBranchId] = useState("");
  const [bookingServiceId, setBookingServiceId] = useState("");
  const [bookingProviderId, setBookingProviderId] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const usStates = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
    "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ];

  // Helper styles matching auth screens
  const inputStyle = (): React.CSSProperties => ({
    height: "44px",
    borderRadius: "8px",
    border: "1.5px solid #DCE9FF",
    padding: "0 14px",
    fontSize: "14px",
    color: "#404750",
    backgroundColor: "#FFFFFF",
    outline: "none",
    width: "100%",
    fontFamily: "inherit",
    transition: "border-color 0.15s, box-shadow 0.15s",
  });

  const selectStyle = (): React.CSSProperties => ({
    height: "44px",
    borderRadius: "8px",
    border: "1.5px solid #DCE9FF",
    padding: "0 14px",
    fontSize: "14px",
    color: "#404750",
    backgroundColor: "#FFFFFF",
    outline: "none",
    width: "100%",
    fontFamily: "inherit",
    transition: "border-color 0.15s, box-shadow 0.15s",
  });

  // Flow handlers
  const handleProfileContinue = () => {
    if (!completedSteps.includes(1)) {
      setCompletedSteps([...completedSteps, 1]);
    }
    setCurrentStep(2);
  };

  const handleProfileSkip = () => {
    if (!completedSteps.includes(1)) {
      setCompletedSteps([...completedSteps, 1]);
    }
    setCurrentStep(2);
  };

  const handleInsuranceContinue = () => {
    if (!completedSteps.includes(2)) {
      setCompletedSteps([...completedSteps, 2]);
    }
    setCurrentStep(3);
  };

  const handleInsuranceSkip = () => {
    if (!completedSteps.includes(2)) {
      setCompletedSteps([...completedSteps, 2]);
    }
    setCurrentStep(3);
  };

  const handleConfirmAppointment = () => {
    setBookingConfirmed(true);
  };

  const handleBookingSkip = () => {
    // Complete onboarding with no appointment
    onComplete({
      profile: {
        dateOfBirth,
        gender,
        address: { street, city, state, zipCode, country },
        emergencyContact: { name: emergencyName, phone: emergencyPhone, countryCode: emergencyCountryCode },
      },
      insurance: insuranceProvider ? {
        insuranceProvider,
        planNetworkName,
        policyNumber,
        groupNumber,
        policyHolderName,
        policyHolderDOB,
        relationshipToPolicyholder,
      } : null,
      selectedClinic: null,
      selectedProvider: null,
      appointmentDetails: null,
    });
  };

  const handleCompleteAll = () => {
    const selectedClinic = branches.find(b => b.id === bookingBranchId);
    const selectedProvider = providers.find(p => p.id === bookingProviderId);
    const selectedService = services.find(s => s.id === bookingServiceId);

    onComplete({
      profile: {
        dateOfBirth,
        gender,
        address: { street, city, state, zipCode, country },
        emergencyContact: { name: emergencyName, phone: emergencyPhone, countryCode: emergencyCountryCode },
      },
      insurance: insuranceProvider ? {
        insuranceProvider,
        planNetworkName,
        policyNumber,
        groupNumber,
        policyHolderName,
        policyHolderDOB,
        relationshipToPolicyholder,
      } : null,
      selectedClinic,
      selectedProvider,
      appointmentDetails: {
        date: bookingDate,
        time: bookingTime,
        timeSlot: bookingTime,
        type: selectedService ? selectedService.name : "Initial Consultation",
      },
    });
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

  const isProfileValid = true;
  const isBookingValid = true;

  // Render variables
  const currentClinic = branches.find(b => b.id === bookingBranchId);
  const currentProvider = providers.find(p => p.id === bookingProviderId);
  const currentService = services.find(s => s.id === bookingServiceId);

  return (
    <div
      style={{
        fontFamily: "'Avenir', 'Avenir Next', 'Nunito Sans', sans-serif",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
      }}
    >
      {/* Left Panel - Solid blue gradient branding (matches OTPPasswordScreen) */}
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
              <Shield style={{ width: "18px", height: "18px", color: "white" }} />
            </div>
            <div>
              <p style={{ color: "white", fontWeight: 600, fontSize: "13px", marginBottom: "2px" }}>Secure &amp; private</p>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "12px" }}>Your health data is encrypted and protected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — flex: 1 + minHeight: 0 is the critical fix for scroll */}
      <div
        className="flex-1 flex flex-col bg-neutral-50 dark:bg-neutral-950"
        style={{ height: "100vh", overflowY: "auto", minHeight: 0 }}
      >
        <div className="w-full max-w-2xl mx-auto px-6 py-8 flex flex-col">
          {/* Logo on Mobile only */}
          <div className="flex lg:hidden justify-center mb-6">
            <img src={logo} alt="SpineCloud IQ" style={{ height: "55px", width: "auto" }} />
          </div>

          {/* Stepper Progress Bar (3 steps) */}
          {!bookingConfirmed && (
            <div className="mb-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between relative">
                <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-neutral-200 dark:bg-neutral-800 -z-0" />
                {steps.map((step) => {
                  const isCompleted = completedSteps.includes(step.id);
                  const isActive = currentStep === step.id;
                  return (
                    <div key={step.id} className="relative z-10 flex flex-col items-center flex-1">
                      <button
                        type="button"
                        onClick={() => {
                          // Allow navigation to completed steps or current step
                          if (isCompleted || step.id < currentStep) {
                            setCurrentStep(step.id);
                          }
                        }}
                        disabled={!isCompleted && step.id > currentStep}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                          isCompleted
                            ? "bg-success-500 text-white"
                            : isActive
                            ? "bg-primary-600 text-white ring-4 ring-primary-500/20"
                            : "bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 cursor-not-allowed"
                        }`}
                      >
                        {isCompleted ? <Check className="w-5 h-5" /> : step.id}
                      </button>
                      <div className="mt-2 text-center">
                        <p className={`text-xs font-semibold ${isActive ? "text-primary-600 dark:text-primary-400" : "text-neutral-500"}`}>
                          {step.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Card Wrapper (Insurance step UI layout applied to all steps) */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm overflow-hidden transition-all">
            {/* STEP 1: BASIC DETAILS */}
            {currentStep === 1 && (
              <div>
                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-neutral-200 dark:border-neutral-800 text-center">
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Basic details</h2>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    Provide your demographic and contact information
                  </p>
                </div>

                {/* Form Body */}
                <div className="p-6 space-y-6">
                  {/* Demographic section */}
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide mb-3">
                      Demographic information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                          Date of birth
                        </label>
                        <input
                          type="date"
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          style={inputStyle()}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                          Gender
                        </label>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          style={selectStyle()}
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800">
                    <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide mb-3">
                      Address details
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                          Street address
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., 123 Main St"
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          style={inputStyle()}
                        />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="col-span-2">
                          <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                            City
                          </label>
                          <input
                            type="text"
                            placeholder="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            style={inputStyle()}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                            State
                          </label>
                          <select
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            style={selectStyle()}
                          >
                            <option value="">State</option>
                            {usStates.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                            Zip code
                          </label>
                          <input
                            type="text"
                            placeholder="Zip"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            style={inputStyle()}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800">
                    <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide mb-3">
                      Emergency contact information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                          Contact name
                        </label>
                        <input
                          type="text"
                          placeholder="Contact full name"
                          value={emergencyName}
                          onChange={(e) => setEmergencyName(e.target.value)}
                          style={inputStyle()}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                          Contact phone number
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={emergencyCountryCode}
                            onChange={(e) => setEmergencyCountryCode(e.target.value)}
                            style={{ ...selectStyle(), width: "80px", flexShrink: 0 }}
                          >
                            <option value="+1">+1</option>
                            <option value="+44">+44</option>
                            <option value="+61">+61</option>
                            <option value="+91">+91</option>
                          </select>
                          <input
                            type="tel"
                            placeholder="(555) 000-0000"
                            value={emergencyPhone}
                            onChange={(e) => setEmergencyPhone(e.target.value)}
                            style={{ ...inputStyle(), flex: 1 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleProfileSkip}
                    className="px-5 h-11 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
                  >
                    Skip
                  </button>
                  <button
                    type="button"
                    onClick={handleProfileContinue}
                    disabled={!isProfileValid}
                    className="px-6 h-11 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: INSURANCE DETAILS (NO ASTERISKS - COMPLETELY OPTIONAL) */}
            {currentStep === 2 && (
              <div>
                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-neutral-200 dark:border-neutral-800 text-center">
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Insurance details</h2>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    Add your insurance information (optional)
                  </p>
                </div>

                {/* Form Body */}
                <div className="p-6 space-y-6">
                  {/* Insurance Information Section */}
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide mb-3">
                      Insurance information
                    </h4>
                    <div className="space-y-4">
                      {/* Insurance Provider Name */}
                      <div>
                        <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                          Insurance provider name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Blue Cross Blue Shield, Aetna, UnitedHealthcare"
                          value={insuranceProvider}
                          onChange={(e) => setInsuranceProvider(e.target.value)}
                          style={inputStyle()}
                        />
                      </div>

                      {/* Plan / Network Name */}
                      <div>
                        <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                          Plan / Network name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., PPO, HMO, EPO"
                          value={planNetworkName}
                          onChange={(e) => setPlanNetworkName(e.target.value)}
                          style={inputStyle()}
                        />
                      </div>

                      {/* Policy Number and Group Number */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                            Policy / Member ID number
                          </label>
                          <input
                            type="text"
                            placeholder="Enter policy/member ID"
                            value={policyNumber}
                            onChange={(e) => setPolicyNumber(e.target.value)}
                            style={inputStyle()}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                            Group number
                          </label>
                          <input
                            type="text"
                            placeholder="Enter group number"
                            value={groupNumber}
                            onChange={(e) => setGroupNumber(e.target.value)}
                            style={inputStyle()}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Policy Holder Information Section */}
                  <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800">
                    <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide mb-3">
                      Policy holder information
                    </h4>
                    <div className="space-y-4">
                      {/* Policy Holder Name */}
                      <div>
                        <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                          Name of policyholder
                        </label>
                        <input
                          type="text"
                          placeholder="Enter full name (if different from patient)"
                          value={policyHolderName}
                          onChange={(e) => setPolicyHolderName(e.target.value)}
                          style={inputStyle()}
                        />
                      </div>

                      {/* Policy Holder DOB and Relationship */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                            Policyholder date of birth
                          </label>
                          <input
                            type="date"
                            value={policyHolderDOB}
                            onChange={(e) => setPolicyHolderDOB(e.target.value)}
                            style={inputStyle()}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                            Relationship to policyholder
                          </label>
                          <select
                            value={relationshipToPolicyholder}
                            onChange={(e) => setRelationshipToPolicyholder(e.target.value)}
                            style={selectStyle()}
                          >
                            <option value="">Select relationship</option>
                            <option value="Self">Self</option>
                            <option value="Spouse">Spouse</option>
                            <option value="Child">Child</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Insurance Card Upload Section */}
                  <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800">
                    <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide mb-3">
                      Insurance card images
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Front Card */}
                      <div>
                        <label className="text-xs text-neutral-500 dark:text-neutral-400 font-medium block mb-2">
                          Insurance card – Front image
                        </label>
                        {!insuranceCardFront ? (
                          <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                            <Upload className="w-6 h-6 text-neutral-400 mb-1" />
                            <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">Click to upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, "front")}
                            />
                          </label>
                        ) : (
                          <div className="relative h-32 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 p-3 flex flex-col justify-between">
                            <button
                              type="button"
                              onClick={() => setInsuranceCardFront(null)}
                              className="absolute top-2 right-2 p-1 bg-white dark:bg-neutral-800 rounded-full border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100"
                            >
                              <X className="w-3.5 h-3.5 text-neutral-500" />
                            </button>
                            <p className="text-xs text-neutral-950 dark:text-white font-medium truncate pr-6">
                              {insuranceCardFront.name}
                            </p>
                            <p className="text-[10px] text-neutral-400">
                              {(insuranceCardFront.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Back Card */}
                      <div>
                        <label className="text-xs text-neutral-500 dark:text-neutral-400 font-medium block mb-2">
                          Insurance card – Back image
                        </label>
                        {!insuranceCardBack ? (
                          <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                            <Upload className="w-6 h-6 text-neutral-400 mb-1" />
                            <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">Click to upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, "back")}
                            />
                          </label>
                        ) : (
                          <div className="relative h-32 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 p-3 flex flex-col justify-between">
                            <button
                              type="button"
                              onClick={() => setInsuranceCardBack(null)}
                              className="absolute top-2 right-2 p-1 bg-white dark:bg-neutral-800 rounded-full border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100"
                            >
                              <X className="w-3.5 h-3.5 text-neutral-500" />
                            </button>
                            <p className="text-xs text-neutral-950 dark:text-white font-medium truncate pr-6">
                              {insuranceCardBack.name}
                            </p>
                            <p className="text-[10px] text-neutral-400">
                              {(insuranceCardBack.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-5 h-11 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleInsuranceSkip}
                      className="px-5 h-11 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
                    >
                      Skip
                    </button>
                    <button
                      type="button"
                      onClick={handleInsuranceContinue}
                      className="px-6 h-11 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium text-sm"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: BOOK APPOINTMENT */}
            {currentStep === 3 && (
              <div>
                {!bookingConfirmed ? (
                  <div>
                    {/* Header */}
                    <div className="px-6 pt-6 pb-4 border-b border-neutral-200 dark:border-neutral-800 text-center">
                      <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Book appointment</h2>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        Schedule your chiropractic appointment (optional)
                      </p>
                    </div>

                    {/* Form Body */}
                    <div className="p-6 space-y-5">
                      {/* Select Branch */}
                      <div>
                        <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                          Select branch
                        </label>
                        <select
                          value={bookingBranchId}
                          onChange={(e) => {
                            setBookingBranchId(e.target.value);
                            setBookingServiceId("");
                            setBookingProviderId("");
                            setBookingDate("");
                            setBookingTime("");
                          }}
                          style={selectStyle()}
                        >
                          <option value="">Select a branch location</option>
                          {branches.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name} - {b.address}, {b.city}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Select Service */}
                      <div>
                        <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                          Select service
                        </label>
                        <select
                          value={bookingServiceId}
                          onChange={(e) => {
                            setBookingServiceId(e.target.value);
                            setBookingProviderId("");
                            setBookingDate("");
                            setBookingTime("");
                          }}
                          disabled={!bookingBranchId}
                          style={selectStyle()}
                        >
                          <option value="">Select a service</option>
                          {services
                            .filter((s) => s.isActive && (s.locationIds ? s.locationIds.includes(bookingBranchId) : true))
                            .map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* Select Provider */}
                      <div>
                        <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                          Select provider
                        </label>
                        <select
                          value={bookingProviderId}
                          onChange={(e) => {
                            setBookingProviderId(e.target.value);
                            setBookingDate("");
                            setBookingTime("");
                          }}
                          disabled={!bookingBranchId}
                          style={selectStyle()}
                        >
                          <option value="">Select a provider</option>
                          {(() => {
                            const filteredProviders = providers.filter((p) => {
                              const selectedBranch = branches.find(b => b.id === bookingBranchId);
                              if (!selectedBranch) return true;
                              return p.branches ? (p.branches.includes(selectedBranch.name) || p.branches.includes(bookingBranchId)) : true;
                            });
                            const displayProviders = filteredProviders.length > 0 ? filteredProviders : providers;
                            return displayProviders.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name || `${p.firstName} ${p.lastName}`} - {p.specialization || p.specialty}
                              </option>
                            ));
                          })()}
                        </select>
                      </div>

                      {/* Select Date & Select Time (Grid Side-by-Side) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                            Select date
                          </label>
                          <input
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            value={bookingDate}
                            onChange={(e) => {
                              setBookingDate(e.target.value);
                              setBookingTime("");
                            }}
                            disabled={!bookingBranchId}
                            style={inputStyle()}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                            Select time slot
                          </label>
                          <select
                            value={bookingTime}
                            onChange={(e) => setBookingTime(e.target.value)}
                            disabled={!bookingBranchId}
                            style={selectStyle()}
                          >
                            <option value="">Select a time</option>
                            <option value="09:00 AM">9:00 AM</option>
                            <option value="09:30 AM">9:30 AM</option>
                            <option value="10:00 AM">10:00 AM</option>
                            <option value="10:30 AM">10:30 AM</option>
                            <option value="11:00 AM">11:00 AM</option>
                            <option value="11:30 AM">11:30 AM</option>
                            <option value="02:00 PM">2:00 PM</option>
                            <option value="02:30 PM">2:30 PM</option>
                            <option value="03:00 PM">3:00 PM</option>
                            <option value="03:30 PM">3:30 PM</option>
                            <option value="04:00 PM">4:00 PM</option>
                            <option value="04:30 PM">4:30 PM</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 pb-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="px-5 h-11 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleBookingSkip}
                          className="px-5 h-11 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
                        >
                          Skip
                        </button>
                        <button
                          type="button"
                          onClick={handleConfirmAppointment}
                          disabled={!isBookingValid}
                          className="px-6 h-11 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Confirm Appointment
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* BOOKING CONFIRMATION - CONTAINED INSIDE STEP 3 CARD */
                  <div className="p-8 text-center space-y-6">
                    <div className="flex justify-center">
                      <div className="size-16 bg-success-50 dark:bg-success-950/20 rounded-full flex items-center justify-center border border-success-200 dark:border-success-800">
                        <CheckCircle className="w-10 h-10 text-success-500" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Appointment Confirmed!</h2>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Your initial chiropractic appointment has been successfully scheduled.
                      </p>
                    </div>

                    {/* Booking Details Card */}
                    <div className="bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 rounded-xl p-5 text-left space-y-4 max-w-md mx-auto">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-neutral-400 font-semibold">CLINIC LOCATION</p>
                          <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                            {currentClinic?.name || "Downtown Branch"}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {currentClinic?.address || "123 Main St, Suite 100"}, {currentClinic?.city || "New York"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Stethoscope className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-neutral-400 font-semibold">TREATMENT & PROVIDER</p>
                          <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                            {currentService?.name || "Initial Consultation"}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {currentProvider?.name || `${currentProvider?.firstName} ${currentProvider?.lastName}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-neutral-400 font-semibold">DATE & TIME</p>
                          <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                            {new Date(bookingDate).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-xs text-neutral-500">{bookingTime}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setBookingConfirmed(false)}
                        className="px-5 h-11 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" /> Reschedule
                      </button>
                      <button
                        type="button"
                        onClick={handleCompleteAll}
                        className="px-8 h-11 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-semibold text-sm"
                      >
                        Go to Dashboard
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}