import { useState } from "react";
import { ClinicStaffLayout } from "./layout/ClinicStaffLayout";
import { ArrowLeft, User, MapPin, Phone, Shield, FileCheck, ClipboardList, CheckCircle, Upload, X, Calendar as CalendarIcon, Clock, Building2 } from "lucide-react";

interface AddPatientFullPageScreenProps {
  onNavigate: (menu: string) => void;
  onBack: () => void;
  onSavePatient: (patientData: any) => void;
  onGenerateLink: () => void;
  onLogout?: () => void;
  services: any[];
}

type Step = "basicInfo" | "insurance" | "clinicSelection" | "appointmentBooking";

export function AddPatientFullPageScreen({
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFinalSubmit = () => {
    const patientData = {
      firstName,
      lastName,
      email,
      phone: `${phoneCountryCode} ${phone}`,
      dateOfBirth,
      gender,
      address: { street, city, state, zipCode, country },
      emergencyContact: { name: emergencyName, phone: `${emergencyCountryCode} ${emergencyPhone}`, relationship: emergencyRelationship },
      insurance: insuranceProvider ? { provider: insuranceProvider, policyNumber, policyHolderName } : undefined,
      appointment: { clinicId: selectedClinic, providerId: selectedProvider, service, date: selectedDate, time: selectedTime },
      status: "Active",
      createdAt: new Date().toISOString(),
    };
    onSavePatient(patientData);
  };

  const renderStepIndicator = () => {
    const steps = [
      { key: "basicInfo", label: "Basic info" },
      { key: "insurance", label: "Insurance" },
      { key: "clinicSelection", label: "Clinic & Provider" },
      { key: "appointmentBooking", label: "Appointment" },
    ];
    const currentIndex = steps.findIndex(s => s.key === currentStep);

    return (
      <div className="flex items-center gap-4 mb-8">
        {steps.map((step, index) => {
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;
          return (
            <div key={step.key} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all ${
                isActive ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20" : 
                isCompleted ? "bg-success-500 text-white" : 
                "bg-neutral-200 dark:bg-neutral-800 text-neutral-500"
              }`}>
                {isCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
              </div>
              <span className={`text-sm font-medium ${isActive ? "text-neutral-900 dark:text-white" : "text-neutral-500"}`}>{step.label}</span>
              {index < steps.length - 1 && <div className={`h-px w-8 ${isCompleted ? "bg-success-500" : "bg-neutral-200 dark:bg-neutral-800"}`} />}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <ClinicStaffLayout activeMenu="patients" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-8">
          <button onClick={onBack} className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Patients</span>
          </button>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Register New Patient</h1>
          <p className="text-neutral-500 mt-1">Complete the intake process for a new patient</p>
        </div>

        {renderStepIndicator()}

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-8">
            {currentStep === "basicInfo" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-primary-600" />
                    <h2 className="text-lg font-semibold">Personal Information</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">First Name *</label>
                      <input value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-600" />
                      {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Last Name *</label>
                      <input value={lastName} onChange={e => setLastName(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-600" />
                      {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Email *</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-600" />
                      {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Phone *</label>
                      <div className="flex">
                        <select value={phoneCountryCode} onChange={e => setPhoneCountryCode(e.target.value)} className="h-11 px-3 border border-r-0 border-neutral-200 dark:border-neutral-800 rounded-l-xl bg-neutral-100">
                          <option value="+1">+1</option>
                          <option value="+91">+91</option>
                        </select>
                        <input value={phone} onChange={e => setPhone(e.target.value)} className="flex-1 h-11 px-4 border border-neutral-200 dark:border-neutral-800 rounded-r-xl bg-neutral-50 dark:bg-neutral-900 outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-600" />
                      </div>
                    </div>
                  </div>
                </section>
                <div className="flex justify-end gap-3 pt-6 border-t border-neutral-100">
                  <button onClick={onGenerateLink} className="px-6 h-11 rounded-xl border border-neutral-200 font-medium hover:bg-neutral-50">Generate Intake Link</button>
                  <button onClick={() => validateBasicInfo() && setCurrentStep("insurance")} className="px-8 h-11 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 shadow-lg shadow-primary-600/20">Continue</button>
                </div>
              </div>
            )}

            {currentStep === "insurance" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary-600" />
                    <h2 className="text-lg font-semibold">Insurance Details (Optional)</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Provider</label>
                      <input value={insuranceProvider} onChange={e => setInsuranceProvider(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 outline-none" placeholder="e.g. Aetna" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Policy Number</label>
                      <input value={policyNumber} onChange={e => setPolicyNumber(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 outline-none" />
                    </div>
                  </div>
                </section>
                <div className="flex justify-between pt-6 border-t border-neutral-100">
                  <button onClick={() => setCurrentStep("basicInfo")} className="px-6 h-11 rounded-xl border border-neutral-200 font-medium hover:bg-neutral-50">Back</button>
                  <button onClick={() => setCurrentStep("clinicSelection")} className="px-8 h-11 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 shadow-lg shadow-primary-600/20">Next: Clinic & Provider</button>
                </div>
              </div>
            )}

            {currentStep === "clinicSelection" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-primary-600" />
                    <h2 className="text-lg font-semibold">Clinic & Service Selection</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Select Clinic</label>
                      <select value={selectedClinic} onChange={e => setSelectedClinic(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 outline-none">
                        <option value="">Choose Clinic</option>
                        {mockClinics.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Select Service</label>
                      <select value={service} onChange={e => setService(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 outline-none">
                        <option value="">Choose Service</option>
                        {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Select Provider</label>
                    <div className="grid grid-cols-3 gap-4">
                      {mockProviders.filter(p => !selectedClinic || p.clinicId === selectedClinic).map(p => (
                        <button key={p.id} onClick={() => setSelectedProvider(p.id)} className={`p-4 rounded-xl border text-left transition-all ${selectedProvider === p.id ? "border-primary-600 bg-primary-50 ring-2 ring-primary-500/10" : "border-neutral-200 hover:border-primary-400"}`}>
                          <p className="font-bold">{p.name}</p>
                          <p className="text-xs text-neutral-500">{p.specialty}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
                <div className="flex justify-between pt-6 border-t border-neutral-100">
                  <button onClick={() => setCurrentStep("insurance")} className="px-6 h-11 rounded-xl border border-neutral-200 font-medium hover:bg-neutral-50">Back</button>
                  <button onClick={() => setCurrentStep("appointmentBooking")} disabled={!selectedClinic || !selectedProvider || !service} className="px-8 h-11 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 disabled:opacity-50 shadow-lg shadow-primary-600/20">Next: Schedule Appointment</button>
                </div>
              </div>
            )}

            {currentStep === "appointmentBooking" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-primary-600" />
                    <h2 className="text-lg font-semibold">Schedule Appointment</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <label className="text-sm font-medium block mb-4 text-neutral-500 uppercase tracking-wider">Select Date</label>
                      <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 outline-none" />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-4 text-neutral-500 uppercase tracking-wider">Select Time</label>
                      <div className="grid grid-cols-3 gap-2">
                        {mockTimeSlots.map(t => (
                          <button key={t} onClick={() => setSelectedTime(t)} className={`h-10 text-xs font-medium rounded-lg border transition-all ${selectedTime === t ? "bg-primary-600 text-white border-primary-600 shadow-md" : "border-neutral-200 hover:border-primary-400"}`}>{t}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
                <div className="flex justify-between pt-6 border-t border-neutral-100">
                  <button onClick={() => setCurrentStep("clinicSelection")} className="px-6 h-11 rounded-xl border border-neutral-200 font-medium hover:bg-neutral-50">Back</button>
                  <button onClick={handleFinalSubmit} disabled={!selectedDate || !selectedTime} className="px-8 h-11 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 disabled:opacity-50 shadow-lg shadow-primary-600/20">Complete Registration</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ClinicStaffLayout>
  );
}
