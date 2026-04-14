import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { ArrowLeft, Plus, Trash2, Calendar as CalendarIcon, Upload, X, User, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { completeStep, isStepCompleted } from "../shared/walkthroughUtils";

interface Branch {
  id: string;
  name: string;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
  branchId: string;
}

interface DaySchedule {
  isWorking: boolean;
  timeSlots: TimeSlot[];
}

interface Schedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  specialty: string;
  branches: string[];
  status: "Active" | "Inactive";
  schedule: Schedule;
  selfBookable: boolean;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

interface AddProviderScreenProps {
  availableBranches: Branch[];
  onNavigate: (menu: any) => void;
  onBack: () => void;
  onSave: (provider: Provider) => void; // Changed from onAddProvider
  onLogout?: () => void;
}

type Tab = "basic" | "schedule";

const daysOfWeek: Array<keyof Schedule> = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export function AddProviderScreen({
  availableBranches,
  onNavigate,
  onBack,
  onSave, // Changed from onAddProvider
  onLogout,
}: AddProviderScreenProps) {
  const [activeTab, setActiveTab] = useState<Tab>("basic");

  // Basic Information State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [selfBookable, setSelfBookable] = useState(false);
  const [isGuided, setIsGuided] = useState(false);

  useEffect(() => {
    const activeGuide = localStorage.getItem("spinecloud_active_guide");
    const explicitlyGuided = activeGuide === "providers";
    const theoreticallyGuided = !isStepCompleted("providers") && activeGuide !== "skipped";
    setIsGuided(explicitlyGuided || theoreticallyGuided);
  }, []);

  // Schedule State
  const [schedule, setSchedule] = useState<Schedule>({
    monday: { isWorking: false, timeSlots: [] },
    tuesday: { isWorking: false, timeSlots: [] },
    wednesday: { isWorking: false, timeSlots: [] },
    thursday: { isWorking: false, timeSlots: [] },
    friday: { isWorking: false, timeSlots: [] },
    saturday: { isWorking: false, timeSlots: [] },
    sunday: { isWorking: false, timeSlots: [] },
  });

  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule>(schedule);

  const handleToggleDay = (day: keyof Schedule) => {
    setEditingSchedule({
      ...editingSchedule,
      [day]: {
        ...editingSchedule[day],
        isWorking: !editingSchedule[day].isWorking,
      },
    });
  };

  const handleAddTimeSlot = (day: keyof Schedule) => {
    setEditingSchedule({
      ...editingSchedule,
      [day]: {
        ...editingSchedule[day],
        timeSlots: [
          ...editingSchedule[day].timeSlots,
          { startTime: "09:00", endTime: "17:00", branchId: availableBranches[0]?.id || "" },
        ],
      },
    });
  };

  const handleRemoveTimeSlot = (day: keyof Schedule, index: number) => {
    setEditingSchedule({
      ...editingSchedule,
      [day]: {
        ...editingSchedule[day],
        timeSlots: editingSchedule[day].timeSlots.filter((_, i) => i !== index),
      },
    });
  };

  const handleUpdateTimeSlot = (
    day: keyof Schedule,
    index: number,
    field: "startTime" | "endTime" | "branchId",
    value: string
  ) => {
    const updatedSlots = [...editingSchedule[day].timeSlots];
    updatedSlots[index] = { ...updatedSlots[index], [field]: value };
    setEditingSchedule({
      ...editingSchedule,
      [day]: {
        ...editingSchedule[day],
        timeSlots: updatedSlots,
      },
    });
  };

  const handleSaveSchedule = () => {
    setSchedule(editingSchedule);
    setIsEditingSchedule(false);
  };

  const handleCancelSchedule = () => {
    setEditingSchedule(schedule);
    setIsEditingSchedule(false);
  };

  const handleToggleBranch = (branchName: string) => {
    if (selectedBranches.includes(branchName)) {
      setSelectedBranches(selectedBranches.filter((b) => b !== branchName));
    } else {
      setSelectedBranches([...selectedBranches, branchName]);
    }
  };

  const isFormValid = () => {
    return (
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      email.trim() !== "" &&
      specialty.trim() !== "" &&
      selectedBranches.length > 0
    );
  };

  const handleSubmit = () => {
    if (!isFormValid()) return;

    const providerData: Provider = {
      id: `user-${Date.now()}`,
      firstName,
      lastName,
      email,
      specialty,
      branches: selectedBranches,
      status,
      schedule,
      selfBookable,
      permissions: [], // In a real app, gather permissions
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isGuided) {
      const nextRoute = completeStep("providers");
      onSave(providerData);
      if (nextRoute) {
        setTimeout(() => onNavigate(nextRoute as any), 100);
      }
    } else {
      onSave(providerData);
    }
  };

  const formatDayName = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const getBranchName = (branchId: string) => {
    return availableBranches.find((b) => b.id === branchId)?.name || branchId;
  };

  return (
    <ClinicAdminLayout activeMenu="providers" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group mb-4"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to providers</span>
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
              Add new provider
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Fill in the provider information and configure their schedule
            </p>
          </div>
        </div>

        {/* Guided setup strip */}
        {isGuided && (
          <div className="mb-6 flex items-center gap-3 bg-primary-50 border border-primary-200 rounded-xl px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center shrink-0 text-white text-xs font-bold">3</div>
            <div>
              <p className="text-sm font-semibold text-primary-900">Step 3 of 5 — Add Providers</p>
              <p className="text-xs text-primary-700 mt-0.5">Please add your clinic's providers (e.g. physiotherapists, doctors). Once saved, you will be automatically redirected to set up questionnaires.</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("basic")}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "basic"
                  ? "border-primary-600 dark:border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Basic information
              </div>
            </button>
            <button
              onClick={() => setActiveTab("schedule")}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "schedule"
                  ? "border-primary-600 dark:border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Schedule
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "basic" && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
            <div className="space-y-6">
              {/* Basic Details */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
                  Provider details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                      First name <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter first name"
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                      Last name <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter last name"
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                      Email address <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="provider@example.com"
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                    />
                  </div>
                  <div>
                    <label htmlFor="specialty" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                      Specialty <span className="text-destructive">*</span>
                    </label>
                    <select
                      id="specialty"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                    >
                      <option value="">Select specialty</option>
                      <option value="Chiropractor">Chiropractor</option>
                      <option value="Physical Therapist">Physical Therapist</option>
                      <option value="Spine Surgeon">Spine Surgeon</option>
                      <option value="Pain Management Specialist">Pain Management Specialist</option>
                      <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
                      <option value="Sports Medicine">Sports Medicine</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="status" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                      Status <span className="text-destructive">*</span>
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          checked={status === "Active"}
                          onChange={() => setStatus("Active")}
                          className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                        />
                        <span className="text-sm text-neutral-900 dark:text-white">Active</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          checked={status === "Inactive"}
                          onChange={() => setStatus("Inactive")}
                          className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                        />
                        <span className="text-sm text-neutral-900 dark:text-white">Inactive</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                      Self-bookable
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selfBookable}
                        onChange={() => setSelfBookable(!selfBookable)}
                        className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-primary-600"
                      />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        Allow patients to book appointments with this provider
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Branches */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
                  Branches <span className="text-destructive">*</span>
                </h4>
                <div className="space-y-3">
                  {availableBranches.map((branch) => (
                    <label
                      key={branch.id}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBranches.includes(branch.name)}
                        onChange={() => handleToggleBranch(branch.name)}
                        className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-primary-600"
                      />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        {branch.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "schedule" && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Weekly schedule
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Configure working hours and branch assignments
                </p>
              </div>
              {!isEditingSchedule ? (
                <button
                  onClick={() => setIsEditingSchedule(true)}
                  className="inline-flex items-center gap-2 px-4 h-9 text-primary-700 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 rounded-lg transition-colors text-sm font-medium"
                >
                  Edit schedule
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCancelSchedule}
                    className="inline-flex items-center gap-2 px-4 h-9 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveSchedule}
                    className="inline-flex items-center gap-2 px-4 h-9 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors text-sm font-medium"
                  >
                    <Save className="w-4 h-4" />
                    Save schedule
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {daysOfWeek.map((day) => (
                <div key={day} className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isEditingSchedule ? editingSchedule[day].isWorking : schedule[day].isWorking}
                          onChange={() => isEditingSchedule && handleToggleDay(day)}
                          disabled={!isEditingSchedule}
                          className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-primary-600"
                        />
                        <span className="text-sm font-medium text-neutral-900 dark:text-white">
                          {formatDayName(day)}
                        </span>
                      </label>
                    </div>
                    {isEditingSchedule && (isEditingSchedule ? editingSchedule[day].isWorking : schedule[day].isWorking) && (
                      <button
                        onClick={() => handleAddTimeSlot(day)}
                        className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                      >
                        + Add time slot
                      </button>
                    )}
                  </div>

                  {(isEditingSchedule ? editingSchedule[day].isWorking : schedule[day].isWorking) && (
                    <div className="space-y-3">
                      {(isEditingSchedule ? editingSchedule[day].timeSlots : schedule[day].timeSlots).map((slot, index) => (
                        <div key={index} className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-950 p-3 rounded-lg">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="text-sm text-neutral-600 dark:text-neutral-400 block mb-1">
                                Start time
                              </label>
                              <input
                                type="time"
                                value={slot.startTime}
                                onChange={(e) =>
                                  isEditingSchedule &&
                                  handleUpdateTimeSlot(day, index, "startTime", e.target.value)
                                }
                                disabled={!isEditingSchedule}
                                className="flex h-9 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                              />
                            </div>
                            <div>
                              <label className="text-sm text-neutral-600 dark:text-neutral-400 block mb-1">
                                End time
                              </label>
                              <input
                                type="time"
                                value={slot.endTime}
                                onChange={(e) =>
                                  isEditingSchedule &&
                                  handleUpdateTimeSlot(day, index, "endTime", e.target.value)
                                }
                                disabled={!isEditingSchedule}
                                className="flex h-9 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                              />
                            </div>
                            <div>
                              <label className="text-sm text-neutral-600 dark:text-neutral-400 block mb-1">
                                Branch
                              </label>
                              <select
                                value={slot.branchId}
                                onChange={(e) =>
                                  isEditingSchedule &&
                                  handleUpdateTimeSlot(day, index, "branchId", e.target.value)
                                }
                                disabled={!isEditingSchedule}
                                className="flex h-9 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                              >
                                {availableBranches.map((branch) => (
                                  <option key={branch.id} value={branch.id}>
                                    {branch.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          {isEditingSchedule && (
                            <button
                              onClick={() => handleRemoveTimeSlot(day, index)}
                              className="text-destructive hover:text-destructive/80 text-sm font-medium"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      {!isEditingSchedule && (isEditingSchedule ? editingSchedule[day].timeSlots : schedule[day].timeSlots).length === 0 && (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">
                          No time slots configured
                        </p>
                      )}
                    </div>
                  )}

                  {!(isEditingSchedule ? editingSchedule[day].isWorking : schedule[day].isWorking) && (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">
                      Not working on this day
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-6 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className="inline-flex items-center gap-2 px-6 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
          >
            <Save className="w-4 h-4" />
            Add provider
          </button>
        </div>
      </div>
    </ClinicAdminLayout>
  );
}