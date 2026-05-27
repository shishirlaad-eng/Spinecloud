import { X } from "lucide-react";

interface Question {
  id: string;
  text: string;
  type: "radio" | "checkbox" | "text" | "textarea" | "slider" | "number";
  options?: string[];
  min?: number;
  max?: number;
  required: boolean;
}

interface QuestionnaireData {
  categoryName: string;
  description: string;
  questions: Question[];
}

interface PreviewPatientFormModalProps {
  isOpen: boolean;
  questionnaire: QuestionnaireData;
  onClose: () => void;
}

export function PreviewPatientFormModal({
  isOpen,
  questionnaire,
  onClose,
}: PreviewPatientFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Preview
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Patient view
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Category Header */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
              {questionnaire.categoryName || "Category Name"}
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {questionnaire.description || "Category description"}
            </p>
          </div>

          {/* Questions */}
          {questionnaire.questions.length > 0 ? (
            <div className="space-y-6">
              {questionnaire.questions.map((question, index) => (
                <div key={question.id} className="space-y-3">
                  <label className="text-sm font-medium text-neutral-900 dark:text-white block">
                    {index + 1}. {question.text || "Question text"}{" "}
                    {question.required && <span className="text-destructive">*</span>}
                  </label>

                  {/* Radio */}
                  {question.type === "radio" && (
                    <div className="space-y-2">
                      {question.options?.map((option, optIndex) => (
                        <label
                          key={optIndex}
                          className="flex items-center gap-3 p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900/50 cursor-pointer transition-colors"
                        >
                          <input
                            type="radio"
                            name={`preview-${question.id}`}
                            disabled
                            className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700"
                          />
                          <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Checkbox */}
                  {question.type === "checkbox" && (
                    <div className="space-y-2">
                      {question.options?.map((option, optIndex) => (
                        <label
                          key={optIndex}
                          className="flex items-center gap-3 p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900/50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            disabled
                            className="w-4 h-4 rounded text-primary-600 border-neutral-300 dark:border-neutral-700"
                          />
                          <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Text */}
                  {question.type === "text" && (
                    <input
                      type="text"
                      placeholder="Your answer"
                      disabled
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 cursor-not-allowed"
                    />
                  )}

                  {/* Textarea */}
                  {question.type === "textarea" && (
                    <textarea
                      placeholder="Your answer"
                      rows={4}
                      disabled
                      className="flex w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 resize-none cursor-not-allowed"
                    />
                  )}

                  {/* Slider */}
                  {question.type === "slider" && (
                    <div className="space-y-2">
                      <input
                        type="range"
                        min={question.min || 0}
                        max={question.max || 10}
                        disabled
                        className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-not-allowed [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600"
                      />
                      <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
                        <span>{question.min || 0}</span>
                        <span>{question.max || 10}</span>
                      </div>
                    </div>
                  )}

                  {/* Number */}
                  {question.type === "number" && (
                    <input
                      type="number"
                      min={question.min || 0}
                      max={question.max || 10}
                      placeholder="Enter a number"
                      disabled
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 cursor-not-allowed"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                No questions to preview
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 shrink-0">
          <button
            onClick={onClose}
            className="w-full h-10 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
