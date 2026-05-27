import { useState } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { ArrowLeft, User, MapPin, Phone, Shield, FileCheck, ClipboardList, CheckCircle, Upload, X, Calendar as CalendarIcon, Clock, Building2 } from "lucide-react";

interface AddPatientFullPageScreenProps {
  onNavigate: (menu: string) => void;
  onBack: () => void;
  onSavePatient: (patientData: any) => void;
  onGenerateLink: () => void;
  onLogout?: () => void;
  services: any[];
}

type Step = "basicInfo" | "insurance" | "clinicSelection" | "providerSelection";

export function AddPatientFullPageScreen({
  onNavigate,
  onBack,
  onSavePatient,
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

  // Clinic & Appointment
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

  // Mock data
  const clinics = [
    { id: "1", name: "Downtown Medical Center", address: "123 Main Street, New York, NY 10001" },
    { id: "2", name: "Westside Spine Clinic", address: "456 West Ave, Los Angeles, CA 90001" },
  ];

  const providers = [
    { id: "1", name: "Dr. Sarah Johnson", specialty: "Orthopedic Spine Surgeon" },
    { id: "2", name: "Dr. Michael Chen", specialty: "Physical Medicine & Rehabilitation" },
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
    const hasAnyInsuranceData = insuranceProvider || policyNumber || policyHolderName || policyHolderDOB || relationshipToPolicyholder;
    if (!hasAnyInsuranceData) return true;
    
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
      setErrors({});
      setCurrentStep("insurance");
    }
  };

  const handleInsuranceContinue = () => {
    if (validateInsurance()) {
      setErrors({});
      setCurrentStep("clinicSelection");
    }
  };

  const handleSkipInsurance = () => {
    setInsuranceProvider("");
    setPolicyNumber("");
    setPolicyHolderName("");
    setPolicyHolderDOB("");
    setRelationshipToPolicyholder("");
    setGroupNumber("");
    setErrors({});
    setCurrentStep("clinicSelection");
  };

  const handleClinicContinue = () => {
    if (!selectedClinic) {
      setErrors({ clinic: "Please select a clinic" });
      return;
    }
    setErrors({});
    setCurrentStep("providerSelection");
  };

  const handleProviderContinue = () => {
    if (!selectedProvider || !service || !appointmentDate || !appointmentTime) {
      setErrors({ appointment: "Please complete all appointment details" });
      return;
    }
    setErrors({});
    handleFinalSubmit();
  };

  const handleFinalSubmit = () => {
    const patientData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      phoneCountryCode,
      dateOfBirth,
      gender,
      address: {
        street: street.trim(),
        city: city.trim(),
        state: state.trim(),
        zip: zipCode.trim(),
        country,
      },
      emergencyContact: {
        name: emergencyName.trim(),
        phone: emergencyPhone.trim(),
        countryCode: emergencyCountryCode,
      },
      insurance: insuranceProvider ? {
        provider: insuranceProvider.trim(),
        policyNumber: policyNumber.trim(),
        policyHolderName: policyHolderName.trim(),
        policyHolderDOB,
        relationship: relationshipToPolicyholder,
        groupNumber: groupNumber.trim(),
      } : null,
      appointment: {
        clinicId: selectedClinic,
        providerId: selectedProvider,
        service: service,
        date: appointmentDate,
        time: appointmentTime,
      },
      status: "Active",
      createdAt: new Date().toISOString(),
    };

    onSavePatient(patientData);
  };

  const getAvailabilityLabel = (providerId: string) => {
    if (providerId === "1") return "Available today";
    return "Available tomorrow";
  };

  const getAvailableTimeSlots = () => {
    return [
      "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
      "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM"
    ];
  };

  const renderBasicInfo = () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">Basic information</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Enter the patient's basic demographic and contact information</p>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">First name *</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full h-10 px-3 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm" />
            {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">Last name *</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full h-10 px-3 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm" />
            {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">Email address *</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-10 px-3 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm" />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">Phone number *</label>
            <div className="flex">
              <select value={phoneCountryCode} onChange={(e) => setPhoneCountryCode(e.target.value)} className="h-10 px-2 border border-r-0 border-neutral-200 dark:border-neutral-800 rounded-l-lg text-sm bg-neutral-50">
                {countryCodes.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
              </select>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="flex-1 h-10 px-3 border border-neutral-200 dark:border-neutral-800 rounded-r-lg text-sm" />
            </div>
            {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">Date of birth *</label>
            <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="w-full h-10 px-3 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm" />
            {errors.dateOfBirth && <p className="text-xs text-destructive mt-1">{errors.dateOfBirth}</p>}
          </div>
          <div>
            <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">Gender *</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full h-10 px-3 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm">
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="text-xs text-destructive mt-1">{errors.gender}</p>}
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <h3 className="text-sm font-semibold mb-4">Address Information</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">Street address</label>
              <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} className="w-full h-10 px-3 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">City</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full h-10 px-3 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">State</label>
                <select value={state} onChange={(e) => setState(e.target.value)} className="w-full h-10 px-3 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm">
                  <option value="">Select state</option>
                  {usStates.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">Zip code</label>
                <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} className="w-full h-10 px-3 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button onClick={handleBasicInfoContinue} className="px-6 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium text-sm">Continue</button>
      </div>
    </div>
  );

  const renderInsurance = () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">Insurance information</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Provide the patient's insurance details (optional)</p>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">Insurance provider</label>
            <input type="text" value={insuranceProvider} onChange={(e) => setInsuranceProvider(e.target.value)} className="w-full h-10 px-3 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm" />
            {errors.insuranceProvider && <p className="text-xs text-destructive mt-1">{errors.insuranceProvider}</p>}
          </div>
          <div>
            <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">Policy number</label>
            <input type="text" value={policyNumber} onChange={(e) => setPolicyNumber(e.target.value)} className="w-full h-10 px-3 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm" />
            {errors.policyNumber && <p className="text-xs text-destructive mt-1">{errors.policyNumber}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">Policyholder name</label>
            <input type="text" value={policyHolderName} onChange={(e) => setPolicyHolderName(e.target.value)} className="w-full h-10 px-3 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm" />
            {errors.policyHolderName && <p className="text-xs text-destructive mt-1">{errors.policyHolderName}</p>}
          </div>
          <div>
            <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">Policyholder DOB</label>
            <input type="date" value={policyHolderDOB} onChange={(e) => setPolicyHolderDOB(e.target.value)} className="w-full h-10 px-3 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm" />
            {errors.policyHolderDOB && <p className="text-xs text-destructive mt-1">{errors.policyHolderDOB}</p>}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button onClick={() => setCurrentStep("basicInfo")} className="px-4 h-10 border border-neutral-300 rounded-lg text-sm font-medium">Back</button>
        <div className="flex gap-3">
          <button onClick={handleSkipInsurance} className="px-4 h-10 text-neutral-600 hover:text-neutral-900 text-sm font-medium transition-colors">Skip for now</button>
          <button onClick={handleInsuranceContinue} className="px-6 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium text-sm">Continue</button>
        </div>
      </div>
    </div>
  );

  const renderClinicSelection = () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">Select clinic</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Choose the clinic location for the patient's appointment</p>
      </div>

      <div className="space-y-3">
        {clinics.map(clinic => (
          <div key={clinic.id} onClick={() => setSelectedClinic(clinic.id)} className={`bg-white dark:bg-neutral-900 border rounded-lg p-5 cursor-pointer transition-all ${selectedClinic === clinic.id ? "border-primary-500 bg-primary-50 ring-2 ring-primary-500/10" : "border-neutral-200 hover:bg-neutral-50"}`}>
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-neutral-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold">{clinic.name}</h3>
                <p className="text-sm text-neutral-600">{clinic.address}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {errors.clinic && <p className="text-xs text-destructive mt-3">{errors.clinic}</p>}

      <div className="mt-6 flex justify-between">
        <button onClick={() => setCurrentStep("insurance")} className="px-4 h-10 border border-neutral-300 rounded-lg text-sm font-medium">Back</button>
        <button onClick={handleClinicContinue} className="px-6 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium text-sm">Continue</button>
      </div>
    </div>
  );

  const renderProviderSelection = () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">Schedule appointment</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Choose a provider and schedule the appointment</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          {providers.map(provider => (
            <div key={provider.id} onClick={() => setSelectedProvider(provider.id)} className={`bg-white dark:bg-neutral-900 border rounded-lg p-5 cursor-pointer transition-all ${selectedProvider === provider.id ? "border-primary-500 bg-primary-50 ring-2 ring-primary-500/10" : "border-neutral-200 hover:bg-neutral-50"}`}>
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-neutral-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold">{provider.name}</h4>
                  <p className="text-sm text-neutral-600">{provider.specialty}</p>
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-success-50 text-success-700 text-xs font-medium mt-2">
                    <CalendarIcon className="w-3 h-3" />
                    {getAvailabilityLabel(provider.id)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedProvider && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">Service *</label>
              <select value={service} onChange={(e) => setService(e.target.value)} className="w-full h-10 px-3 border border-neutral-200 rounded-lg text-sm">
                <option value="">Select service</option>
                {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1.5">Date *</label>
                <input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} className="w-full h-10 px-3 border border-neutral-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">Time *</label>
                <select value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} className="w-full h-10 px-3 border border-neutral-200 rounded-lg text-sm">
                  <option value="">Select time</option>
                  {getAvailableTimeSlots().map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {errors.appointment && <p className="text-xs text-destructive mt-3">{errors.appointment}</p>}

      <div className="mt-6 flex justify-between">
        <button onClick={() => setCurrentStep("clinicSelection")} className="px-4 h-10 border border-neutral-300 rounded-lg text-sm font-medium">Back</button>
        <button onClick={handleProviderContinue} className="px-6 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium text-sm">Complete and Book</button>
      </div>
    </div>
  );

  return (
    <ClinicAdminLayout activeMenu="patients" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6">
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-neutral-200 dark:bg-neutral-800 -z-0" />
            {["basicInfo", "insurance", "clinicSelection", "providerSelection"].map((step, index) => {
              const isActive = currentStep === step;
              const stepKeys = ["basicInfo", "insurance", "clinicSelection", "providerSelection"];
              const isCompleted = stepKeys.indexOf(currentStep) > index;
              const labels = ["Basic Info", "Insurance", "Clinic", "Appointment"];
              
              return (
                <div key={step} className="relative z-10 flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    isCompleted ? "bg-success-600 text-white" : isActive ? "bg-primary-600 text-white" : "bg-neutral-200 dark:bg-neutral-800 text-neutral-600"
                  }`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${isActive || isCompleted ? "text-neutral-900 dark:text-white" : "text-neutral-500"}`}>{labels[index]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {currentStep === "basicInfo" && (
          <div className="max-w-4xl mx-auto mb-6">
            <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to patients
            </button>
          </div>
        )}

        {currentStep === "basicInfo" && renderBasicInfo()}
        {currentStep === "insurance" && renderInsurance()}
        {currentStep === "clinicSelection" && renderClinicSelection()}
        {currentStep === "providerSelection" && renderProviderSelection()}
      </div>
    </ClinicAdminLayout>
  );
}
