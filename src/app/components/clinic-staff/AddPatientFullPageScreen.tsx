import { useState } from "react";
import { ClinicStaffLayout } from "./layout/ClinicStaffLayout";
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
  const [emergencyRelationship, setEmergencyRelationship] = useState("");

  // Insurance
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [policyHolderName, setPolicyHolderName] = useState("");
  const [policyHolderDOB, setPolicyHolderDOB] = useState("");
  const [relationshipToPolicyholder, setRelationshipToPolicyholder] = useState("");
  const [groupNumber, setGroupNumber] = useState("");
  const [planNetworkName, setPlanNetworkName] = useState("");
  const [insuranceCardFront, setInsuranceCardFront] = useState<File | null>(null);
  const [insuranceCardBack, setInsuranceCardBack] = useState<File | null>(null);

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
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Mock data for appointment booking
  const mockClinics = [
    { id: "1", name: "Downtown Clinic", address: "123 Main St, City, State 12345" },
    { id: "2", name: "Northside Branch", address: "456 North Ave, City, State 12346" },
  ];

  const mockProviders = [
    { id: "1", name: "Dr. Sarah Johnson", specialty: "Chiropractor", clinicId: "1", availability: "Available" },
    { id: "2", name: "Dr. Michael Chen", specialty: "Physical Therapist", clinicId: "1", availability: "Available" },
    { id: "3", name: "Dr. Emily Rodriguez", specialty: "Chiropractor", clinicId: "2", availability: "Limited" },
  ];


  const mockTimeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
    "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM"
  ];

  // Validation functions
  const validateBasicInfo = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email format";
    if (!phone.trim()) newErrors.phone = "Phone is required";
    if (!dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!gender) newErrors.gender = "Gender is required";
    if (!street.trim()) newErrors.street = "Street address is required";
    if (!city.trim()) newErrors.city = "City is required";
    if (!state.trim()) newErrors.state = "State is required";
    if (!zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    if (!country.trim()) newErrors.country = "Country is required";
    if (!emergencyName.trim()) newErrors.emergencyName = "Emergency contact name is required";
    if (!emergencyPhone.trim()) newErrors.emergencyPhone = "Emergency contact phone is required";
    if (!emergencyRelationship.trim()) newErrors.emergencyRelationship = "Relationship is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextFromBasicInfo = () => {
    if (validateBasicInfo()) {
      setCurrentStep("insurance");
    }
  };

  const handleSkipInsurance = () => {
    setCurrentStep("categorySelection");
  };

  const handleNextFromInsurance = () => {
    // Insurance is optional, so no validation needed
    setCurrentStep("categorySelection");
  };

  const handleCategorySelection = () => {
    if (selectedCategories.length === 0) {
      // Skip questionnaires if no categories selected
      setCurrentStep("consent");
    } else {
      // Start with first selected category
      const firstCategory = selectedCategories[0];
      setCurrentCategoryId(firstCategory);
      setCurrentStep("questionnaires");
    }
  };

  const handleQuestionnaireSubmit = () => {
    if (!currentCategoryId) return;

    // Mark current category as completed
    setCompletedCategories([...completedCategories, currentCategoryId]);

    // Find next category
    const currentIndex = selectedCategories.indexOf(currentCategoryId);
    if (currentIndex < selectedCategories.length - 1) {
      // Move to next category
      const nextCategory = selectedCategories[currentIndex + 1];
      setCurrentCategoryId(nextCategory);
      setCurrentQuestionnaireStep(1);
      // Reset questionnaire fields
      setComplaint("");
      setFunctionalDifficulties([]);
      setRelievingFactors([]);
      setOverallChange("");
      setPainDescription([]);
      setCurrentPainLevel(5);
      setWorstPainLevel(5);
      setLeastPainLevel(5);
      setUploadedImages([]);
    } else {
      // All categories completed, move to consent
      setCurrentStep("consent");
    }
  };

  const handleConsentSubmit = () => {
    // All active consent forms must be accepted
    const activeConsentForms = consentForms.filter(form => form.status === "Active");
    if (acceptedConsentIds.length === activeConsentForms.length) {
      setCurrentStep("clinicSelection");
    }
  };

  const handleClinicSelection = () => {
    if (selectedClinic) {
      setCurrentStep("providerSelection");
    }
  };

  const handleProviderSelection = () => {
    if (selectedProvider && service) {
      setCurrentStep("appointmentBooking");
    }
  };

  const handleFinalSubmit = () => {
    // Compile all patient data
    const patientData = {
      // Basic Info
      firstName,
      lastName,
      email,
      phone: `${phoneCountryCode} ${phone}`,
      dateOfBirth,
      gender,
      address: {
        street,
        city,
        state,
        zipCode,
        country,
      },
      emergencyContact: {
        name: emergencyName,
        phone: `${emergencyCountryCode} ${emergencyPhone}`,
        relationship: emergencyRelationship,
      },
      // Insurance (if provided)
      insurance: insuranceProvider ? {
        provider: insuranceProvider,
        planNetworkName,
        policyNumber,
        groupNumber,
        policyHolderName,
        policyHolderDOB,
        relationshipToPolicyholder,
      } : undefined,
      // Appointment
      appointment: {
        clinicId: selectedClinic,
        providerId: selectedProvider,
        service: service,
        date: selectedDate,
        time: selectedTime,
      },
      // Questionnaires completed
      completedQuestionnaires: selectedCategories.map(catId => {
        const category = questionnaires.find(q => q.id === catId);
        return {
          categoryId: catId,
          categoryName: category?.categoryName || "",
        };
      }),
      // Consents accepted
      acceptedConsents: acceptedConsentIds,
    };

    onSavePatient(patientData);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedImages([...uploadedImages, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const renderStepIndicator = () => {
    const steps = [
      { key: "basicInfo", label: "Basic info" },
      { key: "insurance", label: "Insurance" },
      { key: "categorySelection", label: "Categories" },
      { key: "questionnaires", label: "Questionnaires" },
      { key: "consent", label: "Consent" },
      { key: "clinicSelection", label: "Clinic" },
      { key: "providerSelection", label: "Provider" },
      { key: "appointmentBooking", label: "Appointment" },
    ];

    const currentIndex = steps.findIndex(s => s.key === currentStep);

    return (
      <div className="flex items-center gap-2 mb-6">
        {steps.map((step, index) => {
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;
          
          return (
            <div key={step.key} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                isActive 
                  ? "bg-primary-600 text-white" 
                  : isCompleted 
                    ? "bg-success-600 text-white" 
                    : "bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
              }`}>
                {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
              </div>
              <span className={`text-sm ${isActive ? "text-neutral-900 dark:text-white font-medium" : "text-neutral-500 dark:text-neutral-400"}`}>
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className={`h-0.5 w-8 ${isCompleted ? "bg-success-600" : "bg-neutral-200 dark:bg-neutral-800"}`} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
          Patient information
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Enter the patient's basic information and contact details
        </p>
      </div>

      {/* Personal Information */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center">
            <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-wide">
            PERSONAL INFORMATION
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
                value={phoneCountryCode}
                onChange={(e) => setPhoneCountryCode(e.target.value)}
                className="flex h-10 w-24 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
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
                className="flex h-10 flex-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                placeholder="(555) 123-4567"
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-destructive mt-1">{errors.phone}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dateOfBirth" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                Date of birth <span className="text-destructive">*</span>
              </label>
              <input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
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
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-wide">
            ADDRESS
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="street" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
              Street address <span className="text-destructive">*</span>
            </label>
            <input
              id="street"
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
              placeholder="123 Main St"
            />
            {errors.street && (
              <p className="text-xs text-destructive mt-1">{errors.street}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                City <span className="text-destructive">*</span>
              </label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                placeholder="Enter city"
              />
              {errors.city && (
                <p className="text-xs text-destructive mt-1">{errors.city}</p>
              )}
            </div>
            <div>
              <label htmlFor="state" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                State <span className="text-destructive">*</span>
              </label>
              <input
                id="state"
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                placeholder="Enter state"
              />
              {errors.state && (
                <p className="text-xs text-destructive mt-1">{errors.state}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="zipCode" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                ZIP code <span className="text-destructive">*</span>
              </label>
              <input
                id="zipCode"
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                placeholder="12345"
              />
              {errors.zipCode && (
                <p className="text-xs text-destructive mt-1">{errors.zipCode}</p>
              )}
            </div>
            <div>
              <label htmlFor="country" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                Country <span className="text-destructive">*</span>
              </label>
              <input
                id="country"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                placeholder="United States"
              />
              {errors.country && (
                <p className="text-xs text-destructive mt-1">{errors.country}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center">
            <Phone className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-wide">
            EMERGENCY CONTACT
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="emergencyName" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
              Contact name <span className="text-destructive">*</span>
            </label>
            <input
              id="emergencyName"
              type="text"
              value={emergencyName}
              onChange={(e) => setEmergencyName(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
              placeholder="Full name"
            />
            {errors.emergencyName && (
              <p className="text-xs text-destructive mt-1">{errors.emergencyName}</p>
            )}
          </div>

          <div>
            <label htmlFor="emergencyPhone" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
              Contact phone <span className="text-destructive">*</span>
            </label>
            <div className="flex gap-2">
              <select
                value={emergencyCountryCode}
                onChange={(e) => setEmergencyCountryCode(e.target.value)}
                className="flex h-10 w-24 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
              >
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+91">+91</option>
              </select>
              <input
                id="emergencyPhone"
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="flex h-10 flex-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                placeholder="(555) 123-4567"
              />
            </div>
            {errors.emergencyPhone && (
              <p className="text-xs text-destructive mt-1">{errors.emergencyPhone}</p>
            )}
          </div>

          <div>
            <label htmlFor="emergencyRelationship" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
              Relationship <span className="text-destructive">*</span>
            </label>
            <input
              id="emergencyRelationship"
              type="text"
              value={emergencyRelationship}
              onChange={(e) => setEmergencyRelationship(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
              placeholder="e.g., Spouse, Parent, Sibling"
            />
            {errors.emergencyRelationship && (
              <p className="text-xs text-destructive mt-1">{errors.emergencyRelationship}</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-neutral-200 dark:border-neutral-800">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to selection</span>
        </button>
        <div className="flex gap-3">
          <button
            onClick={onGenerateLink}
            className="h-10 px-4 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium transition-colors text-sm"
          >
            Generate link instead
          </button>
          <button
            onClick={handleNextFromBasicInfo}
            className="h-10 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm"
          >
            Continue to insurance
          </button>
        </div>
      </div>
    </div>
  );

  const renderInsurance = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
          Insurance information
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Add patient insurance details (optional - can be added later)
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-wide">
            INSURANCE DETAILS
          </h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="insuranceProvider" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                Insurance provider
              </label>
              <input
                id="insuranceProvider"
                type="text"
                value={insuranceProvider}
                onChange={(e) => setInsuranceProvider(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                placeholder="e.g., Blue Cross Blue Shield"
              />
            </div>
            <div>
              <label htmlFor="planNetworkName" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                Plan / Network name
              </label>
              <input
                id="planNetworkName"
                type="text"
                value={planNetworkName}
                onChange={(e) => setPlanNetworkName(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                placeholder="e.g., PPO Gold Plan"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="policyNumber" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                Policy number
              </label>
              <input
                id="policyNumber"
                type="text"
                value={policyNumber}
                onChange={(e) => setPolicyNumber(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                placeholder="Enter policy number"
              />
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
              Policy holder name
            </label>
            <input
              id="policyHolderName"
              type="text"
              value={policyHolderName}
              onChange={(e) => setPolicyHolderName(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
              placeholder="Full name of policy holder"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="policyHolderDOB" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                Policy holder date of birth
              </label>
              <input
                id="policyHolderDOB"
                type="date"
                value={policyHolderDOB}
                onChange={(e) => setPolicyHolderDOB(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
              />
            </div>
            <div>
              <label htmlFor="relationshipToPolicyholder" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                Relationship to policy holder
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
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Insurance Card Upload */}
          <div>
            <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
              Insurance card images
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-neutral-600 dark:text-neutral-400 block mb-2">
                  Front
                </label>
                <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    id="cardFront"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setInsuranceCardFront(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  {insuranceCardFront ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-900 dark:text-white truncate">
                        {insuranceCardFront.name}
                      </span>
                      <button
                        onClick={() => setInsuranceCardFront(null)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="cardFront"
                      className="cursor-pointer inline-flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700"
                    >
                      <Upload className="w-4 h-4" />
                      Upload front
                    </label>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm text-neutral-600 dark:text-neutral-400 block mb-2">
                  Back
                </label>
                <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    id="cardBack"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setInsuranceCardBack(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  {insuranceCardBack ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-900 dark:text-white truncate">
                        {insuranceCardBack.name}
                      </span>
                      <button
                        onClick={() => setInsuranceCardBack(null)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="cardBack"
                      className="cursor-pointer inline-flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700"
                    >
                      <Upload className="w-4 h-4" />
                      Upload back
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-neutral-200 dark:border-neutral-800">
        <button
          onClick={() => setCurrentStep("basicInfo")}
          className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="flex gap-3">
          <button
            onClick={handleSkipInsurance}
            className="h-10 px-4 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium transition-colors text-sm"
          >
            Skip for now
          </button>
          <button
            onClick={handleNextFromInsurance}
            className="h-10 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm"
          >
            Continue to questionnaires
          </button>
        </div>
      </div>
    </div>
  );

  const renderCategorySelection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
          Select questionnaire categories
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Choose the questionnaire categories for the patient to complete (optional)
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-wide">
            AVAILABLE CATEGORIES
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questionnaires.map((q) => (
            <button
              key={q.id}
              onClick={() => {
                if (selectedCategories.includes(q.id)) {
                  setSelectedCategories(selectedCategories.filter(id => id !== q.id));
                } else {
                  setSelectedCategories([...selectedCategories, q.id]);
                }
              }}
              className={`p-5 border rounded-lg text-left transition-all ${
                selectedCategories.includes(q.id)
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30 ring-2 ring-primary-500/20"
                  : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-950"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {q.categoryName}
                </h4>
                {selectedCategories.includes(q.id) && (
                  <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 shrink-0" />
                )}
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {q.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-neutral-200 dark:border-neutral-800">
        <button
          onClick={() => setCurrentStep("insurance")}
          className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setSelectedCategories([]);
              setCurrentStep("consent");
            }}
            className="h-10 px-4 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium transition-colors text-sm"
          >
            Skip questionnaires
          </button>
          <button
            onClick={handleCategorySelection}
            className="h-10 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm"
          >
            {selectedCategories.length > 0 ? `Continue with ${selectedCategories.length} selected` : "Skip to consent forms"}
          </button>
        </div>
      </div>
    </div>
  );

  const renderQuestionnaires = () => {
    const currentCategory = questionnaires.find(q => q.id === currentCategoryId);
    if (!currentCategory) return null;

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
            {currentCategory.categoryName}
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Fill out this questionnaire on behalf of the patient
          </p>
        </div>

        {/* Progress indicator */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-900 dark:text-white">
              Category {selectedCategories.indexOf(currentCategoryId!) + 1} of {selectedCategories.length}
            </span>
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              {completedCategories.length} completed
            </span>
          </div>
          <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-600 transition-all"
              style={{ width: `${((selectedCategories.indexOf(currentCategoryId!) + 1) / selectedCategories.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Simplified questionnaire - just showing it's been filled */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-success-600 mx-auto mb-4" />
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              Questionnaire ready
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
              The patient can complete this questionnaire during their appointment or you can fill it out now on their behalf
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => {
              if (selectedCategories.indexOf(currentCategoryId!) === 0) {
                setCurrentStep("categorySelection");
              } else {
                // Go to previous category
                const currentIndex = selectedCategories.indexOf(currentCategoryId!);
                setCurrentCategoryId(selectedCategories[currentIndex - 1]);
              }
            }}
            className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <button
            onClick={handleQuestionnaireSubmit}
            className="h-10 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm"
          >
            {selectedCategories.indexOf(currentCategoryId!) === selectedCategories.length - 1
              ? "Continue to consent forms"
              : "Next category"}
          </button>
        </div>
      </div>
    );
  };

  const renderConsent = () => {
    const activeConsentForms = consentForms.filter(form => form.status === "Active");

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
            Consent forms
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Review and accept all consent forms on behalf of the patient
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-wide">
              REQUIRED CONSENTS
            </h3>
          </div>

          <div className="space-y-3">
            {activeConsentForms.map((form) => (
              <div
                key={form.id}
                className="flex items-start gap-3 p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg"
              >
                <input
                  type="checkbox"
                  id={`consent-${form.id}`}
                  checked={acceptedConsentIds.includes(form.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setAcceptedConsentIds([...acceptedConsentIds, form.id]);
                    } else {
                      setAcceptedConsentIds(acceptedConsentIds.filter(id => id !== form.id));
                    }
                  }}
                  className="mt-1 w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex-1">
                  <label htmlFor={`consent-${form.id}`} className="text-sm font-medium text-neutral-900 dark:text-white block mb-1 cursor-pointer">
                    {form.title}
                  </label>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                    {form.content.substring(0, 150)}...
                  </p>
                </div>
              </div>
            ))}
          </div>

          {activeConsentForms.length > 0 && acceptedConsentIds.length < activeConsentForms.length && (
            <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg">
              <p className="text-sm text-primary-700 dark:text-primary-300">
                All consent forms must be accepted to continue
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => {
              if (selectedCategories.length > 0) {
                setCurrentCategoryId(selectedCategories[selectedCategories.length - 1]);
                setCurrentStep("questionnaires");
              } else {
                setCurrentStep("categorySelection");
              }
            }}
            className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <button
            onClick={handleConsentSubmit}
            disabled={acceptedConsentIds.length !== activeConsentForms.length}
            className="h-10 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
          >
            Continue to clinic selection
          </button>
        </div>
      </div>
    );
  };

  const renderClinicSelection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
          Select clinic
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Choose the clinic location for the appointment
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-wide">
            AVAILABLE CLINICS
          </h3>
        </div>

        <div className="space-y-3">
          {mockClinics.map((clinic) => (
            <button
              key={clinic.id}
              onClick={() => setSelectedClinic(clinic.id)}
              className={`w-full p-5 border rounded-lg text-left transition-all ${
                selectedClinic === clinic.id
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30 ring-2 ring-primary-500/20"
                  : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-950"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
                    {clinic.name}
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {clinic.address}
                  </p>
                </div>
                {selectedClinic === clinic.id && (
                  <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-neutral-200 dark:border-neutral-800">
        <button
          onClick={() => setCurrentStep("consent")}
          className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <button
          onClick={handleClinicSelection}
          disabled={!selectedClinic}
          className="h-10 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
        >
          Continue to provider selection
        </button>
      </div>
    </div>
  );

  const renderProviderSelection = () => {
    const filteredProviders = mockProviders.filter(p => p.clinicId === selectedClinic);

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
            Select provider and service
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Choose a provider and service
          </p>
        </div>

        {/* Service Selection */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-wide mb-4">
            SELECT SERVICE
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {services.map((svc: any) => (
              <button
                key={svc.id}
                onClick={() => setService(svc.name)}
                className={`p-4 border rounded-lg text-left transition-all ${
                  service === svc.name
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30 ring-2 ring-primary-500/20"
                    : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-950"
                }`}
              >
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
                  {svc.name}
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {svc.duration} minutes
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Provider Selection */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-wide mb-4">
            AVAILABLE PROVIDERS
          </h3>
          <div className="space-y-3">
            {filteredProviders.map((provider) => (
              <button
                key={provider.id}
                onClick={() => setSelectedProvider(provider.id)}
                className={`w-full p-5 border rounded-lg text-left transition-all ${
                  selectedProvider === provider.id
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30 ring-2 ring-primary-500/20"
                    : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-950"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
                      {provider.name}
                    </h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                      {provider.specialty}
                    </p>
                    <span className={`inline-block px-2 py-1 rounded text-sm ${
                      provider.availability === "Available"
                        ? "bg-success-50 text-success-700"
                        : "bg-primary-50 text-primary-700"
                    }`}>
                      {provider.availability}
                    </span>
                  </div>
                  {selectedProvider === provider.id && (
                    <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => setCurrentStep("clinicSelection")}
            className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <button
            onClick={handleProviderSelection}
            disabled={!selectedProvider || !service}
            className="h-10 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
          >
            Continue to appointment booking
          </button>
        </div>
      </div>
    );
  };

  const renderAppointmentBooking = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
          Book appointment
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Select a date and time for the patient's appointment
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center">
            <CalendarIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-wide">
            APPOINTMENT DETAILS
          </h3>
        </div>

        <div className="space-y-6">
          {/* Date Selection */}
          <div>
            <label htmlFor="appointmentDate" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
              Appointment date <span className="text-destructive">*</span>
            </label>
            <input
              id="appointmentDate"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
            />
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <div>
              <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-3">
                Available time slots <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {mockTimeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 border rounded-lg text-sm font-medium transition-all ${
                      selectedTime === time
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300"
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
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-neutral-200 dark:border-neutral-800">
        <button
          onClick={() => setCurrentStep("providerSelection")}
          className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <button
          onClick={handleFinalSubmit}
          disabled={!selectedDate || !selectedTime}
          className="h-10 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
        >
          Add patient and book appointment
        </button>
      </div>
    </div>
  );

  return (
    <ClinicStaffLayout activeMenu="patients" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6">
        {renderStepIndicator()}
        
        <div className="max-w-4xl mx-auto">
          {currentStep === "basicInfo" && renderBasicInfo()}
          {currentStep === "insurance" && renderInsurance()}
          {currentStep === "categorySelection" && renderCategorySelection()}
          {currentStep === "questionnaires" && renderQuestionnaires()}
          {currentStep === "consent" && renderConsent()}
          {currentStep === "clinicSelection" && renderClinicSelection()}
          {currentStep === "providerSelection" && renderProviderSelection()}
          {currentStep === "appointmentBooking" && renderAppointmentBooking()}
        </div>
      </div>
    </ClinicStaffLayout>
  );
}
