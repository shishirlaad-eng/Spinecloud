import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, User, Shield, FileText, Edit2, Save, X, ChevronRight, Activity, Search, Filter, Eye, Download, FolderOpen, ChevronDown, ClipboardList, Heart, Wallet, Scan, Dumbbell, Brain, ExternalLink, UserX } from "lucide-react";
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
  onRescheduleAppointment?: (appointmentId: string) => void;
  onCancelAppointment?: (appointmentId: string) => void;
  onNoShowAppointment?: (appointmentId: string) => void;
}

export function PatientDetailsScreen({
  patient,
  appointments,
  onNavigate,
  onBack,
  onUpdatePatient,
  onLogout,
  onRescheduleAppointment,
  onCancelAppointment,
  onNoShowAppointment,
}: PatientDetailsScreenProps) {
  const [activeTab, setActiveTab] = useState<"basic" | "insurance" | "appointments" | "clinicalRecords" | "referrals">("basic");
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [isEditingInsurance, setIsEditingInsurance] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [appointmentSearch, setAppointmentSearch] = useState("");
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState("all");

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
    <div className="space-y-5">
      {/* Header row - REMOVED redundant header as requested */}
      <div className="flex items-center justify-end mb-1">
        {!isEditingBasic ? (
          <button onClick={() => setIsEditingBasic(true)} className="inline-flex items-center gap-2 px-4 h-9 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm font-medium">
            <Edit2 className="w-4 h-4" />Edit info
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleCancelBasicEdit} className="inline-flex items-center gap-2 px-4 h-9 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm font-medium"><X className="w-4 h-4" />Cancel</button>
            <button onClick={handleSaveBasicInfo} className="inline-flex items-center gap-2 px-4 h-9 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"><Save className="w-4 h-4" />Save changes</button>
          </div>
        )}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Personal Info */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center"><User className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" /></div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Personal</h4>
          </div>
          {!isEditingBasic ? (
            <div className="space-y-3">
              {[{ label: "First name", val: patient.firstName }, { label: "Last name", val: patient.lastName }, { label: "Date of birth", val: formatDate(patient.dateOfBirth) }, { label: "Gender", val: patient.gender }].map(f => (
                <div key={f.label}>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">{f.label}</p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">{f.val}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {[{ id: "firstName", label: "First name", val: firstName, setter: setFirstName, type: "text" }, { id: "lastName", label: "Last name", val: lastName, setter: setLastName, type: "text" }].map(f => (
                <div key={f.id}>
                  <label htmlFor={f.id} className="text-xs font-medium text-neutral-600 dark:text-neutral-400 block mb-1">{f.label}</label>
                  <input id={f.id} type={f.type} value={f.val} onChange={e => f.setter(e.target.value)} className="h-9 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10" />
                </div>
              ))}
              <div>
                <label htmlFor="dob" className="text-xs font-medium text-neutral-600 dark:text-neutral-400 block mb-1">Date of birth</label>
                <input id="dob" type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} className="h-9 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10" />
              </div>
              <div>
                <label htmlFor="gender" className="text-xs font-medium text-neutral-600 dark:text-neutral-400 block mb-1">Gender</label>
                <select id="gender" value={gender} onChange={e => setGender(e.target.value)} className="h-9 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10">
                  {["Male","Female","Other","Prefer not to say"].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center"><Mail className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /></div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Contact</h4>
          </div>
          {!isEditingBasic ? (
            <div className="space-y-3">
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Email address</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white break-all">{patient.email}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Phone number</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{patient.phoneCountryCode} {patient.phone}</p>
              </div>
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Emergency contact</p>
                {patient.emergencyContact ? (
                  <>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">{patient.emergencyContact.name}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{patient.emergencyContact.phoneCountryCode} {patient.emergencyContact.phone}</p>
                  </>
                ) : <p className="text-sm text-neutral-500 dark:text-neutral-400">—</p>}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label htmlFor="email" className="text-xs font-medium text-neutral-600 dark:text-neutral-400 block mb-1">Email address</label>
                <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="h-9 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10" />
              </div>
              <div>
                <label htmlFor="phone" className="text-xs font-medium text-neutral-600 dark:text-neutral-400 block mb-1">Phone number</label>
                <div className="flex gap-2">
                  <select value={phoneCountryCode} onChange={e => setPhoneCountryCode(e.target.value)} className="h-9 w-20 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-2 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600">
                    {countryCodes.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                  </select>
                  <input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="h-9 flex-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10" />
                </div>
              </div>
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
                <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Emergency Contact</p>
                <div>
                  <label htmlFor="emergencyName" className="text-xs font-medium text-neutral-600 dark:text-neutral-400 block mb-1">Name</label>
                  <input id="emergencyName" type="text" value={emergencyName} onChange={e => setEmergencyName(e.target.value)} className="h-9 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10" />
                </div>
                <div>
                  <label htmlFor="emergencyPhone" className="text-xs font-medium text-neutral-600 dark:text-neutral-400 block mb-1">Phone</label>
                  <div className="flex gap-2">
                    <select value={emergencyCountryCode} onChange={e => setEmergencyCountryCode(e.target.value)} className="h-9 w-20 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-2 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600">
                      {countryCodes.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                    </select>
                    <input id="emergencyPhone" type="tel" value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)} className="h-9 flex-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Address */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center"><MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /></div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Address</h4>
          </div>
          {!isEditingBasic ? (
            patient.address ? (
              <div className="space-y-3">
                {[{ label: "Street", val: patient.address.street }, { label: "City", val: patient.address.city }, { label: "State", val: patient.address.state }, { label: "Zip code", val: patient.address.zip }, { label: "Country", val: patient.address.country || "United States" }].map(f => (
                  <div key={f.label}>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">{f.label}</p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">{f.val || "—"}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <MapPin className="w-8 h-8 text-neutral-300 dark:text-neutral-700 mb-2" />
                <p className="text-sm text-neutral-500 dark:text-neutral-400">No address on file</p>
              </div>
            )
          ) : (
            <div className="space-y-3">
              <div>
                <label htmlFor="street" className="text-xs font-medium text-neutral-600 dark:text-neutral-400 block mb-1">Street address</label>
                <input id="street" type="text" value={street} onChange={e => setStreet(e.target.value)} className="h-9 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="city" className="text-xs font-medium text-neutral-600 dark:text-neutral-400 block mb-1">City</label>
                  <input id="city" type="text" value={city} onChange={e => setCity(e.target.value)} className="h-9 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10" />
                </div>
                <div>
                  <label htmlFor="zip" className="text-xs font-medium text-neutral-600 dark:text-neutral-400 block mb-1">Zip code</label>
                  <input id="zip" type="text" value={zipCode} onChange={e => setZipCode(e.target.value)} className="h-9 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10" />
                </div>
              </div>
              <div>
                <label htmlFor="state" className="text-xs font-medium text-neutral-600 dark:text-neutral-400 block mb-1">State</label>
                <select id="state" value={state} onChange={e => setState(e.target.value)} className="h-9 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10">
                  <option value="">Select state</option>
                  {usStates.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="country" className="text-xs font-medium text-neutral-600 dark:text-neutral-400 block mb-1">Country</label>
                <select id="country" value={country} onChange={e => setCountry(e.target.value)} className="h-9 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10">
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderInsuranceDetails = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-end mb-1">
        {!isEditingInsurance ? (
          <button
            onClick={() => setIsEditingInsurance(true)}
            className="inline-flex items-center gap-2 px-4 h-9 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm font-medium"
          >
            <Edit2 className="w-4 h-4" /> Edit insurance
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancelInsuranceEdit}
              className="inline-flex items-center gap-2 px-4 h-9 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm font-medium"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              onClick={handleSaveInsurance}
              className="inline-flex items-center gap-2 px-4 h-9 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              <Save className="w-4 h-4" /> Save changes
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Policy Details */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
            </div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Policy Information</h4>
          </div>
          {!isEditingInsurance ? (
            <div className="space-y-3">
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Insurance provider</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{patient.insurance?.provider || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Policy / Member ID</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{patient.insurance?.policyNumber || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Group number</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{patient.insurance?.groupNumber || "—"}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 block mb-1">Insurance provider</label>
                <input
                  type="text"
                  value={insuranceProvider}
                  onChange={(e) => setInsuranceProvider(e.target.value)}
                  className="h-9 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 block mb-1">Policy / Member ID</label>
                <input
                  type="text"
                  value={policyNumber}
                  onChange={(e) => setPolicyNumber(e.target.value)}
                  className="h-9 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 block mb-1">Group number</label>
                <input
                  type="text"
                  value={groupNumber}
                  onChange={(e) => setGroupNumber(e.target.value)}
                  className="h-9 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                />
              </div>
            </div>
          )}
        </div>

        {/* Policyholder Details */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Policyholder</h4>
          </div>
          {!isEditingInsurance ? (
            <div className="space-y-3">
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Name of policyholder</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{patient.insurance?.policyHolderName || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Date of birth</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{patient.insurance?.policyHolderDOB ? formatDate(patient.insurance.policyHolderDOB) : "—"}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Relationship to patient</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{patient.insurance?.relationshipToPolicyholder || "—"}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 block mb-1">Policyholder name</label>
                <input
                  type="text"
                  value={policyHolderName}
                  onChange={(e) => setPolicyHolderName(e.target.value)}
                  className="h-9 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 block mb-1">Date of birth</label>
                <input
                  type="date"
                  value={policyHolderDOB}
                  onChange={(e) => setPolicyHolderDOB(e.target.value)}
                  className="h-9 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 block mb-1">Relationship</label>
                <select
                  value={relationshipToPolicyholder}
                  onChange={(e) => setRelationshipToPolicyholder(e.target.value)}
                  className="h-9 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
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
          )}
        </div>
      </div>
    </div>
  );

  const renderAppointments = () => {
    // If an appointment is selected, show only the questionnaire (as requested)
    if (selectedAppointmentId) {
      const selectedAppointment = sortedAppointments.find(apt => apt.id === selectedAppointmentId);
      if (selectedAppointment) {
        return (
          <div className="space-y-6">
            <button 
              onClick={() => setSelectedAppointmentId(null)}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to appointments
            </button>
            
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 text-center">
              <ClipboardList className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Questionnaires</h3>
              <p className="text-neutral-500 dark:text-neutral-400 mb-6">View and manage clinical questionnaires for {selectedAppointment.service}</p>
              
              <div className="max-w-md mx-auto space-y-3">
                {["Patient Intake Form", "Functional Rating Index", "Pain Scale (VAS)"].map((q, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700">
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white">{q}</span>
                    <button className="text-xs font-bold text-primary-600 hover:underline">View responses</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
    }

    const filteredAppointments = sortedAppointments.filter(apt => {
      const matchesSearch = apt.service.toLowerCase().includes(appointmentSearch.toLowerCase()) || 
                           apt.provider.toLowerCase().includes(appointmentSearch.toLowerCase());
      const matchesStatus = appointmentStatusFilter === "all" || apt.status.toLowerCase() === appointmentStatusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });

    return (
      <div className="space-y-6">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search by service or provider..." 
              value={appointmentSearch}
              onChange={(e) => setAppointmentSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={appointmentStatusFilter}
              onChange={(e) => setAppointmentStatusFilter(e.target.value)}
              className="h-10 px-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 outline-none"
            >
              <option value="all">All statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
              <option value="rescheduled">Rescheduled</option>
            </select>
            <button className="inline-flex items-center gap-2 px-4 h-10 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        {filteredAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 hover:shadow-md transition-all group relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-1 h-full ${
                  appointment.status === "Completed" ? "bg-success-500" :
                  appointment.status === "Confirmed" ? "bg-primary-500" :
                  appointment.status === "Cancelled" ? "bg-neutral-400" :
                  appointment.status === "No-Show" ? "bg-destructive" :
                  "bg-warning-500"
                }`} />

                <div className="flex justify-between items-start mb-4 pl-2">
                  <div>
                    <h4 className="font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors">
                      {appointment.service}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-xs font-bold text-neutral-500 uppercase tracking-widest">
                      <Calendar className="w-3 h-3" />
                      {formatDate(appointment.date)}
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                    appointment.status === "Completed" ? "bg-success-50 text-success-700" :
                    appointment.status === "Confirmed" ? "bg-primary-50 text-primary-700" :
                    appointment.status === "Cancelled" ? "bg-neutral-100 text-neutral-500" :
                    appointment.status === "No-Show" ? "bg-destructive/10 text-destructive" :
                    "bg-warning-50 text-warning-700"
                  }`}>
                    {appointment.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 pl-2">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Time</p>
                    <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">{appointment.time}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Branch</p>
                    <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">{appointment.clinic || "Main Branch"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Attending Provider</p>
                    <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">{appointment.provider}</p>
                  </div>
                </div>

                <div className="flex gap-2 pl-2">
                  <button 
                    onClick={() => setSelectedAppointmentId(appointment.id)}
                    className="flex-1 h-9 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-neutral-200 transition-colors"
                  >
                    Questionnaires
                  </button>
                  <button 
                    onClick={() => onRescheduleAppointment?.(appointment.id)}
                    className="flex-1 h-9 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-neutral-50 transition-colors"
                  >
                    Reschedule
                  </button>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => onNoShowAppointment?.(appointment.id)}
                      title="Mark as No Show"
                      className="h-9 px-3 border border-neutral-200 dark:border-neutral-800 text-warning-600 rounded-lg hover:bg-warning-50 transition-colors"
                    >
                      <UserX className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onCancelAppointment?.(appointment.id)}
                      title="Cancel Appointment"
                      className="h-9 px-3 border border-neutral-200 dark:border-neutral-800 text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-12 text-center">
            <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
              No appointments found
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Try adjusting your search or filters
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
        <div className="border-b border-neutral-200 dark:border-neutral-800 mb-6 overflow-x-auto">
          <div className="flex gap-6 min-w-max">
            {([
              { key: "basic",           label: "Basic details"     },
              { key: "insurance",       label: "Insurance details" },
              { key: "appointments",    label: "Appointments"      },
              { key: "clinicalRecords", label: "Clinical Records"  },
              { key: "referrals",       label: "Referrals"         },
            ] as const).map(tab => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setSelectedAppointmentId(null); }}
                className={`pb-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? "border-primary-600 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "basic" && renderBasicDetails()}
        {activeTab === "insurance" && renderInsuranceDetails()}
        {activeTab === "appointments" && renderAppointments()}
        {activeTab === "clinicalRecords" && <PatientClinicalRecordsTab patientName={`${patient.firstName} ${patient.lastName}`} />}
        {activeTab === "referrals" && <PatientReferralsTab patientName={`${patient.firstName} ${patient.lastName}`} />}
      </div>
    </ClinicAdminLayout>
  );
}

// ── Patient-scoped Clinical Records table ─────────────────────────────────────

const RECORD_TYPES = [
  { value: "all",                 label: "All types"           },
  { value: "soapNote",            label: "SOAP Notes"          },
  { value: "carePlan",            label: "Care Plans"          },
  { value: "financialPlan",       label: "Financial Plans"     },
  { value: "structuralIntegrity", label: "Structural Integrity"},
  { value: "kdt",                 label: "KDT Reports"         },
  { value: "dicom",               label: "DICOM / Imaging"     },
  { value: "spineCloud",          label: "SpineCloud Wellness" },
];

const TYPE_ICONS: Record<string, any> = {
  soapNote: ClipboardList, carePlan: Heart, financialPlan: Wallet,
  structuralIntegrity: Scan, kdt: Dumbbell, dicom: Activity, spineCloud: Brain,
};

function loadPatientRecords(patientName: string) {
  const all: any[] = [];
  const add = (type: string, id: string, date: string, title: string, provider: string, data: any) =>
    all.push({ id, type, date, title, provider, data });

  Object.keys(localStorage).filter(k => k.startsWith("soapNote_")).forEach(k => {
    try { const d = JSON.parse(localStorage.getItem(k)!); if (d?.id && d.status === "final") add("soapNote", d.id, d.finalizedAt || new Date().toISOString(), "SOAP Clinical Note", d.finalizedBy || "Provider", d); } catch {}
  });
  Object.keys(localStorage).filter(k => k.startsWith("carePlan_") && !k.startsWith("carePlan_master")).forEach(k => {
    try { const d = JSON.parse(localStorage.getItem(k)!); if (d?.id) add("carePlan", d.id, d.datePrepared || new Date().toISOString(), "Care Plan", d.providerName || "Provider", d); } catch {}
  });
  Object.keys(localStorage).filter(k => k.startsWith("financialPlan_")).forEach(k => {
    try { const d = JSON.parse(localStorage.getItem(k)!); if (d?.id) add("financialPlan", d.id, d.datePrepared || new Date().toISOString(), "Financial Agreement", d.providerName || "Provider", d); } catch {}
  });
  Object.keys(localStorage).filter(k => k.startsWith("structuralIntegrity_")).forEach(k => {
    try { const d = JSON.parse(localStorage.getItem(k)!); if (d?.id) add("structuralIntegrity", d.id, d.date || new Date().toISOString(), "Structural Integrity Analysis", d.provider || "Provider", d); } catch {}
  });
  Object.keys(localStorage).filter(k => k.startsWith("kdtReport_")).forEach(k => {
    try { const d = JSON.parse(localStorage.getItem(k)!); if (d?.id) add("kdt", d.id, d.dateCreated || new Date().toISOString(), `KDT – ${d.protocolType || "Lumbar"}`, d.providerName || "Provider", d); } catch {}
  });

  // Mock DICOM + SpineCloud
  all.push(
    { 
      id: "dicom-1", 
      type: "dicom", 
      date: "2025-01-15T10:00:00", 
      title: "Comprehensive Spinal X-Ray Series", 
      provider: "Radiology", 
      data: { 
        id: "dicom-1", 
        images: [
          {
            type: "Cervical Flexion",
            imageUrl: "/assets/clinical/cervical_flexion.png",
            findings: "ABNORMAL: Significant loss of cervical lordosis in flexion. Evidence of mild C5-C6 degenerative disc disease with anterior osteophyte formation. Spinal alignment shows early signs of structural instability."
          },
          {
            type: "Lumbar Lateral",
            imageUrl: "/assets/clinical/lumbar_lateral.png",
            findings: "NORMAL: Well-maintained lumbar lordosis. Vertebral body heights are preserved. Disc spaces are healthy at all levels. No evidence of spondylolisthesis or acute bony injury."
          },
          {
            type: "AP Cervical",
            imageUrl: "/assets/clinical/ap_cervical.png",
            findings: "NORMAL: Spinous processes are midline. No lateral tilt or rotation detected in the cervical vertebrae. Paraspinal soft tissues are within normal limits."
          }
        ]
      } 
    },
    { id: "sc-1", type: "spineCloud", date: "2025-02-10T09:00:00", title: "SpineCloud Wellness Assessment", provider: "SpineCloud AI", data: { id: "sc-1", overallScore: 72 } }
  );

  return all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function PatientClinicalRecordsTab({ patientName }: { patientName: string }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const records = loadPatientRecords(patientName);
  const filterRef = useState<HTMLDivElement | null>(null);

  const filtered = records.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.title.toLowerCase().includes(q) || r.provider.toLowerCase().includes(q);
    const matchType = typeFilter === "all" || r.type === typeFilter;
    let matchDate = true;
    if (dateFilter !== "all") {
      const d = new Date(r.date);
      if (dateFilter === "7d")  { const x = new Date(); x.setDate(x.getDate()-7);   matchDate = d >= x; }
      if (dateFilter === "30d") { const x = new Date(); x.setDate(x.getDate()-30);  matchDate = d >= x; }
      if (dateFilter === "3m")  { const x = new Date(); x.setMonth(x.getMonth()-3); matchDate = d >= x; }
      if (dateFilter === "6m")  { const x = new Date(); x.setMonth(x.getMonth()-6); matchDate = d >= x; }
    }
    return matchSearch && matchType && matchDate;
  });

  const activeFilters = (typeFilter !== "all" ? 1 : 0) + (dateFilter !== "all" ? 1 : 0);
  const fmt = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input type="text" placeholder="Search records..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-neutral-900 dark:text-white placeholder:text-neutral-400" />
        </div>
        <div className="flex gap-2">
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="h-10 px-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20">
            {RECORD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <select value={dateFilter} onChange={e => setDateFilter(e.target.value)}
            className="h-10 px-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20">
            <option value="all">All time</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="3m">Last 3 months</option>
            <option value="6m">Last 6 months</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              {["Date", "Type", "Title", "Provider", "Actions"].map(col => (
                <th key={col} className={`px-5 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-white ${col==="Actions"?"text-right":""}`}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-12 text-center">
                <FolderOpen className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto mb-2" />
                <p className="text-sm text-neutral-500 dark:text-neutral-400">No records found</p>
              </td></tr>
            ) : filtered.map(rec => {
              const Icon = TYPE_ICONS[rec.type] || FileText;
              const typeLabel = RECORD_TYPES.find(t => t.value === rec.type)?.label || rec.type;
              return (
                <tr key={rec.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                  <td className="px-5 py-3 text-sm text-neutral-900 dark:text-white whitespace-nowrap">{fmt(rec.date)}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      <Icon className="w-3 h-3" />{typeLabel}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm font-medium text-neutral-900 dark:text-white">{rec.title}</td>
                  <td className="px-5 py-3 text-sm text-neutral-600 dark:text-neutral-400">{rec.provider}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/20 transition-colors" title="Preview"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => { const b=new Blob([JSON.stringify(rec.data,null,2)],{type:"application/json"}); const u=URL.createObjectURL(b); const a=document.createElement("a"); a.href=u; a.download=`${rec.type}_${rec.id}.json`; a.click(); URL.revokeObjectURL(u); }} className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors" title="Download"><Download className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Referrals tab ──────────────────────────────────────────────────────────────

const MOCK_REFERRALS = [
  { id: "ref-1", date: "2025-01-10", referredTo: "Dr. Michael Chen", specialty: "Orthopedic Surgery", reason: "Lumbar disc herniation evaluation", status: "Completed", notes: "Patient evaluated. Conservative management recommended." },
  { id: "ref-2", date: "2025-02-15", referredTo: "Advanced Imaging Center", specialty: "Radiology", reason: "MRI – Cervical spine", status: "Pending", notes: "Appointment scheduled for next week." },
  { id: "ref-3", date: "2024-11-20", referredTo: "Dr. Lisa Park", specialty: "Pain Management", reason: "Chronic lower back pain management", status: "Completed", notes: "Epidural steroid injection performed. Follow-up in 6 weeks." },
];

function PatientReferralsTab({ patientName }: { patientName: string }) {
  const [search, setSearch] = useState("");
  const filtered = MOCK_REFERRALS.filter(r => {
    const q = search.toLowerCase();
    return !q || r.referredTo.toLowerCase().includes(q) || r.specialty.toLowerCase().includes(q) || r.reason.toLowerCase().includes(q);
  });
  const fmt = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div>
      <div className="mb-4 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input type="text" placeholder="Search referrals..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-neutral-900 dark:text-white placeholder:text-neutral-400" />
        </div>
      </div>
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              {["Date", "Referred To", "Specialty", "Reason", "Status", "Notes"].map(col => (
                <th key={col} className="px-5 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-white">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-12 text-center">
                <FolderOpen className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto mb-2" />
                <p className="text-sm text-neutral-500 dark:text-neutral-400">No referrals found</p>
              </td></tr>
            ) : filtered.map(ref => (
              <tr key={ref.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                <td className="px-5 py-3 text-sm text-neutral-900 dark:text-white whitespace-nowrap">{fmt(ref.date)}</td>
                <td className="px-5 py-3 text-sm font-medium text-neutral-900 dark:text-white">{ref.referredTo}</td>
                <td className="px-5 py-3 text-sm text-neutral-600 dark:text-neutral-400">{ref.specialty}</td>
                <td className="px-5 py-3 text-sm text-neutral-600 dark:text-neutral-400 max-w-xs">{ref.reason}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    ref.status === "Completed" ? "bg-success-50 dark:bg-success-950/30 text-success-700 dark:text-success-300" : "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300"
                  }`}>{ref.status}</span>
                </td>
                <td className="px-5 py-3 text-sm text-neutral-600 dark:text-neutral-400 max-w-xs">{ref.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}