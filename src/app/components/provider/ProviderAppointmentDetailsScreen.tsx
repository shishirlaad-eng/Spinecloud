import { useState } from "react";
import { ProviderLayout } from "./layout/ProviderLayout";
import {
  Calendar,
  Clock,
  MapPin,
  Stethoscope,
  User,
  FileText,
  ClipboardList,
  Activity,
  Image as ImageIcon,
  ChevronRight,
  FileCheck,
  Download,
  FileDown,
} from "lucide-react";
import { QuestionnaireResponsesContent } from "./QuestionnaireResponsesContent";
import { ReferralsTabContent } from "./ReferralsTabContent";
import {
  exportSOAPReport,
  exportPARTReport,
  exportImagingReport,
  exportCombinedReport,
} from "@/utils/exportClinicalReports";
import type { SOAPCategory } from "@/app/components/clinic-admin/soap-master/SOAPMasterScreen";

interface AppointmentDetails {
  id: string;
  service: string;
  date: string;
  time: string;
  status: "Confirmed" | "Completed" | "Cancelled";
  location: string;
  provider: string;
  completedAt?: string;
  patient: {
    id: string;
    name: string;
    dateOfBirth: string;
    gender: string;
    email: string;
    phone: string;
  };
}

interface ProviderAppointmentDetailsScreenProps {
  appointment: AppointmentDetails;
  onNavigate: (menu: "dashboard" | "calendar" | "patients" | "spineCloud" | "leaves") => void;
  onBackToPatient: () => void;
  onCompleteSession?: (appointmentId: string) => void;
  onLogout?: () => void;
  soapCategories?: SOAPCategory[]; // Add SOAP Master categories
}

export function ProviderAppointmentDetailsScreen({
  appointment,
  onNavigate,
  onBackToPatient,
  onCompleteSession,
  onLogout,
  soapCategories = [], // Default to empty array
}: ProviderAppointmentDetailsScreenProps) {
  const [activeTab, setActiveTab] = useState<"questionnaire" | "reference">("questionnaire");
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  // Download handlers
  const handleDownloadSOAP = () => {
    const savedSOAP = localStorage.getItem(`soapNote_${appointment.id}`);
    if (savedSOAP) {
      const soapNote = JSON.parse(savedSOAP);
      exportSOAPReport(
        soapNote,
        {
          name: appointment.patient.name,
          dateOfBirth: appointment.patient.dateOfBirth,
          gender: appointment.patient.gender,
        },
        {
          date: appointment.date,
          time: appointment.time,
          service: appointment.service,
          location: appointment.location,
          provider: appointment.provider,
        }
      );
    }
    setShowDownloadMenu(false);
  };

  const handleDownloadPART = () => {
    const savedPART = localStorage.getItem(`partNote_${appointment.id}`);
    if (savedPART) {
      const partNote = JSON.parse(savedPART);
      exportPARTReport(
        partNote,
        {
          name: appointment.patient.name,
          dateOfBirth: appointment.patient.dateOfBirth,
          gender: appointment.patient.gender,
        },
        {
          date: appointment.date,
          time: appointment.time,
          service: appointment.service,
          location: appointment.location,
          provider: appointment.provider,
        }
      );
    }
    setShowDownloadMenu(false);
  };

  const handleDownloadImaging = () => {
    const savedImaging = localStorage.getItem(`imaging_${appointment.id}`);
    if (savedImaging) {
      const imagingData = JSON.parse(savedImaging);
      exportImagingReport(
        imagingData,
        {
          name: appointment.patient.name,
          dateOfBirth: appointment.patient.dateOfBirth,
          gender: appointment.patient.gender,
        },
        {
          date: appointment.date,
          time: appointment.time,
          service: appointment.service,
          location: appointment.location,
          provider: appointment.provider,
        }
      );
    }
    setShowDownloadMenu(false);
  };

  const handleDownloadCombined = () => {
    const savedSOAP = localStorage.getItem(`soapNote_${appointment.id}`);
    const savedPART = localStorage.getItem(`partNote_${appointment.id}`);
    const savedImaging = localStorage.getItem(`imaging_${appointment.id}`);

    const soapNote = savedSOAP ? JSON.parse(savedSOAP) : null;
    const partNote = savedPART ? JSON.parse(savedPART) : null;
    const imagingData = savedImaging ? JSON.parse(savedImaging) : null;

    exportCombinedReport(
      soapNote,
      partNote,
      imagingData,
      {
        name: appointment.patient.name,
        dateOfBirth: appointment.patient.dateOfBirth,
        gender: appointment.patient.gender,
      },
      {
        date: appointment.date,
        time: appointment.time,
        service: appointment.service,
        location: appointment.location,
        provider: appointment.provider,
      }
    );
    setShowDownloadMenu(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-950/30 dark:text-primary-400 dark:border-primary-800";
      case "Completed":
        return "bg-success-50 text-success-700 border-success-200 dark:bg-success-950/30 dark:text-success-400 dark:border-success-800";
      case "Cancelled":
        return "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700";
      default:
        return "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getGenderDisplay = (gender: string) => {
    switch (gender) {
      case "male":
        return "Male";
      case "female":
        return "Female";
      case "other":
        return "Other";
      case "prefer-not-to-say":
        return "Prefer not to say";
      default:
        return gender;
    }
  };

  return (
    <ProviderLayout activeMenu="patients" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6 space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
          <button
            onClick={() => onNavigate("patients")}
            className="hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Patients
          </button>
          <ChevronRight className="w-4 h-4" />
          <button
            onClick={onBackToPatient}
            className="hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            {appointment.patient.name}
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-neutral-900 dark:text-white font-medium">
            Appointment details
          </span>
        </nav>

        {/* Appointment & Patient Info Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Appointment Information */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  {appointment.service}
                </h2>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    appointment.status
                  )}`}
                >
                  {appointment.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">Date:</span>
                    <span className="ml-2 font-medium text-neutral-900 dark:text-white">
                      {formatDate(appointment.date)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">Time:</span>
                    <span className="ml-2 font-medium text-neutral-900 dark:text-white">
                      {appointment.time}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">Location:</span>
                    <span className="ml-2 font-medium text-neutral-900 dark:text-white">
                      {appointment.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Stethoscope className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">Provider:</span>
                    <span className="ml-2 font-medium text-neutral-900 dark:text-white">
                      {appointment.provider}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Information */}
            <div className="border-l border-neutral-200 dark:border-neutral-800 pl-8">
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide mb-4">
                Patient information
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">Name:</span>
                    <span className="ml-2 font-medium text-neutral-900 dark:text-white">
                      {appointment.patient.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-neutral-500 dark:text-neutral-400 mt-0.5" />
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">Date of birth:</span>
                    <span className="ml-2 font-medium text-neutral-900 dark:text-white">
                      {formatDate(appointment.patient.dateOfBirth)}
                    </span>
                    <span className="ml-2 text-neutral-500 dark:text-neutral-400">
                      ({calculateAge(appointment.patient.dateOfBirth)} years old)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">Gender:</span>
                    <span className="ml-2 font-medium text-neutral-900 dark:text-white">
                      {getGenderDisplay(appointment.patient.gender)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Positioned at bottom right of card */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
            {/* Download Button - Only for Completed Sessions */}
            {appointment.status === "Completed" && (
              <>
                <button
                  onClick={() => setShowDownloadMenu(true)}
                  className="inline-flex items-center gap-2 px-4 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium text-sm whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  Download reports
                </button>
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <Clock className="w-4 h-4" />
                  <div>
                    <span className="text-neutral-500 dark:text-neutral-500">Completed:</span>
                    <span className="ml-1.5 font-medium text-neutral-900 dark:text-white">
                      {appointment.completedAt ? (
                        <>
                          {new Date(appointment.completedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          at{" "}
                          {new Date(appointment.completedAt).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </>
                      ) : (
                        <>
                          {new Date(appointment.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          at {appointment.time.split(" - ")[1]}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Tabs Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <div className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveTab("questionnaire")}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                    activeTab === "questionnaire"
                      ? "border-primary-600 text-primary-600 dark:text-primary-400"
                      : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Questionnaire
                </button>


                <button
                  onClick={() => setActiveTab("reference")}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                    activeTab === "reference"
                      ? "border-primary-600 text-primary-600 dark:text-primary-400"
                      : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  <FileCheck className="w-4 h-4" />
                  Reference
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "questionnaire" && (
              <div>
                <QuestionnaireResponsesContent
                  appointmentId={appointment.id}
                  patientName={appointment.patient.name}
                  appointmentDate={appointment.date}
                />
              </div>
            )}



            {activeTab === "reference" && (
              <div>
                <ReferralsTabContent
                  appointmentId={appointment.id}
                  patientName={appointment.patient.name}
                  appointmentDate={appointment.date}
                  providerName={appointment.provider}
                />
              </div>
            )}
          </div>
        </div>
      </div>



      {/* Download Menu */}
      {showDownloadMenu && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg w-full max-w-md">
            <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Download reports
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Choose which report to download
              </p>
            </div>
            <div className="p-5 space-y-3">
              <button
                onClick={handleDownloadSOAP}
                className="w-full inline-flex items-center gap-3 px-4 h-10 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-900 dark:text-white rounded-lg transition-colors text-left"
              >
                <FileDown className="w-4 h-4 text-neutral-500" />
                <span>SOAP notes</span>
              </button>
              <button
                onClick={handleDownloadPART}
                className="w-full inline-flex items-center gap-3 px-4 h-10 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-900 dark:text-white rounded-lg transition-colors text-left"
              >
                <FileDown className="w-4 h-4 text-neutral-500" />
                <span>P.A.R.T. notes</span>
              </button>
              <button
                onClick={handleDownloadImaging}
                className="w-full inline-flex items-center gap-3 px-4 h-10 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-900 dark:text-white rounded-lg transition-colors text-left"
              >
                <FileDown className="w-4 h-4 text-neutral-500" />
                <span>Imaging report</span>
              </button>
              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={handleDownloadCombined}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download combined report
                </button>
              </div>
            </div>
            <div className="px-5 pb-5 flex gap-3 justify-end">
              <button
                onClick={() => setShowDownloadMenu(false)}
                className="px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </ProviderLayout>
  );
}