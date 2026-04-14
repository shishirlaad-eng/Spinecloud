import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { ArrowLeft, Save, Mail, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface Branch {
  id: string;
  name: string;
}

interface VisitType {
  id: string;
  name: string;
  duration: number;
}

interface AddEditProviderScreenProps {
  availableBranches: Branch[];
  availableVisitTypes?: VisitType[];
  existingProvider?: any;
  onNavigate: (menu: "dashboard" | "branches" | "questionnaires" | "roles" | "users" | "providers") => void;
  onBack: () => void;
  onSaveProvider: (provider: any) => void;
  onLogout?: () => void;
}

const SPECIALTY_OPTIONS = [
  "Physical Therapy",
  "Chiropractic",
  "Orthopedic Surgery",
  "Sports Medicine",
  "Pain Management",
  "Neurology",
  "Rehabilitation Medicine",
];

const SUBSPECIALTY_OPTIONS = [
  "Neck / Shoulder",
  "Lower Back",
  "Hip / Knee",
  "Sports Injuries",
  "Post-Surgical Rehabilitation",
  "Chronic Pain",
  "Neurological Disorders",
];

export function AddEditProviderScreen({
  availableBranches,
  availableVisitTypes = [],
  existingProvider,
  onNavigate,
  onBack,
  onSaveProvider,
  onLogout,
}: AddEditProviderScreenProps) {
  const isEditMode = !!existingProvider;

  // Section 1: Provider Identity
  const [firstName, setFirstName] = useState(existingProvider?.firstName || "");
  const [lastName, setLastName] = useState(existingProvider?.lastName || "");
  const [email, setEmail] = useState(existingProvider?.email || "");
  const [phone, setPhone] = useState(existingProvider?.phone || "");
  const [providerType] = useState("Provider"); // Unified doctor/therapist

  // Section 2: Professional Details
  const [specialty, setSpecialty] = useState(existingProvider?.specialty || "");
  const [subspecialtyTags, setSubspecialtyTags] = useState<string[]>(
    existingProvider?.subspecialtyTags || []
  );
  const [bio, setBio] = useState(existingProvider?.bio || "");

  // Section 3: Location Assignment
  const [selectedBranches, setSelectedBranches] = useState<string[]>(
    existingProvider?.branches || []
  );

  // Section 4: Visit Type Eligibility
  const [enabledVisitTypes, setEnabledVisitTypes] = useState<string[]>(
    existingProvider?.enabledVisitTypes || []
  );

  // Section 5: Self-Booking Eligibility
  const [selfBookingEnabled, setSelfBookingEnabled] = useState(
    existingProvider?.selfBookingEligible || false
  );
  const [anyProviderEnabled, setAnyProviderEnabled] = useState(
    existingProvider?.anyProviderEnabled || false
  );

  // Section 6: Account Status & Invitation
  const [accountStatus, setAccountStatus] = useState<"Invited" | "Active" | "Suspended">(
    existingProvider?.accountStatus || "Active"
  );
  const [sendInvitation, setSendInvitation] = useState(!isEditMode);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleToggleBranch = (branchId: string) => {
    if (selectedBranches.includes(branchId)) {
      setSelectedBranches(selectedBranches.filter((b) => b !== branchId));
    } else {
      setSelectedBranches([...selectedBranches, branchId]);
    }
  };

  const handleToggleVisitType = (visitTypeId: string) => {
    if (enabledVisitTypes.includes(visitTypeId)) {
      setEnabledVisitTypes(enabledVisitTypes.filter((v) => v !== visitTypeId));
    } else {
      setEnabledVisitTypes([...enabledVisitTypes, visitTypeId]);
    }
  };

  const handleToggleSubspecialty = (tag: string) => {
    if (subspecialtyTags.includes(tag)) {
      setSubspecialtyTags(subspecialtyTags.filter((t) => t !== tag));
    } else {
      setSubspecialtyTags([...subspecialtyTags, tag]);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!specialty) newErrors.specialty = "Specialty is required";
    if (selectedBranches.length === 0) {
      newErrors.branches = "At least one location must be assigned";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const providerData = {
      id: existingProvider?.id || `provider-${Date.now()}`,
      firstName,
      lastName,
      email,
      phone,
      providerType,
      specialty,
      subspecialtyTags,
      bio,
      branches: selectedBranches,
      enabledVisitTypes,
      selfBookingEligible: selfBookingEnabled,
      anyProviderEnabled,
      accountStatus,
      status: accountStatus, // For backward compatibility
      sendInvitation: !isEditMode && sendInvitation,
      availabilityStatus: existingProvider?.availabilityStatus || "Not Configured",
      hasSchedule: existingProvider?.hasSchedule || false,
      hasVisitTypes: enabledVisitTypes.length > 0,
    };

    onSaveProvider(providerData);
  };

  const isFormValid = () => {
    return (
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      email.trim() !== "" &&
      specialty !== "" &&
      selectedBranches.length > 0
    );
  };

  return (
    <ClinicAdminLayout
      onNavigate={onNavigate}
      currentPage="providers"
      onLogout={onLogout}
    >
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group mb-4"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to providers</span>
          </button>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
            {isEditMode ? "Edit provider" : "Add provider"}
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {isEditMode
              ? "Update provider information and settings"
              : "Create a new provider profile with scheduling permissions"}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <div className="p-6 space-y-8">
            {/* SECTION 1: Provider Identity */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide mb-4">
                Provider Identity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
                    First name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                    className="w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                  />
                  {errors.firstName && (
                    <p className="text-xs text-destructive mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
                    Last name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                    className="w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                  />
                  {errors.lastName && (
                    <p className="text-xs text-destructive mt-1">{errors.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="provider@clinic.com"
                    className="w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    className="w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
                    Provider type
                  </label>
                  <input
                    type="text"
                    value={providerType}
                    disabled
                    className="w-full h-10 px-3 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-600 dark:text-neutral-400 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: Professional Details */}
            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide mb-4">
                Professional Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
                    Specialty <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                  >
                    <option value="">Select specialty</option>
                    {SPECIALTY_OPTIONS.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                  {errors.specialty && (
                    <p className="text-xs text-destructive mt-1">{errors.specialty}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
                    Sub-specialty tags (optional)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {SUBSPECIALTY_OPTIONS.map((tag) => (
                      <label
                        key={tag}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={subspecialtyTags.includes(tag)}
                          onChange={() => handleToggleSubspecialty(tag)}
                          className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700 rounded"
                        />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                          {tag}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
                    Bio (optional)
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Provider biography for patient-facing profiles..."
                    rows={4}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: Location Assignment */}
            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide mb-2">
                Location Assignment
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Select which locations this provider will work at
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableBranches.map((branch) => (
                  <label
                    key={branch.id}
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedBranches.includes(branch.id)
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30 ring-2 ring-primary-500/20"
                        : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedBranches.includes(branch.id)}
                      onChange={() => handleToggleBranch(branch.id)}
                      className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700 rounded"
                    />
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">
                      {branch.name}
                    </span>
                  </label>
                ))}
              </div>
              {errors.branches && (
                <p className="text-xs text-destructive mt-2">{errors.branches}</p>
              )}
            </div>

            {/* SECTION 4: Visit Type Eligibility */}
            {availableVisitTypes.length > 0 && (
              <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide mb-2">
                  Visit Type Eligibility
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  Select which visit types this provider can perform
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableVisitTypes.map((visitType) => (
                    <label
                      key={visitType.id}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={enabledVisitTypes.includes(visitType.id)}
                        onChange={() => handleToggleVisitType(visitType.id)}
                        className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700 rounded"
                      />
                      <div>
                        <span className="text-sm font-medium text-neutral-900 dark:text-white">
                          {visitType.name}
                        </span>
                        <span className="text-sm text-neutral-500 dark:text-neutral-400 ml-2">
                          ({visitType.duration} min)
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 5: Self-Booking Eligibility */}
            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide mb-2">
                Patient Self-Booking
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Control provider visibility in patient-facing booking
              </p>
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selfBookingEnabled}
                    onChange={(e) => setSelfBookingEnabled(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-primary-600 border-neutral-300 dark:border-neutral-700 rounded"
                  />
                  <div>
                    <span className="text-sm font-medium text-neutral-900 dark:text-white block">
                      Allow patients to book this provider
                    </span>
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                      Provider will appear in patient-facing scheduling
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={anyProviderEnabled}
                    onChange={(e) => setAnyProviderEnabled(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-primary-600 border-neutral-300 dark:border-neutral-700 rounded"
                  />
                  <div>
                    <span className="text-sm font-medium text-neutral-900 dark:text-white block">
                      Include in "Any available provider" option
                    </span>
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                      Patients selecting any provider may be assigned to this provider
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* SECTION 6: Account Status & Invitation */}
            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide mb-4">
                Account Status
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-2">
                    Status
                  </label>
                  <div className="flex gap-4">
                    {(["Active", "Suspended", "Invited"] as const).map((status) => (
                      <label
                        key={status}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="accountStatus"
                          checked={accountStatus === status}
                          onChange={() => setAccountStatus(status)}
                          className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700"
                        />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                          {status}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {!isEditMode && (
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendInvitation}
                      onChange={(e) => setSendInvitation(e.target.checked)}
                      className="w-4 h-4 mt-0.5 text-primary-600 border-neutral-300 dark:border-neutral-700 rounded"
                    />
                    <div>
                      <span className="text-sm font-medium text-neutral-900 dark:text-white block">
                        Send invitation email
                      </span>
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">
                        Provider will receive an email to set up their account
                      </span>
                    </div>
                  </label>
                )}

                {isEditMode && existingProvider?.accountStatus === "Invited" && (
                  <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Invitation sent
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-0.5">
                        Invitation was sent on{" "}
                        {existingProvider.invitationDate
                          ? new Date(existingProvider.invitationDate).toLocaleDateString()
                          : "unknown date"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-200 dark:border-neutral-800 rounded-b-xl flex items-center justify-between">
            <button
              onClick={onBack}
              className="px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className="inline-flex items-center gap-2 px-6 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              <Save className="w-4 h-4" />
              {isEditMode ? "Save changes" : "Create provider"}
            </button>
          </div>
        </div>

        {/* Configure Availability CTA (for new providers) */}
        {!isEditMode && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Configure availability after creation
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  After creating this provider, you'll be able to set their working hours,
                  appointment buffers, and booking rules.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ClinicAdminLayout>
  );
}
