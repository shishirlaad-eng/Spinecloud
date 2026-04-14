import { useState } from "react";
import { Users, Plus, X } from "lucide-react";
import type { WizardData } from "../SetupWizard";

interface InviteStaffStepProps {
  data: WizardData;
  onNext: (data: Partial<WizardData>) => void;
  onSkip: () => void;
  onBack: () => void;
  onSaveAndExit: () => void;
}

interface StaffMember {
  email: string;
  role: string;
  locations: string[];
}

const roles = [
  "Front Desk",
  "Billing",
  "Scheduler",
  "Medical Assistant",
  "Office Manager",
];

export function InviteStaffStep({
  data,
  onNext,
  onSkip,
  onBack,
  onSaveAndExit,
}: InviteStaffStepProps) {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(
    data.staff.length > 0 ? data.staff : [{ email: "", role: "", locations: [] }]
  );
  const [errors, setErrors] = useState<Record<number, Record<string, string>>>({});

  const addStaffMember = () => {
    setStaffMembers([...staffMembers, { email: "", role: "", locations: [] }]);
  };

  const removeStaffMember = (index: number) => {
    setStaffMembers(staffMembers.filter((_, i) => i !== index));
    const newErrors = { ...errors };
    delete newErrors[index];
    setErrors(newErrors);
  };

  const updateStaffMember = (index: number, field: keyof StaffMember, value: any) => {
    const updated = [...staffMembers];
    updated[index] = { ...updated[index], [field]: value };
    setStaffMembers(updated);

    // Clear error for this field
    if (errors[index]?.[field]) {
      const newErrors = { ...errors };
      delete newErrors[index][field];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors: Record<number, Record<string, string>> = {};
    let isValid = true;

    staffMembers.forEach((member, index) => {
      if (member.email || member.role) {
        // If any field is filled, validate all required fields
        if (!member.email) {
          if (!newErrors[index]) newErrors[index] = {};
          newErrors[index].email = "Email is required";
          isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
          if (!newErrors[index]) newErrors[index] = {};
          newErrors[index].email = "Enter a valid email address";
          isValid = false;
        }

        if (!member.role) {
          if (!newErrors[index]) newErrors[index] = {};
          newErrors[index].role = "Please select a role";
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty staff members
    const validStaff = staffMembers.filter(
      (member) => member.email && member.role
    );

    if (validStaff.length > 0 && !validateForm()) {
      return;
    }

    onNext({
      staff: validStaff.map((member) => ({
        ...member,
        locations: data.location ? [data.location.name] : [],
      })),
    });
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-8">
      {/* Icon */}
      <div className="mb-6 flex justify-center">
        <div className="w-16 h-16 bg-primary-50 dark:bg-primary-950/30 rounded-full flex items-center justify-center">
          <Users className="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
          Invite staff members
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Add team members to help manage your clinic (optional)
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Info Banner */}
        <div className="p-4 bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg">
          <p className="text-sm text-primary-700 dark:text-primary-300">
            Invitation emails will be sent automatically. You can manage staff permissions
            later in the User Management section.
          </p>
        </div>

        {/* Staff Members */}
        <div className="space-y-4">
          {staffMembers.map((member, index) => (
            <div
              key={index}
              className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-neutral-900 dark:text-white">
                  Staff member {index + 1}
                </h4>
                {staffMembers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStaffMember(index)}
                    className="text-neutral-400 hover:text-destructive transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor={`email-${index}`}
                    className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
                  >
                    Email address
                  </label>
                  <input
                    id={`email-${index}`}
                    type="email"
                    placeholder="staff@clinic.com"
                    value={member.email}
                    onChange={(e) => updateStaffMember(index, "email", e.target.value)}
                    aria-invalid={!!errors[index]?.email}
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                  />
                  {errors[index]?.email && (
                    <p className="text-xs text-destructive mt-1">{errors[index].email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor={`role-${index}`}
                    className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
                  >
                    Role
                  </label>
                  <select
                    id={`role-${index}`}
                    value={member.role}
                    onChange={(e) => updateStaffMember(index, "role", e.target.value)}
                    aria-invalid={!!errors[index]?.role}
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                  >
                    <option value="">Select role</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  {errors[index]?.role && (
                    <p className="text-xs text-destructive mt-1">{errors[index].role}</p>
                  )}
                </div>
              </div>

              {data.location && (
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  Will be assigned to: <span className="font-medium">{data.location.name}</span>
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addStaffMember}
            className="inline-flex items-center gap-2 h-10 px-4 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-medium rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add another staff member
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={onBack}
            className="h-10 px-6 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-medium rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            Back
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onSkip}
              className="h-10 px-6 text-neutral-600 dark:text-neutral-400 text-sm font-medium hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Skip for now
            </button>
            <button
              type="submit"
              className="h-10 px-6 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors"
            >
              Complete setup
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
