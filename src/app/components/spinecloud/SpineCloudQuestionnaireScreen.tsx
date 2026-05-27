import { useState } from "react";
import { DashboardLayout } from "@/app/components/layout/DashboardLayout";
import { ArrowLeft, ArrowRight, Check, Activity } from "lucide-react";

interface SpineCloudQuestionnaireScreenProps {
  onNavigate: (menu: "dashboard" | "appointments" | "profile" | "spineCloud") => void;
  onBack: () => void;
  onComplete: (responses: Record<string, number>) => void;
  onLogout?: () => void;
}

const QUESTIONS = [
  {
    id: "Q01",
    category: "Neuromuscular Integration",
    question:
      "Do you find yourself tripping, bumping into things, or feeling off-balance?",
  },
  {
    id: "Q02",
    category: "Neuromuscular Integration",
    question:
      "Do you experience any numbness, tingling, or pins and needles in your hands or feet?",
  },
  {
    id: "Q03",
    category: "Neuromuscular Integration",
    question:
      "Do you feel a lag or lack of fluidity when turning your head or moving your limbs?",
  },
  {
    id: "Q04",
    category: "Autonomic Regulation",
    question:
      "Do you feel wired but tired—unable to relax even when you are exhausted?",
  },
  {
    id: "Q05",
    category: "Autonomic Regulation",
    question:
      "Do you experience irregular digestion, bloating, or butterflies in your stomach?",
  },
  {
    id: "Q06",
    category: "Autonomic Regulation",
    question:
      "Do you feel your breathing is shallow or that you frequently need to take a deep sigh?",
  },
  {
    id: "Q07",
    category: "Structural Integrity",
    question:
      "Does your mid-back or neck ache after sitting or standing for only 15-20 minutes?",
  },
  {
    id: "Q08",
    category: "Structural Integrity",
    question:
      "Do you feel like you lean more heavily on one leg or that your head feels heavy for your neck?",
  },
  {
    id: "Q09",
    category: "Structural Integrity",
    question:
      "Do you notice your clothes fitting unevenly (e.g., one pant leg dragging or one sleeve feeling longer)?",
  },
  {
    id: "Q10",
    category: "Metabolic Resilience",
    question: "Do you feel exhausted even after a full night's sleep?",
  },
  {
    id: "Q11",
    category: "Metabolic Resilience",
    question:
      "Do simple injuries (cuts, bruises) seem to take longer to heal than they should?",
  },
  {
    id: "Q12",
    category: "Metabolic Resilience",
    question:
      "Do you catch colds or feel 'run down' more often than others around you?",
  },
  {
    id: "Q13",
    category: "Cognitive and Emotional Vitality",
    question: "Do you experience brain fog or a lack of focus by mid-afternoon?",
  },
  {
    id: "Q14",
    category: "Cognitive and Emotional Vitality",
    question:
      "Do minor stressors (noises, small tasks) feel overwhelming or irritating?",
  },
  {
    id: "Q15",
    category: "Cognitive and Emotional Vitality",
    question:
      "Do you rely on stimulants (caffeine/sugar) to maintain a baseline level of function?",
  },
];

const RESPONSE_OPTIONS = [
  { value: 0, label: "Never" },
  { value: 1, label: "Rarely" },
  { value: 2, label: "Sometimes" },
  { value: 3, label: "Often" },
  { value: 4, label: "Always" },
];

export function SpineCloudQuestionnaireScreen({
  onNavigate,
  onBack,
  onComplete,
  onLogout,
}: SpineCloudQuestionnaireScreenProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const totalQuestions = QUESTIONS.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const hasAnsweredCurrent = responses[currentQuestion.id] !== undefined;

  const handleSelectAnswer = (value: number) => {
    setResponses({ ...responses, [currentQuestion.id]: value });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Complete questionnaire
      onComplete(responses);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      onBack();
    }
  };

  return (
    <DashboardLayout activeMenu="spineCloud" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        {/* Header with Progress */}
        <div className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
          <div className="max-w-3xl mx-auto px-5 md:px-6 py-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {currentQuestionIndex === 0 ? "Cancel" : "Previous"}
              </button>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1d77b4] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="max-w-3xl mx-auto px-5 md:px-6 py-8">
          <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8">
            {/* Category Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg mb-6">
              <Activity className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                {currentQuestion.category}
              </span>
            </div>

            {/* Question */}
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-8">
              {currentQuestion.question}
            </h2>

            {/* Response Options */}
            <div className="space-y-3">
              {RESPONSE_OPTIONS.map((option) => {
                const isSelected = responses[currentQuestion.id] === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSelectAnswer(option.value)}
                    className={`w-full flex items-center justify-between p-5 border-2 rounded-xl transition-all ${
                      isSelected
                        ? "border-primary-600 bg-primary-50 dark:bg-primary-950/30"
                        : "border-neutral-200 dark:border-neutral-800 hover:border-primary-300 dark:hover:border-primary-700"
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        isSelected
                          ? "text-primary-700 dark:text-primary-300"
                          : "text-neutral-700 dark:text-neutral-300"
                      }`}
                    >
                      {option.label}
                    </span>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-[#1d77b4] flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <button
                onClick={handleNext}
                disabled={!hasAnsweredCurrent}
                className={`w-full h-12 rounded-lg font-medium text-sm transition-colors inline-flex items-center justify-center gap-2 ${
                  hasAnsweredCurrent
                    ? "bg-[#1d77b4] text-white hover:opacity-90"
                    : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed"
                }`}
              >
                {isLastQuestion ? (
                  <>
                    <Check className="w-4 h-4" />
                    Complete assessment
                  </>
                ) : (
                  <>
                    Next question
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
