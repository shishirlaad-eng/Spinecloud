import { useState } from "react";
import { UserPlus, Clock } from "lucide-react";
import type { WizardData } from "../SetupWizard";

interface CreateProviderStepProps {
  data: WizardData;
  onNext: (data: Partial<WizardData>) => void;
  onSkip: () => void;
  onBack: () => void;
  onSaveAndExit: () => void;
}

interface DaySchedule {
  isWorking: boolean;
  startTime: string;
  endTime: string;
}

interface WorkingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

const specialties = [
  "Chiropractor",
  "Physical Therapist",
  "Spine Surgeon",
  "Pain Management Specialist",
  "Orthopedic Surgeon",
  "Sports Medicine",
  "Other",
];

export function CreateProviderStep({
  data,
  onNext,
  onSkip,
  onBack,
  onSaveAndExit,
}: CreateProviderStepProps) {
  const [firstName, setFirstName] = useState(data.provider?.firstName || "");
  const [lastName, setLastName] = useState(data.provider?.lastName || "");
  const [email, setEmail] = useState(data.provider?.email || "");
  const [specialty, setSpecialty] = useState(data.provider?.specialty || "");
  const [selfBookable, setSelfBookable] = useState(data.provider?.selfBookable ?? false);
  const [workingHours, setWorkingHours] = useState<WorkingHours>(
    data.provider?.workingHours || {
      monday: { isWorking: true, startTime: "09:00", endTime: "17:00" },
      tuesday: { isWorking: true, startTime: "09:00", endTime: "17:00" },
      wednesday: { isWorking: true, startTime: "09:00", endTime: "17:00" },
      thursday: { isWorking: true, startTime: "09:00", endTime: "17:00" },
      friday: { isWorking: true, startTime: "09:00", endTime: "17:00" },
      saturday: { isWorking: false, startTime: "09:00", endTime: "13:00" },
      sunday: { isWorking: false, startTime: "09:00", endTime: "13:00" },
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "firstName":
      case "lastName":
        if (!value.trim()) {
          error = "This field is required";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Enter a valid email address";
        }
        break;
      case "specialty":
        if (!value) {
          error = "Please select a specialty";
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  const handleBlur = (name: string, value: string) => {
    validateField(name, value);
  };

  const updateWorkingHours = (
    day: keyof WorkingHours,
    field: "isWorking" | "startTime" | "endTime",
    value: boolean | string
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
    const hasAtLeastOneWorkingDay = Object.values(workingHours).some((day) => day.isWorking);
    
    return (
      firstName.trim() &&
      lastName.trim() &&
      email.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      specialty &&
      hasAtLeastOneWorkingDay &&
      Object.values(errors).every((error) => !error)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onNext({
        provider: {
          firstName,
          lastName,
          email,
          specialty,
          assignedLocations: data.location ? [data.location.name] : [],
          workingHours,
          selfBookable,
        },
      });
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-8">
      {/* Icon */}
      <div className="mb-6 flex justify-center">
        <div className="w-16 h-16 bg-primary-50 dark:bg-primary-950/30 rounded-full flex items-center justify-center">
          <UserPlus className="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
          Create your first provider
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Add a healthcare provider to start scheduling appointments
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide">
            Provider information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                First name <span className="text-destructive">*</span>
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="John"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: "" }));
                }}
                onBlur={(e) => handleBlur("firstName", e.target.value)}
                aria-invalid={!!errors.firstName}
                className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
              />
              {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName}</p>}
            </div>

            <div>
              <label htmlFor="lastName" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                Last name <span className="text-destructive">*</span>
              </label>
              <input
                id="lastName"
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: "" }));
                }}
                onBlur={(e) => handleBlur("lastName", e.target.value)}
                aria-invalid={!!errors.lastName}
                className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
              />
              {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
              Email address <span className="text-destructive">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="doctor@clinic.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
              onBlur={(e) => handleBlur("email", e.target.value)}
              aria-invalid={!!errors.email}
              className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
            />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5">
              An invitation email will be sent automatically
            </p>
          </div>

          <div>
            <label htmlFor="specialty" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
              Specialty <span className="text-destructive">*</span>
            </label>
            <select
              id="specialty"
              value={specialty}
              onChange={(e) => {
                setSpecialty(e.target.value);
                if (errors.specialty) setErrors((prev) => ({ ...prev, specialty: "" }));
              }}
              onBlur={(e) => handleBlur("specialty", e.target.value)}
              aria-invalid={!!errors.specialty}
              className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
            >
              <option value="">Select specialty</option>
              {specialties.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.specialty && <p className="text-xs text-destructive mt-1">{errors.specialty}</p>}
          </div>

          {data.location && (
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
              <p className="text-sm font-medium text-neutral-900 dark:text-white mb-1">Assigned location</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{data.location.name}</p>
            </div>
          )}
        </div>

        {/* Working Hours */}
        <div className="space-y-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-500" />
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide">
              Working hours <span className="text-destructive">*</span>
            </h3>
          </div>

          <div className="space-y-3">
            {Object.entries(workingHours).map(([day, schedule]) => (
              <div key={day} className="flex items-center gap-4">
                <div className="w-28">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={schedule.isWorking}
                      onChange={(e) => updateWorkingHours(day as keyof WorkingHours, "isWorking", e.target.checked)}
                      className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-primary-600 focus:ring-2 focus:ring-primary-500/20"
                    />
                    <span className="text-sm text-neutral-700 dark:text-neutral-300 capitalize">{day}</span>
                  </label>
                </div>

                {schedule.isWorking && (
                  <>
                    <input
                      type="time"
                      value={schedule.startTime}
                      onChange={(e) => updateWorkingHours(day as keyof WorkingHours, "startTime", e.target.value)}
                      className="flex h-9 w-32 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                    />
                    <span className="text-sm text-neutral-500">to</span>
                    <input
                      type="time"
                      value={schedule.endTime}
                      onChange={(e) => updateWorkingHours(day as keyof WorkingHours, "endTime", e.target.value)}
                      className="flex h-9 w-32 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Self-Bookable */}
        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">Make provider self-bookable</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Allow patients to book with this provider online</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selfBookable}
                onChange={(e) => setSelfBookable(e.target.checked)}
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
          <div className="flex gap-3">
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
        </div>
      </form>
    </div>
  );
}