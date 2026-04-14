import { DashboardLayout } from "@/app/components/layout/DashboardLayout";
import { SpineCloudResultsView } from "@/app/components/shared/SpineCloudResultsView";
import { ArrowLeft } from "lucide-react";

interface SpineCloudResult {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientDateOfBirth: string;
  appointmentId?: string;
  appointmentDate?: string;
  service?: string;
  provider?: string;
  completedAt: string;
  score: number;
  categoryScores: {
    neuromuscular: number;
    autonomic: number;
    structural: number;
    metabolic: number;
    cognitive: number;
  };
  responses: Record<string, number>;
}

interface SpineCloudResultsScreenProps {
  result: SpineCloudResult;
  previousResults?: SpineCloudResult[];
  onNavigate: (menu: "dashboard" | "appointments" | "profile" | "spineCloud") => void;
  onBack: () => void;
  onLogout?: () => void;
}

export function SpineCloudResultsScreen({
  result,
  previousResults,
  onNavigate,
  onBack,
  onLogout,
}: SpineCloudResultsScreenProps) {
  const handleExport = (format: "pdf" | "email" | "print") => {
    console.log(`Exporting SpineCloud results as ${format}`);
    alert(`Exporting SpineCloud Wellness Index as ${format.toUpperCase()}...`);
  };

  return (
    <DashboardLayout activeMenu="spineCloud" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        {/* Breadcrumbs */}
        <div className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 px-5 md:px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <button
                onClick={onBack}
                className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                SpineCloud Index
              </button>
              <span>/</span>
              <span className="text-neutral-900 dark:text-white font-medium">
                Assessment results
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-5 md:px-6 py-6">
          <SpineCloudResultsView
            result={result}
            previousResults={previousResults}
            onExport={handleExport}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
