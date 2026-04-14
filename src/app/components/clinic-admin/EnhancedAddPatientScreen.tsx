import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { ArrowLeft, Save, Mail, MessageSquare, AlertTriangle, UserPlus } from "lucide-react";
import { useState } from "react";

interface Branch {
  id: string;
  name: string;
}

interface Provider {
  id: string;
  firstName: string;
  lastName: string;
}

interface EnhancedAddPatientScreenProps {
  availableBranches: Branch[];
  availableProviders: Provider[];
  onNavigate: (menu: "dashboard" | "branches" | "questionnaires" | "roles" | "users" | "providers" | "consentForms" | "patients" | "master") => void;
  onBack: () => void;
  onSavePatient: (patientData: any) => void;
  onStartAssistedIntake?: (patientData: any) => void;
  onLogout?: () => void;
}

type OnboardingMode = "invite" | "draft" | "assisted";

export function EnhancedAddPatientScreen({
  availableBranches,
  availableProviders,
  onNavigate,
  onBack,
  onSavePatient,
  onStartAssistedIntake,
  onLogout,
}: EnhancedAddPatientScreenProps) {
  // Section 1: Basic Patient Information
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [primaryLocation, setPrimaryLocation] = useState("");
  const [assignedProvider, setAssignedProvider] = useState("");

  // Section 2: Onboarding Mode
  const [onboardingMode, setOnboardingMode] = useState<OnboardingMode>("invite");
  const [inviteChannel, setInviteChannel] = useState<"email" | "sms" | "both">("email");
  const [sendNow, setSendNow] = useState(true);

  // Duplicate detection
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [potentialDuplicates, setPotentialDuplicates] = useState<any[]>([]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!primaryLocation) newErrors.primaryLocation = "Primary location is required";

    // Contact validation based on mode
    if (onboardingMode === "invite") {
      if (!email && !phone) {
        newErrors.contact = "At least one contact method (email or phone) is required to send invitation";
      }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = "Enter a valid email address";
      }
      if (phone && !/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
        newErrors.phone = "Enter a valid 10-digit phone number";
      }
      if (inviteChannel === "email" && !email) {
        newErrors.email = "Email is required for email invitation";
      }
      if (inviteChannel === "sms" && !phone) {
        newErrors.phone = "Phone number is required for SMS invitation";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkForDuplicates = () => {
    // Simulate duplicate check
    // In real implementation, this would query the database
    const duplicates = [];
    
    if (email && email.toLowerCase().includes("john")) {
      duplicates.push({
        id: "dup-1",
        name: "Similar Name",
        email: email,
        phone: "(555) 123-4567",
      });
    }

    if (duplicates.length > 0) {
      setPotentialDuplicates(duplicates);
      setShowDuplicateWarning(true);
      return true;
    }

    return false;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    // Check for duplicates before creating
    if (checkForDuplicates()) {
      return; // Show duplicate warning
    }

    const patientData = {
      id: `patient-${Date.now()}`,
      firstName,
      lastName,
      email,
      phone,
      primaryLocation,
      assignedProvider: assignedProvider || undefined,
      status: onboardingMode === "draft" ? "Draft" : onboardingMode === "invite" ? "Invited" : "Active",
      intakeStatus: onboardingMode === "assisted" ? "In Progress" : "Not Started",
      insuranceStatus: "Missing",
      onboardingMode,
      invitationDetails: onboardingMode === "invite" ? {
        channel: inviteChannel,
        sendNow,
        sentDate: sendNow ? new Date().toISOString() : null,
      } : undefined,
      createdBy: "admin",
      createdDate: new Date().toISOString(),
    };

    if (onboardingMode === "assisted" && onStartAssistedIntake) {
      onStartAssistedIntake(patientData);
    } else {
      onSavePatient(patientData);
    }
  };

  const isFormValid = () => {
    const hasBasicInfo = firstName.trim() !== "" && lastName.trim() !== "" && primaryLocation !== "";
    
    if (onboardingMode === "invite") {
      const hasContact = email.trim() !== "" || phone.trim() !== "";
      const hasValidChannel = 
        (inviteChannel === "email" && email.trim() !== "") ||
        (inviteChannel === "sms" && phone.trim() !== "") ||
        (inviteChannel === "both" && email.trim() !== "" && phone.trim() !== "");
      return hasBasicInfo && hasContact && hasValidChannel;
    }

    return hasBasicInfo;
  };

  const getSubmitButtonText = () => {
    switch (onboardingMode) {
      case "invite":
        return sendNow ? "Create & send invitation" : "Create patient";
      case "draft":
        return "Create draft patient";
      case "assisted":
        return "Create & start intake";
      default:
        return "Create patient";
    }
  };

  return (
    <ClinicAdminLayout
      onNavigate={onNavigate}
      currentPage="patients"
      onLogout={onLogout}
    >
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group mb-4"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to patients</span>
          </button>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
            Add / pre-register patient
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Create a patient record and choose how to onboard them
          </p>
        </div>

        {/* Duplicate Warning */}
        {showDuplicateWarning && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
                  Potential duplicate patient detected
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                  We found {potentialDuplicates.length} patient(s) with similar information:
                </p>
                <div className="space-y-2 mb-3">
                  {potentialDuplicates.map((dup) => (
                    <div key={dup.id} className="p-2 bg-white dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800">
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                        {dup.name}
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        {dup.email} • {dup.phone}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDuplicateWarning(false)}
                    className="px-3 h-9 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                  >
                    Create anyway
                  </button>
                  <button
                    onClick={onBack}
                    className="px-3 h-9 border border-amber-600 dark:border-amber-400 text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <div className="p-6 space-y-8">
            {/* SECTION 1: Basic Patient Information */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide mb-4">
                Basic Patient Information
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
                    Email {onboardingMode === "invite" && inviteChannel !== "sms" && <span className="text-destructive">*</span>}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patient@email.com"
                    className="w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
                    Phone {onboardingMode === "invite" && inviteChannel !== "email" && <span className="text-destructive">*</span>}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    className="w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
                    Primary location <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={primaryLocation}
                    onChange={(e) => setPrimaryLocation(e.target.value)}
                    className="w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                  >
                    <option value="">Select location</option>
                    {availableBranches.map((branch) => (
                      <option key={branch.id} value={branch.name}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                  {errors.primaryLocation && (
                    <p className="text-xs text-destructive mt-1">{errors.primaryLocation}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
                    Assigned provider (optional)
                  </label>
                  <select
                    value={assignedProvider}
                    onChange={(e) => setAssignedProvider(e.target.value)}
                    className="w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                  >
                    <option value="">None</option>
                    {availableProviders.map((provider) => (
                      <option key={provider.id} value={`${provider.firstName} ${provider.lastName}`}>
                        {provider.firstName} {provider.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {errors.contact && (
                <p className="text-xs text-destructive mt-2">{errors.contact}</p>
              )}
            </div>

            {/* SECTION 2: Onboarding Mode */}
            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide mb-2">
                Onboarding Mode
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Choose how this patient will complete their registration
              </p>

              <div className="space-y-3">
                {/* Mode A: Invite Patient */}
                <label
                  className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                    onboardingMode === "invite"
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30 ring-2 ring-primary-500/20"
                      : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="onboardingMode"
                      checked={onboardingMode === "invite"}
                      onChange={() => setOnboardingMode("invite")}
                      className="w-4 h-4 mt-0.5 text-primary-600 border-neutral-300 dark:border-neutral-700"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Mail className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                          Invite patient to complete onboarding
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                        Patient will receive an invitation to complete their profile and intake online
                      </p>

                      {onboardingMode === "invite" && (
                        <div className="space-y-3 pl-1">
                          <div>
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-2">
                              Send invitation via
                            </label>
                            <div className="flex gap-4">
                              {(["email", "sms", "both"] as const).map((channel) => (
                                <label key={channel} className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="inviteChannel"
                                    checked={inviteChannel === channel}
                                    onChange={() => setInviteChannel(channel)}
                                    className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700"
                                  />
                                  <span className="text-sm text-neutral-700 dark:text-neutral-300 capitalize">
                                    {channel === "both" ? "Email & SMS" : channel}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={sendNow}
                              onChange={(e) => setSendNow(e.target.checked)}
                              className="w-4 h-4 mt-0.5 text-primary-600 border-neutral-300 dark:border-neutral-700 rounded"
                            />
                            <div>
                              <span className="text-sm font-medium text-neutral-900 dark:text-white block">
                                Send now
                              </span>
                              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                                Invitation will be sent immediately after creation
                              </span>
                            </div>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </label>

                {/* Mode B: Draft Patient */}
                <label
                  className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                    onboardingMode === "draft"
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30 ring-2 ring-primary-500/20"
                      : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="onboardingMode"
                      checked={onboardingMode === "draft"}
                      onChange={() => setOnboardingMode("draft")}
                      className="w-4 h-4 mt-0.5 text-primary-600 border-neutral-300 dark:border-neutral-700"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <UserPlus className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                          Create draft (staff-managed)
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Patient record created without login access. Staff can manage internally and book appointments
                      </p>
                    </div>
                  </div>
                </label>

                {/* Mode C: Assisted Intake */}
                <label
                  className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                    onboardingMode === "assisted"
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30 ring-2 ring-primary-500/20"
                      : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="onboardingMode"
                      checked={onboardingMode === "assisted"}
                      onChange={() => setOnboardingMode("assisted")}
                      className="w-4 h-4 mt-0.5 text-primary-600 border-neutral-300 dark:border-neutral-700"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                          Complete intake on behalf of patient
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Staff will complete the full intake process immediately. Useful for in-person registrations
                      </p>
                    </div>
                  </div>
                </label>
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
              {getSubmitButtonText()}
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Invitation expiry
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Patient invitations expire after 7 days. You can resend invitations from the patient list or profile page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ClinicAdminLayout>
  );
}
