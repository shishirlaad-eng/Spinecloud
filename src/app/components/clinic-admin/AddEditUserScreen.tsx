import { useState } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { ArrowLeft, User, Mail } from "lucide-react";

interface UserData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
}

interface AddEditUserScreenProps {
  user?: UserData;
  mode: "add" | "edit";
  availableRoles: { name: string, description: string }[];
  onNavigate: (menu: "dashboard" | "branches" | "questionnaires" | "roles" | "users") => void;
  onBack: () => void;
  onSave: (user: UserData) => void;
  onLogout?: () => void;
}

export function AddEditUserScreen({
  user,
  mode,
  availableRoles,
  onNavigate,
  onBack,
  onSave,
  onLogout,
}: AddEditUserScreenProps) {
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "");
  const [status, setStatus] = useState<"Active" | "Inactive">(user?.status || "Active");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!role) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const userData: UserData = {
      ...(user?.id && { id: user.id }),
      firstName,
      lastName,
      email,
      role,
      status,
    };

    onSave(userData);
  };

  return (
    <ClinicAdminLayout activeMenu="users" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group mb-4"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Users
            </button>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
              {mode === "add" ? "Invite New User" : "Edit User"}
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {mode === "add"
                ? "Invite a new staff member to your clinic"
                : "Update user information and role assignment"}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* User Information */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-wide">
                  User information
                </h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
                    >
                      First name <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      aria-invalid={!!errors.firstName}
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                    />
                    {errors.firstName && (
                      <p className="text-xs text-destructive mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
                    >
                      Last name <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      aria-invalid={!!errors.lastName}
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                    />
                    {errors.lastName && (
                      <p className="text-xs text-destructive mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
                  >
                    Email address <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!errors.email}
                    disabled={mode === "edit"}
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive mt-1">{errors.email}</p>
                  )}
                  {mode === "add" && (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                      An invitation will be sent to this email address
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Role Assignment */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-wide">
                  Role assignment
                </h2>
              </div>
              <div>
                <label
                  htmlFor="role"
                  className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
                >
                  Select role <span className="text-destructive">*</span>
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  aria-invalid={!!errors.role}
                  className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                >
                  <option value="">Select a role</option>
                  {availableRoles.map((r) => (
                    <option key={r.name} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="text-xs text-destructive mt-1">{errors.role}</p>
                )}
                {role && (
                  <div className="mt-3 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <p className="text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-1">Role Description</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {availableRoles.find(r => r.name === role)?.description}
                    </p>
                  </div>
                )}
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                  This user will inherit all permissions from the selected role
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-wide mb-1">
                    USER STATUS
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Control if this user can currently access the system
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${status === "Active" ? "text-success-600" : "text-neutral-500"}`}>
                    {status}
                  </span>
                  <button
                    type="button"
                    onClick={() => setStatus(status === "Active" ? "Inactive" : "Active")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      status === "Active" ? "bg-primary-600" : "bg-neutral-300 dark:bg-neutral-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        status === "Active" ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
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
                {mode === "add" ? "Send Invitation" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ClinicAdminLayout>
  );
}