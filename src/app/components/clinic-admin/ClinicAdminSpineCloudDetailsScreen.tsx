import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { ArrowLeft, Calendar, User, TrendingUp, Download, FileText } from "lucide-react";
import { SpineCloudResultsView } from "@/app/components/shared/SpineCloudResultsView";

interface ClinicAdminSpineCloudDetailsScreenProps {
  patientId: string;
  patientName: string;
  patientAge: number;
  patientDateOfBirth: string;
  onNavigate: (menu: "dashboard" | "branches" | "questionnaires" | "roles" | "users" | "providers" | "consentForms" | "patients" | "master" | "subscription" | "calendar" | "appointment-categories" | "invoices" | "payments" | "reports" | "activityLog" | "auditLog" | "rooms" | "spineCloud") => void;
  onBack: () => void;
  onLogout?: () => void;
  onNavigateToProfile?: () => void;
}

export function ClinicAdminSpineCloudDetailsScreen({
  patientId,
  patientName,
  patientAge,
  patientDateOfBirth,
  onNavigate,
  onBack,
  onLogout,
  onNavigateToProfile,
}: ClinicAdminSpineCloudDetailsScreenProps) {
  // Mock data - latest assessment for this patient
  const latestResult = {
    id: "scwi-001",
    patientId,
    patientName,
    patientAge,
    patientDateOfBirth,
    appointmentId: undefined, // Not tied to appointment anymore
    appointmentDate: undefined,
    appointmentType: undefined,
    service: undefined,
    provider: "Dr. Michael Chen",
    completedAt: "2026-02-10",
    score: 78.5,
    categoryScores: {
      neuromuscular: 80,
      autonomic: 75,
      structural: 82,
      metabolic: 76,
      cognitive: 80,
    },
    responses: {
      Q01: 1,
      Q02: 2,
      Q03: 1,
      Q04: 2,
      Q05: 2,
      Q06: 1,
      Q07: 2,
      Q08: 1,
      Q09: 1,
      Q10: 2,
      Q11: 1,
      Q12: 2,
      Q13: 2,
      Q14: 1,
      Q15: 2,
    },
  };

  // Mock data - previous assessments
  const previousResults = [
    {
      id: "scwi-002",
      patientId,
      patientName,
      patientAge,
      patientDateOfBirth,
      appointmentId: undefined,
      appointmentDate: undefined,
      provider: "Dr. Michael Chen",
      completedAt: "2026-01-15",
      score: 73.2,
      categoryScores: {
        neuromuscular: 75,
        autonomic: 70,
        structural: 78,
        metabolic: 72,
        cognitive: 71,
      },
      responses: {
        Q01: 2,
        Q02: 2,
        Q03: 1,
        Q04: 2,
        Q05: 2,
        Q06: 1,
        Q07: 2,
        Q08: 2,
        Q09: 1,
        Q10: 2,
        Q11: 1,
        Q12: 2,
        Q13: 2,
        Q14: 2,
        Q15: 2,
      },
    },
    {
      id: "scwi-003",
      patientId,
      patientName,
      patientAge,
      patientDateOfBirth,
      appointmentId: undefined,
      appointmentDate: undefined,
      appointmentType: undefined,
      provider: "Dr. Emily Rodriguez",
      completedAt: "2025-12-20",
      score: 68.5,
      categoryScores: {
        neuromuscular: 70,
        autonomic: 65,
        structural: 72,
        metabolic: 68,
        cognitive: 68,
      },
      responses: {
        Q01: 2,
        Q02: 2,
        Q03: 2,
        Q04: 2,
        Q05: 2,
        Q06: 1,
        Q07: 2,
        Q08: 2,
        Q09: 2,
        Q10: 2,
        Q11: 1,
        Q12: 2,
        Q13: 2,
        Q14: 2,
        Q15: 2,
      },
    },
  ];

  return (
    <ClinicAdminLayout
      activeMenu="spineCloud"
      onNavigate={(menu) => onNavigate(menu as any)}
      onLogout={onLogout}
      onNavigateToProfile={onNavigateToProfile}
    >
      <div className="p-6 space-y-6">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to SpineCloud Index
        </button>

        {/* Patient Header */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                {patientName}
              </h1>
              <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>{patientAge} years old</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>DOB: {new Date(patientDateOfBirth).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-semibold text-primary-600 dark:text-primary-400">
                  {previousResults.length + 1}
                </div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                  Total assessments
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1 text-2xl font-semibold text-success-600 dark:text-success-400">
                  <TrendingUp className="w-5 h-5" />
                  +{(latestResult.score - previousResults[0].score).toFixed(1)}
                </div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                  Score change
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Results */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
          <div className="border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Latest assessment results
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Completed on {new Date(latestResult.completedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
              <button
                onClick={() => {
                  // Export functionality
                  console.log("Export latest results");
                }}
                className="inline-flex items-center gap-2 px-4 h-9 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          <div className="p-6">
            <SpineCloudResultsView
              result={latestResult}
              previousResults={previousResults}
            />
          </div>
        </div>

        {/* Assessment History */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
          <div className="border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Assessment history
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Previous SpineCloud Wellness Index assessments
            </p>
          </div>

          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {previousResults.map((result, index) => (
              <div key={result.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-neutral-100 dark:bg-neutral-800 rounded-full">
                      <FileText className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Assessment #{previousResults.length - index}
                      </div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        {new Date(result.completedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        Provider
                      </div>
                      <div className="text-sm font-medium text-neutral-900 dark:text-white">
                        {result.provider}
                      </div>
                    </div>
                    <div className="bg-primary-50 dark:bg-primary-950/30 rounded-lg px-4 py-2 min-w-[80px] text-center">
                      <div className="text-2xl font-semibold text-primary-600 dark:text-primary-400">
                        {result.score.toFixed(1)}
                      </div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-400">
                        Score
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category Scores */}
                <div className="grid grid-cols-5 gap-3">
                  {Object.entries(result.categoryScores).map(([category, score]) => (
                    <div key={category} className="text-center">
                      <div className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                        {score}
                      </div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-400 capitalize">
                        {category}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ClinicAdminLayout>
  );
}
