import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { ArrowLeft, Calendar, Mail, Phone, MapPin, User, FileText, ClipboardList, Upload, DollarSign, Edit, Send, CheckCircle, AlertCircle, Clock, Search, Filter, X, Activity, MoreVertical, Plus } from "lucide-react";
import { useState } from "react";
import { KioskFormFillingScreen } from "../kiosk/KioskFormFillingScreen";
import { AssignDocumentModal } from "./AssignDocumentModal";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  primaryLocation: string;
  assignedProvider?: string;
  status: "Draft" | "Invited" | "Active" | "Inactive";
  intakeStatus: "Not Started" | "In Progress" | "Complete";
  insuranceStatus: "Missing" | "Provided";
  insurance?: {
    provider: string;
    policyNumber: string;
    policyHolderName: string;
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  nextAppointment?: string;
  balanceDue?: number;
  registeredDate: string;
  lastUpdated?: string;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  provider: string;
  type: string;
  status: "Confirmed" | "Cancelled" | "Completed";
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadedDate: string;
  uploadedBy: string;
}

interface EnhancedPatientProfileScreenProps {
  patient: Patient;
  appointments: Appointment[];
  documents: Document[];
  onNavigate: (menu: string) => void;
  onBack: () => void;
  onBookAppointment?: (patientId: string) => void;
  onResendInvitation?: (patientId: string) => void;
  onStartAssistedIntake?: (patientId: string) => void;
  onUploadDocument?: (patientId: string) => void;
  onMarkInactive?: (patientId: string) => void;
  onLogout?: () => void;
}

type Tab = "overview" | "demographics" | "forms" | "documents" | "appointments" | "billing" | "referrals" | "spineCloud";

export function EnhancedPatientProfileScreen({
  patient,
  appointments,
  documents,
  onNavigate,
  onBack,
  onBookAppointment,
  onResendInvitation,
  onStartAssistedIntake,
  onUploadDocument,
  onMarkInactive,
  onLogout,
}: EnhancedPatientProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [activeFormsSubTab, setActiveFormsSubTab] = useState<"patientForms" | "agreements">("patientForms");
  const [kioskMode, setKioskMode] = useState<{
    active: boolean;
    type: "form" | "agreement";
    documentId: string;
    documentName: string;
  } | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [activeFilterDropdown, setActiveFilterDropdown] = useState<string | null>(null);
  
  // Search & Filter state
  const [formsSearchQuery, setFormsSearchQuery] = useState("");
  const [referralsSearchQuery, setReferralsSearchQuery] = useState("");
  const [referralsDateFrom, setReferralsDateFrom] = useState("");
  const [referralsDateTo, setReferralsDateTo] = useState("");
  const [spineCloudSearchQuery, setSpineCloudSearchQuery] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Mock Referrals
  const [referrals, setReferrals] = useState([
    { id: 'ref-1', date: '2025-10-15T10:00:00Z', notes: 'Referred to Dr. Smith for orthopedic evaluation of chronic lower back pain.' },
    { id: 'ref-2', date: '2025-11-02T14:30:00Z', notes: 'Physical therapy referral for post-surgical rehabilitation.' }
  ]);
  const [isAddingReferral, setIsAddingReferral] = useState(false);
  const [newReferralNote, setNewReferralNote] = useState("");

  // Mock available documents
  const availableDocs = [
    { id: "mdi-001", name: "Neck Pain Index (NDI)", type: "form" as const, category: "Clinical Index" },
    { id: "mdi-002", name: "Oswestry Disability Index (ODI)", type: "form" as const, category: "Clinical Index" },
    { id: "mdi-003", name: "Initial Intake Questionnaire", type: "form" as const, category: "Intake" },
    { id: "fra-001", name: "Financial Responsibility Agreement", type: "agreement" as const, category: "Legal" },
    { id: "fra-002", name: "HIPAA Privacy Policy", type: "agreement" as const, category: "Privacy" },
    { id: "fra-003", name: "Informed Consent for Treatment", type: "agreement" as const, category: "Treatment" },
  ];

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === "Confirmed" && new Date(apt.date) >= new Date()
  );
  const pastAppointments = appointments.filter(
    (apt) => apt.status === "Completed" || new Date(apt.date) < new Date()
  );

  const getStatusBadgeColor = (status: Patient["status"]) => {
    switch (status) {
      case "Active":
        return "bg-success-100 dark:bg-success-950/30 text-success-700 dark:text-success-400";
      case "Invited":
        return "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400";
      case "Draft":
        return "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400";
      case "Inactive":
        return "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400";
    }
  };

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: "overview", label: "Overview", icon: User },
    { key: "demographics", label: "Demographics", icon: MapPin },
    { key: "forms", label: "Forms & Agreements", icon: ClipboardList },
    { key: "referrals", label: "Referrals", icon: Send },
    { key: "spineCloud", label: "Wellness Index", icon: Activity },
    { key: "documents", label: "Documents", icon: FileText },
    { key: "appointments", label: "Appointments", icon: Calendar },
    { key: "billing", label: "Billing", icon: DollarSign },
  ];

  return (
    <ClinicAdminLayout
      onNavigate={onNavigate}
      currentPage="patients"
      onLogout={onLogout}
    >
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group mb-4"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to patients</span>
          </button>

          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-950/30 flex items-center justify-center shrink-0">
                <span className="text-xl font-semibold text-primary-600 dark:text-primary-400">
                  {patient.firstName[0]}
                  {patient.lastName[0]}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
                  {patient.firstName} {patient.lastName}
                </h1>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm ${getStatusBadgeColor(
                      patient.status
                    )}`}
                  >
                    {patient.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {patient.status === "Invited" && onResendInvitation && (
                <button
                  onClick={() => onResendInvitation(patient.id)}
                  className="inline-flex items-center gap-2 px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm font-medium"
                >
                  <Send className="w-4 h-4" />
                  Resend invitation
                </button>
              )}
              {onBookAppointment && (
                <button
                  onClick={() => onBookAppointment(patient.id)}
                  className="inline-flex items-center gap-2 px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  <Calendar className="w-4 h-4" />
                  Book appointment
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.key
                      ? "border-primary-600 text-primary-600 dark:text-primary-400"
                      : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* TAB 1: Overview */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Patient Identity */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide mb-4">
                    Patient Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Primary location</p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {patient.primaryLocation}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Assigned provider</p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {patient.assignedProvider || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Intake status</p>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm ${
                          patient.intakeStatus === "Complete"
                            ? "bg-success-100 dark:bg-success-950/30 text-success-700 dark:text-success-400"
                            : patient.intakeStatus === "In Progress"
                            ? "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400"
                            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                        }`}
                      >
                        {patient.intakeStatus}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Next appointment</p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {patient.nextAppointment
                          ? new Date(patient.nextAppointment).toLocaleDateString()
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Balance due</p>
                      <p
                        className={`text-sm font-medium ${
                          patient.balanceDue && patient.balanceDue > 0
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-neutral-900 dark:text-white"
                        }`}
                      >
                        ${patient.balanceDue?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide mb-4">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {onBookAppointment && (
                      <button
                        onClick={() => onBookAppointment(patient.id)}
                        className="inline-flex items-center justify-center gap-2 px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                      >
                        <Calendar className="w-4 h-4" />
                        Book appointment
                      </button>
                    )}
                    {patient.status === "Invited" && onResendInvitation && (
                      <button
                        onClick={() => onResendInvitation(patient.id)}
                        className="inline-flex items-center justify-center gap-2 px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm font-medium"
                      >
                        <Send className="w-4 h-4" />
                        Resend invitation
                      </button>
                    )}
                    {patient.intakeStatus !== "Complete" && onStartAssistedIntake && (
                      <button
                        onClick={() => onStartAssistedIntake(patient.id)}
                        className="inline-flex items-center justify-center gap-2 px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm font-medium"
                      >
                        <ClipboardList className="w-4 h-4" />
                        Complete intake
                      </button>
                    )}
                    {onUploadDocument && (
                      <button
                        onClick={() => onUploadDocument(patient.id)}
                        className="inline-flex items-center justify-center gap-2 px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm font-medium"
                      >
                        <Upload className="w-4 h-4" />
                        Upload document
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Cards */}
              <div className="space-y-4">
                {/* Intake Status Warning */}
                {patient.intakeStatus !== "Complete" && (
                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
                          Intake pending
                        </h4>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                          Patient has not completed intake questionnaires
                        </p>
                        {onStartAssistedIntake && (
                          <button
                            onClick={() => onStartAssistedIntake(patient.id)}
                            className="text-sm text-amber-700 dark:text-amber-300 font-medium hover:text-amber-900 dark:hover:text-amber-100"
                          >
                            Complete on behalf →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Insurance Warning */}
                {patient.insuranceStatus === "Missing" && (
                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
                          Insurance missing
                        </h4>
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                          No insurance information on file
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Invitation Pending */}
                {patient.status === "Invited" && (
                  <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                          Invitation pending
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                          Patient has not accepted invitation
                        </p>
                        {onResendInvitation && (
                          <button
                            onClick={() => onResendInvitation(patient.id)}
                            className="text-sm text-blue-700 dark:text-blue-300 font-medium hover:text-blue-900 dark:hover:text-blue-100"
                          >
                            Resend invitation →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Demographics & Contact */}
          {activeTab === "demographics" && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
              <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
                  Demographics & Contact Information
                </h3>
                <button className="inline-flex items-center gap-2 px-3 h-9 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm font-medium">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Date of birth</p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {new Date(patient.dateOfBirth).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Gender</p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">{patient.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Email</p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">{patient.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Phone</p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">{patient.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Address</h4>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {patient.address.street}
                    </p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {patient.address.city}, {patient.address.state} {patient.address.zip}
                    </p>
                  </div>
                </div>

                {patient.emergencyContact && (
                  <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                      Emergency Contact
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Name</p>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          {patient.emergencyContact.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Phone</p>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          {patient.emergencyContact.phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Relationship</p>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          {patient.emergencyContact.relationship}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Forms & Agreements */}
          {activeTab === "forms" && (
            <div className="space-y-6">
              {/* Sub-tabs for Forms and Agreements */}
              <div className="flex border-b border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={() => setActiveFormsSubTab("patientForms")}
                  className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeFormsSubTab === "patientForms" ? "text-primary-600 dark:text-primary-400" : "text-neutral-500 hover:text-neutral-700"}`}
                >
                  Patient Forms
                  {activeFormsSubTab === "patientForms" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />}
                </button>
                <button
                  onClick={() => setActiveFormsSubTab("agreements")}
                  className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeFormsSubTab === "agreements" ? "text-primary-600 dark:text-primary-400" : "text-neutral-500 hover:text-neutral-700"}`}
                >
                  Consent Agreements
                  {activeFormsSubTab === "agreements" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />}
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                <input
                  type="text"
                  placeholder={`Search ${activeFormsSubTab === "patientForms" ? "forms" : "agreements"}...`}
                  value={formsSearchQuery}
                  onChange={(e) => setFormsSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 outline-none"
                />
              </div>

              {activeFormsSubTab === "patientForms" ? (
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
                  <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
                        Patient Forms
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        Clinical questionnaires assigned to this patient
                      </p>
                    </div>
                    <button
                      onClick={() => setIsAssignModalOpen(true)}
                      className="inline-flex items-center gap-2 px-3 h-9 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Assign Form
                    </button>
                  </div>
                  <div className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b border-neutral-100 dark:border-neutral-800">
                          <th className="px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Form Name</th>
                          <th className="px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Assigned Date</th>
                          <th className="px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                        <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">Initial Intake Questionnaire</p>
                            <p className="text-xs text-neutral-500">General assessment</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-success-50 text-success-700 dark:bg-success-950/30 dark:text-success-400">
                              Completed
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">Oct 12, 2025</td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline">View Results</button>
                          </td>
                        </tr>
                        <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">Neck Pain Index (NDI)</p>
                            <p className="text-xs text-neutral-500">Specialized assessment</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                              Pending
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">Oct 24, 2025</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <button 
                                onClick={() => setKioskMode({
                                  active: true,
                                  type: "form",
                                  documentId: "mdi-001",
                                  documentName: "Neck Pain Index (NDI)"
                                })}
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline"
                              >
                                Fill Now
                              </button>
                              <button className="text-sm text-neutral-500 hover:text-neutral-700 font-medium hover:underline">Remind</button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
                  <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
                        Consent Agreements
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        Legal consents and policy agreements
                      </p>
                    </div>
                    <button
                      onClick={() => setIsAssignModalOpen(true)}
                      className="inline-flex items-center gap-2 px-3 h-9 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Assign Agreement
                    </button>
                  </div>
                  <div className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b border-neutral-100 dark:border-neutral-800">
                          <th className="px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Agreement</th>
                          <th className="px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Signed Date</th>
                          <th className="px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                        <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">HIPAA Privacy Policy</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-success-50 text-success-700 dark:bg-success-950/30 dark:text-success-400">
                              Signed
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">Oct 12, 2025</td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline">View PDF</button>
                          </td>
                        </tr>
                        <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">Financial Responsibility Agreement</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                              Pending
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">—</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <button 
                                onClick={() => setKioskMode({
                                  active: true,
                                  type: "agreement",
                                  documentId: "fra-001",
                                  documentName: "Financial Responsibility Agreement"
                                })}
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline"
                              >
                                Sign Now
                              </button>
                              <button className="text-sm text-neutral-500 hover:text-neutral-700 font-medium hover:underline">Remind</button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Documents */}
          {activeTab === "documents" && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
              <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
                  Documents
                </h3>
                {onUploadDocument && (
                  <button
                    onClick={() => onUploadDocument(patient.id)}
                    className="inline-flex items-center gap-2 px-3 h-9 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                  >
                    <Upload className="w-4 h-4" />
                    Upload
                  </button>
                )}
              </div>
              <div className="p-6">
                {documents.length > 0 ? (
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-neutral-400" />
                          <div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">{doc.name}</p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                              Uploaded {new Date(doc.uploadedDate).toLocaleDateString()} by {doc.uploadedBy}
                            </p>
                          </div>
                        </div>
                        <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-8">
                    No documents uploaded
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB: REFERRALS */}
          {activeTab === "referrals" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Search referrals..."
                    value={referralsSearchQuery}
                    onChange={(e) => setReferralsSearchQuery(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 outline-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                   <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-2 h-10">
                      <Calendar className="w-4 h-4 text-neutral-400" />
                      <input type="date" value={referralsDateFrom} onChange={e => setReferralsDateFrom(e.target.value)} className="bg-transparent border-none text-xs text-neutral-900 dark:text-white outline-none" />
                      <span className="text-neutral-300">to</span>
                      <input type="date" value={referralsDateTo} onChange={e => setReferralsDateTo(e.target.value)} className="bg-transparent border-none text-xs text-neutral-900 dark:text-white outline-none" />
                   </div>
                </div>
                <button onClick={() => setIsAddingReferral(true)} className="px-4 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap">
                  New Referral
                </button>
              </div>

              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400">
                    <tr>
                      <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Date</th>
                      <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Clinical Notes</th>
                      <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {referrals.map(ref => (
                      <tr key={ref.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                        <td className="px-6 py-4 text-neutral-900 dark:text-white font-medium whitespace-nowrap">
                          {new Date(ref.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400 break-words max-w-md">
                          {ref.notes}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-primary-600 hover:underline mr-4 font-medium">View</button>
                          <button className="text-neutral-600 hover:underline font-medium">Download</button>
                        </td>
                      </tr>
                    ))}
                    {referrals.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center text-neutral-500">No referrals found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: WELLNESS INDEX */}
          {activeTab === "spineCloud" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Search wellness assessments..."
                    value={spineCloudSearchQuery}
                    onChange={(e) => setSpineCloudSearchQuery(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 outline-none"
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400">
                    <tr>
                      <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Date Completed</th>
                      <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Overall Score</th>
                      <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Status</th>
                      <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium flex items-center gap-2 text-neutral-900 dark:text-white">
                        <Activity className="w-4 h-4 text-primary-500"/> 
                        Oct 12, 2025
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-success-600">84.5/100</span>
                          <div className="w-24 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                            <div className="h-full bg-success-500" style={{ width: '84.5%' }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold inline-block bg-success-50 text-success-700">Finalized</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-primary-600 dark:text-primary-400 font-medium hover:underline mr-4">Preview</button>
                        <button className="text-neutral-600 dark:text-neutral-400 font-medium hover:underline">Download</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: Appointments */}
          {activeTab === "appointments" && (
            <div className="space-y-6">
              {upcomingAppointments.length > 0 && (
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
                  <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
                      Upcoming Appointments
                    </h3>
                  </div>
                  <div className="p-6 space-y-3">
                    {upcomingAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-950/30 flex flex-col items-center justify-center">
                            <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                              {new Date(apt.date).toLocaleDateString("en-US", { month: "short" })}
                            </span>
                            <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                              {new Date(apt.date).getDate()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                              {apt.type} with {apt.provider}
                            </p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">{apt.time}</p>
                          </div>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-success-100 dark:bg-success-950/30 text-sm text-success-700 dark:text-success-400">
                          {apt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
                <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
                    Past Appointments
                  </h3>
                </div>
                <div className="p-6">
                  {pastAppointments.length > 0 ? (
                    <div className="space-y-2">
                      {pastAppointments.map((apt) => (
                        <div
                          key={apt.id}
                          className="flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg"
                        >
                          <div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">
                              {apt.type} with {apt.provider}
                            </p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                              {new Date(apt.date).toLocaleDateString()} at {apt.time}
                            </p>
                          </div>
                          <span className="text-sm text-neutral-500 dark:text-neutral-400">{apt.status}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-8">
                      No past appointments
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Billing */}
          {activeTab === "billing" && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
              <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
                  Billing Summary
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Balance due</p>
                    <p className="text-2xl font-semibold text-neutral-900 dark:text-white">
                      ${patient.balanceDue?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Insurance</p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {patient.insurance?.provider || "None"}
                    </p>
                  </div>
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Policy number</p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {patient.insurance?.policyNumber || "—"}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-8">
                  Invoice history will be displayed here
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Kiosk Mode Overlay */}
      {kioskMode?.active && (
        <KioskFormFillingScreen
          type={kioskMode.type}
          documentId={kioskMode.documentId}
          documentName={kioskMode.documentName}
          patientName={`${patient.firstName} ${patient.lastName}`}
          onClose={() => setKioskMode(null)}
          onComplete={(data) => {
            console.log("Kiosk completion data:", data);
            setKioskMode(null);
            // Refresh logic would go here
          }}
        />
      )}
      {/* Assign Document Modal */}
      <AssignDocumentModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        availableDocuments={availableDocs}
        onAssign={(data) => {
          console.log("Assigned document:", data);
          const doc = availableDocs.find(d => d.id === data.documentId);
          if (data.deliveryMethod === "kiosk" && doc) {
            setKioskMode({
              active: true,
              type: data.type,
              documentId: data.documentId,
              documentName: doc.name
            });
          } else {
            // For email/sms, we'd update a list here
            alert(`Document "${doc?.name}" has been sent via ${data.deliveryMethod.toUpperCase()}.`);
          }
        }}
      />

      {/* Referrals Modal */}
      {isAddingReferral && (
        <div className="fixed inset-0 bg-neutral-950/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl w-full max-w-lg shadow-xl overflow-hidden">
             <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-800/50">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white">Create New Referral Note</h3>
                <button onClick={() => setIsAddingReferral(false)} className="text-neutral-400 hover:text-neutral-600"><X className="w-5 h-5" /></button>
             </div>
             <div className="p-6 space-y-4">
                <div>
                   <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-2">Clinical Note / Reason for Referral</label>
                   <textarea 
                     value={newReferralNote}
                     onChange={e => setNewReferralNote(e.target.value)}
                     className="w-full h-40 p-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm outline-none focus:border-primary-500 transition-colors resize-none"
                     placeholder="Enter clinical details for the referral..."
                   />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                   <button onClick={() => setIsAddingReferral(false)} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900">Cancel</button>
                   <button 
                     onClick={() => {
                       if(!newReferralNote) return;
                       setReferrals([{ id: `ref-${Date.now()}`, date: new Date().toISOString(), notes: newReferralNote }, ...referrals]);
                       setIsAddingReferral(false);
                       setNewReferralNote("");
                     }}
                     className="px-6 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
                   >
                     Save Referral
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </ClinicAdminLayout>
  );
}
