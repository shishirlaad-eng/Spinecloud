import { useState } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { ArrowLeft, Save, Info } from "lucide-react";

interface SpineCloudConfig {
  enabled: boolean;
  inactivityValue: number;
  inactivityUnit: "weeks" | "months";
}

interface SpineCloudIndexConfigScreenProps {
  config: SpineCloudConfig;
  onSave: (config: SpineCloudConfig) => void;
  onNavigate: (screen: string) => void;
  onBack?: () => void;
  onLogout?: () => void;
}

// The 15 SpineCloud Index Questions (Read-only for education)
const SPINECLOUD_QUESTIONS = [
  {
    category: "Neuromuscular Integration",
    description: "Balance, coordination, and body awareness",
    questions: [
      {
        id: "Q01",
        text: "Do you find yourself tripping, bumping into things, or feeling off-balance?",
        domain: "Proprioception",
      },
      {
        id: "Q02",
        text: "Do you experience any numbness, tingling, or pins and needles in your hands or feet?",
        domain: "Fine Motor",
      },
      {
        id: "Q03",
        text: "Do you feel a lag or lack of fluidity when turning your head or moving your limbs?",
        domain: "Coordination",
      },
    ],
  },
  {
    category: "Autonomic Regulation",
    description: "Stress response, digestion, and breathing patterns",
    questions: [
      {
        id: "Q04",
        text: "Do you feel wired but tired—unable to relax even when you are exhausted?",
        domain: "Stress Response",
      },
      {
        id: "Q05",
        text: "Do you experience irregular digestion, bloating, or butterflies in your stomach?",
        domain: "Digestive Tone",
      },
      {
        id: "Q06",
        text: "Do you feel your breathing is shallow or that you frequently need to take a deep sigh?",
        domain: "Respiratory Depth",
      },
    ],
  },
  {
    category: "Structural Integrity",
    description: "Postural endurance and body alignment",
    questions: [
      {
        id: "Q07",
        text: "Does your mid-back or neck ache after sitting or standing for only 15-20 minutes?",
        domain: "Postural Fatigue",
      },
      {
        id: "Q08",
        text: "Do you feel like you lean more heavily on one leg or that your head feels heavy for your neck?",
        domain: "Weight Distribution",
      },
      {
        id: "Q09",
        text: "Do you notice your clothes fitting unevenly (e.g., one pant leg dragging or one sleeve feeling longer)?",
        domain: "Asymmetry",
      },
    ],
  },
  {
    category: "Metabolic Resilience",
    description: "Energy, recovery, and healing capacity",
    questions: [
      {
        id: "Q10",
        text: "Do you feel exhausted even after a full night's sleep?",
        domain: "Sleep Recovery",
      },
      {
        id: "Q11",
        text: "Do simple injuries (cuts, bruises) seem to take longer to heal than they should?",
        domain: "Tissue Repair",
      },
      {
        id: "Q12",
        text: "Do you catch colds or feel 'run down' more often than others around you?",
        domain: "Immune Response",
      },
    ],
  },
  {
    category: "Cognitive and Emotional Vitality",
    description: "Mental sharpness and emotional balance",
    questions: [
      {
        id: "Q13",
        text: "Do you experience brain fog or a lack of focus by mid-afternoon?",
        domain: "Mental Clarity",
      },
      {
        id: "Q14",
        text: "Do minor stressors (noises, small tasks) feel overwhelming or irritating?",
        domain: "Adaptability",
      },
      {
        id: "Q15",
        text: "Do you rely on stimulants (caffeine/sugar) to maintain a baseline level of function?",
        domain: "Global Energy",
      },
    ],
  },
];

const SCORE_RANGES = [
  { range: "0-20", label: "Critical Dysfunction", color: "text-red-700 dark:text-red-400", bgColor: "bg-red-50 dark:bg-red-950/30" },
  { range: "21-40", label: "Significant Impairment", color: "text-orange-700 dark:text-orange-400", bgColor: "bg-orange-50 dark:bg-orange-950/30" },
  { range: "41-60", label: "Sub-Optimal Function", color: "text-yellow-700 dark:text-yellow-400", bgColor: "bg-yellow-50 dark:bg-yellow-950/30" },
  { range: "61-80", label: "Robust Health", color: "text-success-700 dark:text-success-400", bgColor: "bg-success-50 dark:bg-success-950/30" },
  { range: "81-100", label: "Optimal Vitality", color: "text-primary-700 dark:text-primary-400", bgColor: "bg-primary-50 dark:bg-primary-950/30" },
];

export function SpineCloudIndexConfigScreen({
  config,
  onSave,
  onNavigate,
  onBack,
  onLogout,
}: SpineCloudIndexConfigScreenProps) {
  const [localConfig, setLocalConfig] = useState<SpineCloudConfig>({
    enabled: config.enabled ?? false,
    inactivityValue: config.inactivityValue ?? 2,
    inactivityUnit: config.inactivityUnit ?? "months",
  });
  const [showQuestionsInfo, setShowQuestionsInfo] = useState(false);

  const handleSave = () => {
    onSave(localConfig);
  };

  return (
    <ClinicAdminLayout activeMenu="spineCloud" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6 space-y-6">
        {/* Back Button */}
        <button
          onClick={() => onBack ? onBack() : onNavigate("dashboard")}
          className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          {onBack ? "Back to SpineCloud Index" : "Back to dashboard"}
        </button>

        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
            SpineCloud Index Configuration
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Configure global settings for the SpineCloud Wellness Index questionnaire
          </p>
        </div>

        {/* Enable/Disable Toggle */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                Enable SpineCloud Index
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                When enabled, the SpineCloud Wellness Index will be available for patients to complete
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localConfig.enabled}
                onChange={(e) => setLocalConfig({ ...localConfig, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-200 dark:bg-neutral-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>

        {/* Inactivity Period Configuration */}
        {localConfig.enabled && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                Global Inactivity Period
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Automatically prompt patients to retake the questionnaire after a period of inactivity
              </p>
            </div>

            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-5 h-5 text-primary-600 dark:text-primary-400 shrink-0" />
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  This is a global setting applied to all patients. Providers can configure per-patient frequency in the patient's appointment details.
                </p>
              </div>

              <div>
                <label htmlFor="inactivityValue" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-3">
                  Inactivity period
                </label>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                  Ask patients to retake the questionnaire if they haven't completed one in this specified period
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    id="inactivityValue"
                    min="1"
                    max={localConfig.inactivityUnit === "months" ? 12 : 52}
                    value={localConfig.inactivityValue}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        inactivityValue: parseInt(e.target.value) || 2,
                      })
                    }
                    className="w-24 h-10 px-3 py-1 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-lg text-sm focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none"
                  />
                  <select
                    value={localConfig.inactivityUnit}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        inactivityUnit: e.target.value as "weeks" | "months"
                      })
                    }
                    className="h-10 px-3 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-lg text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-colors"
                  >
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-3">
                  Recommended: 2-3 months for optimal wellness tracking
                </p>
              </div>
            </div>
          </div>
        )}

        {/* About the SpineCloud Index */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
          <button
            onClick={() => setShowQuestionsInfo(!showQuestionsInfo)}
            className="w-full flex items-center justify-between group"
          >
            <div className="text-left">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                About the SpineCloud Wellness Index
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {showQuestionsInfo ? "Hide" : "View"} the 15 assessment questions and scoring methodology
              </p>
            </div>
            <div className={`text-neutral-400 transition-transform ${showQuestionsInfo ? "rotate-180" : ""}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {showQuestionsInfo && (
            <div className="mt-6 space-y-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
              {/* Questions by Category */}
              <div className="space-y-4">
                {SPINECLOUD_QUESTIONS.map((category) => (
                  <div key={category.category} className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-5">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
                      {category.category}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                      {category.description}
                    </p>
                    <div className="space-y-3">
                      {category.questions.map((q) => (
                        <div key={q.id} className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <span className="inline-flex items-center justify-center w-7 h-7 shrink-0 bg-primary-100 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 rounded-full text-xs font-semibold">
                              {q.id.replace("Q", "")}
                            </span>
                            <div className="flex-1">
                              <p className="text-sm text-neutral-900 dark:text-white mb-1">
                                {q.text}
                              </p>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                Domain: {q.domain}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Scoring Information */}
              <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-5">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
                  Score Interpretation
                </h3>
                <div className="space-y-3">
                  {SCORE_RANGES.map((range) => (
                    <div
                      key={range.range}
                      className={`${range.bgColor} border border-neutral-200 dark:border-neutral-800 rounded-lg p-4`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm font-semibold ${range.color}`}>
                            {range.label}
                          </p>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                            Score range: {range.range}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-2">
                    <strong>Age Adjustment:</strong>
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Scores are automatically age-adjusted using a validated algorithm. The adjustment accounts for natural age-related changes in neuromuscular, autonomic, structural, metabolic, and cognitive function.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-6 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            <Save className="w-4 h-4" />
            Save configuration
          </button>
        </div>
      </div>
    </ClinicAdminLayout>
  );
}