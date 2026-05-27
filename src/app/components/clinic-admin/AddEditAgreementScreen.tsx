import { useState, useRef, useMemo, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  AlertCircle,
  ArrowLeft,
  ChevronDown,
  Eye,
  FileSignature,
  Plus,
  Save,
} from "lucide-react";
import { completeStep, isStepCompleted } from "../shared/walkthroughUtils";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";

interface Agreement {
  id: string;
  title: string;
  content: string;
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}

interface AddEditAgreementScreenProps {
  agreement: Agreement | null;
  onNavigate: (menu: any) => void;
  onSave: (agreement: Omit<Agreement, "id" | "createdAt" | "updatedAt">) => void;
  onBack: () => void;
  onPreview: () => void;
  onLogout?: () => void;
}

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

export function AddEditAgreementScreen({
  agreement,
  onNavigate,
  onSave,
  onBack,
  onPreview,
  onLogout,
}: AddEditAgreementScreenProps) {
  const [title, setTitle] = useState(agreement?.title || "");
  const [content, setContent] = useState(agreement?.content || "");
  const [status, setStatus] = useState<"Active" | "Inactive">(agreement?.status || "Active");
  const [showVariablesDropdown, setShowVariablesDropdown] = useState(false);
  const quillRef = useRef<ReactQuill>(null);
  const [isGuided, setIsGuided] = useState(false);

  useEffect(() => {
    const activeGuide = localStorage.getItem("spinecloud_active_guide");
    const explicitlyGuided = activeGuide === "agreements";
    const theoreticallyGuided = !isStepCompleted("agreements") && activeGuide !== "skipped";
    setIsGuided(explicitlyGuided || theoreticallyGuided);
  }, []);

  const isFormValid = title.trim() !== "" && content.trim() !== "";
  const pageTitle = agreement ? "Edit Agreement" : "Create Custom Agreement";
  const contentText = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const statusBadgeClass =
    status === "Active"
      ? "border-success-200 bg-success-50 text-success-700 dark:border-success-800 dark:bg-success-950/30 dark:text-success-400"
      : "border-neutral-200 bg-neutral-50 text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300";

  const handleInsertVariable = (variable: string) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      if (range) {
        editor.insertText(range.index, variable);
        editor.setSelection(range.index + variable.length, 0);
      } else {
        const length = editor.getLength();
        editor.insertText(length, variable);
      }
    }
    setShowVariablesDropdown(false);
  };

  const handleSave = () => {
    if (isFormValid) {
      const agreementData: Omit<Agreement, "id" | "createdAt" | "updatedAt"> = {
        title: title.trim(),
        content,
        status,
      };

      if (isGuided) {
        completeStep("agreements");
        onSave(agreementData);
        setTimeout(() => onNavigate("dashboard"), 100);
      } else {
        onSave(agreementData);
      }
    }
  };

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
    <ClinicAdminLayout activeMenu="agreements" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-5 md:p-6">
        <div className="mb-5">
          <button
            onClick={onBack}
            className="group inline-flex h-9 items-center gap-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Agreements
          </button>

          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                <span>Clinic Admin</span>
                <span className="text-neutral-300 dark:text-neutral-700">/</span>
                <span>Base Setup</span>
                <span className="text-neutral-300 dark:text-neutral-700">/</span>
                <span>Agreements</span>
                <span className="text-neutral-300 dark:text-neutral-700">/</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">{pageTitle}</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <h1
                  className="font-semibold text-neutral-900 dark:text-white"
                  style={{ fontSize: "18px", lineHeight: "24px" }}
                >
                  {pageTitle}
                </h1>
                <span className={`inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium ${statusBadgeClass}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${status === "Active" ? "bg-success-500" : "bg-neutral-400"}`} />
                  {status}
                </span>
              </div>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                Create or edit legal agreement templates with patient variable placeholders
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={onPreview}
                disabled={!isFormValid}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <Eye className="h-4 w-4" />
                Preview
              </button>
              <button
                onClick={onBack}
                className="inline-flex h-9 items-center rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!isFormValid}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary-600 px-4 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:pointer-events-none disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {agreement ? "Save Changes" : "Create Agreement"}
              </button>
            </div>
          </div>
        </div>

        {isGuided && (
          <div className="mb-5 flex items-center gap-3 rounded-lg border border-primary-200 bg-primary-50 px-4 py-3 dark:border-primary-900 dark:bg-primary-950/20">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-xs font-semibold text-white">5</div>
            <div>
              <p className="text-sm font-semibold text-primary-900 dark:text-primary-100">Step 5 of 5 - Configure Agreements</p>
              <p className="mt-0.5 text-xs text-primary-700 dark:text-primary-300">Create your mandatory documentation. This is the final step; you will be redirected to the dashboard after saving.</p>
            </div>
          </div>
        )}

        <div className="mb-5 rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400">
              <FileSignature className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Agreement Overview</h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Public document settings and content readiness</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950/40">
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Title</p>
              <p className="mt-1 truncate text-sm font-semibold text-neutral-900 dark:text-white">{title || "Untitled agreement"}</p>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950/40">
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Content</p>
              <p className="mt-1 text-sm font-semibold text-neutral-900 dark:text-white">{contentText ? `${contentText.length} characters` : "Not started"}</p>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950/40">
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Status</p>
              <p className="mt-1 text-sm font-semibold text-neutral-900 dark:text-white">{status}</p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <section className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Agreement Information</h2>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Name and availability for this agreement template</p>
              </div>
              {!isFormValid && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-warning-200 bg-warning-50 px-2.5 py-1 text-xs font-medium text-warning-700 dark:border-warning-900 dark:bg-warning-950/20 dark:text-warning-300">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Required fields missing
                </span>
              )}
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Title <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter agreement title"
                  className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 transition-[border-color,box-shadow] placeholder:text-neutral-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/10 dark:!border-neutral-800 dark:!bg-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")}
                  className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 transition-[border-color,box-shadow] focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/10 dark:!border-neutral-800 dark:!bg-neutral-900 dark:text-neutral-100"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Agreement Content</h2>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Compose patient-facing legal language and insert supported variables</p>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowVariablesDropdown(!showVariablesDropdown)}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium text-primary-600 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-primary-400 dark:hover:bg-neutral-800"
                >
                  <Plus className="h-4 w-4" />
                  Insert patient variable
                  <ChevronDown className="h-4 w-4" />
                </button>
                {showVariablesDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowVariablesDropdown(false)}
                    />
                    <div className="absolute right-0 top-full z-20 mt-2 max-h-64 w-64 overflow-y-auto rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
                      {PATIENT_VARIABLES.map((variable) => (
                        <button
                          key={variable.value}
                          onClick={() => handleInsertVariable(variable.value)}
                          className="w-full px-3 py-2 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
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
            <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
              Content <span className="text-destructive">*</span>
            </label>
            <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                placeholder="Write your agreement content here..."
                className="agreement-editor"
              />
            </div>
            <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-500">
              Use patient variables to automatically populate patient information when the agreement is generated
            </p>
          </section>

          <div className="sticky bottom-0 z-10 flex items-center justify-between border-t border-neutral-200 bg-white/95 px-1 py-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95">
            <button
              onClick={onPreview}
              disabled={!isFormValid}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="h-9 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!isFormValid}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary-600 px-4 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:pointer-events-none disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {agreement ? "Save Changes" : "Create Agreement"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .agreement-editor .ql-toolbar {
          border: 0;
          border-bottom: 1px solid rgb(229 229 229);
          background: rgb(250 250 250);
        }
        .agreement-editor .ql-container {
          min-height: 360px;
          border: 0;
          background: transparent;
          font-size: 14px;
        }
        .agreement-editor .ql-editor {
          min-height: 360px;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        }
        .agreement-editor .ql-editor.ql-blank::before {
          color: #a3a3a3;
          font-style: normal;
        }
        .dark .agreement-editor .ql-toolbar {
          border-bottom-color: rgb(38 38 38);
          background: rgb(23 23 23);
        }
        .dark .agreement-editor .ql-editor {
          color: rgb(245 245 245);
        }
      `}</style>
    </ClinicAdminLayout>
  );
}
