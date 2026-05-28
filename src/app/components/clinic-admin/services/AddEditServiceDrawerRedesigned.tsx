import { useState, useEffect } from "react";
import { ClinicAdminLayout } from "../layout/ClinicAdminLayout";
import {
  ArrowLeft,
  Save,
  X,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Check,
  Search,
  Stethoscope,
  DollarSign,
  MapPin,
  Clock,
  BookOpen,
  AlertCircle,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface BookingWindow {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  slotCapacity: number;
}

interface Service {
  id: string;
  name: string;
  price: number;
  locationIds: string[];
  bookingWindows: BookingWindow[];
  allowOnlineBooking: boolean;
  isActive: boolean;
}

interface Location {
  id: string;
  name: string;
}

type TabId = "basic" | "locations" | "booking";

interface AddEditServiceDrawerRedesignedProps {
  service: Service | null;
  locations: Location[];
  providers?: any[];
  rooms?: any[];
  questionnaires?: any[];
  onNavigate: (menu: any) => void;
  onBack: () => void;
  onSave: (service: Partial<Service>) => void;
  onLogout?: () => void;
}

// ── Tab config ────────────────────────────────────────────────────────────────

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "basic",     label: "Basic Info",      icon: Stethoscope },
  { id: "locations", label: "Locations",       icon: MapPin      },
  { id: "booking",   label: "Booking Windows", icon: Clock       },
];

const FORM_ID = "service-edit-form";

// ── Component ──────────────────────────────────────────────────────────────────

export function AddEditServiceDrawerRedesigned({
  service,
  locations,
  onNavigate,
  onBack,
  onSave,
  onLogout,
}: AddEditServiceDrawerRedesignedProps) {
  const isEditMode = !!service;

  // ── Form state ──────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState<Partial<Service>>({
    name: "",
    price: 0,
    locationIds: [],
    bookingWindows: [{ id: "window-1", startTime: "09:00", endTime: "17:00", duration: 30, slotCapacity: 1 }],
    allowOnlineBooking: true,
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // ── UI state ────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<TabId>("basic");
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [showKnowledgePanel, setShowKnowledgePanel] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("overview");

  // ── Init ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (service) {
      setFormData({ ...service });
    } else {
      setFormData({
        name: "",
        price: 0,
        locationIds: [],
        bookingWindows: [{ id: "window-1", startTime: "09:00", endTime: "17:00", duration: 30, slotCapacity: 1 }],
        allowOnlineBooking: true,
        isActive: true,
      });
    }
    setFormErrors({});
    setActiveTab("basic");
  }, [service]);

  // ── Derived ─────────────────────────────────────────────────────────────────
  const serviceTitle = formData.name?.trim() || (isEditMode ? "Edit Service" : "New Service");
  const serviceInitials = formData.name?.trim()
    ? formData.name.trim().split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("")
    : isEditMode ? "ES" : "NS";

  const filteredLocations = locations.filter((l) =>
    l.name.toLowerCase().includes(locationSearchQuery.toLowerCase())
  );

  // ── Validation ──────────────────────────────────────────────────────────────
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name?.trim()) errors.name = "Service name is required";
    if (formData.price === undefined || formData.price < 0) errors.price = "Price must be 0 or greater";
    if (!formData.locationIds || formData.locationIds.length === 0)
      errors.locationIds = "At least one location is required";
    formData.bookingWindows?.forEach((window, index) => {
      if (!window.startTime) errors[`window-${index}-startTime`] = "Start time is required";
      if (!window.endTime)   errors[`window-${index}-endTime`]   = "End time is required";
      if (window.startTime && window.endTime && window.startTime >= window.endTime)
        errors[`window-${index}-endTime`] = "End time must be after start time";
      if (!window.slotCapacity || window.slotCapacity < 1)
        errors[`window-${index}-slotCapacity`] = "Capacity must be at least 1";
    });
    setFormErrors(errors);
    // jump to first offending tab
    if (errors.name || errors.price)                                  { setActiveTab("basic");     return false; }
    if (errors.locationIds)                                           { setActiveTab("locations");  return false; }
    if (Object.keys(errors).some((k) => k.startsWith("window-")))    { setActiveTab("booking");   return false; }
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSave(formData);
  };

  // ── Location helpers ────────────────────────────────────────────────────────
  const handleLocationToggle = (locationId: string) => {
    const current = formData.locationIds || [];
    const next = current.includes(locationId)
      ? current.filter((id) => id !== locationId)
      : [...current, locationId];
    setFormData({ ...formData, locationIds: next });
    if (formErrors.locationIds) setFormErrors({ ...formErrors, locationIds: "" });
  };

  const handleSelectAllLocations = () => {
    setFormData({
      ...formData,
      locationIds:
        formData.locationIds?.length === locations.length ? [] : locations.map((l) => l.id),
    });
  };

  // ── Booking window helpers ──────────────────────────────────────────────────
  const handleAddWindow = () => {
    const newWindow: BookingWindow = {
      id: `window-${Date.now()}`,
      startTime: "09:00",
      endTime: "17:00",
      duration: 30,
      slotCapacity: 1,
    };
    setFormData({ ...formData, bookingWindows: [...(formData.bookingWindows || []), newWindow] });
  };

  const handleDeleteWindow = (windowId: string) => {
    setFormData({
      ...formData,
      bookingWindows: (formData.bookingWindows || []).filter((w) => w.id !== windowId),
    });
  };

  const handleWindowChange = (windowId: string, field: keyof BookingWindow, value: any) => {
    setFormData({
      ...formData,
      bookingWindows: (formData.bookingWindows || []).map((w) =>
        w.id === windowId ? { ...w, [field]: value } : w
      ),
    });
  };

  // ── Tab error indicators ────────────────────────────────────────────────────
  const tabHasError: Record<TabId, boolean> = {
    basic:     !!(formErrors.name || formErrors.price),
    locations: !!formErrors.locationIds,
    booking:   Object.keys(formErrors).some((k) => k.startsWith("window-")),
  };

  // ── Style tokens ────────────────────────────────────────────────────────────
  const inputCls =
    "flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2.5 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]";
  const labelCls = "text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5";

  // ── Knowledge panel ─────────────────────────────────────────────────────────
  const renderKnowledgePanel = () => {
    if (!showKnowledgePanel) return null;
    return (
      <>
        <div
          className="fixed inset-0 bg-neutral-950/40 z-40"
          onClick={() => setShowKnowledgePanel(false)}
        />
        <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-primary-50 dark:bg-primary-950/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/40 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-900 dark:text-white">Services Guide</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Knowledge Guide</p>
              </div>
            </div>
            <button
              onClick={() => setShowKnowledgePanel(false)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto text-left">
            {[
              {
                id: "overview",
                title: "What is a Service?",
                content: (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    A <strong className="text-neutral-800 dark:text-neutral-200">Service</strong> defines
                    a clinical procedure or offering at your clinic — including its pricing, assigned
                    locations, and available booking windows for patient scheduling.
                  </p>
                ),
              },
              {
                id: "locations",
                title: "Assigning Locations",
                content: (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Assign the service to one or more branch locations. Only patients at assigned
                    locations can book this service online. A service must have at least one location.
                  </p>
                ),
              },
              {
                id: "booking",
                title: "Booking Windows",
                content: (
                  <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed">
                    <p>
                      Booking windows define when this service can be scheduled. For each window,
                      configure:
                    </p>
                    <ul className="list-disc list-inside space-y-1 pl-1">
                      <li>Start and end time for available booking hours</li>
                      <li>Duration of each appointment slot</li>
                      <li>Slot capacity — concurrent bookings allowed per slot</li>
                    </ul>
                  </div>
                ),
              },
            ].map((section) => {
              const isExpanded = expandedSection === section.id;
              return (
                <div
                  key={section.id}
                  className="border-b border-neutral-100 dark:border-neutral-800"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                    className="w-full flex items-center justify-between gap-3 px-5 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors text-left"
                  >
                    <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                      {section.title}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                    )}
                  </button>
                  {isExpanded && <div className="px-5 pb-5 pt-1">{section.content}</div>}
                </div>
              );
            })}
          </div>
          <div className="px-5 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/30">
            <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center">
              Knowledge guide for the Services module in SpineCloudIQ.
            </p>
          </div>
        </div>
      </>
    );
  };

  // ── Tab: Basic Info ─────────────────────────────────────────────────────────
  const renderBasicTab = () => (
    <div className="px-6 py-6 space-y-6">
      {/* Service Name */}
      <div>
        <label className={labelCls}>
          Service name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          value={formData.name || ""}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            if (formErrors.name) setFormErrors({ ...formErrors, name: "" });
          }}
          placeholder="e.g., Spinal Decompression Therapy"
          aria-invalid={!!formErrors.name}
          className={inputCls}
        />
        {formErrors.name && (
          <p className="flex items-center gap-1 text-xs text-destructive mt-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {formErrors.name}
          </p>
        )}
      </div>

      {/* Price */}
      <div>
        <label className={labelCls}>
          Price (USD) <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
          <input
            type="number"
            value={formData.price ?? ""}
            onChange={(e) => {
              setFormData({ ...formData, price: parseFloat(e.target.value) || 0 });
              if (formErrors.price) setFormErrors({ ...formErrors, price: "" });
            }}
            min="0"
            step="0.01"
            placeholder="0.00"
            aria-invalid={!!formErrors.price}
            className={`${inputCls} pl-9`}
          />
        </div>
        {formErrors.price && (
          <p className="flex items-center gap-1 text-xs text-destructive mt-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {formErrors.price}
          </p>
        )}
      </div>

      {/* Self-booking Toggle */}
      <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div>
          <p className="text-sm font-medium text-neutral-900 dark:text-white">
            Self-booking allowed
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Allow patients to book this service online
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setFormData({ ...formData, allowOnlineBooking: !formData.allowOnlineBooking })
          }
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 ${
            formData.allowOnlineBooking
              ? "bg-primary-600"
              : "bg-neutral-200 dark:bg-neutral-700"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              formData.allowOnlineBooking ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Active Status Toggle */}
      <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div>
          <p className="text-sm font-medium text-neutral-900 dark:text-white">Active status</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Inactive services cannot be selected for new appointments
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 ${
            formData.isActive ? "bg-primary-600" : "bg-neutral-200 dark:bg-neutral-700"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              formData.isActive ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );

  // ── Tab: Locations ──────────────────────────────────────────────────────────
  const renderLocationsTab = () => (
    <div className="px-6 py-6">
      <div className="relative">
        <label className={labelCls}>
          Locations <span className="text-destructive">*</span>
        </label>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
          Select the branch locations where this service is available.
        </p>

        {/* Selected chips */}
        {(formData.locationIds?.length ?? 0) > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.locationIds?.map((locId) => {
              const loc = locations.find((l) => l.id === locId);
              return (
                <span
                  key={locId}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full border border-primary-100 dark:border-primary-800"
                >
                  {loc?.name}
                  <button
                    type="button"
                    onClick={() => handleLocationToggle(locId)}
                    className="p-0.5 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-full transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        )}

        {/* Dropdown trigger */}
        <button
          type="button"
          onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
          className="w-full h-10 px-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-500 flex items-center justify-between focus:border-primary-600 outline-none transition-all"
        >
          <span>Select locations…</span>
          <ChevronDown
            className={`w-4 h-4 text-neutral-400 transition-transform ${
              isLocationDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isLocationDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-2 border-b border-neutral-100 dark:border-neutral-800">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="text"
                  value={locationSearchQuery}
                  onChange={(e) => setLocationSearchQuery(e.target.value)}
                  placeholder="Search locations…"
                  className="w-full h-8 pl-8 pr-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-md text-xs outline-none focus:border-primary-600"
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto p-1">
              <button
                type="button"
                onClick={handleSelectAllLocations}
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/30 rounded-md transition-colors font-medium"
              >
                Select All
                {formData.locationIds?.length === locations.length && (
                  <Check className="w-4 h-4" />
                )}
              </button>
              <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-1" />
              {filteredLocations.map((location) => (
                <button
                  type="button"
                  key={location.id}
                  onClick={() => handleLocationToggle(location.id)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-md transition-colors"
                >
                  {location.name}
                  {formData.locationIds?.includes(location.id) && (
                    <Check className="w-4 h-4 text-primary-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {formErrors.locationIds && (
          <p className="flex items-center gap-1 text-xs text-destructive mt-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {formErrors.locationIds}
          </p>
        )}
      </div>
    </div>
  );

  // ── Tab: Booking Windows ────────────────────────────────────────────────────
  const renderBookingTab = () => (
    <div className="px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
            Booking Time Windows
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Define when this service can be scheduled
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddWindow}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Window
        </button>
      </div>

      <div className="space-y-4">
        {(formData.bookingWindows || []).map((window, index) => (
          <div
            key={window.id}
            className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 space-y-4"
          >
            {/* Window header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Window {index + 1}
              </span>
              {(formData.bookingWindows?.length ?? 0) > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteWindow(window.id)}
                  className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                  title="Remove window"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Start / End time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Start Time
                </label>
                <input
                  type="time"
                  value={window.startTime}
                  onChange={(e) => handleWindowChange(window.id, "startTime", e.target.value)}
                  className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none transition-all"
                />
                {formErrors[`window-${index}-startTime`] && (
                  <p className="flex items-center gap-1 text-xs text-destructive mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {formErrors[`window-${index}-startTime`]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                  End Time
                </label>
                <input
                  type="time"
                  value={window.endTime}
                  onChange={(e) => handleWindowChange(window.id, "endTime", e.target.value)}
                  className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none transition-all"
                />
                {formErrors[`window-${index}-endTime`] && (
                  <p className="flex items-center gap-1 text-xs text-destructive mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {formErrors[`window-${index}-endTime`]}
                  </p>
                )}
              </div>
            </div>

            {/* Duration / Capacity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Duration
                </label>
                <div className="relative">
                  <select
                    value={window.duration}
                    onChange={(e) =>
                      handleWindowChange(window.id, "duration", parseInt(e.target.value))
                    }
                    className="w-full h-10 px-3 pr-8 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none transition-all appearance-none"
                  >
                    <option value={15}>15 mins</option>
                    <option value={30}>30 mins</option>
                    <option value={45}>45 mins</option>
                    <option value={60}>60 mins</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Slot Capacity
                </label>
                <input
                  type="number"
                  value={window.slotCapacity}
                  onChange={(e) =>
                    handleWindowChange(window.id, "slotCapacity", parseInt(e.target.value) || 1)
                  }
                  min="1"
                  placeholder="1"
                  className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none transition-all"
                />
                {formErrors[`window-${index}-slotCapacity`] && (
                  <p className="flex items-center gap-1 text-xs text-destructive mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {formErrors[`window-${index}-slotCapacity`]}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Right col: Service Overview card ────────────────────────────────────────
  const renderServiceOverviewCard = () => (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Service Overview</h3>
      </div>
      <div className="p-4">
        {/* Avatar + name */}
        <div className="flex flex-col items-center pb-4 mb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-950/30 flex items-center justify-center font-bold text-primary-600 dark:text-primary-400 text-base mb-2">
            {serviceInitials}
          </div>
          <p className="text-sm font-semibold text-neutral-900 dark:text-white text-center line-clamp-2">
            {serviceTitle}
          </p>
          {service?.id && (
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5 font-mono">
              {service.id}
            </p>
          )}
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" />
              Price
            </span>
            <span className="font-medium text-neutral-900 dark:text-white">
              ${(formData.price ?? 0).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              Locations
            </span>
            <span className="font-medium text-neutral-900 dark:text-white">
              {formData.locationIds?.length || 0} assigned
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="text-neutral-500 dark:text-neutral-400">Status</span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
                formData.isActive
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
                  : "border-neutral-200 bg-neutral-50 text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  formData.isActive ? "bg-emerald-500" : "bg-neutral-400"
                }`}
              />
              {formData.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="text-neutral-500 dark:text-neutral-400">Online Booking</span>
            <span
              className={`text-xs font-medium ${
                formData.allowOnlineBooking
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-neutral-400 dark:text-neutral-500"
              }`}
            >
              {formData.allowOnlineBooking ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Right col: Booking Summary card ─────────────────────────────────────────
  const renderBookingSummaryCard = () => {
    const windows = formData.bookingWindows || [];
    const totalCapacity = windows.reduce((sum, w) => sum + (w.slotCapacity || 0), 0);
    return (
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
            Booking Summary
          </h3>
        </div>
        <div className="p-4">
          {windows.length === 0 ? (
            <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center py-2">
              No windows configured
            </p>
          ) : (
            <div className="space-y-2">
              {windows.map((w, i) => (
                <div
                  key={w.id}
                  className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-950/30 border border-neutral-100 dark:border-neutral-800"
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      Window {i + 1}
                    </span>
                    <span className="text-xs text-neutral-400 dark:text-neutral-500">
                      {w.duration} min
                    </span>
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    {w.startTime} – {w.endTime} ·{" "}
                    {w.slotCapacity} slot{w.slotCapacity !== 1 ? "s" : ""}
                  </div>
                </div>
              ))}
              <div className="pt-2 mt-1 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                <span className="text-neutral-500 dark:text-neutral-400">Total capacity</span>
                <span className="font-medium text-neutral-900 dark:text-white">
                  {totalCapacity} slot{totalCapacity !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── Main render ─────────────────────────────────────────────────────────────
  return (
    <ClinicAdminLayout
      activeMenu="services"
      onNavigate={onNavigate}
      onLogout={onLogout}
      onOpenHelpGuide={() => setShowKnowledgePanel(true)}
    >
      <div className="p-5 md:p-6">
        {renderKnowledgePanel()}

        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          {/* Left: avatar + identity */}
          <div className="flex min-w-0 items-start gap-3">
            <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-white dark:border-neutral-800 bg-primary-100 dark:bg-primary-950/50 text-base font-bold text-primary-600 dark:text-primary-400 shadow-sm">
              {serviceInitials}
            </div>
            <div className="min-w-0">
              {/* Title row */}
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-[18px] font-semibold text-neutral-900 dark:text-white">
                  {serviceTitle}
                </h1>
                <div className="w-px h-5 bg-neutral-300 dark:bg-neutral-700" />
                <span className="text-sm font-medium text-neutral-900 dark:text-white">
                  Clinical Service
                </span>
                <span className="text-neutral-400 dark:text-neutral-600">•</span>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {service?.id || "New Service"}
                </span>
              </div>

              {/* Metadata row */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                <span className="inline-flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  ${(formData.price ?? 0).toFixed(2)}
                </span>
                <span className="text-neutral-400 dark:text-neutral-600">•</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {formData.locationIds?.length || 0}{" "}
                  {(formData.locationIds?.length || 0) === 1 ? "location" : "locations"}
                </span>
                <span className="text-neutral-400 dark:text-neutral-600">•</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formData.bookingWindows?.length || 0}{" "}
                  {(formData.bookingWindows?.length || 0) === 1 ? "window" : "windows"}
                </span>
              </div>

              {/* Status badges */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      formData.isActive ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                  />
                  {formData.isActive ? "Active" : "Inactive"}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      formData.allowOnlineBooking ? "bg-primary-600" : "bg-neutral-400"
                    }`}
                  />
                  Online booking {formData.allowOnlineBooking ? "enabled" : "disabled"}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Back + Save */}
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
              form={FORM_ID}
              className="h-9 px-5 flex items-center justify-center gap-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors text-sm font-medium"
            >
              <Save className="w-4 h-4" />
              {isEditMode ? "Save Changes" : "Add Service"}
            </button>
          </div>
        </div>

        {/* ── 70 / 30 Body ────────────────────────────────────────────────── */}
        <div className="flex flex-col xl:flex-row gap-6">
          {/* ── Left: tabbed card (70%) ──────────────────────────────────── */}
          <main className="w-full xl:w-[70%]">
            <form id={FORM_ID} onSubmit={handleSubmit}>
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto">
                  {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    const hasError = tabHasError[tab.id];
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative inline-flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap transition-colors ${
                          isActive
                            ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 font-semibold"
                            : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-medium"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        {tab.label}
                        {hasError && (
                          <span className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Tab content */}
                {activeTab === "basic"     && renderBasicTab()}
                {activeTab === "locations" && renderLocationsTab()}
                {activeTab === "booking"   && renderBookingTab()}

                {/* Form footer */}
                <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    Tab {TABS.findIndex((t) => t.id === activeTab) + 1} of {TABS.length}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={onBack}
                      className="h-9 px-4 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="h-9 px-5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium transition-colors"
                    >
                      {isEditMode ? "Save Changes" : "Add Service"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </main>

          {/* ── Right: contextual cards (30%) ───────────────────────────── */}
          <aside className="w-full xl:w-[30%] space-y-6">
            {renderServiceOverviewCard()}
            {renderBookingSummaryCard()}
          </aside>
        </div>
      </div>
    </ClinicAdminLayout>
  );
}
