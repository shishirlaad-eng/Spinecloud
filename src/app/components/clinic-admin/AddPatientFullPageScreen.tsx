import { useState } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { ArrowLeft, User, MapPin, Phone, Shield, FileCheck, ClipboardList, CheckCircle, Upload, X, Calendar as CalendarIcon, Clock, Building2 } from "lucide-react";

interface Question {
  id: string;
  text: string;
  type: "radio" | "checkbox" | "text" | "textarea" | "slider" | "number";
  options?: string[];
  min?: number;
  max?: number;
  required: boolean;
}

interface Questionnaire {
  id: string;
  categoryName: string;
  description: string;
  questions: Question[];
}

interface ConsentForm {
  id: string;
  title: string;
  status: "Active" | "Inactive";
  content: string;
}

interface AddPatientFullPageScreenProps {
  questionnaires: Questionnaire[];
  consentForms: ConsentForm[];
  onNavigate: (menu: string) => void;
  onBack: () => void;
  onSavePatient: (patientData: any) => void;
  onGenerateLink: () => void;
  onLogout?: () => void;
  services: any[];
}

type Step = "basicInfo" | "insurance" | "categorySelection" | "questionnaires" | "consent" | "clinicSelection" | "providerSelection" | "appointmentBooking";

export function AddPatientFullPageScreen({
  questionnaires,
  consentForms,
  onNavigate,
  onBack,
  onSavePatient,
  onGenerateLink,
  onLogout,
  services,
}: AddPatientFullPageScreenProps) {
  const [currentStep, setCurrentStep] = useState<Step>("basicInfo");

  // Basic Information
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+1");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("United States");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyCountryCode, setEmergencyCountryCode] = useState("+1");
  const [emergencyPhone, setEmergencyPhone] = useState("");

  // Insurance
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [policyHolderName, setPolicyHolderName] = useState("");
  const [policyHolderDOB, setPolicyHolderDOB] = useState("");
  const [relationshipToPolicyholder, setRelationshipToPolicyholder] = useState("");
  const [groupNumber, setGroupNumber] = useState("");

  // Category Selection
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [completedCategories, setCompletedCategories] = useState<string[]>([]);
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null);

  // Questionnaires - Using real patient portal questions
  const [currentQuestionnaireStep, setCurrentQuestionnaireStep] = useState(1);
  const [complaint, setComplaint] = useState("");
  const [functionalDifficulties, setFunctionalDifficulties] = useState<string[]>([]);
  const [relievingFactors, setRelievingFactors] = useState<string[]>([]);
  const [overallChange, setOverallChange] = useState("");
  const [painDescription, setPainDescription] = useState<string[]>([]);
  const [currentPainLevel, setCurrentPainLevel] = useState(5);
  const [worstPainLevel, setWorstPainLevel] = useState(5);
  const [leastPainLevel, setLeastPainLevel] = useState(5);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  // Consent
  const [acceptedConsentIds, setAcceptedConsentIds] = useState<string[]>([]);

  // Appointment Booking
  const [selectedClinic, setSelectedClinic] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [service, setService] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const countryCodes = [
    { code: "+1", country: "US/Canada" },
    { code: "+44", country: "UK" },
    { code: "+61", country: "Australia" },
    { code: "+91", country: "India" },
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

  // Mock data for clinics and providers
  const clinics = [
    { id: "1", name: "Downtown Medical Center", address: "123 Main Street, New York, NY 10001" },
    { id: "2", name: "Westside Spine Clinic", address: "456 West Ave, Los Angeles, CA 90001" },
  ];

  const providers = [
    { id: "1", name: "Dr. Sarah Johnson", specialty: "Orthopedic Spine Surgeon" },
    { id: "2", name: "Dr. Michael Chen", specialty: "Physical Medicine & Rehabilitation" },
  ];


  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM"
  ];

  const validateBasicInfo = () => {
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email format";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    if (!dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!gender) newErrors.gender = "Gender is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateInsurance = () => {
    // Insurance is optional, but if any field is filled, all required fields must be filled
    const hasAnyInsuranceData = insuranceProvider || policyNumber || policyHolderName || policyHolderDOB || relationshipToPolicyholder;
    
    if (!hasAnyInsuranceData) return true; // All optional, so valid
    
    const newErrors: Record<string, string> = {};
    if (!insuranceProvider.trim()) newErrors.insuranceProvider = "Insurance provider is required";
    if (!policyNumber.trim()) newErrors.policyNumber = "Policy number is required";
    if (!policyHolderName.trim()) newErrors.policyHolderName = "Policyholder name is required";
    if (!policyHolderDOB) newErrors.policyHolderDOB = "Policyholder date of birth is required";
    if (!relationshipToPolicyholder) newErrors.relationshipToPolicyholder = "Relationship is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBasicInfoContinue = () => {
    if (validateBasicInfo()) {
      setCurrentStep("insurance");
    }
  };

  const handleInsuranceContinue = () => {
    if (validateInsurance()) {
      setCurrentStep("categorySelection");
    }
  };

  const handleSkipInsurance = () => {
    setInsuranceProvider("");
    setPolicyNumber("");
    setPolicyHolderName("");
    setPolicyHolderDOB("");
    setRelationshipToPolicyholder("");
    setGroupNumber("");
    setCurrentStep("categorySelection");
  };

  const handleCategorySelection = () => {
    if (selectedCategories.length === 0 && completedCategories.length === 0) {
      setErrors({ category: "Please select at least one category" });
      return;
    }
    
    // If user clicked continue without selecting a new category, go to consent
    if (selectedCategories.length === 0 && completedCategories.length > 0) {
      setCurrentStep("consent");
      return;
    }
    
    // Start with the first selected (uncompleted) category
    const firstUncompletedCategory = selectedCategories.find(
      catId => !completedCategories.includes(catId)
    );
    
    if (firstUncompletedCategory) {
      setCurrentCategoryId(firstUncompletedCategory);
      setCurrentQuestionnaireStep(1);
      setCurrentStep("questionnaires");
    } else {
      // All selected categories are completed, go to consent
      setCurrentStep("consent");
    }
  };

  const handleQuestionnaireNext = () => {
    if (currentQuestionnaireStep < 4) {
      setCurrentQuestionnaireStep(currentQuestionnaireStep + 1);
    } else {
      // Mark current category as completed
      if (currentCategoryId && !completedCategories.includes(currentCategoryId)) {
        setCompletedCategories([...completedCategories, currentCategoryId]);
      }

      // Reset current category from selected list
      setSelectedCategories(selectedCategories.filter(id => id !== currentCategoryId));
      setCurrentCategoryId(null);

      // Reset questionnaire fields for potential next category
      setComplaint("");
      setFunctionalDifficulties([]);
      setRelievingFactors([]);
      setOverallChange("");
      setPainDescription([]);
      setCurrentPainLevel(5);
      setWorstPainLevel(5);
      setLeastPainLevel(5);
      setUploadedImages([]);

      // Go back to category selection
      setCurrentStep("categorySelection");
    }
  };

  const handleQuestionnaireBack = () => {
    if (currentQuestionnaireStep > 1) {
      setCurrentQuestionnaireStep(currentQuestionnaireStep - 1);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedImages([...uploadedImages, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleConsentContinue = () => {
    const activeConsents = consentForms.filter(form => form.status === "Active");
    if (acceptedConsentIds.length === activeConsents.length) {
      setCurrentStep("clinicSelection");
    } else {
      setErrors({ consent: "All consent forms must be accepted" });
    }
  };

  const handleClinicContinue = () => {
    if (selectedClinic) {
      setCurrentStep("providerSelection");
    } else {
      setErrors({ clinic: "Please select a clinic" });
    }
  };

  const handleProviderContinue = () => {
    if (!selectedProvider) {
      setErrors({ provider: "Please select a provider" });
      return;
    }
    if (!service) {
      setErrors({ appointment: "Please select a service" });
      return;
    }
    if (!appointmentDate) {
      setErrors({ appointment: "Please select an appointment date" });
      return;
    }
    if (!appointmentTime) {
      setErrors({ appointment: "Please select an appointment time" });
      return;
    }
    setErrors({});
    handleFinalSubmit();
  };

  const handleFinalSubmit = () => {
    if (!service || !appointmentDate || !appointmentTime) {
      setErrors({ appointment: "Please complete all appointment details" });
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
      ...(insuranceProvider
        ? {
            insurance: {
              provider: insuranceProvider.trim(),
              policyNumber: policyNumber.trim(),
              policyHolderName: policyHolderName.trim(),
              policyHolderDOB,
              relationshipToPolicyholder,
              groupNumber: groupNumber.trim(),
            },
          }
        : {}),
      questionnaireResponses: {
        complaint,
        functionalDifficulties,
        relievingFactors,
        overallChange,
        painDescription,
        currentPainLevel,
        worstPainLevel,
        leastPainLevel,
        images: uploadedImages,
      },
      acceptedConsentIds,
      appointment: {
        clinic: selectedClinic,
        provider: selectedProvider,
        service: service,
        date: appointmentDate,
        time: appointmentTime,
      },
      source: "staff",
      createdAt: new Date().toISOString(),
    };

    onSavePatient(patientData);
  };

  const renderBasicInfo = () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
          Basic information
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Enter the patient's basic demographic and contact information
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-6">
        {/* Demographics */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide">
              Demographics
            </h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                  Email address <span className="text-destructive">*</span>
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
                  Phone number <span className="text-destructive">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    id="phoneCountryCode"
                    value={phoneCountryCode}
                    onChange={(e) => setPhoneCountryCode(e.target.value)}
                    className="flex h-10 w-24 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                  >
                    {countryCodes.map((code) => (
                      <option key={code.code} value={code.code}>
                        {code.code}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Address */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Emergency Contact */}
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
              <div className="flex gap-2">
                <select
                  id="emergencyCountryCode"
                  value={emergencyCountryCode}
                  onChange={(e) => setEmergencyCountryCode(e.target.value)}
                  className="flex h-10 w-24 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                >
                  {countryCodes.map((code) => (
                    <option key={code.code} value={code.code}>
                      {code.code}
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
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleBasicInfoContinue}
          className="inline-flex items-center gap-2 px-6 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm"
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderInsurance = () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
          Insurance details
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Add the patient's insurance information (optional - you can skip this step)
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-4">
        <div>
          <label htmlFor="insuranceProvider" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
            Insurance provider name
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="policyNumber" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
              Policy / Member ID number
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
            <label htmlFor="groupNumber" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
              Group number
            </label>
            <input
              id="groupNumber"
              type="text"
              value={groupNumber}
              onChange={(e) => setGroupNumber(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
              placeholder="Enter group number"
            />
          </div>
        </div>
        <div>
          <label htmlFor="policyHolderName" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
            Name of policyholder
          </label>
          <input
            id="policyHolderName"
            type="text"
            value={policyHolderName}
            onChange={(e) => setPolicyHolderName(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
            placeholder="Full name of policyholder"
          />
          {errors.policyHolderName && (
            <p className="text-xs text-destructive mt-1">{errors.policyHolderName}</p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="policyHolderDOB" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
              Policyholder date of birth
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
            <label htmlFor="relationship" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
              Relationship to policyholder
            </label>
            <select
              id="relationship"
              value={relationshipToPolicyholder}
              onChange={(e) => setRelationshipToPolicyholder(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
            >
              <option value="">Select relationship</option>
              <option value="Self">Self</option>
              <option value="Spouse">Spouse</option>
              <option value="Child">Child</option>
              <option value="Parent">Parent</option>
              <option value="Other">Other</option>
            </select>
            {errors.relationshipToPolicyholder && (
              <p className="text-xs text-destructive mt-1">{errors.relationshipToPolicyholder}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setCurrentStep("basicInfo")}
          className="inline-flex items-center gap-2 px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex gap-3">
          <button
            onClick={handleSkipInsurance}
            className="inline-flex items-center gap-2 px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
          >
            Skip for now
          </button>
          <button
            onClick={handleInsuranceContinue}
            className="inline-flex items-center gap-2 px-6 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );

  const renderCategorySelection = () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
          Select questionnaire categories
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {completedCategories.length > 0 
            ? "Select another category to complete or continue to the next step"
            : "Choose the questionnaire categories to complete for this patient"}
        </p>
      </div>

      {completedCategories.length > 0 && (
        <div className="mb-4 p-3 bg-success-50 dark:bg-success-950/20 border border-success-200 dark:border-success-900 rounded-lg">
          <p className="text-sm text-success-900 dark:text-success-100">
            ✓ {completedCategories.length} {completedCategories.length === 1 ? 'category' : 'categories'} completed
          </p>
        </div>
      )}

      <div className="space-y-3">
        {questionnaires.map((questionnaire) => {
          const isSelected = selectedCategories.includes(questionnaire.id);
          const isCompleted = completedCategories.includes(questionnaire.id);

          return (
            <div
              key={questionnaire.id}
              onClick={() => {
                if (!isCompleted) {
                  if (isSelected) {
                    setSelectedCategories(selectedCategories.filter(id => id !== questionnaire.id));
                  } else {
                    setSelectedCategories([...selectedCategories, questionnaire.id]);
                  }
                }
              }}
              className={`bg-white dark:bg-neutral-900 border rounded-lg p-5 transition-all ${
                isCompleted
                  ? "border-success-500 bg-success-50 dark:bg-success-950/20 cursor-default"
                  : "cursor-pointer " + (isSelected
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20 ring-2 ring-primary-500/20"
                  : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-950")
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <ClipboardList className="w-5 h-5 text-neutral-600 dark:text-neutral-400 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
                      {questionnaire.categoryName}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {questionnaire.description}
                    </p>
                  </div>
                </div>
                {isCompleted ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-success-600" />
                    <span className="text-sm text-success-600 font-medium">Completed</span>
                  </div>
                ) : isSelected ? (
                  <div className="w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {errors.category && (
        <p className="text-xs text-destructive mt-3">{errors.category}</p>
      )}

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setCurrentStep("insurance")}
          className="inline-flex items-center gap-2 px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={handleCategorySelection}
          disabled={selectedCategories.length === 0 && completedCategories.length === 0}
          className="inline-flex items-center gap-2 px-6 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
        >
          {selectedCategories.length > 0 
            ? "Continue to questionnaire" 
            : completedCategories.length > 0 
            ? "Continue to consent" 
            : "Continue"}
        </button>
      </div>
    </div>
  );

  const renderQuestionnaires = () => {
    const currentCategory = questionnaires.find(q => q.id === currentCategoryId);
    
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
            {currentCategory?.categoryName || "Patient questionnaire"}
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Step {currentQuestionnaireStep} of 4: Complete the medical history questionnaire
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-2 rounded-full transition-all ${
                step === currentQuestionnaireStep
                  ? "w-8 bg-primary-600"
                  : step < currentQuestionnaireStep
                  ? "w-2 bg-primary-600"
                  : "w-2 bg-neutral-300 dark:bg-neutral-700"
              }`}
            />
          ))}
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-6">
          {currentQuestionnaireStep === 1 && (
            <>
              <div>
                <label htmlFor="complaint" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                  What is your main complaint or reason for visiting?
                </label>
                <textarea
                  id="complaint"
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  className="flex min-h-24 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow] resize-none"
                  placeholder="Describe your main complaint"
                />
              </div>

              <div>
                <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                  What functional difficulties are you experiencing?
                </label>
                <div className="space-y-2">
                  {["Walking", "Sitting", "Standing", "Sleeping", "Bending", "Lifting"].map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={functionalDifficulties.includes(option)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFunctionalDifficulties([...functionalDifficulties, option]);
                          } else {
                            setFunctionalDifficulties(functionalDifficulties.filter(d => d !== option));
                          }
                        }}
                        className="w-4 h-4 text-primary-600 border-neutral-300 rounded"
                      />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {currentQuestionnaireStep === 2 && (
            <div>
              <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                What makes your pain better? (Select all that apply)
              </label>
              <div className="space-y-2">
                {["Rest", "Ice", "Heat", "Medication", "Stretching", "Exercise", "Physical therapy"].map((option) => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={relievingFactors.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setRelievingFactors([...relievingFactors, option]);
                        } else {
                          setRelievingFactors(relievingFactors.filter(f => f !== option));
                        }
                      }}
                      className="w-4 h-4 text-primary-600 border-neutral-300 rounded"
                    />
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {currentQuestionnaireStep === 3 && (
            <>
              <div>
                <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                  Overall, how has your condition changed in the last 2 weeks?
                </label>
                <div className="space-y-2">
                  {["Much better", "Slightly better", "No change", "Slightly worse", "Much worse"].map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="overallChange"
                        value={option}
                        checked={overallChange === option}
                        onChange={(e) => setOverallChange(e.target.value)}
                        className="w-4 h-4 text-primary-600 border-neutral-300"
                      />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                  How would you describe your pain? (Select all that apply)
                </label>
                <div className="space-y-2">
                  {["Sharp", "Dull", "Burning", "Tingling", "Throbbing", "Shooting", "Stabbing"].map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={painDescription.includes(option)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPainDescription([...painDescription, option]);
                          } else {
                            setPainDescription(painDescription.filter(p => p !== option));
                          }
                        }}
                        className="w-4 h-4 text-primary-600 border-neutral-300 rounded"
                      />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {currentQuestionnaireStep === 4 && (
            <>
              <div>
                <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                  Current pain level (0 = No pain, 10 = Worst pain)
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={currentPainLevel}
                  onChange={(e) => setCurrentPainLevel(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-neutral-500 mt-1">
                  <span>0</span>
                  <span className="text-sm font-medium text-neutral-900 dark:text-white">{currentPainLevel}</span>
                  <span>10</span>
                </div>
              </div>

              <div>
                <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                  Worst pain level in the last week
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={worstPainLevel}
                  onChange={(e) => setWorstPainLevel(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-neutral-500 mt-1">
                  <span>0</span>
                  <span className="text-sm font-medium text-neutral-900 dark:text-white">{worstPainLevel}</span>
                  <span>10</span>
                </div>
              </div>

              <div>
                <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                  Least pain level in the last week
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={leastPainLevel}
                  onChange={(e) => setLeastPainLevel(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-neutral-500 mt-1">
                  <span>0</span>
                  <span className="text-sm font-medium text-neutral-900 dark:text-white">{leastPainLevel}</span>
                  <span>10</span>
                </div>
              </div>

              <div>
                <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                  Upload X-rays or imaging reports (optional)
                </label>
                <p className="text-sm text-neutral-500 mb-3">
                  If you have recent X-rays, MRI, CT scans, or other imaging reports, please upload them here
                </p>
                <div className="border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-neutral-500 mb-3">
                    PNG, JPG, or PDF up to 10MB
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center gap-2 px-4 h-9 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm cursor-pointer"
                  >
                    Choose files
                  </label>
                </div>
                {uploadedImages.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {uploadedImages.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-neutral-50 dark:bg-neutral-950 rounded">
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">{file.name}</span>
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded"
                        >
                          <X className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={() => {
              if (currentQuestionnaireStep === 1) {
                setCurrentStep("categorySelection");
              } else {
                handleQuestionnaireBack();
              }
            }}
            className="inline-flex items-center gap-2 px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={handleQuestionnaireNext}
            className="inline-flex items-center gap-2 px-6 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm"
          >
            {currentQuestionnaireStep === 4 
              ? (selectedCategories.find(catId => !completedCategories.includes(catId) && catId !== currentCategoryId) 
                  ? "Next category" 
                  : "Continue")
              : "Next"}
          </button>
        </div>
      </div>
    );
  };

  const renderConsent = () => {
    const activeConsents = consentForms.filter(form => form.status === "Active");

    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
            Consent forms
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Review and accept all required consent forms on behalf of the patient
          </p>
          <div className="mt-3 p-3 bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-900 rounded-lg">
            <p className="text-sm text-primary-900 dark:text-primary-100">
              <strong>Note:</strong> Staff is agreeing after verbal confirmation from the patient and patient agrees to this.
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {activeConsents.map((form) => {
            const isAccepted = acceptedConsentIds.includes(form.id);

            return (
              <div
                key={form.id}
                className={`bg-white dark:bg-neutral-900 border rounded-lg p-5 transition-all ${
                  isAccepted
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20"
                    : "border-neutral-200 dark:border-neutral-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isAccepted}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setAcceptedConsentIds([...acceptedConsentIds, form.id]);
                      } else {
                        setAcceptedConsentIds(acceptedConsentIds.filter(id => id !== form.id));
                      }
                    }}
                    className="mt-0.5 w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-2 focus:ring-primary-500/10"
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <FileCheck className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    <h3 className="text-sm font-medium text-neutral-900 dark:text-white">
                      {form.title}
                    </h3>
                  </div>
                  {isAccepted && (
                    <CheckCircle className="w-5 h-5 text-primary-600" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {errors.consent && (
          <p className="text-xs text-destructive mb-4">{errors.consent}</p>
        )}

        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setCurrentStep("categorySelection")}
            className="inline-flex items-center gap-2 px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={handleConsentContinue}
            className="inline-flex items-center gap-2 px-6 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm"
          >
            Continue
          </button>
        </div>
      </div>
    );
  };

  const renderClinicSelection = () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
          Select clinic
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Choose the clinic location for the patient's appointment
        </p>
      </div>

      <div className="space-y-3">
        {clinics.map((clinic) => (
          <div
            key={clinic.id}
            onClick={() => setSelectedClinic(clinic.id)}
            className={`bg-white dark:bg-neutral-900 border rounded-lg p-5 cursor-pointer transition-all ${
              selectedClinic === clinic.id
                ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20 ring-2 ring-primary-500/20"
                : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-950"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <Building2 className="w-5 h-5 text-neutral-600 dark:text-neutral-400 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
                    {clinic.name}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {clinic.address}
                  </p>
                </div>
              </div>
              {selectedClinic === clinic.id && (
                <div className="w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {errors.clinic && (
        <p className="text-xs text-destructive mt-3">{errors.clinic}</p>
      )}

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setCurrentStep("consent")}
          className="inline-flex items-center gap-2 px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={handleClinicContinue}
          className="inline-flex items-center gap-2 px-6 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm"
        >
          Continue
        </button>
      </div>
    </div>
  );

  // Helper function to get next available date label
  const getAvailabilityLabel = (providerId: string) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Mock logic - in real app, check actual provider schedule
    if (providerId === "1") {
      return "Available today";
    } else if (providerId === "2") {
      const daysUntilTuesday = (2 - today.getDay() + 7) % 7 || 7;
      if (daysUntilTuesday === 1) {
        return "Available tomorrow";
      }
      return "Available next Tuesday";
    }
    return "Available tomorrow";
  };

  // Generate available time slots based on selected provider
  const getAvailableTimeSlots = () => {
    if (!selectedProvider) return [];
    
    // Mock available slots - in real app, fetch from provider schedule
    const morningSlots = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"];
    const afternoonSlots = ["01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM"];
    
    return [...morningSlots, ...afternoonSlots];
  };

  const renderProviderSelection = () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
          Select provider and book appointment
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Choose a healthcare provider and schedule the patient's appointment
        </p>
      </div>

      {/* Provider Selection */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
          Select provider
        </h3>
        <div className="space-y-3">
          {providers.map((provider) => (
            <div
              key={provider.id}
              onClick={() => setSelectedProvider(provider.id)}
              className={`bg-white dark:bg-neutral-900 border rounded-lg p-5 cursor-pointer transition-all ${
                selectedProvider === provider.id
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20 ring-2 ring-primary-500/20"
                  : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-950"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <User className="w-5 h-5 text-neutral-600 dark:text-neutral-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
                      {provider.name}
                    </h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                      {provider.specialty}
                    </p>
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-success-50 dark:bg-success-950/20 text-success-700 dark:text-success-400 text-xs font-medium">
                      <CalendarIcon className="w-3 h-3" />
                      {getAvailabilityLabel(provider.id)}
                    </span>
                  </div>
                </div>
                {selectedProvider === provider.id && (
                  <div className="w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Appointment Details - Only show when provider is selected */}
      {selectedProvider && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-6">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
            Appointment details
          </h3>

          {/* Service Selection */}
          <div>
            <label htmlFor="service" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
              Service <span className="text-destructive">*</span>
            </label>
            <select
              id="service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
            >
              <option value="">Select service</option>
              {services.map((svc) => (
                <option key={svc.id} value={svc.name}>
                  {svc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="appointmentDate" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
              Date <span className="text-destructive">*</span>
            </label>
            <input
              id="appointmentDate"
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
            />
          </div>

          {/* Available Time Slots */}
          {appointmentDate && (
            <div>
              <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-3">
                Available time slots <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {getAvailableTimeSlots().map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setAppointmentTime(time)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      appointmentTime === time
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400"
                        : "border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-950"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {errors.provider && (
        <p className="text-xs text-destructive mt-3">{errors.provider}</p>
      )}
      {errors.appointment && (
        <p className="text-xs text-destructive mt-3">{errors.appointment}</p>
      )}

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setCurrentStep("clinicSelection")}
          className="inline-flex items-center gap-2 px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={handleProviderContinue}
          disabled={!selectedProvider || !service || !appointmentDate || !appointmentTime}
          className="inline-flex items-center gap-2 px-6 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
        >
          Add patient and book appointment
        </button>
      </div>
    </div>
  );

  return (
    <ClinicAdminLayout activeMenu="patients" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6">
        {/* Progress Indicator */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {[
              { key: "basicInfo", label: "Basic info" },
              { key: "insurance", label: "Insurance" },
              { key: "categorySelection", label: "Categories" },
              { key: "questionnaires", label: "Questionnaire" },
              { key: "consent", label: "Consent" },
              { key: "clinicSelection", label: "Clinic" },
              { key: "providerSelection", label: "Appointment" },
            ].map((step, index, array) => {
              const stepKeys = ["basicInfo", "insurance", "categorySelection", "questionnaires", "consent", "clinicSelection", "providerSelection"];
              const currentIndex = stepKeys.indexOf(currentStep);
              const stepIndex = stepKeys.indexOf(step.key);
              
              const isActive = currentStep === step.key;
              const isCompleted = stepIndex < currentIndex;

              return (
                <div key={step.key} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      isCompleted 
                        ? "bg-success-600 text-white"
                        : isActive
                        ? "bg-primary-600 text-white"
                        : "bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                    }`}>
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
                    </div>
                    <span className={`text-xs mt-2 text-center ${
                      isActive || isCompleted
                        ? "text-neutral-900 dark:text-white font-medium"
                        : "text-neutral-500"
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {index < array.length - 1 && (
                    <div className={`h-0.5 flex-1 -mt-6 ${
                      isCompleted ? "bg-success-600" : "bg-neutral-200 dark:bg-neutral-800"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Back to Patients List */}
        {currentStep === "basicInfo" && (
          <div className="mb-6">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to patients
            </button>
          </div>
        )}

        {/* Render Current Step */}
        {currentStep === "basicInfo" && renderBasicInfo()}
        {currentStep === "insurance" && renderInsurance()}
        {currentStep === "categorySelection" && renderCategorySelection()}
        {currentStep === "questionnaires" && renderQuestionnaires()}
        {currentStep === "consent" && renderConsent()}
        {currentStep === "clinicSelection" && renderClinicSelection()}
        {currentStep === "providerSelection" && renderProviderSelection()}
      </div>
    </ClinicAdminLayout>
  );
}
