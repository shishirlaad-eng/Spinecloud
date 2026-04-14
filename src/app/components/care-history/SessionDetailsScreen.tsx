import { DashboardLayout } from "@/app/components/layout/DashboardLayout";
import { Calendar, Clock, MapPin, User, FileText, Download, Eye } from "lucide-react";

interface SessionImage {
  id: string;
  filename: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
}

interface SessionData {
  id: string;
  date: string;
  time: string;
  provider: string;
  clinic: string;
  clinicAddress: string;
  status: "Completed";
  // P.A.R.T. Summary
  partSummary: {
    pain: string;
    activity: string;
    range: string;
    treatment: string;
  };
  // Medical Imaging
  images: SessionImage[];
  // Provider Notes (limited visibility)
  providerNotes?: string;
}

interface SessionDetailsScreenProps {
  session: SessionData;
  onNavigate: (menu: "dashboard" | "appointments" | "careHistory") => void;
  onBack: () => void;
  onLogout?: () => void;
}

export function SessionDetailsScreen({
  session,
  onNavigate,
  onBack,
  onLogout,
}: SessionDetailsScreenProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  };

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) {
      return "📄";
    } else if (type.includes("dicom")) {
      return "🏥";
    } else {
      return "🖼️";
    }
  };

  return (
    <DashboardLayout activeMenu="dashboard" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-5 md:p-6">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <button
              onClick={onBack}
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Care history
            </button>
            <span>/</span>
            <span className="text-neutral-900 dark:text-white font-medium">
              Session details
            </span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          {/* Session Overview Card */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Session overview
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Session details and clinical summary
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date & Time */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 flex-shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium mb-1">
                      Date & time
                    </p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {formatDate(session.date)}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                      {session.time}
                    </p>
                  </div>
                </div>

                {/* Provider */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 flex-shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium mb-1">
                      Provider
                    </p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {session.provider}
                    </p>
                  </div>
                </div>

                {/* Clinic Location */}
                <div className="flex items-start gap-3 md:col-span-2">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium mb-1">
                      Clinic location
                    </p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {session.clinic}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      {session.clinicAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* P.A.R.T. Clinical Summary Card */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-primary-50 dark:bg-primary-950/30">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h3 className="text-sm font-semibold text-primary-700 dark:text-primary-400">
                  Clinical summary (P.A.R.T.)
                </h3>
              </div>
              <p className="text-sm text-primary-600 dark:text-primary-300 mt-1">
                This is a summary of your session prepared by your provider
              </p>
            </div>

            <div className="p-6 space-y-5">
              {/* Pain */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Pain assessment
                </h4>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  {session.partSummary.pain}
                </p>
              </div>

              {/* Activity */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Activity level
                </h4>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  {session.partSummary.activity}
                </p>
              </div>

              {/* Range of Motion */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Range of motion
                </h4>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  {session.partSummary.range}
                </p>
              </div>

              {/* Treatment */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Treatment performed
                </h4>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  {session.partSummary.treatment}
                </p>
              </div>
            </div>
          </div>

          {/* Medical Imaging Card */}
          {session.images.length > 0 && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
              <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Medical imaging
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Images uploaded by your provider
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-3">
                  {session.images.map((image) => (
                    <div
                      key={image.id}
                      className="flex items-center justify-between gap-4 p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="text-2xl">{getFileIcon(image.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                            {image.filename}
                          </p>
                          <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            <span>{formatFileSize(image.size)}</span>
                            <span>•</span>
                            <span>Uploaded by {image.uploadedBy}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 rounded-lg transition-colors"
                          aria-label="View image"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 rounded-lg transition-colors"
                          aria-label="Download image"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Provider Notes Card (if available) */}
          {session.providerNotes && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
              <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Provider notes
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Additional notes from your provider
                </p>
              </div>

              <div className="p-6">
                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {session.providerNotes}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}