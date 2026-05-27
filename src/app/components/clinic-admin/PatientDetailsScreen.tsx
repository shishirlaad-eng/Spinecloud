import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, User, Shield, FileText, Edit2, Save, X, ChevronRight, ChevronLeft, Activity, Search, Filter, Eye, Download, FolderOpen, ChevronDown, ClipboardList, Heart, Wallet, Scan, Dumbbell, Brain, ExternalLink, UserX, Upload, Send, CheckCircle, Clock, AlertCircle, PenLine, ShieldCheck, Copy, Plus, RotateCcw } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { AppointmentDetailsView } from "./AppointmentDetailsView";
import { SpineCloudResultsView } from "@/app/components/shared/SpineCloudResultsView";
import { 
  PatientClinicalRecordsTab, 
  PatientReferralsTab, 
  PatientDocumentsTab, 
  PatientFormsTab, 
  PatientAgreementsTab 
} from "../shared/PatientDetailTabs";

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
  onNavigate: (menu: "dashboard" | "branches" | "questionnaires" | "roles" | "users" | "providers" | "consentForms" | "patients" | "referrals") => void;
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
  const [activeTab, setActiveTab] = useState<"basic" | "insurance" | "appointments" | "clinicalRecords" | "referrals" | "documents" | "patientForms" | "agreements">("basic");
  const tabScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft]   = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    const el = tabScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  const scrollTabs = (dir: "left" | "right") => {
    const el = tabScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -160 : 160, behavior: "smooth" });
    setTimeout(updateScrollButtons, 300);
  };
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
      const matchesSearch = (apt.service?.toLowerCase() || "").includes(appointmentSearch.toLowerCase()) || 
                           (apt.provider?.toLowerCase() || "").includes(appointmentSearch.toLowerCase());
      const matchesStatus = appointmentStatusFilter === "all" || apt.status.toLowerCase() === appointmentStatusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });

    return (
      <div className="space-y-6">
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
              </div>
            </div>
          </div>
        </div>

        {/* ── Tab bar with scroll arrows ── */}
        <div className="relative mb-6">
          {/* Left scroll arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scrollTabs("left")}
              className="absolute left-0 top-0 bottom-1 z-10 flex items-center px-1 bg-gradient-to-r from-white dark:from-neutral-950 via-white/90 dark:via-neutral-950/90 to-transparent pr-4"
            >
              <ChevronLeft className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            </button>
          )}

          {/* Scrollable tab list */}
          <div
            ref={tabScrollRef}
            onScroll={updateScrollButtons}
            className="flex gap-1 overflow-x-auto scrollbar-hide border-b border-neutral-200 dark:border-neutral-800"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {([
              { key: "basic",           label: "Overview"          },
              { key: "insurance",       label: "Insurance"         },
              { key: "appointments",    label: "Appointments"      },
              { key: "clinicalRecords", label: "Clinical Records"  },
              { key: "referrals",       label: "Referrals"         },
              { key: "documents",       label: "Documents"         },
              { key: "patientForms",    label: "Patient Forms"     },
              { key: "agreements",      label: "Agreements"        },
            ] as const).map(tab => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setSelectedAppointmentId(null); }}
                className={`px-4 pb-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex-shrink-0 ${
                  activeTab === tab.key
                    ? "border-primary-600 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right scroll arrow */}
          {canScrollRight && (
            <button
              onClick={() => scrollTabs("right")}
              className="absolute right-0 top-0 bottom-1 z-10 flex items-center px-1 bg-gradient-to-l from-white dark:from-neutral-950 via-white/90 dark:via-neutral-950/90 to-transparent pl-4"
            >
              <ChevronRight className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            </button>
          )}
        </div>

        {activeTab === "basic" && renderBasicDetails()}
        {activeTab === "insurance" && renderInsuranceDetails()}
        {activeTab === "appointments" && renderAppointments()}
        {activeTab === "clinicalRecords" && <PatientClinicalRecordsTab patientName={`${patient.firstName} ${patient.lastName}`} />}
        {activeTab === "referrals" && <PatientReferralsTab patientName={`${patient.firstName} ${patient.lastName}`} />}
        {activeTab === "documents" && <PatientDocumentsTab patientId={patient.id} />}
        {activeTab === "patientForms" && <PatientFormsTab patientEmail={patient.email} patientName={`${patient.firstName} ${patient.lastName}`} />}
        {activeTab === "agreements" && <PatientAgreementsTab patientEmail={patient.email} patientName={`${patient.firstName} ${patient.lastName}`} />}
      </div>
    </ClinicAdminLayout>
  );
}


// Local tab definitions removed in favor of shared components.