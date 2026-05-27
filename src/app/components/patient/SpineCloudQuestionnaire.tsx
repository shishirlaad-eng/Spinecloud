import { useState } from "react";
import { X, ChevronRight, ChevronLeft, Info } from "lucide-react";

interface SpineCloudQuestionnaireProps {
  config?: any;
  patientAge?: number;
  patientVisitCount?: number;
  patientLastVisitDate?: string;
  onComplete: (response: QuestionnaireResponse) => void;
  onSkip?: () => void;
}

interface QuestionnaireResponse {
  responses: Record<string, number>; // Question ID -> Score (0-4)
  completedAt: string;
  score: number; // Calculated SCWI score
  categoryScores: Record<string, number>; // Category -> Score
}

const QUESTIONS = [
  {
    category: "Neuromuscular Integration",
    categoryKey: "neuromuscular",
    questions: [
      {
        id: "Q01",
        text: "Do you find yourself tripping, bumping into things, or feeling off-balance?",
      },
      {
        id: "Q02",
        text: "Do you experience any numbness, tingling, or pins and needles in your hands or feet?",
      },
      {
        id: "Q03",
        text: "Do you feel a lag or lack of fluidity when turning your head or moving your limbs?",
      },
    ],
  },
  {
    category: "Autonomic Regulation",
    categoryKey: "autonomic",
    questions: [
      {
        id: "Q04",
        text: "Do you feel wired but tired—unable to relax even when you are exhausted?",
      },
      {
        id: "Q05",
        text: "Do you experience irregular digestion, bloating, or butterflies in your stomach?",
      },
      {
        id: "Q06",
        text: "Do you feel your breathing is shallow or that you frequently need to take a deep sigh?",
      },
    ],
  },
  {
    category: "Structural Integrity",
    categoryKey: "structural",
    questions: [
      {
        id: "Q07",
        text: "Does your mid-back or neck ache after sitting or standing for only 15-20 minutes?",
      },
      {
        id: "Q08",
        text: "Do you feel like you lean more heavily on one leg or that your head feels heavy for your neck?",
      },
      {
        id: "Q09",
        text: "Do you notice your clothes fitting unevenly (e.g., one pant leg dragging or one sleeve feeling longer)?",
      },
    ],
  },
  {
    category: "Metabolic Resilience",
    categoryKey: "metabolic",
    questions: [
      {
        id: "Q10",
        text: "Do you feel puffy or have general joint achiness that moves from place to place?",
      },
      {
        id: "Q11",
        text: "Do you wake up feeling just as tired as when you went to bed?",
      },
      {
        id: "Q12",
        text: "Does it take you more than 48 hours to recover from mild physical activity or a long day?",
      },
    ],
  },
  {
    category: "Cognitive Vitality",
    categoryKey: "cognitive",
    questions: [
      {
        id: "Q13",
        text: "Do you experience brain fog or a lack of focus by mid-afternoon?",
      },
      {
        id: "Q14",
        text: "Do minor stressors (noises, small tasks) feel overwhelming or irritating?",
      },
      {
        id: "Q15",
        text: "Do you rely on stimulants (caffeine/sugar) to maintain a baseline level of function?",
      },
    ],
  },
];

const SCORE_OPTIONS = [
  { value: 0, label: "Never", sublabel: "Optimal" },
  { value: 1, label: "Rarely", sublabel: "Mildly" },
  { value: 2, label: "Occasionally", sublabel: "Moderately" },
  { value: 3, label: "Frequently", sublabel: "Severely" },
  { value: 4, label: "Constantly", sublabel: "Debilitating" },
];

// Calculate age-based multiplier (β)
function getAgeMultiplier(age: number): number {
  if (age < 30) return 1.0;
  if (age < 50) return 0.9;
  if (age < 70) return 0.8;
  return 0.7;
}

// Calculate SCWI score
function calculateSCWI(responses: Record<string, number>, age: number): number {
  const rawScore = Object.values(responses).reduce((sum, val) => sum + val, 0);
  const beta = getAgeMultiplier(age);
  const scwi = 100 - ((rawScore / 60) * 100 * beta);
  return Math.round(scwi * 10) / 10; // Round to 1 decimal place
}

// Calculate category scores
function calculateCategoryScores(responses: Record<string, number>): Record<string, number> {
  const categoryScores: Record<string, number> = {};
  
  QUESTIONS.forEach((section) => {
    const categoryQuestions = section.questions.map((q) => q.id);
    const categorySum = categoryQuestions.reduce((sum, qId) => sum + (responses[qId] || 0), 0);
    const maxScore = categoryQuestions.length * 4; // Max score per question is 4
    // Convert to 0-100 scale and invert (higher is better)
    categoryScores[section.categoryKey] = Math.round(100 - ((categorySum / maxScore) * 100));
  });
  
  return categoryScores;
}

export function SpineCloudQuestionnaire({
  config,
  patientAge,
  patientVisitCount,
  patientLastVisitDate,
  onComplete,
  onSkip,
}: SpineCloudQuestionnaireProps) {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});

  const currentSection = QUESTIONS[currentCategoryIndex];
  const isLastCategory = currentCategoryIndex === QUESTIONS.length - 1;
  const allQuestionsAnswered = currentSection.questions.every((q) => responses[q.id] !== undefined);

  const handleResponse = (questionId: string, score: number) => {
    setResponses({
      ...responses,
      [questionId]: score,
    });
  };

  const handleNext = () => {
    if (isLastCategory) {
      // Calculate final score and complete
      const scwi = calculateSCWI(responses, patientAge);
      const categoryScores = calculateCategoryScores(responses);
      
      onComplete({
        responses,
        completedAt: new Date().toISOString(),
        score: scwi,
        categoryScores,
      });
    } else {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1);
    }
  };

  const progress = ((currentCategoryIndex + 1) / QUESTIONS.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                SpineCloud Wellness Index
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {currentSection.category} • Category {currentCategoryIndex + 1} of {QUESTIONS.length}
              </p>
            </div>
            {onSkip && (
              <button
                onClick={onSkip}
                className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-[#1d77b4] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-[#eff4ff] dark:bg-primary-950/30 border border-[#c0c7d1] dark:border-primary-800 rounded-lg p-4 mb-6 flex items-start gap-3">
            <Info className="w-5 h-5 text-[#1d77b4] dark:text-primary-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-[#0b1c30] dark:text-primary-100 font-medium mb-1">
                How to answer
              </p>
              <p className="text-sm text-[#005e93] dark:text-primary-300">
                Rate each question based on how frequently you experience these symptoms over the past 2-4 weeks.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {currentSection.questions.map((question) => (
              <div key={question.id} className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-5">
                <p className="text-sm font-medium text-neutral-900 dark:text-white mb-4">
                  {question.text}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {SCORE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleResponse(question.id, option.value)}
                      className={`p-3 border-2 rounded-lg transition-all text-center ${
                        responses[question.id] === option.value
                          ? "border-[#1d77b4] bg-[#eff4ff] dark:bg-primary-950/30"
                          : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                      }`}
                    >
                      <div className="text-sm font-medium text-neutral-900 dark:text-white">
                        {option.label}
                      </div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                        {option.sublabel}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentCategoryIndex === 0}
              className="inline-flex items-center gap-2 h-10 px-4 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              {currentSection.questions.filter((q) => responses[q.id] !== undefined).length} of{" "}
              {currentSection.questions.length} answered
            </div>

            <button
              onClick={handleNext}
              disabled={!allQuestionsAnswered}
              className="inline-flex items-center gap-2 h-10 px-6 bg-[#1d77b4] hover:opacity-90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isLastCategory ? "Complete" : "Next"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}