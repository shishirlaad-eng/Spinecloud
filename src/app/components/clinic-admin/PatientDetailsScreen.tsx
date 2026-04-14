import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, User, Shield, FileText, Edit2, Save, X, ChevronRight, Activity } from "lucide-react";
import { useState } from "react";
import { AppointmentDetailsView } from "./AppointmentDetailsView";
import { SpineCloudResultsView } from "@/app/components/shared/SpineCloudResultsView";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneCountryCode?: string;
  dateOfBirth: string;
  gender: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country?: string;
  };
  registeredDate: string;
  lastVisit: string;
  upcomingAppointment?: string;
  status: "Active" | "Inactive" | "Link sent";
  totalAppointments: number;
  insurance?: {
    provider: string;
    planNetworkName?: string;
    policyNumber: string;
    groupNumber?: string;
    policyHolderName: string;
    policyHolderDOB: string;
    relationshipToPolicyholder: string;
  };
  emergencyContact?: {
    name: string;
    relationship?: string;
    phone: string;
    phoneCountryCode?: string;
  };
}

interface Appointment {
  id: string;
  appointmentId?: string;
  date: string;
  time: string;
  provider: string;
  service: string;
  clinic?: string;
  status: "Completed" | "Cancelled" | "No-Show" | "Confirmed";
  notes?: string;
}

interface PatientDetailsScreenProps {
  patient: Patient;
  appointments: Appointment[];
  onNavigate: (menu: "dashboard" | "branches" | "questionnaires" | "roles" | "users" | "providers" | "consentForms" | "patients") => void;
  onBack: () => void;
  onUpdatePatient: (updatedPatient: Patient) => void;
  onLogout?: () => void;
}

export function PatientDetailsScreen({
  patient,
  appointments,
  onNavigate,
  onBack,
  onUpdatePatient,
  onLogout,
}: PatientDetailsScreenProps) {
  const [activeTab, setActiveTab] = useState<"basic" | "insurance" | "appointments">("basic");
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [isEditingInsurance, setIsEditingInsurance] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  // Basic Information State
  const [firstName, setFirstName] = useState(patient.firstName);
  const [lastName, setLastName] = useState(patient.lastName);
  const [email, setEmail] = useState(patient.email);
  const [phone, setPhone] = useState(patient.phone);
  const [phoneCountryCode, setPhoneCountryCode] = useState(patient.phoneCountryCode || "+1");
  const [dateOfBirth, setDateOfBirth] = useState(patient.dateOfBirth);
  const [gender, setGender] = useState(patient.gender);
  const [street, setStreet] = useState(patient.address?.street || "");
  const [city, setCity] = useState(patient.address?.city || "");
  const [state, setState] = useState(patient.address?.state || "");
  const [zipCode, setZipCode] = useState(patient.address?.zip || "");
  const [country, setCountry] = useState(patient.address?.country || "United States");
  const [emergencyName, setEmergencyName] = useState(patient.emergencyContact?.name || "");
  const [emergencyPhone, setEmergencyPhone] = useState(patient.emergencyContact?.phone || "");
  const [emergencyCountryCode, setEmergencyCountryCode] = useState(patient.emergencyContact?.phoneCountryCode || "+1");

  // Insurance State
  const [insuranceProvider, setInsuranceProvider] = useState(patient.insurance?.provider || "");
  const [policyNumber, setPolicyNumber] = useState(patient.insurance?.policyNumber || "");
  const [groupNumber, setGroupNumber] = useState(patient.insurance?.groupNumber || "");
  const [policyHolderName, setPolicyHolderName] = useState(patient.insurance?.policyHolderName || "");
  const [policyHolderDOB, setPolicyHolderDOB] = useState(patient.insurance?.policyHolderDOB || "");
  const [relationshipToPolicyholder, setRelationshipToPolicyholder] = useState(patient.insurance?.relationshipToPolicyholder || "");

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

  // Sort appointments by date (most recent first)
  const sortedAppointments = [...appointments].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  const handleSaveBasicInfo = () => {
    const updatedPatient: Patient = {
      ...patient,
      firstName,
      lastName,
      email,
      phone,
      phoneCountryCode,
      dateOfBirth,
      gender,
      ...(street || city || state || zipCode
        ? {
            address: {
              street,
              city,
              state,
              zip: zipCode,
              country,
            },
          }
        : {}),
      ...(emergencyName || emergencyPhone
        ? {
            emergencyContact: {
              name: emergencyName,
              phone: emergencyPhone,
              phoneCountryCode: emergencyCountryCode,
            },
          }
        : {}),
    };
    onUpdatePatient(updatedPatient);
    setIsEditingBasic(false);
  };

  const handleCancelBasicEdit = () => {
    // Reset to original values
    setFirstName(patient.firstName);
    setLastName(patient.lastName);
    setEmail(patient.email);
    setPhone(patient.phone);
    setPhoneCountryCode(patient.phoneCountryCode || "+1");
    setDateOfBirth(patient.dateOfBirth);
    setGender(patient.gender);
    setStreet(patient.address?.street || "");
    setCity(patient.address?.city || "");
    setState(patient.address?.state || "");
    setZipCode(patient.address?.zip || "");
    setCountry(patient.address?.country || "United States");
    setEmergencyName(patient.emergencyContact?.name || "");
    setEmergencyPhone(patient.emergencyContact?.phone || "");
    setEmergencyCountryCode(patient.emergencyContact?.phoneCountryCode || "+1");
    setIsEditingBasic(false);
  };

  const handleSaveInsurance = () => {
    const updatedPatient: Patient = {
      ...patient,
      insurance: insuranceProvider
        ? {
            provider: insuranceProvider,
            policyNumber,
            groupNumber,
            policyHolderName,
            policyHolderDOB,
            relationshipToPolicyholder,
          }
        : undefined,
    };
    onUpdatePatient(updatedPatient);
    setIsEditingInsurance(false);
  };

  const handleCancelInsuranceEdit = () => {
    // Reset to original values
    setInsuranceProvider(patient.insurance?.provider || "");
    setPolicyNumber(patient.insurance?.policyNumber || "");
    setGroupNumber(patient.insurance?.groupNumber || "");
    setPolicyHolderName(patient.insurance?.policyHolderName || "");
    setPolicyHolderDOB(patient.insurance?.policyHolderDOB || "");
    setRelationshipToPolicyholder(patient.insurance?.relationshipToPolicyholder || "");
    setIsEditingInsurance(false);
  };

  const renderBasicDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Basic information
        </h3>
        {!isEditingBasic ? (
          <button
            onClick={() => setIsEditingBasic(true)}
            className="inline-flex items-center gap-2 px-4 h-9 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm font-medium"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancelBasicEdit}
              className="inline-flex items-center gap-2 px-4 h-9 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm font-medium"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSaveBasicInfo}
              className="inline-flex items-center gap-2 px-4 h-9 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-6">
        {/* Demographics */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide">
              Demographics
            </h4>
          </div>
          {!isEditingBasic ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">First name</p>
                <p className="text-sm text-neutral-900 dark:text-white">{patient.firstName}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Last name</p>
                <p className="text-sm text-neutral-900 dark:text-white">{patient.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Email address</p>
                <p className="text-sm text-neutral-900 dark:text-white">{patient.email}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Phone number</p>
                <p className="text-sm text-neutral-900 dark:text-white">
                  {patient.phoneCountryCode} {patient.phone}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Date of birth</p>
                <p className="text-sm text-neutral-900 dark:text-white">{formatDate(patient.dateOfBirth)}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Gender</p>
                <p className="text-sm text-neutral-900 dark:text-white">{patient.gender}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                    First name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                    Phone number
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={phoneCountryCode}
                      onChange={(e) => setPhoneCountryCode(e.target.value)}
                      className="flex h-10 w-24 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
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
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dob" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                    Date of birth
                  </label>
                  <input
                    id="dob"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                  />
                </div>
                <div>
                  <label htmlFor="gender" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                    Gender
                  </label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Address */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide">
              Address
            </h4>
          </div>
          {!isEditingBasic ? (
            patient.address ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Street address</p>
                  <p className="text-sm text-neutral-900 dark:text-white">{patient.address.street || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">City</p>
                  <p className="text-sm text-neutral-900 dark:text-white">{patient.address.city || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">State</p>
                  <p className="text-sm text-neutral-900 dark:text-white">{patient.address.state || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Zip code</p>
                  <p className="text-sm text-neutral-900 dark:text-white">{patient.address.zip || "-"}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">No address information available</p>
            )
          ) : (
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
                  className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
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
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
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
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
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
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
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
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Emergency Contact */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Phone className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide">
              Emergency contact
            </h4>
          </div>
          {!isEditingBasic ? (
            patient.emergencyContact ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Name</p>
                  <p className="text-sm text-neutral-900 dark:text-white">{patient.emergencyContact.name}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Phone number</p>
                  <p className="text-sm text-neutral-900 dark:text-white">
                    {patient.emergencyContact.phoneCountryCode} {patient.emergencyContact.phone}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">No emergency contact information available</p>
            )
          ) : (
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
                  className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                />
              </div>
              <div>
                <label htmlFor="emergencyPhone" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                  Emergency contact number
                </label>
                <div className="flex gap-2">
                  <select
                    value={emergencyCountryCode}
                    onChange={(e) => setEmergencyCountryCode(e.target.value)}
                    className="flex h-10 w-24 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
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
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderInsuranceDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Insurance information
        </h3>
        {!isEditingInsurance ? (
          <button
            onClick={() => setIsEditingInsurance(true)}
            className="inline-flex items-center gap-2 px-4 h-9 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm font-medium"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancelInsuranceEdit}
              className="inline-flex items-center gap-2 px-4 h-9 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm font-medium"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSaveInsurance}
              className="inline-flex items-center gap-2 px-4 h-9 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
        {!isEditingInsurance ? (
          patient.insurance ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Insurance provider</p>
                  <p className="text-sm text-neutral-900 dark:text-white">{patient.insurance.provider}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Policy number</p>
                  <p className="text-sm text-neutral-900 dark:text-white">{patient.insurance.policyNumber}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Group number</p>
                  <p className="text-sm text-neutral-900 dark:text-white">{patient.insurance.groupNumber || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Policyholder name</p>
                  <p className="text-sm text-neutral-900 dark:text-white">{patient.insurance.policyHolderName}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Policyholder DOB</p>
                  <p className="text-sm text-neutral-900 dark:text-white">{formatDate(patient.insurance.policyHolderDOB)}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Relationship to policyholder</p>
                  <p className="text-sm text-neutral-900 dark:text-white">{patient.insurance.relationshipToPolicyholder}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">No insurance information available</p>
          )
        ) : (
          <div className="space-y-4">
            <div>
              <label htmlFor="insuranceProvider" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                Insurance provider name
              </label>
              <input
                id="insuranceProvider"
                type="text"
                value={insuranceProvider}
                onChange={(e) => setInsuranceProvider(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                placeholder="e.g., Blue Cross Blue Shield"
              />
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
                  className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
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
                  className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
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
                className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
              />
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
                  className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                />
              </div>
              <div>
                <label htmlFor="relationship" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                  Relationship to policyholder
                </label>
                <select
                  id="relationship"
                  value={relationshipToPolicyholder}
                  onChange={(e) => setRelationshipToPolicyholder(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                >
                  <option value="">Select relationship</option>
                  <option value="Self">Self</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderAppointments = () => {
    // If an appointment is selected, show the details view
    if (selectedAppointmentId) {
      const selectedAppointment = sortedAppointments.find(apt => apt.id === selectedAppointmentId);
      if (selectedAppointment) {
        return (
          <AppointmentDetailsView 
            appointment={selectedAppointment}
            onBack={() => setSelectedAppointmentId(null)}
          />
        );
      }
    }

    // Otherwise show the list
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Appointment history
        </h3>

        {sortedAppointments.length > 0 ? (
          <div className="space-y-3">
            {sortedAppointments.map((appointment) => (
              <button
                key={appointment.id}
                onClick={() => setSelectedAppointmentId(appointment.id)}
                className="w-full text-left bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {appointment.service}
                      </h4>
                      <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {formatDate(appointment.date)} at {appointment.time}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                      appointment.status === "Completed"
                        ? "bg-success-50 dark:bg-success-950/30 text-success-700 dark:text-success-300"
                        : appointment.status === "Confirmed"
                        ? "bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300"
                        : appointment.status === "Cancelled"
                        ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <User className="w-4 h-4" />
                    <span>{appointment.provider}</span>
                  </div>
                  {appointment.clinic && (
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <MapPin className="w-4 h-4" />
                      <span>{appointment.clinic}</span>
                    </div>
                  )}
                  {appointment.notes && (
                    <div className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <FileText className="w-4 h-4 mt-0.5" />
                      <span>{appointment.notes}</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-12 text-center">
            <Calendar className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
              No appointments yet
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              This patient has no appointment history
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <ClinicAdminLayout activeMenu="patients" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6">
        {/* Breadcrumb Navigation */}
        {selectedAppointmentId ? (
          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mb-6">
            <button
              onClick={onBack}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Patients
            </button>
            <ChevronRight className="w-4 h-4" />
            <button
              onClick={() => setSelectedAppointmentId(null)}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              {patient.firstName} {patient.lastName}
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-neutral-900 dark:text-white">
              Appointment details
            </span>
          </div>
        ) : (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-6 group transition-colors"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to patients
          </button>
        )}

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
                {patient.firstName} {patient.lastName}
              </h1>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                    patient.status === "Active"
                      ? "bg-success-50 dark:bg-success-950/30 text-success-700 dark:text-success-300"
                      : patient.status === "Link sent"
                      ? "bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                  }`}
                >
                  {patient.status}
                </span>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Patient ID: {patient.id}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-neutral-200 dark:border-neutral-800 mb-6">
          <div className="flex gap-6">
            <button
              onClick={() => {
                setActiveTab("basic");
                setSelectedAppointmentId(null);
              }}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "basic"
                  ? "border-primary-600 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              Basic details
            </button>
            <button
              onClick={() => {
                setActiveTab("insurance");
                setSelectedAppointmentId(null);
              }}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "insurance"
                  ? "border-primary-600 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              Insurance details
            </button>
            <button
              onClick={() => {
                setActiveTab("appointments");
                setSelectedAppointmentId(null);
              }}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "appointments"
                  ? "border-primary-600 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              Appointments
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "basic" && renderBasicDetails()}
        {activeTab === "insurance" && renderInsuranceDetails()}
        {activeTab === "appointments" && renderAppointments()}
      </div>
    </ClinicAdminLayout>
  );
}