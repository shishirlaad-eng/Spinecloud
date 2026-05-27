import { useState, useEffect } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { ArrowLeft, Plus, Save, Trash2, Eye, GripVertical, FileText, CheckCircle2, X } from "lucide-react";
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

interface PatientFormData {
  id?: string;
  title: string;
  description: string;
  branchIds: string[];
  status: "Active" | "Inactive";
  questions: Question[];
}

interface Branch {
  id: string;
  name: string;
}

interface AddEditPatientFormScreenProps {
  patientForm?: PatientFormData;
  mode: "add" | "edit";
  availableBranches: Branch[];
  availableServices?: any[];
  onNavigate: (menu: any) => void;
  onBack: () => void;
  onSave: (form: PatientFormData) => void;
  onPreview: (form: PatientFormData) => void;
  onLogout?: () => void;
}

export function AddEditPatientFormScreen({
  patientForm,
  mode,
  availableBranches,
  availableServices = [],
  onNavigate,
  onBack,
  onSave,
  onPreview,
  onLogout,
}: AddEditPatientFormScreenProps) {
  const [title, setTitle] = useState(patientForm?.title || "");
  const [description, setDescription] = useState(patientForm?.description || "");
  const [branchIds, setBranchIds] = useState<string[]>(patientForm?.branchIds || []);
  const [status, setStatus] = useState<"Active" | "Inactive">(patientForm?.status || "Active");
  const [questions, setQuestions] = useState<Question[]>(patientForm?.questions || []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGuided, setIsGuided] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);

  useEffect(() => {
    const explicitlyGuided = localStorage.getItem("spinecloud_active_guide") === "patientForms";
    const theoreticallyGuided = !isStepCompleted("patientForms") && localStorage.getItem("spinecloud_active_guide") !== "skipped";
    setIsGuided(explicitlyGuided || theoreticallyGuided);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isBranchDropdownOpen && !target.closest('.branch-select-container')) {
        setIsBranchDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isBranchDropdownOpen]);

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

  const handleSelectAllBranches = () => {
    if (branchIds.length === availableBranches.length) {
      setBranchIds([]);
    } else {
      setBranchIds(availableBranches.map(b => b.id));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!description.trim()) {
      newErrors.description = "Description is required";
    }
    if (branchIds.length === 0) {
      newErrors.branches = "At least one branch must be selected";
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

    const patientFormData: PatientFormData = {
      ...(patientForm?.id && { id: patientForm.id }),
      title,
      description,
      branchIds,
      status,
      questions,
    };

    if (isGuided) {
      const nextRoute = completeStep("patientForms");
      onSave(patientFormData);
      if (nextRoute) {
        setTimeout(() => onNavigate(nextRoute as any), 100);
      }
    } else {
      onSave(patientFormData);
    }
  };

  const handlePreview = () => {
    const patientFormData: PatientFormData = {
      title,
      description,
      branchIds,
      status,
      questions,
    };
    onPreview(patientFormData);
  };

  const statusBadge = (value: "Active" | "Inactive") => (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm text-neutral-700 dark:text-neutral-300">
      <span className={`w-1.5 h-1.5 rounded-full ${value === "Active" ? "bg-emerald-500" : "bg-neutral-400"}`} />
      {value}
    </span>
  );

  return (
    <ClinicAdminLayout activeMenu="questionnaires" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-5 md:p-6">
        <div className="max-w-[100%] mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group mb-4"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Patient Forms
            </button>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="mb-2 flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                  <span>Clinic Admin</span>
                  <span>/</span>
                  <span>Base Setup</span>
                  <span>/</span>
                  <span>Patient Forms</span>
                  <span>/</span>
                  <span className="text-neutral-900 dark:text-white">
                    {mode === "add" ? "Create Custom Form" : "Edit Patient Form"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-[18px] leading-6 font-semibold text-neutral-900 dark:text-white">
                    {mode === "add" ? "Create Custom Form" : title || "Edit Patient Form"}
                  </h1>
                  {statusBadge(status)}
                </div>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  {mode === "add"
                    ? "Create a new patient form category with custom questions"
                    : "Update patient form information and questions"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handlePreview}
                  className="inline-flex items-center gap-2 h-9 px-3 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors font-medium text-sm"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button
                  type="button"
                  onClick={onBack}
                  className="h-9 px-4 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="patient-form-detail-form"
                  className="inline-flex items-center gap-2 h-9 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm"
                >
                  <Save className="w-4 h-4" />
                  {mode === "add" ? "Create Patient Form" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>

          {/* Guided setup strip */}
          {isGuided && (
            <div className="mb-6 flex items-center gap-3 bg-white dark:!bg-neutral-900 border border-primary-200 dark:border-primary-900/50 rounded-lg px-4 py-3">
              <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400 flex items-center justify-center shrink-0 text-xs font-bold">4</div>
              <div>
                <p className="text-sm font-semibold text-primary-900">Step 4 of 5 — Setup Patient Forms</p>
                <p className="text-xs text-primary-700 mt-0.5">Build intake forms or clinical assessments for your patients. Once saved, you will be automatically redirected to set up agreements.</p>
              </div>
            </div>
          )}

          <div className="mb-6 bg-white dark:!bg-neutral-900 border border-neutral-200 dark:!border-neutral-800 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex gap-3 md:col-span-2">
                <div className="w-8 h-8 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Form description</p>
                  <p className="text-sm text-neutral-900 dark:text-white font-medium line-clamp-2">
                    {description || "No description provided"}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Questions</p>
                  <p className="text-sm text-neutral-900 dark:text-white font-medium">{questions.length}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Status</p>
                  <div>{statusBadge(status)}</div>
                </div>
              </div>
            </div>
          </div>

          <form id="patient-form-detail-form" onSubmit={handleSubmit}>
            {/* Title Information */}
            <div className="bg-white dark:!bg-neutral-900 border border-neutral-200 dark:!border-neutral-800 rounded-lg p-6 mb-6">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
                Title information
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="text-xs text-neutral-700 dark:text-neutral-300 block mb-1.5"
                  >
                    Title <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Neck / Shoulder Pain"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    aria-invalid={!!errors.title}
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:!border-neutral-800 bg-white dark:!bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                  />
                  {errors.title && (
                    <p className="text-xs text-destructive mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="text-xs text-neutral-700 dark:text-neutral-300 block mb-1.5"
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
                    className="flex w-full rounded-lg border border-neutral-200 dark:!border-neutral-800 bg-white dark:!bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive resize-none"
                  />
                  {errors.description && (
                    <p className="text-xs text-destructive mt-1">{errors.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Branch Association */}
            <div className="bg-white dark:!bg-neutral-900 border border-neutral-200 dark:!border-neutral-800 rounded-lg p-6 mb-6">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
                Branch association
              </h2>
              <div className="relative branch-select-container">
                <label className="text-xs text-neutral-700 dark:text-neutral-300 block mb-1.5">
                  Assigned branches <span className="text-destructive">*</span>
                </label>
                <div 
                  className={`min-h-[40px] w-full p-1.5 rounded-lg border border-neutral-200 dark:!border-neutral-800 bg-white dark:!bg-neutral-900 flex flex-wrap gap-1.5 cursor-pointer focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/10 transition-all ${errors.branches ? 'border-destructive' : ''}`}
                  onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                >
                  {branchIds.length > 0 ? (
                    branchIds.map(id => {
                      const branch = availableBranches.find(b => b.id === id);
                      return (
                        <div key={id} className="inline-flex items-center gap-1.5 px-2 py-1 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400 rounded-md text-xs font-medium">
                          {branch?.name}
                          <button 
                            type="button" 
                            onClick={(e) => { e.stopPropagation(); toggleBranch(id); }}
                            className="hover:text-primary-900 dark:hover:text-primary-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <span className="text-sm text-neutral-400 px-2 py-1">Select branches...</span>
                  )}
                </div>
                {errors.branches && <p className="text-xs text-destructive mt-1">{errors.branches}</p>}

                {isBranchDropdownOpen && (
                  <div className="absolute left-0 right-0 top-[100%] mt-2 bg-white dark:!bg-neutral-900 border border-neutral-200 dark:!border-neutral-800 rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto">
                    <div className="p-2 border-b border-neutral-100 dark:border-neutral-800">
                      <button
                        type="button"
                        onClick={handleSelectAllBranches}
                        className="w-full text-left px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/30 rounded-md transition-colors"
                      >
                        {branchIds.length === availableBranches.length ? "Deselect All" : "Select All Branches"}
                      </button>
                    </div>
                    {availableBranches.map((branch) => {
                      const isSelected = branchIds.includes(branch.id);
                      return (
                        <button
                          key={branch.id}
                          type="button"
                          onClick={() => toggleBranch(branch.id)}
                          className={`w-full text-left px-3 py-2.5 text-sm transition-colors flex items-center justify-between ${
                            isSelected 
                              ? "bg-primary-50/50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 font-medium" 
                              : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                          }`}
                        >
                          {branch.name}
                          {isSelected && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Questions */}
            <div className="bg-white dark:!bg-neutral-900 border border-neutral-200 dark:!border-neutral-800 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
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
                      className="border border-neutral-200 dark:!border-neutral-800 rounded-lg p-4"
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <GripVertical className="w-4 h-4 text-neutral-400 mt-2 cursor-move" />
                        <div className="flex-1 space-y-3">
                          <div>
                            <label className="text-xs text-neutral-700 dark:text-neutral-300 block mb-1.5">
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
                              className="flex h-10 w-full rounded-lg border border-neutral-200 dark:!border-neutral-800 bg-white dark:!bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                            />
                            {errors[`question-${index}`] && (
                              <p className="text-xs text-destructive mt-1">
                                {errors[`question-${index}`]}
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs text-neutral-700 dark:text-neutral-300 block mb-1.5">
                                Answer type
                              </label>
                              <select
                                value={question.type}
                                onChange={(e) =>
                                  updateQuestion(question.id, {
                                    type: e.target.value as Question["type"],
                                  })
                                }
                                className="flex h-10 w-full rounded-lg border border-neutral-200 dark:!border-neutral-800 bg-white dark:!bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
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
                              <label className="text-xs text-neutral-700 dark:text-neutral-300 block mb-2">
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
                                      className="flex h-10 flex-1 rounded-lg border border-neutral-200 dark:!border-neutral-800 bg-white dark:!bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
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
                                <label className="text-xs text-neutral-700 dark:text-neutral-300 block mb-1.5">
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
                                  className="flex h-10 w-full rounded-lg border border-neutral-200 dark:!border-neutral-800 bg-white dark:!bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-neutral-700 dark:text-neutral-300 block mb-1.5">
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
                                  className="flex h-10 w-full rounded-lg border border-neutral-200 dark:!border-neutral-800 bg-white dark:!bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
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

            {/* Status Section */}
            <div className="bg-white dark:!bg-neutral-900 border border-neutral-200 dark:!border-neutral-800 rounded-lg p-6 mb-6">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
                Status
              </h2>
              <div className="max-w-xs">
                <label
                  htmlFor="status"
                  className="text-xs text-neutral-700 dark:text-neutral-300 block mb-1.5"
                >
                  Form status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")}
                  className="flex h-10 w-full rounded-lg border border-neutral-200 dark:!border-neutral-800 bg-white dark:!bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="sticky bottom-0 z-10 -mx-5 md:-mx-6 px-5 md:px-6 py-4 bg-white/95 dark:bg-neutral-950/95 border-t border-neutral-200 dark:!border-neutral-800 flex gap-3 justify-end">
              <button
                type="button"
                onClick={onBack}
                className="px-4 h-9 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 h-9 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm"
              >
                <Save className="w-4 h-4" />
                {mode === "add" ? "Create Patient Form" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ClinicAdminLayout>
  );
}
