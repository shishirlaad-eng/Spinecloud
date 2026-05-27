import { useState } from "react";
import { DashboardLayout } from "@/app/components/layout/DashboardLayout";
import { Activity, Plus, TrendingUp, TrendingDown, Calendar, Eye } from "lucide-react";

interface SpineCloudIntake {
  id: string;
  completedAt: string;
  score: number;
  previousScore?: number;
  categoryScores: {
    neuromuscular: number;
    autonomic: number;
    structural: number;
    metabolic: number;
    cognitive: number;
  };
}

interface PatientSpineCloudIndexScreenProps {
  intakes: SpineCloudIntake[];
  onNavigate: (menu: "dashboard" | "appointments" | "profile" | "spineCloud") => void;
  onStartNewIntake: () => void;
  onViewResults: (intakeId: string) => void;
  onLogout?: () => void;
}

function getScoreCategory(score: number): {
  label: string;
  color: string;
  bgColor: string;
} {
  if (score >= 81)
    return {
      label: "Optimal Vitality",
      color: "text-primary-700 dark:text-primary-400",
      bgColor: "bg-primary-50 dark:bg-primary-950/30",
    };
  if (score >= 61)
    return {
      label: "Robust Health",
      color: "text-success-700 dark:text-success-400",
      bgColor: "bg-success-50 dark:bg-success-950/30",
    };
  if (score >= 41)
    return {
      label: "Sub-Optimal Function",
      color: "text-yellow-700 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
    };
  if (score >= 21)
    return {
      label: "Significant Impairment",
      color: "text-orange-700 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
    };
  return {
    label: "Critical Dysfunction",
    color: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/30",
  };
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function PatientSpineCloudIndexScreen({
  intakes,
  onNavigate,
  onStartNewIntake,
  onViewResults,
  onLogout,
}: PatientSpineCloudIndexScreenProps) {
  const [sortBy, setSortBy] = useState<"recent" | "score">("recent");

  const sortedIntakes = [...intakes].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
    } else {
      return b.score - a.score;
    }
  });

  return (
    <DashboardLayout activeMenu="spineCloud" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        {/* Header */}
        <div className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
          <div className="max-w-7xl mx-auto px-5 md:px-6 py-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                  SpineCloud Wellness Index
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Track your wellness journey with comprehensive health assessments
                </p>
              </div>
              <button
                onClick={onStartNewIntake}
                className="inline-flex items-center gap-2 h-10 px-6 bg-[#1d77b4] text-white rounded-lg hover:opacity-90 transition-colors font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                Take new assessment
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-5 md:px-6 py-6">
          {intakes.length > 0 ? (
            <div className="space-y-6">
              {/* Sort Controls */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Sort by:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortBy("recent")}
                    className={`px-4 h-9 rounded-lg text-sm font-medium transition-colors ${
                      sortBy === "recent"
                        ? "bg-[#1d77b4] text-white"
                        : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    }`}
                  >
                    Most recent
                  </button>
                  <button
                    onClick={() => setSortBy("score")}
                    className={`px-4 h-9 rounded-lg text-sm font-medium transition-colors ${
                      sortBy === "score"
                        ? "bg-[#1d77b4] text-white"
                        : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    }`}
                  >
                    Highest score
                  </button>
                </div>
              </div>

              {/* Intakes List */}
              <div className="grid grid-cols-1 gap-4">
                {sortedIntakes.map((intake) => {
                  const category = getScoreCategory(intake.score);
                  const scoreDiff = intake.previousScore
                    ? intake.score - intake.previousScore
                    : null;

                  return (
                    <div
                      key={intake.id}
                      className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-6">
                        {/* Left Side - Date and Score */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Calendar className="w-4 h-4 text-neutral-400" />
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">
                              {formatDate(intake.completedAt)}
                            </span>
                          </div>

                          {/* Overall Score */}
                          <div className="flex items-center gap-4 mb-4">
                            <div>
                              <div className="text-4xl font-semibold text-neutral-900 dark:text-white">
                                {intake.score.toFixed(1)}
                              </div>
                              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                Out of 100
                              </div>
                            </div>

                            {/* Score Change */}
                            {scoreDiff !== null && (
                              <div className="flex items-center gap-2">
                                {scoreDiff > 0 ? (
                                  <>
                                    <TrendingUp className="w-5 h-5 text-success-600 dark:text-success-400" />
                                    <span className="text-sm font-medium text-success-700 dark:text-success-400">
                                      +{scoreDiff.toFixed(1)} from last
                                    </span>
                                  </>
                                ) : scoreDiff < 0 ? (
                                  <>
                                    <TrendingDown className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                    <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
                                      {scoreDiff.toFixed(1)} from last
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                                    No change
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Category Badge */}
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${category.bgColor} border border-neutral-200 dark:border-neutral-800`}
                          >
                            <Activity className={`w-4 h-4 ${category.color}`} />
                            <span className={`text-sm font-medium ${category.color}`}>
                              {category.label}
                            </span>
                          </div>

                          {/* Category Scores */}
                          <div className="grid grid-cols-5 gap-3 mt-4">
                            {Object.entries(intake.categoryScores).map(([key, value]) => {
                              const labels: Record<string, string> = {
                                neuromuscular: "Neuromuscular",
                                autonomic: "Autonomic",
                                structural: "Structural",
                                metabolic: "Metabolic",
                                cognitive: "Cognitive",
                              };
                              return (
                                <div key={key} className="text-center">
                                  <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                                    {value}
                                  </div>
                                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                    {labels[key]}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Right Side - Action Button */}
                        <button
                          onClick={() => onViewResults(intake.id)}
                          className="inline-flex items-center gap-2 h-10 px-4 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          View details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-12 text-center">
              <Activity className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                No assessments yet
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
                Take your first SpineCloud Wellness Index assessment to establish your baseline
                and track your progress over time
              </p>
              <button
                onClick={onStartNewIntake}
                className="inline-flex items-center gap-2 h-10 px-6 bg-[#1d77b4] text-white rounded-lg hover:opacity-90 transition-colors font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                Take your first assessment
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
