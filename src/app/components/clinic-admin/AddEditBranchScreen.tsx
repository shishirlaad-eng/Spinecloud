import { useState, useEffect } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { Building2, X, Plus, Trash2, MapPin, ArrowLeft } from "lucide-react";
import { completeStep, isStepCompleted } from "../shared/walkthroughUtils";

interface WorkingHours {
  monday: { open: string; close: string; isOpen: boolean };
  tuesday: { open: string; close: string; isOpen: boolean };
  wednesday: { open: string; close: string; isOpen: boolean };
  thursday: { open: string; close: string; isOpen: boolean };
  friday: { open: string; close: string; isOpen: boolean };
  saturday: { open: string; close: string; isOpen: boolean };
  sunday: { open: string; close: string; isOpen: boolean };
}

interface Branch {
  id?: string;
  name: string;
  clinicName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  status: "Active" | "Inactive";
  workingHours: WorkingHours;
  selfBookingEnabled: boolean;
  allowPatientCancel: boolean;
  allowPatientReschedule: boolean;
  minNoticeHours: number;
  maxFutureDays: number;
  cancellationWindow: number;
  rescheduleWindow: number;
  allowStaffOverrides: boolean;
}

interface AddEditBranchScreenProps {
  branch?: Branch;
  mode: "add" | "edit";
  onNavigate: (menu: any) => void;
  onBack: () => void;
  onSave: (branch: Branch) => void;
  onLogout?: () => void;
}

export function AddEditBranchScreen({
  branch,
  mode,
  onNavigate,
  onBack,
  onSave,
  onLogout,
}: AddEditBranchScreenProps) {
  const [name, setName] = useState(branch?.name || "");
  const [clinicName, setClinicName] = useState(branch?.clinicName || "");
  const [email, setEmail] = useState(branch?.email || "");
  const [street, setStreet] = useState(branch?.street || "");
  const [city, setCity] = useState(branch?.city || "");
  const [state, setState] = useState(branch?.state || "");
  const [zip, setZip] = useState(branch?.zip || "");
  const [country, setCountry] = useState(branch?.country || "US");
  const [status, setStatus] = useState<"Active" | "Inactive">(branch?.status || "Active");
  
  const [workingHours, setWorkingHours] = useState<WorkingHours>(
    branch?.workingHours || {
      monday: { open: "09:00", close: "17:00", isOpen: true },
      tuesday: { open: "09:00", close: "17:00", isOpen: true },
      wednesday: { open: "09:00", close: "17:00", isOpen: true },
      thursday: { open: "09:00", close: "17:00", isOpen: true },
      friday: { open: "09:00", close: "17:00", isOpen: true },
      saturday: { open: "09:00", close: "13:00", isOpen: false },
      sunday: { open: "09:00", close: "13:00", isOpen: false },
    }
  );

  // Booking Settings
  const [selfBookingEnabled, setSelfBookingEnabled] = useState(branch?.selfBookingEnabled ?? false);
  const [allowPatientCancel, setAllowPatientCancel] = useState(branch?.allowPatientCancel ?? true);
  const [allowPatientReschedule, setAllowPatientReschedule] = useState(branch?.allowPatientReschedule ?? true);
  const [minNoticeHours, setMinNoticeHours] = useState(branch?.minNoticeHours || 24);
  const [maxFutureDays, setMaxFutureDays] = useState(branch?.maxFutureDays || 30);
  const [cancellationWindow, setCancellationWindow] = useState(branch?.cancellationWindow || 24);
  const [rescheduleWindow, setRescheduleWindow] = useState(branch?.rescheduleWindow || 12);
  const [allowStaffOverrides, setAllowStaffOverrides] = useState(branch?.allowStaffOverrides ?? true);
  const [isHovered, setIsHovered] = useState(false);
  const [isGuided, setIsGuided] = useState(false);

  useEffect(() => {
    const activeGuide = localStorage.getItem("spinecloud_active_guide");
    // Show guide strip if this was explicitly clicked from the checklist, OR if it's the user's first time (step not completed)
    const explicitlyGuided = activeGuide === "branches";
    const theoreticallyGuided = !isStepCompleted("branches") && activeGuide !== "skipped";
    setIsGuided((explicitlyGuided || theoreticallyGuided) && mode === "add");
  }, [mode]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const usStates = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
    "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ];

  const days: (keyof WorkingHours)[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const handleWorkingHoursChange = (
    day: keyof WorkingHours,
    field: "open" | "close" | "isOpen",
    value: string | boolean
  ) => {
    setWorkingHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Branch name is required";
    if (!clinicName.trim()) newErrors.clinicName = "Clinic name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!street.trim()) newErrors.street = "Street address is required";
    if (!city.trim()) newErrors.city = "City is required";
    if (!state) newErrors.state = "State is required";
    if (!zip.trim()) newErrors.zip = "Zip code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const branchData: Branch = {
      ...(branch?.id && { id: branch.id }),
      name,
      clinicName,
      email,
      street,
      city,
      state,
      zip,
      country,
      status,
      workingHours,
      selfBookingEnabled,
      allowPatientCancel,
      allowPatientReschedule,
      minNoticeHours,
      maxFutureDays,
      cancellationWindow,
      rescheduleWindow,
      allowStaffOverrides,
    };

    if (isGuided) {
      const nextRoute = completeStep("branches");
      onSave(branchData);
      if (nextRoute) {
        // give onSave a moment to execute
        setTimeout(() => onNavigate(nextRoute as any), 100);
      }
    } else {
      onSave(branchData);
    }
  };

  return (
    <ClinicAdminLayout activeMenu="branches" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group mb-4"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Branches
            </button>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
              {mode === "add" ? "Add New Branch" : "Edit Branch"}
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {mode === "add"
                ? "Create a new branch location for your clinic"
                : "Update branch information and settings"}
            </p>
          </div>

          {/* Guided setup strip */}
        {isGuided && (
          <div className="mb-6 flex items-center gap-3 bg-primary-50 border border-primary-200 rounded-xl px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center shrink-0 text-white text-xs font-bold">1</div>
            <div>
              <p className="text-sm font-semibold text-primary-900">Step 1 of 5 — Add a Branch</p>
              <p className="text-xs text-primary-700 mt-0.5">Please provide your clinic's location details, operating hours, and contact information. Once saved, you will be automatically redirected to configure user roles.</p>
            </div>
          </div>
        )}

          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 mb-6">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-wide mb-4">
                Basic information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                      Branch name <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Downtown Branch"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      aria-invalid={!!errors.name}
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="clinicName" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                      Clinic name <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="clinicName"
                      type="text"
                      placeholder="SpineCloudIQ Clinic"
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      aria-invalid={!!errors.clinicName}
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                    />
                    {errors.clinicName && (
                      <p className="text-xs text-destructive mt-1">{errors.clinicName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                    Email address <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="branch@clinic.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!errors.email}
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="status" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                    Status <span className="text-destructive">*</span>
                  </label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")}
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 mb-6">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-wide mb-4">
                Address information
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="street" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                    Street address <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="street"
                    type="text"
                    placeholder="123 Main Street, Suite 400"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    aria-invalid={!!errors.street}
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                  />
                  {errors.street && (
                    <p className="text-xs text-destructive mt-1">{errors.street}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                      City <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="city"
                      type="text"
                      placeholder="New York"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      aria-invalid={!!errors.city}
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                    />
                    {errors.city && (
                      <p className="text-xs text-destructive mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="state" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                      State <span className="text-destructive">*</span>
                    </label>
                    <select
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      aria-invalid={!!errors.state}
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                    >
                      <option value="">Select state</option>
                      {usStates.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-xs text-destructive mt-1">{errors.state}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="zip" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                      Zip code <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="zip"
                      type="text"
                      placeholder="10001"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      aria-invalid={!!errors.zip}
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                    />
                    {errors.zip && (
                      <p className="text-xs text-destructive mt-1">{errors.zip}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="country" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                      Country <span className="text-destructive">*</span>
                    </label>
                    <select
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 mb-6">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-wide mb-4">
                Working hours
              </h2>
              <div className="space-y-3">
                {days.map((day) => (
                  <div
                    key={day}
                    className="flex items-center gap-4 p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3 w-32">
                      <input
                        type="checkbox"
                        id={`${day}-open`}
                        checked={workingHours[day].isOpen}
                        onChange={(e) =>
                          handleWorkingHoursChange(day, "isOpen", e.target.checked)
                        }
                        className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500/20"
                      />
                      <label
                        htmlFor={`${day}-open`}
                        className="text-sm font-medium text-neutral-700 dark:text-neutral-300 capitalize"
                      >
                        {day}
                      </label>
                    </div>

                    {workingHours[day].isOpen ? (
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="time"
                          value={workingHours[day].open}
                          onChange={(e) =>
                            handleWorkingHoursChange(day, "open", e.target.value)
                          }
                          className="flex h-9 px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                        />
                        <span className="text-sm text-neutral-500">to</span>
                        <input
                          type="time"
                          value={workingHours[day].close}
                          onChange={(e) =>
                            handleWorkingHoursChange(day, "close", e.target.value)
                          }
                          className="flex h-9 px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 flex-1">
                        Closed
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Settings */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 mb-6">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-wide mb-4">
                Booking settings
              </h2>
              <div className="space-y-4">
                {/* Self-Booking Toggle */}
                <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">Enable self-booking</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Allow patients to book appointments online</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selfBookingEnabled}
                      onChange={(e) => setSelfBookingEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-300 dark:bg-neutral-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                {/* Booking Window */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="minNoticeHours" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                      Minimum notice (hours)
                    </label>
                    <input
                      id="minNoticeHours"
                      type="number"
                      min="0"
                      value={minNoticeHours}
                      onChange={(e) => setMinNoticeHours(parseInt(e.target.value))}
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                    />
                  </div>

                  <div>
                    <label htmlFor="maxFutureDays" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                      Max future booking (days)
                    </label>
                    <input
                      id="maxFutureDays"
                      type="number"
                      min="1"
                      value={maxFutureDays}
                      onChange={(e) => setMaxFutureDays(parseInt(e.target.value))}
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                    />
                  </div>
                </div>

                {/* Patient Actions */}
                <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">Allow patient cancellation</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Let patients cancel their own appointments</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowPatientCancel}
                      onChange={(e) => setAllowPatientCancel(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-300 dark:bg-neutral-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">Allow patient rescheduling</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Let patients reschedule their appointments</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowPatientReschedule}
                      onChange={(e) => setAllowPatientReschedule(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-300 dark:bg-neutral-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                {/* Cancellation & Reschedule Windows */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cancellationWindow" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                      Cancellation window (hours)
                    </label>
                    <input
                      id="cancellationWindow"
                      type="number"
                      min="0"
                      value={cancellationWindow}
                      onChange={(e) => setCancellationWindow(parseInt(e.target.value))}
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                    />
                  </div>

                  <div>
                    <label htmlFor="rescheduleWindow" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                      Reschedule window (hours)
                    </label>
                    <input
                      id="rescheduleWindow"
                      type="number"
                      min="0"
                      value={rescheduleWindow}
                      onChange={(e) => setRescheduleWindow(parseInt(e.target.value))}
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                    />
                  </div>
                </div>

                {/* Staff Overrides */}
                <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">Allow staff overrides</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Let staff bypass booking restrictions when needed</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowStaffOverrides}
                      onChange={(e) => setAllowStaffOverrides(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-300 dark:bg-neutral-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
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
                {mode === "add" ? "Add Branch" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ClinicAdminLayout>
  );
}