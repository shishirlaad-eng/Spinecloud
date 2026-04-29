import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, Calendar, Upload, X, FileImage, File, CheckCircle, FileText } from "lucide-react";
import { InsuranceDetailsScreen } from "@/app/components/profile/InsuranceDetailsScreen";
import { ConsentFormsScreen } from "@/app/components/consent/ConsentFormsScreen";
import { ClinicSelectionScreen } from "@/app/components/booking/ClinicSelectionScreen";
import { ProviderSelectionScreen } from "@/app/components/booking/ProviderSelectionScreen";
import { AppointmentBookingScreen } from "@/app/components/booking/AppointmentBookingScreen";

interface PatientOnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
  onBack?: () => void;
  wizardData?: any;
  services: any[];
  branches: any[];
  providers: any[];
  questionnaires: any[];
}

interface OnboardingData {
  profile: any;
  insurance: any;
  questionnaires: any[];
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
  { id: 1, title: "Profile", description: "Basic information" },
  { id: 2, title: "Insurance", description: "Insurance details" },
  { id: 3, title: "Select Clinic", description: "Choose location" },
  { id: 4, title: "Select Service", description: "Choose service" },
  { id: 5, title: "Select Provider", description: "Choose provider" },
  { id: 6, title: "Book Appointment", description: "Date and time" },
  { id: 7, title: "Questionnaire", description: "Health assessment" },
  { id: 8, title: "Consent Forms", description: "Review & accept" },
];

export function PatientOnboardingFlow({ 
  onComplete, 
  onBack, 
  wizardData,
  services,
  branches,
  providers,
  questionnaires
}: PatientOnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Profile data
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyCountryCode, setEmergencyCountryCode] = useState("+1");

  // Insurance data
  const [insuranceData, setInsuranceData] = useState<any>(null);

  // Questionnaire data
  const [questionnaireResponses, setQuestionnaireResponses] = useState<any[]>([]);
  const [currentQuestionnaireCategory, setCurrentQuestionnaireCategory] = useState<string | null>(null);
  
  // Questionnaire form states for active category
  const [questionnaireStep, setQuestionnaireStep] = useState(1);
  const totalQuestionnaireSteps = 5;
  const [complaintDescription, setComplaintDescription] = useState("");
  const [functionalDifficulties, setFunctionalDifficulties] = useState<string[]>([]);
  const [relievingFactors, setRelievingFactors] = useState<string[]>([]);
  const [overallChange, setOverallChange] = useState("");
  const [painDescriptions, setPainDescriptions] = useState<string[]>([]);
  const [currentPainLevel, setCurrentPainLevel] = useState<number | null>(null);
  const [worstPainLevel, setWorstPainLevel] = useState<number | null>(null);
  const [medicalImages, setMedicalImages] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Clinic, service and provider
  const [selectedClinic, setSelectedClinic] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);

  // Appointment
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null);

  const usStates = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
    "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ];

  const questionnaireCategories = selectedService?.questionnaireId 
    ? questionnaires.filter(q => q.id === selectedService.questionnaireId)
    : [];

  const functionalDifficultiesOptions = [
    "Housekeeping", "Climbing stairs", "Getting dressed", "Sitting for long periods",
    "Standing for long periods", "Walking", "Lifting objects", "Reaching overhead",
    "Sleeping", "Driving", "Working at a desk", "Exercise / physical activity",
    "Bending or twisting"
  ];

  const relievingFactorsOptions = [
    "Heating pad", "Aspirin", "Lying down", "Ice pack", "Rest", "Stretching",
    "Massage", "Changing posture", "Over-the-counter pain medication",
    "Prescription medication", "Gentle movement", "Physical therapy exercises",
    "Hot shower or bath"
  ];

  const overallChangeOptions = [
    "Stayed the same", "Improved 5–20%", "Improved 21–40%", "Improved 41–60%",
    "Improved 61–80%", "Improved 81–100%", "Worsened 5–20%",
    "Worsened 21–40%", "Worsened 41–60%"
  ];

  const painDescriptionOptions = [
    "Aching", "Sharp", "Shooting", "Dull", "Throbbing", "Burning",
    "Stabbing", "Tight", "Stiff", "Cramping", "Sore", "Tender",
    "Numbness / tingling"
  ];


  const isStep1Valid = () => dateOfBirth && gender;
  const isStep2Valid = () => true; // Insurance is optional
  const isStep3Valid = () => selectedClinic !== null;
  const isStep4Valid = () => selectedService !== null;
  const isStep5Valid = () => selectedProvider !== null;
  const isStep6Valid = () => appointmentDetails !== null;
  const isStep7Valid = () => {
    if (selectedService?.questionnaireId) {
      return questionnaireResponses.length > 0;
    }
    return true;
  };
  const isStep8Valid = () => true; // Consent forms are always auto-acceptable

  const canProceed = () => {
    switch (currentStep) {
      case 1: return isStep1Valid();
      case 2: return isStep2Valid();
      case 3: return isStep3Valid();
      case 4: return isStep4Valid();
      case 5: return isStep5Valid();
      case 6: return isStep6Valid();
      case 7: return isStep7Valid();
      case 8: return isStep8Valid();
      default: return false;
    }
  };

  const handleNext = () => {
    if (canProceed()) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      if (currentStep === 8) {
        handleComplete();
      } else if (currentStep === 6) {
        // After Booking Appointment, check for questionnaire
        if (selectedService?.questionnaireId) {
          setCurrentStep(7);
        } else {
          // Skip questionnaire, go to Consent (Step 8)
          setCompletedSteps(prev => [...prev, currentStep, 7]);
          setCurrentStep(8);
        }
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      if (currentStep === 8 && !selectedService?.questionnaireId) {
        setCurrentStep(6);
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  const handleComplete = () => {
    const onboardingData: OnboardingData = {
      profile: {
        dateOfBirth,
        gender,
        address: { street, city, state, zipCode, country },
        emergencyContact: { name: emergencyName, phone: emergencyContact, countryCode: emergencyCountryCode },
      },
      insurance: insuranceData,
      questionnaires: questionnaireResponses,
      selectedClinic,
      selectedProvider,
      appointmentDetails,
    };
    onComplete(onboardingData);
  };

  // Questionnaire handlers
  const handleSelectCategory = (categoryId: string) => {
    setCurrentQuestionnaireCategory(categoryId);
    setQuestionnaireStep(1);
    // Reset form
    setComplaintDescription("");
    setFunctionalDifficulties([]);
    setRelievingFactors([]);
    setOverallChange("");
    setPainDescriptions([]);
    setCurrentPainLevel(null);
    setWorstPainLevel(null);
    setMedicalImages([]);
  };

  const toggleArrayValue = (
    currentArray: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    if (currentArray.includes(value)) {
      setter(currentArray.filter((item) => item !== value));
    } else {
      setter([...currentArray, value]);
    }
  };

  const isQuestionnaireStepValid = () => {
    switch (questionnaireStep) {
      case 1:
        return complaintDescription.trim().length > 0 && functionalDifficulties.length > 0;
      case 2:
        return relievingFactors.length > 0;
      case 3:
        return overallChange !== "" && painDescriptions.length > 0;
      case 4:
        return currentPainLevel !== null && worstPainLevel !== null;
      case 5:
        return true; // Image upload is optional
      default:
        return false;
    }
  };

  const handleQuestionnaireNext = () => {
    if (questionnaireStep < totalQuestionnaireSteps) {
      setQuestionnaireStep(questionnaireStep + 1);
    }
  };

  const handleQuestionnairePrevious = () => {
    if (questionnaireStep > 1) {
      setQuestionnaireStep(questionnaireStep - 1);
    }
  };

  const handleQuestionnaireSubmit = () => {
    const category = questionnaireCategories.find(c => c.id === currentQuestionnaireCategory);
    setQuestionnaireResponses([
      ...questionnaireResponses,
      {
        categoryId: currentQuestionnaireCategory,
        categoryName: category?.name,
        complaintDescription,
        functionalDifficulties,
        relievingFactors,
        overallChange,
        painDescription: painDescriptions,
        currentPainLevel,
        worstPainLevel,
        medicalImages: medicalImages.length > 0 ? medicalImages : undefined,
        timestamp: new Date().toISOString(),
      },
    ]);
    setCurrentQuestionnaireCategory(null);
  };

  const handleQuestionnaireBack = () => {
    if (questionnaireStep === 1) {
      setCurrentQuestionnaireCategory(null);
    } else {
      handleQuestionnairePrevious();
    }
  };

  const handleContinueFromQuestionnaire = () => {
    if (!completedSteps.includes(7)) {
      setCompletedSteps([...completedSteps, 7]);
    }
    setCurrentStep(8);
  };

  const handleInsuranceSubmit = (data: any) => {
    setInsuranceData(data);
    if (!completedSteps.includes(2)) {
      setCompletedSteps([...completedSteps, 2]);
    }
    setCurrentStep(3);
  };

  const handleClinicSelection = (clinicId: string) => {
    const clinic = branches.find(c => c.id === clinicId);
    setSelectedClinic(clinic);
    if (!completedSteps.includes(3)) {
      setCompletedSteps([...completedSteps, 3]);
    }
    setCurrentStep(4);
  };

  const handleServiceSelection = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    setSelectedService(service);
    if (!completedSteps.includes(4)) {
      setCompletedSteps([...completedSteps, 4]);
    }
    setCurrentStep(5);
  };

  const handleProviderSelection = (providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    setSelectedProvider(provider);
    if (!completedSteps.includes(5)) {
      setCompletedSteps([...completedSteps, 5]);
    }
    setCurrentStep(6);
  };

  const handleAppointmentBooking = (details: any) => {
    setAppointmentDetails(details);
    if (!completedSteps.includes(6)) {
      setCompletedSteps([...completedSteps, 6]);
    }
    
    // Check for questionnaire like in handleNext
    if (selectedService?.questionnaireId) {
      setCurrentStep(7);
    } else {
      // Skip questionnaire, go to Consent (Step 8)
      setCompletedSteps(prev => [...prev, 7]);
      setCurrentStep(8);
    }
  };

  // File upload handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).filter(file => {
        if (file.size > 10 * 1024 * 1024) {
          alert(`${file.name} is too large. Maximum file size is 10MB.`);
          return false;
        }
        return true;
      });
      setMedicalImages([...medicalImages, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files) {
      const newFiles = Array.from(files).filter(file => {
        if (file.size > 10 * 1024 * 1024) {
          alert(`${file.name} is too large. Maximum file size is 10MB.`);
          return false;
        }
        return true;
      });
      setMedicalImages([...medicalImages, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setMedicalImages(medicalImages.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header with Progress Stepper */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          {/* Logo */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white">SpineCloudIQ</h1>
            <div className="w-16 h-1 bg-primary-600 rounded-full mx-auto mt-3"></div>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                      completedSteps.includes(step.id)
                        ? "bg-success-500 text-white"
                        : currentStep === step.id
                        ? "bg-primary-600 text-white ring-4 ring-primary-500/20"
                        : "bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400"
                    }`}
                  >
                    {completedSteps.includes(step.id) ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="mt-2 text-center hidden md:block">
                    <p
                      className={`text-sm font-medium ${
                        currentStep === step.id
                          ? "text-primary-600 dark:text-primary-400"
                          : "text-neutral-600 dark:text-neutral-400"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500">{step.description}</p>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      completedSteps.includes(step.id)
                        ? "bg-success-500"
                        : "bg-neutral-200 dark:bg-neutral-700"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Step 1: Profile */}
        {currentStep === 1 && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">Patient profile</h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                Please provide your demographic and contact information
              </p>

              <div className="space-y-6">
                {/* Demographics */}
                <div>
                  <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide mb-3">
                    Demographics
                  </h4>
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
                        className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                      />
                    </div>
                    <div>
                      <label htmlFor="gender" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                        Gender <span className="text-destructive">*</span>
                      </label>
                      <select
                        id="gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide mb-3">
                    Address <span className="text-sm font-normal text-neutral-500">(Optional)</span>
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="street" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                        Street address
                      </label>
                      <input
                        id="street"
                        type="text"
                        placeholder="123 Main Street, Apt 4B"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
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
                          placeholder="New York"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
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
                          className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
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
                          placeholder="10001"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
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
                          className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                        >
                          <option value="">Select country</option>
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="UK">United Kingdom</option>
                          <option value="AU">Australia</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide mb-3">
                    Emergency contact <span className="text-sm font-normal text-neutral-500">(Optional)</span>
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="emergencyName" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                        Emergency contact name
                      </label>
                      <input
                        id="emergencyName"
                        type="text"
                        placeholder="John Doe"
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                        className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                      />
                    </div>
                    <div>
                      <label htmlFor="emergencyContact" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                        Emergency contact number
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={emergencyCountryCode}
                          onChange={(e) => setEmergencyCountryCode(e.target.value)}
                          className="flex h-10 w-28 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                        >
                          <option value="+1">+1 (US)</option>
                          <option value="+44">+44 (UK)</option>
                          <option value="+61">+61 (AU)</option>
                          <option value="+91">+91 (IN)</option>
                        </select>
                        <input
                          id="emergencyContact"
                          type="tel"
                          placeholder="(555) 123-4567"
                          value={emergencyContact}
                          onChange={(e) => setEmergencyContact(e.target.value)}
                          className="flex h-10 flex-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="px-6 pb-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <button
                  onClick={onBack || (() => {})}
                  disabled={!onBack}
                  className="inline-flex items-center gap-2 h-10 px-4 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="inline-flex items-center gap-2 h-10 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Insurance */}
        {currentStep === 2 && (
          <InsuranceDetailsScreen
            onBack={() => setCurrentStep(1)}
            onContinue={handleInsuranceSubmit}
          />
        )}

        {/* Step 3: Clinic Selection */}
        {currentStep === 3 && (
          <ClinicSelectionScreen
            clinics={branches.map(b => ({
              id: b.id,
              name: b.name,
              address: `${b.street}, ${b.city}`,
              city: `${b.state} ${b.zip}`,
              phone: b.phone
            }))}
            onContinue={handleClinicSelection}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {/* Step 4: Service Selection */}
        {currentStep === 4 && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">Select service</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
              What brings you to see us today?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.filter(s => selectedClinic && s.locationIds?.includes(selectedClinic.id)).map(service => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelection(service.id)}
                  className={`p-4 border rounded-xl text-left transition-all ${
                    selectedService?.id === service.id
                      ? "border-primary-600 bg-primary-50 dark:bg-primary-950/30 ring-2 ring-primary-600/20"
                      : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-neutral-900 dark:text-white">{service.name}</h3>
                    <span className="text-xs font-medium px-2 py-1 bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 rounded-full">
                      ${service.price}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">
                    {service.phases?.reduce((acc: number, p: any) => acc + p.duration, 0) || 30} mins
                  </p>
                </button>
              ))}
            </div>
            <div className="mt-8 pt-4 border-t border-neutral-200 dark:border-neutral-800">
               <button
                  onClick={() => setCurrentStep(3)}
                  className="inline-flex items-center gap-2 h-10 px-4 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium transition-colors text-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
            </div>
          </div>
        )}

        {/* Step 5: Provider Selection */}
        {currentStep === 5 && (
          <ProviderSelectionScreen
            providers={providers.filter(p => p.branchIds?.includes(selectedClinic.id))}
            onContinue={handleProviderSelection}
            onBack={() => setCurrentStep(4)}
          />
        )}

        {/* Step 6: Book Appointment */}
        {currentStep === 6 && (
          <AppointmentBookingScreen
            clinicName={selectedClinic.name}
            providerName={selectedProvider.name}
            preselectedService={selectedService.name}
            onConfirm={handleAppointmentBooking}
            onBack={() => setCurrentStep(5)}
          />
        )}

        {/* Step 7: Questionnaire - Category Selection */}
        {currentStep === 7 && !currentQuestionnaireCategory && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">Health questionnaire</h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                Based on your selected service, please complete the following assessment
              </p>

              <div className="space-y-4">
                {/* Category Selection */}
                <div className="grid grid-cols-1 gap-3">
                  {questionnaireCategories.map((category) => {
                    const isCompleted = questionnaireResponses.some(r => r.categoryId === category.id);
                    return (
                      <button
                        key={category.id}
                        onClick={() => handleSelectCategory(category.id)}
                        disabled={isCompleted}
                        className={`p-5 border rounded-lg text-left transition-all ${
                          isCompleted
                            ? "border-success-500 bg-success-50 dark:bg-success-950/30 ring-2 ring-success-500/20 cursor-default"
                            : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">{category.categoryName}</h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Please fill out this form to help us understand your condition better.</p>
                            {isCompleted && (
                              <p className="text-sm text-success-600 dark:text-success-400 mt-2">✓ Completed</p>
                            )}
                          </div>
                          {isCompleted && (
                            <div className="w-5 h-5 rounded-full bg-success-500 flex items-center justify-center flex-shrink-0 ml-3">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Continue Button */}
                {questionnaireResponses.length > 0 && (
                  <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                    <button
                      onClick={handleContinueFromQuestionnaire}
                      className="w-full h-10 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm"
                    >
                      Continue to consent forms
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="px-6 pb-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(6)}
                  className="inline-flex items-center gap-2 h-10 px-4 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium transition-colors text-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Questionnaire - Category Form (Multi-step) */}
        {currentStep === 7 && currentQuestionnaireCategory && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm">
            <div className="p-6">
              {/* Progress indicator */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Step {questionnaireStep} of {totalQuestionnaireSteps}
                  </p>
                  <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                    {questionnaireCategories.find(c => c.id === currentQuestionnaireCategory)?.name}
                  </p>
                </div>
                <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-600 transition-all duration-300"
                    style={{ width: `${(questionnaireStep / totalQuestionnaireSteps) * 100}%` }}
                  />
                </div>
              </div>

              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
                {questionnaireStep === 1 && "Tell us about your condition"}
                {questionnaireStep === 2 && "What helps relieve your symptoms?"}
                {questionnaireStep === 3 && "How are you feeling now?"}
                {questionnaireStep === 4 && "Rate your pain levels"}
                {questionnaireStep === 5 && "Share medical imaging (optional)"}
              </h2>

              {/* Step 1: Complaint and Functional Difficulties */}
              {questionnaireStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
                      Describe your complaint <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      placeholder="Tell us what's bothering you..."
                      value={complaintDescription}
                      onChange={(e) => setComplaintDescription(e.target.value)}
                      className="flex min-h-24 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] resize-y"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-3">
                      Select functional difficulties <span className="text-destructive">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {functionalDifficultiesOptions.map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-3 p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={functionalDifficulties.includes(option)}
                            onChange={() => toggleArrayValue(functionalDifficulties, setFunctionalDifficulties, option)}
                            className="w-4 h-4 text-primary-600 rounded"
                          />
                          <span className="text-sm text-neutral-900 dark:text-white">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Relieving Factors */}
              {questionnaireStep === 2 && (
                <div>
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-3">
                    What helps relieve your symptoms? <span className="text-destructive">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {relievingFactorsOptions.map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-3 p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={relievingFactors.includes(option)}
                          onChange={() => toggleArrayValue(relievingFactors, setRelievingFactors, option)}
                          className="w-4 h-4 text-primary-600 rounded"
                        />
                        <span className="text-sm text-neutral-900 dark:text-white">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Overall Change and Pain Description */}
              {questionnaireStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-3">
                      Overall change in symptoms <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={overallChange}
                      onChange={(e) => setOverallChange(e.target.value)}
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                    >
                      <option value="">Select overall change</option>
                      {overallChangeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-3">
                      Pain description <span className="text-destructive">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {painDescriptionOptions.map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-3 p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={painDescriptions.includes(option)}
                            onChange={() => toggleArrayValue(painDescriptions, setPainDescriptions, option)}
                            className="w-4 h-4 text-primary-600 rounded"
                          />
                          <span className="text-sm text-neutral-900 dark:text-white">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Pain Levels */}
              {questionnaireStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-3">
                      Current pain level (0-10) <span className="text-destructive">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setCurrentPainLevel(level)}
                          className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
                            currentPainLevel === level
                              ? "bg-primary-600 text-white ring-2 ring-primary-500/20"
                              : "border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-3">
                      Worst pain level in the past week (0-10) <span className="text-destructive">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setWorstPainLevel(level)}
                          className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
                            worstPainLevel === level
                              ? "bg-primary-600 text-white ring-2 ring-primary-500/20"
                              : "border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Medical Images Upload */}
              {questionnaireStep === 5 && (
                <div className="space-y-4">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDragging
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30"
                        : "border-neutral-300 dark:border-neutral-700"
                    }`}
                  >
                    <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                      Drag and drop files here, or click to select
                    </p>
                    <p className="text-xs text-neutral-500 mb-4">Supported formats: JPG, PNG, PDF (max 10MB)</p>
                    <label
                      htmlFor="file-upload"
                      className="inline-flex h-10 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm cursor-pointer"
                    >
                      Choose files
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Uploaded Files List */}
                  {medicalImages.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        Uploaded files ({medicalImages.length})
                      </h4>
                      {medicalImages.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-950/30 rounded-lg flex items-center justify-center">
                              {file.type.startsWith("image/") ? (
                                <FileImage className="w-5 h-5 text-primary-600" />
                              ) : (
                                <File className="w-5 h-5 text-primary-600" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-neutral-900 dark:text-white">{file.name}</p>
                              <p className="text-xs text-neutral-500">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeImage(index)}
                            className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-destructive transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="px-6 pb-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleQuestionnaireBack}
                  className="inline-flex items-center gap-2 h-10 px-4 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium transition-colors text-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <div className="flex items-center gap-2">
                  {questionnaireStep === 5 && (
                    <button
                      onClick={handleQuestionnaireSubmit}
                      className="h-10 px-4 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium transition-colors text-sm"
                    >
                      Skip
                    </button>
                  )}
                  <button
                    onClick={questionnaireStep === totalQuestionnaireSteps ? handleQuestionnaireSubmit : handleQuestionnaireNext}
                    disabled={questionnaireStep !== 5 && !isQuestionnaireStepValid()}
                    className="inline-flex items-center gap-2 h-10 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                  >
                    {questionnaireStep === totalQuestionnaireSteps ? "Submit" : "Continue"}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 8: Consent Forms */}
        {currentStep === 8 && (
          <ConsentFormsScreen
            onBack={() => {
              if (selectedService?.questionnaireId) {
                setCurrentStep(7);
              } else {
                setCurrentStep(6);
              }
            }}
            onComplete={() => {
              if (!completedSteps.includes(8)) {
                setCompletedSteps([...completedSteps, 8]);
              }
              handleComplete();
            }}
          />
        )}
      </div>
    </div>
  );
}