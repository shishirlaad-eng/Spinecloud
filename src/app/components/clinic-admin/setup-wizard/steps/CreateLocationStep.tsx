import { useState } from "react";
import { MapPin, Clock } from "lucide-react";
import type { WizardData } from "../SetupWizard";

interface CreateLocationStepProps {
  data: WizardData;
  onNext: (data: Partial<WizardData>) => void;
  onSkip: () => void;
  onBack: () => void;
  onSaveAndExit: () => void;
}

interface WorkingHours {
  monday: { open: string; close: string; isOpen: boolean };
  tuesday: { open: string; close: string; isOpen: boolean };
  wednesday: { open: string; close: string; isOpen: boolean };
  thursday: { open: string; close: string; isOpen: boolean };
  friday: { open: string; close: string; isOpen: boolean };
  saturday: { open: string; close: string; isOpen: boolean };
  sunday: { open: string; close: string; isOpen: boolean };
}

const usStates = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const timezones = [
  "America/New_York (EST/EDT)",
  "America/Chicago (CST/CDT)",
  "America/Denver (MST/MDT)",
  "America/Phoenix (MST)",
  "America/Los_Angeles (PST/PDT)",
  "America/Anchorage (AKST/AKDT)",
  "Pacific/Honolulu (HST)",
];

export function CreateLocationStep({
  data,
  onNext,
  onSkip,
  onBack,
  onSaveAndExit,
}: CreateLocationStepProps) {
  const [name, setName] = useState(data.location?.name || "");
  const [street, setStreet] = useState(data.location?.street || "");
  const [city, setCity] = useState(data.location?.city || "");
  const [state, setState] = useState(data.location?.state || "");
  const [zip, setZip] = useState(data.location?.zip || "");
  const [country, setCountry] = useState(data.location?.country || "US");
  const [timezone, setTimezone] = useState(data.location?.timezone || data.defaultTimezone);
  const [selfBookingEnabled, setSelfBookingEnabled] = useState(
    data.location?.selfBookingEnabled ?? false
  );
  const [allowPatientCancel, setAllowPatientCancel] = useState(
    data.location?.allowPatientCancel ?? true
  );
  const [allowPatientReschedule, setAllowPatientReschedule] = useState(
    data.location?.allowPatientReschedule ?? true
  );
  const [minNoticeHours, setMinNoticeHours] = useState(
    data.location?.minNoticeHours || 24
  );
  const [maxFutureDays, setMaxFutureDays] = useState(
    data.location?.maxFutureDays || 30
  );
  const [cancellationWindow, setCancellationWindow] = useState(
    data.location?.cancellationWindow || 24
  );
  const [rescheduleWindow, setRescheduleWindow] = useState(
    data.location?.rescheduleWindow || 12
  );
  const [allowStaffOverrides, setAllowStaffOverrides] = useState(
    data.location?.allowStaffOverrides ?? true
  );
  const [workingHours, setWorkingHours] = useState<WorkingHours>(
    data.location?.workingHours || {
      monday: { open: "09:00", close: "17:00", isOpen: true },
      tuesday: { open: "09:00", close: "17:00", isOpen: true },
      wednesday: { open: "09:00", close: "17:00", isOpen: true },
      thursday: { open: "09:00", close: "17:00", isOpen: true },
      friday: { open: "09:00", close: "17:00", isOpen: true },
      saturday: { open: "09:00", close: "13:00", isOpen: false },
      sunday: { open: "09:00", close: "13:00", isOpen: false },
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (fieldName: string, value: string) => {
    let error = "";

    switch (fieldName) {
      case "name":
      case "street":
      case "city":
        if (!value.trim()) {
          error = "This field is required";
        }
        break;
      case "state":
        if (!value) {
          error = "Please select a state";
        }
        break;
      case "zip":
        if (!value.trim()) {
          error = "ZIP code is required";
        } else if (!/^\d{5}(-\d{4})?$/.test(value)) {
          error = "Enter a valid ZIP code";
        }
        break;
      case "timezone":
        if (!value) {
          error = "Please select a timezone";
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [fieldName]: error }));
    return error === "";
  };

  const handleBlur = (fieldName: string, value: string) => {
    validateField(fieldName, value);
  };

  const updateWorkingHours = (
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

  const isFormValid = () => {
    const hasAtLeastOneWorkingDay = Object.values(workingHours).some((day) => day.isOpen);
    
    return (
      name.trim() &&
      street.trim() &&
      city.trim() &&
      state &&
      zip.trim() &&
      /^\d{5}(-\d{4})?$/.test(zip) &&
      timezone &&
      hasAtLeastOneWorkingDay &&
      Object.values(errors).every((error) => !error)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onNext({
        location: {
          name,
          street,
          city,
          state,
          zip,
          country,
          timezone,
          workingHours,
          selfBookingEnabled,
          allowPatientCancel,
          allowPatientReschedule,
          minNoticeHours,
          maxFutureDays,
          cancellationWindow,
          rescheduleWindow,
          allowStaffOverrides,
        },
      });
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-8">
      {/* Icon */}
      <div className="mb-6 flex justify-center">
        <div className="w-16 h-16 bg-primary-50 dark:bg-primary-950/30 rounded-full flex items-center justify-center">
          <MapPin className="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
          Create your first location
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Set up your first clinic location to start accepting appointments
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide">
            Location information
          </h3>

          <div>
            <label htmlFor="name" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
              Location name <span className="text-destructive">*</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder="Main Clinic"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={(e) => handleBlur("name", e.target.value)}
              aria-invalid={!!errors.name}
              className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
            />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="street" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
              Street address <span className="text-destructive">*</span>
            </label>
            <input
              id="street"
              type="text"
              placeholder="123 Main Street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              onBlur={(e) => handleBlur("street", e.target.value)}
              aria-invalid={!!errors.street}
              className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
            />
            {errors.street && <p className="text-xs text-destructive mt-1">{errors.street}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                onBlur={(e) => handleBlur("city", e.target.value)}
                aria-invalid={!!errors.city}
                className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
              />
              {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
            </div>

            <div>
              <label htmlFor="state" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                State <span className="text-destructive">*</span>
              </label>
              <select
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                onBlur={(e) => handleBlur("state", e.target.value)}
                aria-invalid={!!errors.state}
                className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
              >
                <option value="">Select state</option>
                {usStates.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.state && <p className="text-xs text-destructive mt-1">{errors.state}</p>}
            </div>

            <div>
              <label htmlFor="zip" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                ZIP code <span className="text-destructive">*</span>
              </label>
              <input
                id="zip"
                type="text"
                placeholder="10001"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                onBlur={(e) => handleBlur("zip", e.target.value)}
                aria-invalid={!!errors.zip}
                className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
              />
              {errors.zip && <p className="text-xs text-destructive mt-1">{errors.zip}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="timezone" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
              Timezone <span className="text-destructive">*</span>
            </label>
            <select
              id="timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              onBlur={(e) => handleBlur("timezone", e.target.value)}
              aria-invalid={!!errors.timezone}
              className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
            >
              <option value="">Select timezone</option>
              {timezones.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
            {errors.timezone && <p className="text-xs text-destructive mt-1">{errors.timezone}</p>}
          </div>
        </div>

        {/* Working Hours */}
        <div className="space-y-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-500" />
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide">
              Operating hours <span className="text-destructive">*</span>
            </h3>
          </div>

          <div className="space-y-3">
            {Object.entries(workingHours).map(([day, hours]) => (
              <div key={day} className="flex items-center gap-4">
                <div className="w-28">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={hours.isOpen}
                      onChange={(e) => updateWorkingHours(day as keyof WorkingHours, "isOpen", e.target.checked)}
                      className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-primary-600 focus:ring-2 focus:ring-primary-500/20"
                    />
                    <span className="text-sm text-neutral-700 dark:text-neutral-300 capitalize">{day}</span>
                  </label>
                </div>

                {hours.isOpen && (
                  <>
                    <input
                      type="time"
                      value={hours.open}
                      onChange={(e) => updateWorkingHours(day as keyof WorkingHours, "open", e.target.value)}
                      className="flex h-9 w-32 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                    />
                    <span className="text-sm text-neutral-500">to</span>
                    <input
                      type="time"
                      value={hours.close}
                      onChange={(e) => updateWorkingHours(day as keyof WorkingHours, "close", e.target.value)}
                      className="flex h-9 w-32 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Booking Settings */}
        <div className="space-y-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide">
            Booking settings
          </h3>

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
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Allow staff to override booking settings</p>
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

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={onBack}
            className="h-10 px-6 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-medium rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="h-10 px-6 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-medium rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
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