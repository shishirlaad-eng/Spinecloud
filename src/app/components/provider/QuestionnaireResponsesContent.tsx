import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Calendar,
  FileText,
  TrendingUp,
  Activity,
  AlertCircle,
} from "lucide-react";

interface QuestionnaireResponse {
  categoryId: string;
  categoryName: string;
  completedAt: string;
  responses: QuestionResponse[];
}

interface QuestionResponse {
  questionId: string;
  question: string;
  type: "text" | "textarea" | "radio" | "checkbox" | "select" | "scale";
  answer: string | string[] | number;
  options?: string[];
}

interface QuestionnaireResponsesContentProps {
  appointmentId: string;
  patientName: string;
  appointmentDate: string;
}

export function QuestionnaireResponsesContent({
  appointmentId,
  patientName,
  appointmentDate,
}: QuestionnaireResponsesContentProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["neck-shoulder"]) // First category expanded by default
  );

  // Dummy questionnaire data - in a real app, this would come from the backend
  const questionnaireResponses: QuestionnaireResponse[] = [
    {
      categoryId: "neck-shoulder",
      categoryName: "Neck / Shoulder",
      completedAt: new Date(appointmentDate).toISOString(),
      responses: [
        {
          questionId: "q1",
          question: "Where is your primary area of pain or discomfort?",
          type: "radio",
          answer: "Neck and upper shoulders",
          options: ["Neck only", "Neck and upper shoulders", "Shoulders only", "Upper back"],
        },
        {
          questionId: "q2",
          question: "How long have you been experiencing this pain?",
          type: "radio",
          answer: "2-4 weeks",
          options: ["Less than 1 week", "1-2 weeks", "2-4 weeks", "More than 1 month"],
        },
        {
          questionId: "q3",
          question: "Rate your current pain level",
          type: "scale",
          answer: 7,
        },
        {
          questionId: "q4",
          question: "Which activities are most affected by your pain?",
          type: "checkbox",
          answer: ["Looking up or down", "Turning head side to side", "Sleeping"],
          options: [
            "Looking up or down",
            "Turning head side to side",
            "Reaching overhead",
            "Sleeping",
            "Working at computer",
          ],
        },
        {
          questionId: "q5",
          question: "What makes your pain worse?",
          type: "textarea",
          answer:
            "Sitting at my desk for extended periods, especially when working on the computer. The pain intensifies when I turn my head to the right side. Also worse in the morning when I first wake up.",
        },
        {
          questionId: "q6",
          question: "What provides relief from your pain?",
          type: "textarea",
          answer:
            "Heat packs on my neck and shoulders provide temporary relief. Taking breaks to stretch and move around helps. Ibuprofen reduces the pain for a few hours.",
        },
        {
          questionId: "q7",
          question: "Have you experienced this type of pain before?",
          type: "radio",
          answer: "Yes, similar episodes in the past",
          options: ["No, this is the first time", "Yes, similar episodes in the past", "Yes, it's chronic/ongoing"],
        },
        {
          questionId: "q8",
          question: "Do you experience any of the following symptoms?",
          type: "checkbox",
          answer: ["Headaches", "Muscle stiffness"],
          options: ["Numbness or tingling", "Headaches", "Dizziness", "Muscle stiffness", "None of the above"],
        },
      ],
    },
    {
      categoryId: "lower-back",
      categoryName: "Lower Back",
      completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      responses: [
        {
          questionId: "q1",
          question: "Where exactly is your lower back pain located?",
          type: "radio",
          answer: "Central lower back",
          options: ["Central lower back", "Left side", "Right side", "Both sides"],
        },
        {
          questionId: "q2",
          question: "How would you describe your pain?",
          type: "checkbox",
          answer: ["Dull ache", "Stiffness"],
          options: ["Sharp/stabbing", "Dull ache", "Burning", "Stiffness", "Throbbing"],
        },
        {
          questionId: "q3",
          question: "Rate your pain when standing",
          type: "scale",
          answer: 4,
        },
        {
          questionId: "q4",
          question: "Rate your pain when sitting",
          type: "scale",
          answer: 6,
        },
        {
          questionId: "q5",
          question: "Does the pain radiate to other areas?",
          type: "radio",
          answer: "Yes, to my buttocks",
          options: ["No radiation", "Yes, to my buttocks", "Yes, down my legs", "Yes, to both buttocks and legs"],
        },
        {
          questionId: "q6",
          question: "What triggered your back pain?",
          type: "textarea",
          answer:
            "Started after helping a friend move furniture last weekend. Lifted a heavy couch and felt immediate tightness in my lower back.",
        },
        {
          questionId: "q7",
          question: "What activities are difficult due to your back pain?",
          type: "checkbox",
          answer: ["Bending forward", "Lifting objects", "Getting in/out of car"],
          options: [
            "Bending forward",
            "Bending backward",
            "Twisting",
            "Lifting objects",
            "Getting in/out of car",
            "Walking",
            "Standing for long periods",
          ],
        },
      ],
    },
  ];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const getCategoryIcon = (categoryName: string) => {
    if (categoryName.toLowerCase().includes("neck") || categoryName.toLowerCase().includes("shoulder")) {
      return <Activity className="w-5 h-5" />;
    }
    if (categoryName.toLowerCase().includes("back")) {
      return <TrendingUp className="w-5 h-5" />;
    }
    return <FileText className="w-5 h-5" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-primary-950/30 dark:to-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-500 dark:bg-primary-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-primary-900 dark:text-primary-100">
              Questionnaire completed
            </h3>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-primary-700 dark:text-primary-300">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(appointmentDate)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>{questionnaireResponses.length} {questionnaireResponses.length === 1 ? 'category' : 'categories'} completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Questionnaire Categories */}
      <div className="space-y-3">
        {questionnaireResponses.map((category) => {
          const isExpanded = expandedCategories.has(category.categoryId);
          
          return (
            <div
              key={category.categoryId}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden"
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.categoryId)}
                className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                    {getCategoryIcon(category.categoryName)}
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {category.categoryName}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                      {category.responses.length} {category.responses.length === 1 ? 'response' : 'responses'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {isExpanded ? "Collapse" : "Expand"}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                  )}
                </div>
              </button>

              {/* Category Content */}
              {isExpanded && (
                <div className="border-t border-neutral-200 dark:border-neutral-800">
                  <div className="p-4 space-y-6">
                    {category.responses.map((response, index) => (
                      <QuestionResponseItem
                        key={response.questionId}
                        response={response}
                        questionNumber={index + 1}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {questionnaireResponses.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-neutral-400 dark:text-neutral-600" />
          </div>
          <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
            No questionnaire responses
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            The patient has not completed any questionnaires for this appointment
          </p>
        </div>
      )}
    </div>
  );
}

// Question Response Item Component
interface QuestionResponseItemProps {
  response: QuestionResponse;
  questionNumber: number;
}

function QuestionResponseItem({ response, questionNumber }: QuestionResponseItemProps) {
  const renderAnswer = () => {
    switch (response.type) {
      case "scale":
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
              <span>0 (No pain)</span>
              <span>10 (Worst pain)</span>
            </div>
            <div className="relative h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-gradient-to-r from-success-500 via-yellow-500 to-destructive rounded-full transition-all"
                style={{ width: `${(Number(response.answer) / 10) * 100}%` }}
              />
            </div>
            <div className="text-center">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 text-lg font-bold">
                {response.answer}
              </span>
            </div>
          </div>
        );

      case "checkbox":
        if (Array.isArray(response.answer)) {
          return (
            <div className="flex flex-wrap gap-2">
              {response.answer.map((answer, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 dark:bg-primary-950/30 border border-primary-300 dark:border-primary-700 rounded-lg text-sm text-neutral-900 dark:text-white"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                  {answer}
                </span>
              ))}
            </div>
          );
        }
        return null;

      case "radio":
      case "select":
        return (
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-primary-50 dark:bg-primary-950/30 border border-primary-300 dark:border-primary-700 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-primary-600" />
            <span className="text-sm text-neutral-900 dark:text-white font-medium">
              {response.answer}
            </span>
          </div>
        );

      case "textarea":
      case "text":
        return (
          <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <p className="text-sm text-neutral-900 dark:text-white whitespace-pre-wrap">{response.answer}</p>
          </div>
        );

      default:
        return (
          <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <p className="text-sm text-neutral-900 dark:text-white">{String(response.answer)}</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 flex items-center justify-center flex-shrink-0 text-xs font-semibold">
          {questionNumber}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-neutral-900 dark:text-white">{response.question}</h4>
        </div>
      </div>
      <div className="ml-9">{renderAnswer()}</div>
    </div>
  );
}