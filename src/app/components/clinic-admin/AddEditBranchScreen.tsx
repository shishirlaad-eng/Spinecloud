import { useState, useEffect } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import {
  Building2,
  X,
  MapPin,
  Mail,
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Clock,
  Settings,
  AlertCircle,
  Save,
} from "lucide-react";
import { completeStep, isStepCompleted } from "../shared/walkthroughUtils";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Tab config ───────────────────────────────────────────────────────────────

type TabId = "basic" | "address" | "hours" | "booking";

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "basic",   label: "Basic Info",        icon: Building2 },
  { id: "address", label: "Address",           icon: MapPin    },
  { id: "hours",   label: "Operational Hours", icon: Clock     },
  { id: "booking", label: "Booking Settings",  icon: Settings  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function AddEditBranchScreen({
  branch,
  mode,
  onNavigate,
  onBack,
  onSave,
  onLogout,
}: AddEditBranchScreenProps) {
  // ── form state ──────────────────────────────────────────────────────────────
  const [name,    setName]    = useState(branch?.name    || "");
  const [email,   setEmail]   = useState(branch?.email   || "");
  const [street,  setStreet]  = useState(branch?.street  || "");
  const [city,    setCity]    = useState(branch?.city    || "");
  const [state,   setState]   = useState(branch?.state   || "");
  const [zip,     setZip]     = useState(branch?.zip     || "");
  const [country, setCountry] = useState(branch?.country || "US");
  const [status,  setStatus]  = useState<"Active" | "Inactive">(branch?.status || "Active");

  const [workingHours, setWorkingHours] = useState<WorkingHours>(
    branch?.workingHours || {
      monday:    { open: "09:00", close: "17:00", isOpen: true  },
      tuesday:   { open: "09:00", close: "17:00", isOpen: true  },
      wednesday: { open: "09:00", close: "17:00", isOpen: true  },
      thursday:  { open: "09:00", close: "17:00", isOpen: true  },
      friday:    { open: "09:00", close: "17:00", isOpen: true  },
      saturday:  { open: "09:00", close: "13:00", isOpen: false },
      sunday:    { open: "09:00", close: "13:00", isOpen: false },
    }
  );

  const [selfBookingEnabled,    setSelfBookingEnabled]    = useState(branch?.selfBookingEnabled    ?? false);
  const [allowPatientCancel,    setAllowPatientCancel]    = useState(branch?.allowPatientCancel    ?? true);
  const [allowPatientReschedule,setAllowPatientReschedule]= useState(branch?.allowPatientReschedule?? true);
  const [minNoticeHours,        setMinNoticeHours]        = useState(branch?.minNoticeHours        || 24);
  const [maxFutureDays,         setMaxFutureDays]         = useState(branch?.maxFutureDays         || 30);
  const [cancellationWindow,    setCancellationWindow]    = useState(branch?.cancellationWindow    || 24);
  const [rescheduleWindow,      setRescheduleWindow]      = useState(branch?.rescheduleWindow      || 12);
  const [allowStaffOverrides,   setAllowStaffOverrides]   = useState(branch?.allowStaffOverrides   ?? true);

  // ── UI state ────────────────────────────────────────────────────────────────
  const [activeTab,           setActiveTab]           = useState<TabId>("basic");
  const [errors,              setErrors]              = useState<Record<string, string>>({});
  const [isGuided,            setIsGuided]            = useState(false);
  const [showKnowledgePanel,  setShowKnowledgePanel]  = useState(false);
  const [expandedSection,     setExpandedSection]     = useState<string | null>("overview");

  useEffect(() => {
    const activeGuide = localStorage.getItem("spinecloud_active_guide");
    const explicitlyGuided  = activeGuide === "branches";
    const theoreticallyGuided = !isStepCompleted("branches") && activeGuide !== "skipped";
    setIsGuided((explicitlyGuided || theoreticallyGuided) && mode === "add");
  }, [mode]);

  // ── helpers ─────────────────────────────────────────────────────────────────
  const usStates = [
    "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
    "Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky",
    "Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
    "Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico",
    "New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
    "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
    "Virginia","Washington","West Virginia","Wisconsin","Wyoming",
  ];

  const days: (keyof WorkingHours)[] = [
    "monday","tuesday","wednesday","thursday","friday","saturday","sunday",
  ];

  const handleWorkingHoursChange = (
    day: keyof WorkingHours,
    field: "open" | "close" | "isOpen",
    value: string | boolean
  ) => {
    setWorkingHours((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
  };

  // ── validation — jumps to the first tab that has errors ────────────────────
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim())  newErrors.name  = "Branch name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!street.trim()) newErrors.street = "Street address is required";
    if (!city.trim())   newErrors.city   = "City is required";
    if (!state)         newErrors.state  = "State is required";
    if (!zip.trim())    newErrors.zip    = "Zip code is required";

    setErrors(newErrors);

    // Jump to the first offending tab
    if (newErrors.name || newErrors.email) { setActiveTab("basic");   return false; }
    if (newErrors.street || newErrors.city || newErrors.state || newErrors.zip) {
      setActiveTab("address"); return false;
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const branchData: Branch = {
      ...(branch?.id && { id: branch.id }),
      name, clinicName: "", email, street, city, state, zip, country, status,
      workingHours, selfBookingEnabled, allowPatientCancel, allowPatientReschedule,
      minNoticeHours, maxFutureDays, cancellationWindow, rescheduleWindow, allowStaffOverrides,
    };

    if (isGuided) {
      const nextRoute = completeStep("branches");
      onSave(branchData);
      if (nextRoute) setTimeout(() => onNavigate(nextRoute as any), 100);
    } else {
      onSave(branchData);
    }
  };

  // ── tab error indicators ────────────────────────────────────────────────────
  const tabHasError: Record<TabId, boolean> = {
    basic:   !!(errors.name  || errors.email),
    address: !!(errors.street || errors.city || errors.state || errors.zip),
    hours:   false,
    booking: false,
  };

  // ── shared style tokens ─────────────────────────────────────────────────────
  const inputCls =
    "flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive";
  const selectCls =
    "flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]";
  const labelCls = "text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5";
  const toggleTrackCls =
    "w-11 h-6 bg-neutral-300 dark:bg-neutral-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600";
  const isEditMode = mode === "edit";
  const useDetailLayout = true;
  const branchTitle = name.trim() || (isEditMode ? "Edit Branch" : "Add New Branch");
  const branchInitials = branchTitle
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "BR";
  const openDayCount = days.filter((day) => workingHours[day].isOpen).length;
  const fullAddress = [street, city, state, zip].filter(Boolean).join(", ");
  const formId = "branch-edit-form";

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <ClinicAdminLayout
      activeMenu="branches"
      onNavigate={onNavigate}
      onLogout={onLogout}
      onOpenHelpGuide={() => setShowKnowledgePanel(true)}
    >
      <div className={useDetailLayout ? "p-5 md:p-6 bg-white dark:bg-neutral-950" : "p-6"}>
        <div className={useDetailLayout ? "max-w-[100%] mx-auto" : "max-w-3xl mx-auto"}>

          {/* ── Page Header ───────────────────────────────────────────────── */}
          {useDetailLayout ? (
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-white dark:border-neutral-800 bg-primary-100 dark:bg-primary-950/50 text-base font-bold text-primary-600 dark:text-primary-400 shadow-sm">
                  {branchInitials}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h1 className="text-[18px] font-semibold text-neutral-900 dark:text-white">
                      {branchTitle}
                    </h1>
                    <div className="w-px h-5 bg-neutral-300 dark:bg-neutral-700" />
                    <span className="text-sm text-neutral-900 dark:text-white font-medium">
                      {isEditMode ? "Branch Location" : "New Branch Location"}
                    </span>
                    <span className="text-neutral-400 dark:text-neutral-600">•</span>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      {branch?.id || (isEditMode ? "Branch Profile" : "Draft Branch")}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    <span className="inline-flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      {email || "branch@clinic.com"}
                    </span>
                    <span className="text-neutral-400 dark:text-neutral-600">•</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {fullAddress || "Address not added"}
                    </span>
                    <span className="text-neutral-400 dark:text-neutral-600">•</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {openDayCount} days open
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      <span className={`w-1.5 h-1.5 rounded-full ${status === "Active" ? "bg-emerald-500" : "bg-rose-500"}`} />
                      {status}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      <span className={`w-1.5 h-1.5 rounded-full ${selfBookingEnabled ? "bg-primary-600" : "bg-neutral-400"}`} />
                      Self-booking {selfBookingEnabled ? "enabled" : "disabled"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <button
                  type="button"
                  onClick={onBack}
                  className="h-9 px-4 flex items-center justify-center gap-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors text-sm font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="submit"
                  form={formId}
                  className="h-9 px-5 flex items-center justify-center gap-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors text-sm font-medium"
                >
                  <Save className="w-4 h-4" />
                  {isEditMode ? "Save Changes" : "Add Branch"}
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6 flex items-start justify-between">
              <div>
                <button
                  onClick={onBack}
                  className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group mb-3"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  Back to Branches
                </button>
                <h1 className="text-lg font-semibold text-neutral-900 dark:text-white mb-0.5">
                  Add New Branch
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Create a new branch location for your clinic
                </p>
              </div>
              <button
                type="submit"
                form={formId}
                className="h-9 px-5 flex items-center justify-center gap-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors text-sm font-medium"
              >
                <Save className="w-4 h-4" />
                Add Branch
              </button>
            </div>
          )}

          {/* ── Guided setup strip ────────────────────────────────────────── */}
          {isGuided && (
            <div className="mb-5 flex items-center gap-3 bg-primary-50 border border-primary-200 rounded-xl px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center shrink-0 text-white text-xs font-bold">1</div>
              <div>
                <p className="text-sm font-semibold text-primary-900">Step 1 of 5 — Add a Branch</p>
                <p className="text-xs text-primary-700 mt-0.5">Provide your clinic's location details, operating hours, and contact information. Once saved you'll be redirected to configure user roles.</p>
              </div>
            </div>
          )}

          {/* ── Tabbed form card ──────────────────────────────────────────── */}
          <div className={useDetailLayout ? "flex flex-col xl:flex-row gap-6" : ""}>
          <form id={formId} onSubmit={handleSubmit} className={useDetailLayout ? "w-full xl:w-[70%]" : ""}>
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">

              {/* Tab bar */}
              <div className="flex border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  const hasErr   = tabHasError[tab.id];
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center gap-2 px-5 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                        isActive
                          ? "border-primary-600 text-primary-600 dark:text-primary-400 font-semibold"
                          : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                      {hasErr && (
                        <span className="w-1.5 h-1.5 rounded-full bg-destructive absolute top-2.5 right-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* ── Tab: Basic Info ──────────────────────────────────────── */}
              {activeTab === "basic" && (
                <div className="px-6 py-6 space-y-5">
                  <div>
                    <label htmlFor="name" className={labelCls}>
                      Branch name <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Downtown Branch"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      aria-invalid={!!errors.name}
                      className={inputCls}
                    />
                    {errors.name && (
                      <p className="flex items-center gap-1.5 text-xs text-destructive mt-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />{errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className={labelCls}>
                      Email address <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="branch@clinic.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={!!errors.email}
                      className={inputCls}
                    />
                    {errors.email && (
                      <p className="flex items-center gap-1.5 text-xs text-destructive mt-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />{errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="status" className={labelCls}>
                      Status <span className="text-destructive">*</span>
                    </label>
                    <select
                      id="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")}
                      className={selectCls}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              )}

              {/* ── Tab: Address ─────────────────────────────────────────── */}
              {activeTab === "address" && (
                <div className="px-6 py-6 space-y-5">
                  <div>
                    <label htmlFor="street" className={labelCls}>
                      Street address <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="street"
                      type="text"
                      placeholder="123 Main Street, Suite 400"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      aria-invalid={!!errors.street}
                      className={inputCls}
                    />
                    {errors.street && (
                      <p className="flex items-center gap-1.5 text-xs text-destructive mt-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />{errors.street}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="country" className={labelCls}>
                        Country <span className="text-destructive">*</span>
                      </label>
                      <select
                        id="country"
                        value={country}
                        onChange={(e) => { setCountry(e.target.value); setState(""); }}
                        className={selectCls}
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="state" className={labelCls}>
                        State <span className="text-destructive">*</span>
                      </label>
                      <select
                        id="state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        aria-invalid={!!errors.state}
                        className={selectCls}
                      >
                        <option value="">Select state</option>
                        {usStates.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {errors.state && (
                        <p className="flex items-center gap-1.5 text-xs text-destructive mt-1.5">
                          <AlertCircle className="w-3.5 h-3.5" />{errors.state}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className={labelCls}>
                        City <span className="text-destructive">*</span>
                      </label>
                      <input
                        id="city"
                        type="text"
                        placeholder="New York"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        aria-invalid={!!errors.city}
                        className={inputCls}
                      />
                      {errors.city && (
                        <p className="flex items-center gap-1.5 text-xs text-destructive mt-1.5">
                          <AlertCircle className="w-3.5 h-3.5" />{errors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="zip" className={labelCls}>
                        Zip code <span className="text-destructive">*</span>
                      </label>
                      <input
                        id="zip"
                        type="text"
                        placeholder="10001"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        aria-invalid={!!errors.zip}
                        className={inputCls}
                      />
                      {errors.zip && (
                        <p className="flex items-center gap-1.5 text-xs text-destructive mt-1.5">
                          <AlertCircle className="w-3.5 h-3.5" />{errors.zip}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Tab: Operational Hours ───────────────────────────────── */}
              {activeTab === "hours" && (
                <div className="px-6 py-6">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                    Toggle each day open or closed and set the opening and closing time.
                  </p>
                  <div className="space-y-2">
                    {days.map((day) => (
                      <div
                        key={day}
                        className="flex items-center gap-4 px-4 py-3 border border-neutral-200 dark:border-neutral-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3 w-32 shrink-0">
                          <input
                            type="checkbox"
                            id={`${day}-open`}
                            checked={workingHours[day].isOpen}
                            onChange={(e) => handleWorkingHoursChange(day, "isOpen", e.target.checked)}
                            className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500/20"
                          />
                          <label
                            htmlFor={`${day}-open`}
                            className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
                          >
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                          </label>
                        </div>

                        {workingHours[day].isOpen ? (
                          <div className="flex items-center gap-3 flex-1">
                            <input
                              type="time"
                              value={workingHours[day].open}
                              onChange={(e) => handleWorkingHoursChange(day, "open", e.target.value)}
                              className="h-9 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                            />
                            <span className="text-xs text-neutral-400">to</span>
                            <input
                              type="time"
                              value={workingHours[day].close}
                              onChange={(e) => handleWorkingHoursChange(day, "close", e.target.value)}
                              className="h-9 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                            />
                          </div>
                        ) : (
                          <span className="text-sm text-neutral-400 dark:text-neutral-500">Closed</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Tab: Booking Settings ────────────────────────────────── */}
              {activeTab === "booking" && (
                <div className="px-6 py-6 space-y-5">

                  {/* Self-Booking */}
                  <div className="flex items-center justify-between py-3 px-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">Enable self-booking</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Allow patients to book appointments online</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={selfBookingEnabled} onChange={(e) => setSelfBookingEnabled(e.target.checked)} className="sr-only peer" />
                      <div className={toggleTrackCls} />
                    </label>
                  </div>

                  {/* Booking Window */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="minNoticeHours" className={labelCls}>Minimum notice (hours)</label>
                      <input
                        id="minNoticeHours"
                        type="number"
                        min="0"
                        value={minNoticeHours}
                        onChange={(e) => setMinNoticeHours(parseInt(e.target.value))}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label htmlFor="maxFutureDays" className={labelCls}>Max future booking (days)</label>
                      <input
                        id="maxFutureDays"
                        type="number"
                        min="1"
                        value={maxFutureDays}
                        onChange={(e) => setMaxFutureDays(parseInt(e.target.value))}
                        className={inputCls}
                      />
                    </div>
                  </div>

                  {/* Cancellation */}
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-800/50">
                      <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">Allow patient cancellation</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Let patients cancel their own appointments</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={allowPatientCancel} onChange={(e) => setAllowPatientCancel(e.target.checked)} className="sr-only peer" />
                        <div className={toggleTrackCls} />
                      </label>
                    </div>
                    {allowPatientCancel && (
                      <div className="px-4 pb-4 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                        <label htmlFor="cancellationWindow" className={labelCls}>Cancellation window (hours)</label>
                        <input
                          id="cancellationWindow"
                          type="number"
                          min="0"
                          value={cancellationWindow}
                          onChange={(e) => setCancellationWindow(parseInt(e.target.value))}
                          className={`${inputCls} max-w-[200px]`}
                        />
                      </div>
                    )}
                  </div>

                  {/* Rescheduling */}
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-800/50">
                      <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">Allow patient rescheduling</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Let patients reschedule their appointments</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={allowPatientReschedule} onChange={(e) => setAllowPatientReschedule(e.target.checked)} className="sr-only peer" />
                        <div className={toggleTrackCls} />
                      </label>
                    </div>
                    {allowPatientReschedule && (
                      <div className="px-4 pb-4 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                        <label htmlFor="rescheduleWindow" className={labelCls}>Rescheduling window (hours)</label>
                        <input
                          id="rescheduleWindow"
                          type="number"
                          min="0"
                          value={rescheduleWindow}
                          onChange={(e) => setRescheduleWindow(parseInt(e.target.value))}
                          className={`${inputCls} max-w-[200px]`}
                        />
                      </div>
                    )}
                  </div>

                  {/* Staff Overrides */}
                  <div className="flex items-center justify-between py-3 px-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">Allow staff overrides</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Let staff bypass booking restrictions when needed</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={allowStaffOverrides} onChange={(e) => setAllowStaffOverrides(e.target.checked)} className="sr-only peer" />
                      <div className={toggleTrackCls} />
                    </label>
                  </div>
                </div>
              )}

              {/* ── Footer actions (always visible) ─────────────────────── */}
              <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 flex items-center justify-between gap-3">
                {/* Tab stepper hint */}
                <p className="text-xs text-neutral-400 dark:text-neutral-500 hidden sm:block">
                  Tab {TABS.findIndex((t) => t.id === activeTab) + 1} of {TABS.length}
                  {" — "}{TABS.find((t) => t.id === activeTab)?.label}
                </p>

                <div className="flex items-center gap-3 ml-auto">
                  <button
                    type="button"
                    onClick={onBack}
                    className="h-9 px-5 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-9 px-6 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm"
                  >
                    {mode === "add" ? "Add Branch" : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </form>
          {useDetailLayout && (
            <aside className="w-full xl:w-[30%] space-y-6">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
                  <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Branch Controls</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-neutral-50 dark:bg-neutral-800/50 px-4 py-4">
                    <div>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">Status</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 uppercase">{status}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={status === "Active"}
                        onChange={(e) => setStatus(e.target.checked ? "Active" : "Inactive")}
                        className="sr-only peer"
                      />
                      <div className={toggleTrackCls} />
                    </label>
                  </div>
                  <div className="rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/20 px-4 py-4">
                    <p className="text-sm leading-relaxed text-amber-800 dark:text-amber-300">
                      Changing branch status can affect staff scheduling, provider availability, and patient-facing booking access for this location.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
                  <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Booking Summary</h2>
                </div>
                <div className="p-6 grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 px-3 py-3">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Open Days</p>
                    <p className="mt-1 text-lg font-semibold text-neutral-900 dark:text-white">{openDayCount}</p>
                  </div>
                  <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 px-3 py-3">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Notice</p>
                    <p className="mt-1 text-lg font-semibold text-neutral-900 dark:text-white">{minNoticeHours}h</p>
                  </div>
                  <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 px-3 py-3">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Future</p>
                    <p className="mt-1 text-lg font-semibold text-neutral-900 dark:text-white">{maxFutureDays}d</p>
                  </div>
                  <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 px-3 py-3">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Overrides</p>
                    <p className="mt-1 text-lg font-semibold text-neutral-900 dark:text-white">{allowStaffOverrides ? "On" : "Off"}</p>
                  </div>
                </div>
              </div>
            </aside>
          )}
          </div>
        </div>
      </div>

      {/* ── Knowledge Panel Overlay ─────────────────────────────────────────── */}
      {showKnowledgePanel && (
        <>
          <div className="fixed inset-0 bg-neutral-950/40 z-40" onClick={() => setShowKnowledgePanel(false)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-primary-50 dark:bg-primary-950/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/40 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-900 dark:text-white">Branches Management</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Knowledge Guide</p>
                </div>
              </div>
              <button onClick={() => setShowKnowledgePanel(false)} className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto text-left">
              {[
                {
                  id: "overview",
                  title: "What is Branches Management?",
                  content: (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      The <strong className="text-neutral-800 dark:text-neutral-200">Branches Management</strong> module allows your clinic to manage one or more physical locations under a single SpineCloudIQ account. Each branch has its own address, contact information, operational hours, providers, and booking configuration.
                    </p>
                  ),
                },
                {
                  id: "locations",
                  title: "Adding & Managing Locations",
                  content: (
                    <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed">
                      <p>When you create a new branch, you will be asked to provide:</p>
                      <ul className="list-disc list-inside space-y-1 pl-1">
                        <li><strong className="text-neutral-700 dark:text-neutral-300">Branch Name</strong> – Unique name to identify the location</li>
                        <li><strong className="text-neutral-700 dark:text-neutral-300">Full Address</strong> – Street, city, state, ZIP, and country</li>
                        <li><strong className="text-neutral-700 dark:text-neutral-300">Contact Email</strong> – Primary email for this branch</li>
                        <li><strong className="text-neutral-700 dark:text-neutral-300">Status</strong> – Active or Inactive</li>
                      </ul>
                    </div>
                  ),
                },
                {
                  id: "hours",
                  title: "Operational Hours",
                  content: (
                    <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed">
                      <p>Each branch can have its own operational hours configured per day of the week. You can toggle each day as <strong className="text-neutral-700 dark:text-neutral-300">Open</strong> or <strong className="text-neutral-700 dark:text-neutral-300">Closed</strong> and set the opening and closing time.</p>
                    </div>
                  ),
                },
                {
                  id: "booking",
                  title: "Booking Settings",
                  content: (
                    <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-3 leading-relaxed">
                      <p>Each branch has its own booking configuration:</p>
                      <div className="space-y-2">
                        <div><p className="font-medium text-neutral-700 dark:text-neutral-300">Enable Self-Booking</p><p>When enabled, patients can book directly from the patient portal.</p></div>
                        <div><p className="font-medium text-neutral-700 dark:text-neutral-300">Minimum Notice Period</p><p>Minimum hours in advance that an appointment must be booked.</p></div>
                        <div><p className="font-medium text-neutral-700 dark:text-neutral-300">Maximum Future Booking Date</p><p>Limits how far in advance appointments can be scheduled.</p></div>
                      </div>
                    </div>
                  ),
                },
                {
                  id: "cancellation",
                  title: "Cancellation Policy",
                  content: (
                    <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed">
                      <ul className="list-disc list-inside space-y-1 pl-1">
                        <li><strong className="text-neutral-700 dark:text-neutral-300">Allow Cancellations</strong> – Toggle patient-facing cancellation ability</li>
                        <li><strong className="text-neutral-700 dark:text-neutral-300">Cancellation Window</strong> – Minimum hours before the appointment that a cancellation is allowed</li>
                      </ul>
                    </div>
                  ),
                },
                {
                  id: "reschedule",
                  title: "Rescheduling Policy",
                  content: (
                    <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed">
                      <ul className="list-disc list-inside space-y-1 pl-1">
                        <li><strong className="text-neutral-700 dark:text-neutral-300">Allow Rescheduling</strong> – Permits patients to move their appointment</li>
                        <li><strong className="text-neutral-700 dark:text-neutral-300">Rescheduling Window</strong> – Minimum hours in advance required</li>
                      </ul>
                    </div>
                  ),
                },
                {
                  id: "staff-override",
                  title: "Staff Override",
                  content: (
                    <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed">
                      <p>Controls whether clinic staff can bypass standard booking restrictions for this branch.</p>
                      <ul className="list-disc list-inside space-y-1 pl-1">
                        <li>When <strong className="text-neutral-700 dark:text-neutral-300">enabled</strong>, staff can book outside configured patient-facing rules</li>
                        <li>When <strong className="text-neutral-700 dark:text-neutral-300">disabled</strong>, staff are subject to the same restrictions as patients</li>
                      </ul>
                    </div>
                  ),
                },
              ].map((section) => {
                const isExpanded = expandedSection === section.id;
                return (
                  <div key={section.id} className="border-b border-neutral-100 dark:border-neutral-800">
                    <button
                      type="button"
                      onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                      className="w-full flex items-center justify-between gap-3 px-5 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors text-left"
                    >
                      <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{section.title}</span>
                      {isExpanded
                        ? <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0" />
                        : <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />}
                    </button>
                    {isExpanded && <div className="px-5 pb-5 pt-1">{section.content}</div>}
                  </div>
                );
              })}
            </div>

            <div className="px-5 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/30">
              <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center">
                This guide reflects the current configuration capabilities of the Branches module in SpineCloudIQ.
              </p>
            </div>
          </div>
        </>
      )}
    </ClinicAdminLayout>
  );
}
