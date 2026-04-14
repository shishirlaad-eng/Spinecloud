import { Download, Mail, Printer, TrendingUp, Calendar, User } from "lucide-react";

interface SpineCloudResult {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientDateOfBirth: string;
  appointmentId: string;
  appointmentDate: string;
  service: string;
  provider: string;
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

interface SpineCloudResultsViewProps {
  result: SpineCloudResult;
  previousResults?: SpineCloudResult[];
  onExport?: (format: "pdf" | "email" | "print") => void;
}

function getScoreCategory(score: number): {
  label: string;
  color: string;
  bgColor: string;
  description: string;
} {
  if (score >= 81)
    return {
      label: "Optimal Vitality",
      color: "text-primary-700 dark:text-primary-400",
      bgColor: "bg-primary-50 dark:bg-primary-950/30",
      description: "Peak Performance - Excellent functional capacity",
    };
  if (score >= 61)
    return {
      label: "Robust Health",
      color: "text-success-700 dark:text-success-400",
      bgColor: "bg-success-50 dark:bg-success-950/30",
      description: "Wellness/Maintenance - Good overall function",
    };
  if (score >= 41)
    return {
      label: "Sub-Optimal Function",
      color: "text-yellow-700 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
      description: "Functional Transition - Room for improvement",
    };
  if (score >= 21)
    return {
      label: "Significant Impairment",
      color: "text-orange-700 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
      description: "Corrective Care - Requires focused intervention",
    };
  return {
    label: "Critical Dysfunction",
    color: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    description: "Crisis Care - Immediate attention needed",
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

// SVG Spider/Radar Chart Component
function SpiderChart({
  categoryScores,
  previousScores,
}: {
  categoryScores: Record<string, number>;
  previousScores?: Record<string, number>;
}) {
  const categories = [
    { key: "neuromuscular", label: "Neuromuscular\nIntegration", angle: 0 },
    { key: "autonomic", label: "Autonomic\nRegulation", angle: 72 },
    { key: "structural", label: "Structural\nIntegrity", angle: 144 },
    { key: "metabolic", label: "Metabolic\nResilience", angle: 216 },
    { key: "cognitive", label: "Cognitive\nVitality", angle: 288 },
  ];

  const centerX = 200;
  const centerY = 200;
  const maxRadius = 150;
  const rings = [20, 40, 60, 80, 100];

  // Calculate point position
  const getPoint = (angle: number, value: number) => {
    const radians = ((angle - 90) * Math.PI) / 180;
    const radius = (value / 100) * maxRadius;
    return {
      x: centerX + radius * Math.cos(radians),
      y: centerY + radius * Math.sin(radians),
    };
  };

  // Create path for current scores
  const currentPath = categories
    .map((cat, i) => {
      const point = getPoint(cat.angle, categoryScores[cat.key] || 0);
      return `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`;
    })
    .join(" ") + " Z";

  // Create path for previous scores if available
  const previousPath = previousScores
    ? categories
        .map((cat, i) => {
          const point = getPoint(cat.angle, previousScores[cat.key] || 0);
          return `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`;
        })
        .join(" ") + " Z"
    : null;

  return (
    <svg viewBox="0 0 400 400" className="w-full h-full">
      {/* Background rings */}
      {rings.map((ring) => (
        <circle
          key={ring}
          cx={centerX}
          cy={centerY}
          r={(ring / 100) * maxRadius}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-neutral-200 dark:text-neutral-700"
        />
      ))}

      {/* Axis lines */}
      {categories.map((cat) => {
        const endPoint = getPoint(cat.angle, 100);
        return (
          <line
            key={cat.key}
            x1={centerX}
            y1={centerY}
            x2={endPoint.x}
            y2={endPoint.y}
            stroke="currentColor"
            strokeWidth="1"
            className="text-neutral-200 dark:text-neutral-700"
          />
        );
      })}

      {/* Ring labels */}
      {rings.map((ring) => (
        <text
          key={ring}
          x={centerX + 5}
          y={centerY - (ring / 100) * maxRadius}
          fontSize="10"
          fill="currentColor"
          className="text-neutral-400 dark:text-neutral-600"
        >
          {ring}
        </text>
      ))}

      {/* Previous scores (if available) - Red fill */}
      {previousPath && (
        <path
          d={previousPath}
          fill="rgba(239, 68, 68, 0.2)"
          stroke="rgb(239, 68, 68)"
          strokeWidth="2"
        />
      )}

      {/* Current scores - Green fill */}
      <path
        d={currentPath}
        fill="rgba(16, 185, 129, 0.3)"
        stroke="rgb(16, 185, 129)"
        strokeWidth="2"
      />

      {/* Category labels */}
      {categories.map((cat) => {
        const labelPoint = getPoint(cat.angle, 115);
        const lines = cat.label.split("\n");
        return (
          <text
            key={cat.key}
            x={labelPoint.x}
            y={labelPoint.y}
            fontSize="12"
            fontWeight="600"
            fill="currentColor"
            textAnchor="middle"
            className="text-neutral-700 dark:text-neutral-300"
          >
            {lines.map((line, i) => (
              <tspan key={i} x={labelPoint.x} dy={i === 0 ? 0 : 14}>
                {line}
              </tspan>
            ))}
          </text>
        );
      })}
    </svg>
  );
}

export function SpineCloudResultsView({
  result,
  previousResults,
  onExport,
}: SpineCloudResultsViewProps) {
  const scoreCategory = getScoreCategory(result.score);
  const previousResult = previousResults && previousResults.length > 0 ? previousResults[0] : undefined;
  const scoreChange = previousResult ? result.score - previousResult.score : null;

  return (
    <div className="space-y-6">
      {/* Header with Export Options */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
            SpineCloud Wellness Index Results
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Completed on {formatDate(result.completedAt)}
          </p>
        </div>

        {onExport && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onExport("email")}
              className="inline-flex items-center gap-2 h-9 px-4 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium transition-colors text-sm"
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
            <button
              onClick={() => onExport("print")}
              className="inline-flex items-center gap-2 h-9 px-4 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium transition-colors text-sm"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={() => onExport("pdf")}
              className="inline-flex items-center gap-2 h-9 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        )}
      </div>

      {/* Patient & Appointment Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Patient Information
            </h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">Name:</span>
              <span className="font-medium text-neutral-900 dark:text-white">
                {result.patientName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">Age:</span>
              <span className="font-medium text-neutral-900 dark:text-white">
                {result.patientAge} years
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">Date of Birth:</span>
              <span className="font-medium text-neutral-900 dark:text-white">
                {formatDate(result.patientDateOfBirth)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Appointment Details
            </h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">Appointment:</span>
              <span className="font-medium text-neutral-900 dark:text-white">
                {result.service}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">Date:</span>
              <span className="font-medium text-neutral-900 dark:text-white">
                {formatDate(result.appointmentDate)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">Provider:</span>
              <span className="font-medium text-neutral-900 dark:text-white">
                {result.provider}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Score */}
      <div className={`${scoreCategory.bgColor} border border-current rounded-xl p-6`}>
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className={`text-sm font-semibold ${scoreCategory.color}`}>
                Overall Wellness Score
              </h3>
              {scoreChange !== null && (
                <div
                  className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                    scoreChange > 0
                      ? "bg-success-100 text-success-700 dark:bg-success-950/50 dark:text-success-400"
                      : scoreChange < 0
                      ? "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                      : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"
                  }`}
                >
                  <TrendingUp className="w-3 h-3" />
                  {scoreChange > 0 ? "+" : ""}
                  {scoreChange.toFixed(1)}
                </div>
              )}
            </div>
            <div className={`text-4xl font-bold ${scoreCategory.color} mb-2`}>
              {result.score.toFixed(1)}
              <span className="text-2xl">/100</span>
            </div>
            <div className={`text-lg font-semibold ${scoreCategory.color} mb-2`}>
              {scoreCategory.label}
            </div>
            <p className={`text-sm ${scoreCategory.color}`}>
              {scoreCategory.description}
            </p>
          </div>
        </div>
      </div>

      {/* Spider Graph */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-6">
          Functional Domain Analysis
        </h3>
        <div className="max-w-2xl mx-auto">
          <SpiderChart
            categoryScores={result.categoryScores}
            previousScores={previousResult?.categoryScores}
          />
        </div>
        <div className="mt-6 flex items-center justify-center gap-6 text-sm">
          {previousResult && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-neutral-600 dark:text-neutral-400">
                Previous ({formatDate(previousResult.completedAt)})
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-success-500 rounded"></div>
            <span className="text-neutral-600 dark:text-neutral-400">
              Current ({formatDate(result.completedAt)})
            </span>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
          Category Scores
        </h3>
        <div className="space-y-4">
          {Object.entries(result.categoryScores).map(([key, score]) => {
            const previousScore = previousResult?.categoryScores[key as keyof typeof result.categoryScores];
            const change = previousScore ? score - previousScore : null;
            const categoryLabels: Record<string, string> = {
              neuromuscular: "Neuromuscular Integration",
              autonomic: "Autonomic Regulation",
              structural: "Structural Integrity",
              metabolic: "Metabolic Resilience",
              cognitive: "Cognitive Vitality",
            };

            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-neutral-900 dark:text-white">
                    {categoryLabels[key]}
                  </span>
                  <div className="flex items-center gap-2">
                    {change !== null && change !== 0 && (
                      <span
                        className={`text-xs font-medium ${
                          change > 0
                            ? "text-success-600 dark:text-success-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {change > 0 ? "+" : ""}
                        {change.toFixed(1)}
                      </span>
                    )}
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {score}/100
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-600 transition-all duration-500"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Tracking Message */}
      {previousResult && (
        <div className="bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-primary-900 dark:text-primary-100 mb-2">
            Your Progress
          </h3>
          <p className="text-sm text-primary-700 dark:text-primary-300">
            {scoreChange && scoreChange > 0 ? (
              <>
                Great progress! Your wellness score has improved by{" "}
                <strong>{scoreChange.toFixed(1)} points</strong> since your last assessment. This
                demonstrates measurable improvement in your functional capacity and overall health.
              </>
            ) : scoreChange && scoreChange < 0 ? (
              <>
                Your score has decreased by <strong>{Math.abs(scoreChange).toFixed(1)} points</strong>{" "}
                since your last assessment. This may indicate increased stress, reduced activity, or
                other factors affecting your wellness. Let's discuss strategies to get back on track.
              </>
            ) : (
              <>
                Your score is stable since your last assessment. Consistent scores indicate you're
                maintaining your current level of function. Let's work together to continue progressing.
              </>
            )}
          </p>
        </div>
      )}

      {/* Next Steps */}
      <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
          Next Re-evaluation
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Your next SpineCloud Wellness Index assessment will be conducted based on your clinic's
          configured schedule. Regular assessments help track your progress and demonstrate the
          effectiveness of your care plan.
        </p>
      </div>
    </div>
  );
}