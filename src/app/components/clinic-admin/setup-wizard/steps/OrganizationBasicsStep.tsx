import { useState } from "react";
import { Building2 } from "lucide-react";
import type { WizardData } from "../SetupWizard";

interface OrganizationBasicsStepProps {
  data: WizardData;
  onNext: (data: Partial<WizardData>) => void;
  onSkip: () => void;
  onSaveAndExit: () => void;
}

const timezones = [
  "America/New_York (EST/EDT)",
  "America/Chicago (CST/CDT)",
  "America/Denver (MST/MDT)",
  "America/Phoenix (MST)",
  "America/Los_Angeles (PST/PDT)",
  "America/Anchorage (AKST/AKDT)",
  "Pacific/Honolulu (HST)",
];

export function OrganizationBasicsStep({
  data,
  onNext,
  onSkip,
  onSaveAndExit,
}: OrganizationBasicsStepProps) {
  const [organizationName, setOrganizationName] = useState(data.organizationName);
  const [defaultTimezone, setDefaultTimezone] = useState(data.defaultTimezone);
  const [senderName, setSenderName] = useState(data.senderName);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "organizationName":
        if (!value.trim()) {
          error = "Organization name is required";
        }
        break;
      case "defaultTimezone":
        if (!value) {
          error = "Please select a timezone";
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  const handleBlur = (name: string, value: string) => {
    validateField(name, value);
  };

  const isFormValid = () => {
    return (
      organizationName.trim() &&
      defaultTimezone &&
      Object.values(errors).every((error) => !error)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onNext({
        organizationName,
        defaultTimezone,
        senderName,
      });
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-8">
      {/* Icon */}
      <div className="mb-6 flex justify-center">
        <div className="w-16 h-16 bg-primary-50 dark:bg-primary-950/30 rounded-full flex items-center justify-center">
          <Building2 className="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
          Organization basics
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Let's start with your organization's core information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Organization Name */}
        <div>
          <label
            htmlFor="organizationName"
            className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
          >
            Organization name <span className="text-destructive">*</span>
          </label>
          <input
            id="organizationName"
            type="text"
            placeholder="Downtown Medical Center"
            value={organizationName}
            onChange={(e) => {
              setOrganizationName(e.target.value);
              if (errors.organizationName) {
                setErrors((prev) => ({ ...prev, organizationName: "" }));
              }
            }}
            onBlur={(e) => handleBlur("organizationName", e.target.value)}
            aria-invalid={!!errors.organizationName}
            className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
          />
          {errors.organizationName && (
            <p className="text-xs text-destructive mt-1">{errors.organizationName}</p>
          )}
        </div>

        {/* Default Timezone */}
        <div>
          <label
            htmlFor="defaultTimezone"
            className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
          >
            Default timezone <span className="text-destructive">*</span>
          </label>
          <select
            id="defaultTimezone"
            value={defaultTimezone}
            onChange={(e) => {
              setDefaultTimezone(e.target.value);
              if (errors.defaultTimezone) {
                setErrors((prev) => ({ ...prev, defaultTimezone: "" }));
              }
            }}
            onBlur={(e) => handleBlur("defaultTimezone", e.target.value)}
            aria-invalid={!!errors.defaultTimezone}
            className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
          >
            <option value="">Select timezone</option>
            {timezones.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
          {errors.defaultTimezone && (
            <p className="text-xs text-destructive mt-1">{errors.defaultTimezone}</p>
          )}
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5">
            This timezone will be used for scheduling and appointments
          </p>
        </div>

        {/* Communication Sender Name */}
        <div>
          <label
            htmlFor="senderName"
            className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
          >
            Communication sender name
          </label>
          <input
            id="senderName"
            type="text"
            placeholder="SpineCloudIQ Team"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
          />
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5">
            Optional: This name will appear in emails sent to patients
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={onSkip}
            className="h-10 px-6 bg-neutral-100 text-neutral-600 text-sm font-medium rounded-lg hover:bg-neutral-200 active:bg-neutral-300 transition-colors"
          >
            Skip
          </button>
          <button
            type="submit"
            disabled={!isFormValid()}
            className="h-10 px-6 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}