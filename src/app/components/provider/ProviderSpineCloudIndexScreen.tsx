import { ProviderLayout } from "./layout/ProviderLayout";
import { useState } from "react";
import { Search, Filter, TrendingUp, TrendingDown, Minus, Calendar, User, ChevronRight } from "lucide-react";

interface SpineCloudAssessment {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  completedDate: string;
  score: number;
  previousScore?: number;
  trend: "up" | "down" | "stable";
}

interface ProviderSpineCloudIndexScreenProps {
  onNavigate: (menu: "dashboard" | "calendar" | "patients" | "spineCloud" | "leaves") => void;
  onViewDetails: (patientId: string) => void;
  onLogout?: () => void;
}

export function ProviderSpineCloudIndexScreen({
  onNavigate,
  onViewDetails,
  onLogout,
}: ProviderSpineCloudIndexScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "score" | "name">("recent");
  const [filterTrend, setFilterTrend] = useState<"all" | "up" | "down" | "stable">("all");

  // Mock data - provider's patients' SpineCloud assessments
  const mockAssessments: SpineCloudAssessment[] = [
    {
      id: "assessment-1",
      patientId: "patient-1",
      patientName: "Sarah Johnson",
      patientAge: 42,
      completedDate: "2026-02-10",
      score: 78.5,
      previousScore: 73.2,
      trend: "up",
    },
    {
      id: "assessment-2",
      patientId: "patient-3",
      patientName: "Jennifer Davis",
      patientAge: 38,
      completedDate: "2026-02-08",
      score: 82.0,
      previousScore: 81.8,
      trend: "stable",
    },
    {
      id: "assessment-3",
      patientId: "patient-5",
      patientName: "Lisa Anderson",
      patientAge: 29,
      completedDate: "2026-02-06",
      score: 88.2,
      previousScore: 85.5,
      trend: "up",
    },
    {
      id: "assessment-4",
      patientId: "patient-7",
      patientName: "John Smith",
      patientAge: 51,
      completedDate: "2026-02-04",
      score: 75.5,
      previousScore: 78.0,
      trend: "down",
    },
    {
      id: "assessment-5",
      patientId: "patient-8",
      patientName: "Emily White",
      patientAge: 35,
      completedDate: "2026-02-02",
      score: 80.8,
      previousScore: 79.5,
      trend: "stable",
    },
  ];

  // Filter and sort assessments
  const filteredAssessments = mockAssessments
    .filter((assessment) => {
      const matchesSearch = assessment.patientName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTrend = filterTrend === "all" || assessment.trend === filterTrend;
      return matchesSearch && matchesTrend;
    })
    .sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime();
      } else if (sortBy === "score") {
        return b.score - a.score;
      } else {
        return a.patientName.localeCompare(b.patientName);
      }
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success-600 dark:text-success-400";
    if (score >= 60) return "text-primary-600 dark:text-primary-400";
    return "text-destructive dark:text-red-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-success-50 dark:bg-success-950/30";
    if (score >= 60) return "bg-primary-50 dark:bg-primary-950/30";
    return "bg-destructive/10 dark:bg-red-950/30";
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    if (trend === "up") return <TrendingUp className="w-4 h-4 text-success-600 dark:text-success-400" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4 text-destructive dark:text-red-400" />;
    return <Minus className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />;
  };

  const getTrendText = (assessment: SpineCloudAssessment) => {
    if (!assessment.previousScore) return "First assessment";
    const diff = assessment.score - assessment.previousScore;
    if (Math.abs(diff) < 2) return "No change";
    return `${diff > 0 ? "+" : ""}${diff.toFixed(1)} points`;
  };

  return (
    <ProviderLayout
      activeMenu="spineCloud"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
            SpineCloud Wellness Index
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            View and track your patients' wellness assessments
          </p>
        </div>

        {/* Filters & Search */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by patient name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
            />
          </div>

          {/* Sort & Filter */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              <span className="text-sm text-neutral-600 dark:text-neutral-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "recent" | "score" | "name")}
                className="h-9 px-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
              >
                <option value="recent">Most recent</option>
                <option value="score">Highest score</option>
                <option value="name">Patient name</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">Trend:</span>
              <select
                value={filterTrend}
                onChange={(e) => setFilterTrend(e.target.value as "all" | "up" | "down" | "stable")}
                className="h-9 px-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
              >
                <option value="all">All trends</option>
                <option value="up">Improving</option>
                <option value="down">Declining</option>
                <option value="stable">Stable</option>
              </select>
            </div>
          </div>
        </div>

        {/* Assessments List */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
          {filteredAssessments.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-4">
                <Search className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                No assessments found
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {filteredAssessments.map((assessment) => (
                <button
                  key={assessment.id}
                  onClick={() => onViewDetails(assessment.patientId)}
                  className="w-full p-6 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-left"
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Patient Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {assessment.patientName}
                        </h3>
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">
                          {assessment.patientAge} years old
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(assessment.completedDate)}</span>
                      </div>
                    </div>

                    {/* Score & Trend */}
                    <div className="flex items-center gap-4">
                      {/* Trend */}
                      <div className="flex items-center gap-2">
                        {getTrendIcon(assessment.trend)}
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {getTrendText(assessment)}
                        </span>
                      </div>

                      {/* Score */}
                      <div className={`${getScoreBgColor(assessment.score)} rounded-lg px-4 py-2 min-w-[80px] text-center`}>
                        <div className={`text-2xl font-semibold ${getScoreColor(assessment.score)}`}>
                          {assessment.score.toFixed(1)}
                        </div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400">
                          Score
                        </div>
                      </div>

                      {/* Arrow */}
                      <ChevronRight className="w-5 h-5 text-neutral-400" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProviderLayout>
  );
}