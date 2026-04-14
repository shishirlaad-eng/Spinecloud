import { useState, useEffect } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { ArrowLeft, Plus, Save, Trash2, Eye, GripVertical, FileText, CheckCircle2 } from "lucide-react";
import { completeStep, isStepCompleted } from "../shared/walkthroughUtils";

interface Question {
  id: string;
  text: string;
  type: "radio" | "checkbox" | "text" | "textarea" | "slider" | "number";
  options?: string[]; // For radio and checkbox
  min?: number; // For slider and number
  max?: number; // For slider and number
  required: boolean;
}

interface QuestionnaireData {
  id?: string;
  categoryName: string;
  description: string;
  branchIds: string[];
  serviceIds?: string[];
  frequency?: "first_visit" | "every_visit" | "monthly" | "custom";
  questions: Question[];
}

interface Branch {
  id: string;
  name: string;
}

interface AddEditQuestionnaireScreenProps {
  questionnaire?: QuestionnaireData;
  mode: "add" | "edit";
  availableBranches: Branch[];
  availableServices?: any[];
  onNavigate: (menu: any) => void;
  onBack: () => void;
  onSave: (questionnaire: QuestionnaireData) => void;
  onPreview: (questionnaire: QuestionnaireData) => void;
  onLogout?: () => void;
}

export function AddEditQuestionnaireScreen({
  questionnaire,
  mode,
  availableBranches,
  availableServices = [],
  onNavigate,
  onBack,
  onSave,
  onPreview,
  onLogout,
}: AddEditQuestionnaireScreenProps) {
  const [categoryName, setCategoryName] = useState(questionnaire?.categoryName || "");
  const [description, setDescription] = useState(questionnaire?.description || "");
  const [branchIds, setBranchIds] = useState<string[]>(questionnaire?.branchIds || []);
  const [serviceIds, setServiceIds] = useState<string[]>(questionnaire?.serviceIds || []);
  const [frequency, setFrequency] = useState<string>(questionnaire?.frequency || "first_visit");
  const [questions, setQuestions] = useState<Question[]>(questionnaire?.questions || []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGuided, setIsGuided] = useState(false);

  useEffect(() => {
    const activeGuide = localStorage.getItem("spinecloud_active_guide");
    const explicitlyGuided = activeGuide === "questionnaires";
    const theoreticallyGuided = !isStepCompleted("questionnaires") && activeGuide !== "skipped";
    setIsGuided(explicitlyGuided || theoreticallyGuided);
  }, []);

  const questionTypes = [
    { value: "radio", label: "Single choice (radio)" },
    { value: "checkbox", label: "Multiple choice (checkbox)" },
    { value: "text", label: "Short text" },
    { value: "textarea", label: "Long text" },
    { value: "slider", label: "Slider (1-10)" },
    { value: "number", label: "Number input" },
  ];

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      text: "",
      type: "radio",
      options: ["Option 1", "Option 2"],
      required: true,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setQuestions(
      questions.map((q) => (q.id === questionId ? { ...q, ...updates } : q))
    );
  };

  const deleteQuestion = (questionId: string) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  const addOption = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (question && question.options) {
      updateQuestion(questionId, {
        options: [...question.options, `Option ${question.options.length + 1}`],
      });
    }
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (question && question.options) {
      const newOptions = [...question.options];
      newOptions[optionIndex] = value;
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const deleteOption = (questionId: string, optionIndex: number) => {
    const question = questions.find((q) => q.id === questionId);
    if (question && question.options && question.options.length > 2) {
      updateQuestion(questionId, {
        options: question.options.filter((_, i) => i !== optionIndex),
      });
    }
  };

  const toggleBranch = (branchId: string) => {
    if (branchIds.includes(branchId)) {
      setBranchIds(branchIds.filter((id) => id !== branchId));
    } else {
      setBranchIds([...branchIds, branchId]);
    }
  };

  const toggleService = (serviceId: string) => {
    if (serviceIds.includes(serviceId)) {
      setServiceIds(serviceIds.filter((id) => id !== serviceId));
    } else {
      setServiceIds([...serviceIds, serviceId]);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!categoryName.trim()) {
      newErrors.categoryName = "Category name is required";
    }
    if (!description.trim()) {
      newErrors.description = "Description is required";
    }
    if (branchIds.length === 0) {
      newErrors.branches = "At least one branch must be selected";
    }
    if (serviceIds.length === 0) {
      newErrors.services = "At least one service must be selected";
    }
    if (questions.length === 0) {
      newErrors.questions = "At least one question is required";
    }

    questions.forEach((q, index) => {
      if (!q.text.trim()) {
        newErrors[`question-${index}`] = "Question text is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const questionnaireData: QuestionnaireData = {
      ...(questionnaire?.id && { id: questionnaire.id }),
      categoryName,
      description,
      branchIds,
      serviceIds,
      frequency: frequency as any,
      questions,
    };

    if (isGuided) {
      const nextRoute = completeStep("questionnaires");
      onSave(questionnaireData);
      if (nextRoute) {
        setTimeout(() => onNavigate(nextRoute as any), 100);
      }
    } else {
      onSave(questionnaireData);
    }
  };

  const handlePreview = () => {
    const questionnaireData: QuestionnaireData = {
      categoryName,
      description,
      branchIds,
      serviceIds,
      frequency: frequency as any,
      questions,
    };
    onPreview(questionnaireData);
  };

  return (
    <ClinicAdminLayout activeMenu="questionnaires" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group mb-4"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Questionnaires
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
                  {mode === "add" ? "Add New Questionnaire" : "Edit Questionnaire"}
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {mode === "add"
                    ? "Create a new questionnaire category with custom questions"
                    : "Update questionnaire information and questions"}
                </p>
              </div>
              <button
                type="button"
                onClick={handlePreview}
                className="inline-flex items-center gap-2 px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
            </div>
          </div>

          {/* Guided setup strip */}
        {isGuided && (
          <div className="mb-6 flex items-center gap-3 bg-primary-50 border border-primary-200 rounded-xl px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center shrink-0 text-white text-xs font-bold">4</div>
            <div>
              <p className="text-sm font-semibold text-primary-900">Step 4 of 5 — Setup Patient Questionnaires</p>
              <p className="text-xs text-primary-700 mt-0.5">Build intake forms or clinical assessments for your patients. Once saved, you will be automatically redirected to set up consent forms.</p>
            </div>
          </div>
        )}

          <form onSubmit={handleSubmit}>
            {/* Category Information */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 mb-6">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-wide mb-4">
                Category information
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="categoryName"
                    className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
                  >
                    Category name <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="categoryName"
                    type="text"
                    placeholder="Neck / Shoulder Pain"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    aria-invalid={!!errors.categoryName}
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                  />
                  {errors.categoryName && (
                    <p className="text-xs text-destructive mt-1">{errors.categoryName}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
                  >
                    Short description <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="description"
                    placeholder="Help us understand your neck and shoulder pain better"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    aria-invalid={!!errors.description}
                    rows={2}
                    className="flex w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive resize-none"
                  />
                  {errors.description && (
                    <p className="text-xs text-destructive mt-1">{errors.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Branch Association */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 mb-6">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-wide mb-4">
                Branch association
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Select which branches will use this questionnaire
              </p>
              {errors.branches && (
                <p className="text-xs text-destructive mb-4">{errors.branches}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableBranches.map((branch) => {
                  const isSelected = branchIds.includes(branch.id);
                  return (
                    <button
                      key={branch.id}
                      type="button"
                      onClick={() => toggleBranch(branch.id)}
                      className={`p-4 border rounded-lg text-left transition-all ${
                        isSelected
                          ? "border-primary-500 dark:border-primary-600 bg-primary-50 dark:bg-primary-950/30"
                          : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? "bg-primary-600 dark:bg-primary-500 border-primary-600 dark:border-primary-500"
                              : "border-neutral-300 dark:border-neutral-700"
                          }`}
                        >
                          {isSelected && (
                            <svg
                              className="w-3 h-3 text-white"
                              viewBox="0 0 12 12"
                              fill="none"
                            >
                              <path
                                d="M10 3L4.5 8.5L2 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            isSelected
                              ? "text-neutral-900 dark:text-white"
                              : "text-neutral-700 dark:text-neutral-300"
                          }`}
                        >
                          {branch.name}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Service Association */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 mb-6">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-wide mb-4">
                Service association & trigger rules
              </h2>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 font-medium">
                    Trigger frequency
                  </p>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="h-10 w-full sm:w-80 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                  >
                    <option value="first_visit">First visit only</option>
                    <option value="every_visit">Every visit</option>
                    <option value="monthly">Monthly</option>
                    <option value="custom">Custom schedule</option>
                  </select>
                </div>

                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 font-medium">
                    Assigned services
                  </p>
                  {errors.services && (
                    <p className="text-xs text-destructive mb-3">{errors.services}</p>
                  )}
                  {availableServices.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {availableServices.map((service) => {
                        const isSelected = serviceIds.includes(service.id);
                        return (
                          <button
                            key={service.id}
                            type="button"
                            onClick={() => toggleService(service.id)}
                            className={`p-3 border rounded-lg text-left transition-all ${
                              isSelected
                                ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30 text-primary-900"
                                : "border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900/50 text-neutral-700 dark:text-neutral-300"
                            }`}
                          >
                            <span className="text-sm font-medium">{service.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-neutral-500 italic">No services available. Please create services first.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-wide">
                  Questions
                </h2>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="inline-flex items-center gap-2 px-3 h-9 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-950/50 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Question
                </button>
              </div>

              {errors.questions && (
                <p className="text-xs text-destructive mb-4">{errors.questions}</p>
              )}

              {questions.length > 0 ? (
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4"
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <GripVertical className="w-5 h-5 text-neutral-400 mt-2 cursor-move" />
                        <div className="flex-1 space-y-3">
                          <div>
                            <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                              Question {index + 1}{" "}
                              <span className="text-destructive">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="What brings you to the clinic today?"
                              value={question.text}
                              onChange={(e) =>
                                updateQuestion(question.id, { text: e.target.value })
                              }
                              aria-invalid={!!errors[`question-${index}`]}
                              className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                            />
                            {errors[`question-${index}`] && (
                              <p className="text-xs text-destructive mt-1">
                                {errors[`question-${index}`]}
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                                Answer type
                              </label>
                              <select
                                value={question.type}
                                onChange={(e) =>
                                  updateQuestion(question.id, {
                                    type: e.target.value as Question["type"],
                                  })
                                }
                                className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                              >
                                {questionTypes.map((type) => (
                                  <option key={type.value} value={type.value}>
                                    {type.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="flex items-end">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={question.required}
                                  onChange={(e) =>
                                    updateQuestion(question.id, {
                                      required: e.target.checked,
                                    })
                                  }
                                  className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-primary-600 focus:ring-2 focus:ring-primary-500/20"
                                />
                                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                                  Required
                                </span>
                              </label>
                            </div>
                          </div>

                          {/* Options for radio/checkbox */}
                          {(question.type === "radio" || question.type === "checkbox") && (
                            <div>
                              <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                                Options
                              </label>
                              <div className="space-y-2">
                                {question.options?.map((option, optIndex) => (
                                  <div key={optIndex} className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={option}
                                      onChange={(e) =>
                                        updateOption(question.id, optIndex, e.target.value)
                                      }
                                      className="flex h-10 flex-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                                    />
                                    {question.options && question.options.length > 2 && (
                                      <button
                                        type="button"
                                        onClick={() => deleteOption(question.id, optIndex)}
                                        className="p-2 text-neutral-400 hover:text-destructive transition-colors"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => addOption(question.id)}
                                  className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                                >
                                  + Add Option
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Slider/Number range */}
                          {(question.type === "slider" || question.type === "number") && (
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                                  Min value
                                </label>
                                <input
                                  type="number"
                                  value={question.min || 0}
                                  onChange={(e) =>
                                    updateQuestion(question.id, {
                                      min: parseInt(e.target.value),
                                    })
                                  }
                                  className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                                />
                              </div>
                              <div>
                                <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                                  Max value
                                </label>
                                <input
                                  type="number"
                                  value={question.max || 10}
                                  onChange={(e) =>
                                    updateQuestion(question.id, {
                                      max: parseInt(e.target.value),
                                    })
                                  }
                                  className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteQuestion(question.id)}
                          className="p-2 text-neutral-400 hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                    No questions added yet
                  </p>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="inline-flex items-center gap-2 px-4 h-9 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Your First Question
                  </button>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onBack}
                className="px-6 h-11 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-11 px-6 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm"
              >
                {mode === "add" ? "Create Questionnaire" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ClinicAdminLayout>
  );
}
