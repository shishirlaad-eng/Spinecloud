import { useState, useRef, useMemo, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ArrowLeft, Eye, ChevronDown, Save, Trash2, FileSignature, AlertCircle, Plus } from "lucide-react";
import { completeStep, isStepCompleted } from "../shared/walkthroughUtils";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";

interface ConsentForm {
  id: string;
  title: string;
  content: string;
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}

interface AddEditConsentFormScreenProps {
  form: ConsentForm | null;
  onNavigate: (menu: any) => void;
  onSave: (form: Omit<ConsentForm, "id" | "createdAt" | "updatedAt">) => void;
  onBack: () => void;
  onPreview: () => void;
  onLogout?: () => void;
}

// Patient variables that can be inserted into the consent form
const PATIENT_VARIABLES = [
  { label: "First name", value: "{{firstName}}" },
  { label: "Last name", value: "{{lastName}}" },
  { label: "Email", value: "{{email}}" },
  { label: "Mobile", value: "{{mobile}}" },
  { label: "Date of birth", value: "{{dateOfBirth}}" },
  { label: "Gender", value: "{{gender}}" },
  { label: "Street address", value: "{{street}}" },
  { label: "City", value: "{{city}}" },
  { label: "State", value: "{{state}}" },
  { label: "Zip code", value: "{{zip}}" },
  { label: "Emergency contact name", value: "{{emergencyContactName}}" },
  { label: "Emergency contact phone", value: "{{emergencyContactPhone}}" },
];

export function AddEditConsentFormScreen({
  form,
  onNavigate,
  onSave,
  onBack,
  onPreview,
  onLogout,
}: AddEditConsentFormScreenProps) {
  const [title, setTitle] = useState(form?.title || "");
  const [content, setContent] = useState(form?.content || "");
  const [status, setStatus] = useState<"Active" | "Inactive">(form?.status || "Active");
  const [showVariablesDropdown, setShowVariablesDropdown] = useState(false);
  const quillRef = useRef<ReactQuill>(null);
  const [isGuided, setIsGuided] = useState(false);

  useEffect(() => {
    const activeGuide = localStorage.getItem("spinecloud_active_guide");
    const explicitlyGuided = activeGuide === "consentForms";
    const theoreticallyGuided = !isStepCompleted("consentForms") && activeGuide !== "skipped";
    setIsGuided(explicitlyGuided || theoreticallyGuided);
  }, []);

  const isFormValid = title.trim() !== "" && content.trim() !== "";

  const handleInsertVariable = (variable: string) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      if (range) {
        editor.insertText(range.index, variable);
        editor.setSelection(range.index + variable.length, 0);
      } else {
        // If no selection, append to the end
        const length = editor.getLength();
        editor.insertText(length, variable);
      }
    }
    setShowVariablesDropdown(false);
  };

  const handleSave = () => {
    if (isFormValid) {
      const consentFormData: Omit<ConsentForm, "id" | "createdAt" | "updatedAt"> = {
        title: title.trim(),
        content,
        status,
      };

      if (isGuided) {
        completeStep("consentForms");
        onSave(consentFormData);
        
        // Auto redirect back to list, or stay, or go to dashboard to finish.
        // E.g. timeout to navigate back to dashboard to see "All Done!"
        setTimeout(() => onNavigate("dashboard"), 100);
      } else {
        onSave(consentFormData);
      }
    }
  };

  // Quill modules configuration
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["link"],
        ["clean"],
      ],
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
  ];

  return (
    <ClinicAdminLayout activeMenu="consentForms" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to consent forms
          </button>

          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
            {form ? "Edit consent form" : "Add consent form"}
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Create or edit agreement templates with patient variable placeholders
          </p>
        </div>

        {/* Guided setup strip */}
        {isGuided && (
          <div className="mb-6 flex items-center gap-3 bg-primary-50 border border-primary-200 rounded-xl px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center shrink-0 text-white text-xs font-bold">5</div>
            <div>
              <p className="text-sm font-semibold text-primary-900">Step 5 of 5 — Configure Consent Forms</p>
              <p className="text-xs text-primary-700 mt-0.5">Create your mandatory documentation. This is the final step! You will be redirected to the dashboard after saving.</p>
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter consent form title"
              className="w-full h-10 px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-600 transition-[border-color,box-shadow]"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Status
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={status === "Active"}
                  onChange={() => setStatus("Active")}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-600 focus:ring-offset-0"
                />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={status === "Inactive"}
                  onChange={() => setStatus("Inactive")}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-600 focus:ring-offset-0"
                />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">Inactive</span>
              </label>
            </div>
          </div>

          {/* Rich Text Editor with Variable Insertion */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Content <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowVariablesDropdown(!showVariablesDropdown)}
                  className="inline-flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
                >
                  Insert patient variable
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showVariablesDropdown && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowVariablesDropdown(false)}
                    />
                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-1 w-64 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
                      {PATIENT_VARIABLES.map((variable, index) => (
                        <button
                          key={index}
                          onClick={() => handleInsertVariable(variable.value)}
                          className="w-full text-left px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                        >
                          <div className="font-medium">{variable.label}</div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-500">
                            {variable.value}
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-white dark:bg-neutral-900">
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                placeholder="Write your consent form content here..."
                className="consent-form-editor"
              />
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1.5">
              Use patient variables to automatically populate patient information when the form is generated
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <button
              onClick={onPreview}
              disabled={!isFormValid}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-neutral-300 dark:border-neutral-700 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="h-10 px-4 rounded-lg border border-neutral-300 dark:border-neutral-700 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!isFormValid}
                className="h-10 px-6 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
              >
                {form ? "Save changes" : "Create consent form"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .consent-form-editor .ql-container {
          min-height: 400px;
          font-size: 14px;
        }
        .consent-form-editor .ql-editor {
          min-height: 400px;
        }
        .consent-form-editor .ql-editor.ql-blank::before {
          font-style: normal;
          color: #a3a3a3;
        }
      `}</style>
    </ClinicAdminLayout>
  );
}