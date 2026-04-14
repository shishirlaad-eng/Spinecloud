import { useState, useRef } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { ArrowLeft, Save } from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  body: string;
  variables: string[];
  enabled: boolean;
  category: "Appointment" | "Payment" | "Account" | "Clinical";
}

interface EditEmailTemplateScreenProps {
  template: EmailTemplate;
  onNavigate: (menu: "dashboard" | "branches" | "questionnaires" | "roles" | "users" | "providers" | "consentForms" | "patients" | "master" | "subscription" | "calendar" | "appointment-categories" | "invoices" | "payments" | "email-management" | "clinic-settings" | "tickets") => void;
  onBack: () => void;
  onSave: (template: EmailTemplate) => void;
  onLogout?: () => void;
}

export function EditEmailTemplateScreen({
  template,
  onNavigate,
  onBack,
  onSave,
  onLogout,
}: EditEmailTemplateScreenProps) {
  const [editedTemplate, setEditedTemplate] = useState<EmailTemplate>(template);
  const subjectInputRef = useRef<HTMLInputElement>(null);
  const bodyTextareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInsertVariable = (variable: string, field: "subject" | "body") => {
    const variableText = `{${variable}}`;
    
    if (field === "subject" && subjectInputRef.current) {
      const input = subjectInputRef.current;
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const currentValue = editedTemplate.subject;
      const newValue = 
        currentValue.substring(0, start) + 
        variableText + 
        currentValue.substring(end);
      
      setEditedTemplate({ ...editedTemplate, subject: newValue });
      
      // Set cursor position after inserted variable
      setTimeout(() => {
        input.focus();
        const newPosition = start + variableText.length;
        input.setSelectionRange(newPosition, newPosition);
      }, 0);
    } else if (field === "body" && bodyTextareaRef.current) {
      const textarea = bodyTextareaRef.current;
      const start = textarea.selectionStart || 0;
      const end = textarea.selectionEnd || 0;
      const currentValue = editedTemplate.body;
      const newValue = 
        currentValue.substring(0, start) + 
        variableText + 
        currentValue.substring(end);
      
      setEditedTemplate({ ...editedTemplate, body: newValue });
      
      // Set cursor position after inserted variable
      setTimeout(() => {
        textarea.focus();
        const newPosition = start + variableText.length;
        textarea.setSelectionRange(newPosition, newPosition);
      }, 0);
    }
  };

  const handleSave = () => {
    onSave(editedTemplate);
    onBack();
  };

  const handleToggleStatus = () => {
    setEditedTemplate({ ...editedTemplate, enabled: !editedTemplate.enabled });
  };

  return (
    <ClinicAdminLayout activeMenu="email-management" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to email management
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                Edit template
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                {template.name} - {template.description}
              </p>
            </div>

            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 h-10 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm"
            >
              <Save className="w-4 h-4" />
              Save changes
            </button>
          </div>
        </div>

        {/* Main Content - Full Width */}
        <div className="max-w-6xl">
          <div className="space-y-6">
            {/* Status Toggle */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Template status
                  </label>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Control whether this template is active and can be used for sending emails
                  </p>
                </div>
                <button
                  onClick={handleToggleStatus}
                  className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors ${
                    editedTemplate.enabled
                      ? "bg-success-600"
                      : "bg-neutral-300 dark:bg-neutral-700"
                  }`}
                >
                  <span
                    className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform ${
                      editedTemplate.enabled ? "translate-x-11" : "translate-x-1"
                    }`}
                  />
                  <span
                    className={`absolute text-xs font-medium transition-opacity ${
                      editedTemplate.enabled
                        ? "left-2 text-white"
                        : "right-2 text-neutral-600 dark:text-neutral-400"
                    }`}
                  >
                    {editedTemplate.enabled ? "Active" : "Inactive"}
                  </span>
                </button>
              </div>
            </div>

            {/* Subject Field */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Subject line <span className="text-destructive">*</span>
                  </label>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleInsertVariable(e.target.value, "subject");
                        e.target.value = "";
                      }
                    }}
                    className="h-9 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                  >
                    <option value="">Insert variable</option>
                    {editedTemplate.variables.map((variable) => (
                      <option key={variable} value={variable}>
                        {variable}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                  The subject line that will appear in the recipient's inbox. Use variables from the dropdown to personalize the subject for each patient.
                </p>
              </div>
              <input
                ref={subjectInputRef}
                type="text"
                value={editedTemplate.subject}
                onChange={(e) =>
                  setEditedTemplate({ ...editedTemplate, subject: e.target.value })
                }
                className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                placeholder="Enter subject line"
              />
            </div>

            {/* Body Field */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Email body <span className="text-destructive">*</span>
                  </label>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleInsertVariable(e.target.value, "body");
                        e.target.value = "";
                      }
                    }}
                    className="h-9 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                  >
                    <option value="">Insert variable</option>
                    {editedTemplate.variables.map((variable) => (
                      <option key={variable} value={variable}>
                        {variable}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                  The main content of the email. Place your cursor where you want to insert a variable, then select it from the dropdown above. Variables appear as {`{variableName}`} and will be automatically replaced with actual values when the email is sent to patients.
                </p>
              </div>
              <textarea
                ref={bodyTextareaRef}
                value={editedTemplate.body}
                onChange={(e) =>
                  setEditedTemplate({ ...editedTemplate, body: e.target.value })
                }
                rows={32}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow] resize-none font-mono leading-relaxed"
                placeholder="Enter email body"
              />
            </div>
          </div>
        </div>
      </div>
    </ClinicAdminLayout>
  );
}
