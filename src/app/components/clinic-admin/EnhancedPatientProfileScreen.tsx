import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { ArrowLeft, Calendar, Mail, Phone, MapPin, User, FileText, ClipboardList, Upload, DollarSign, Edit, Send, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useState } from "react";

interface Patient {
  id: string;
  patientId: string;
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

type Tab = "overview" | "demographics" | "intake" | "documents" | "appointments" | "billing";

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
    { key: "demographics", label: "Demographics & Contact", icon: MapPin },
    { key: "intake", label: "Intake & Consents", icon: ClipboardList },
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
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    ID: {patient.patientId}
                  </span>
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

          {/* TAB 3: Intake & Consents */}
          {activeTab === "intake" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
                <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
                    Intake Progress
                  </h3>
                  {patient.intakeStatus !== "Complete" && onStartAssistedIntake && (
                    <button
                      onClick={() => onStartAssistedIntake(patient.id)}
                      className="inline-flex items-center gap-2 px-3 h-9 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                    >
                      <ClipboardList className="w-4 h-4" />
                      Complete on behalf
                    </button>
                  )}
                </div>
                <div className="p-6">
                  {patient.intakeStatus === "Complete" ? (
                    <div className="flex items-center gap-3 p-4 bg-success-50 dark:bg-success-950/30 border border-success-200 dark:border-success-800 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-success-600 dark:text-success-400" />
                      <div>
                        <p className="text-sm font-medium text-success-900 dark:text-success-100">
                          Intake completed
                        </p>
                        <p className="text-sm text-success-700 dark:text-success-300">
                          All questionnaires and consents collected
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      <div>
                        <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                          Intake {patient.intakeStatus.toLowerCase()}
                        </p>
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                          Patient needs to complete questionnaires
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
                <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
                    Consent Forms
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-8">
                    Consent information will be displayed here
                  </p>
                </div>
              </div>
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
    </ClinicAdminLayout>
  );
}
