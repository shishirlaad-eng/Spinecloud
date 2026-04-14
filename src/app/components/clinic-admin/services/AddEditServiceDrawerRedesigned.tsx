import { useState, useEffect } from "react";
import { X, Info, Plus, Trash2, DoorClosed } from "lucide-react";

interface ProcedurePhase {
  id: string;
  duration: number; // in minutes
  providerRequired: boolean; // true = ACTIVE, false = PASSIVE
}

interface Service {
  id: string;
  name: string;
  roomId: string; // Room selection
  phases: ProcedurePhase[]; // Procedure phases
  price: number;
  providerIds: string[];
  locationIds: string[]; // Changed from locationId to locationIds (array)
  allowOnlineBooking: boolean;
  bookingStartTime: string;
  bookingEndTime: string;
  slotCapacity: number;
  isActive: boolean;
}

interface Location {
  id: string;
  name: string;
}

interface Provider {
  id: string;
  firstName: string;
  lastName: string;
}

interface Room {
  id: string;
  roomId: string; // Room identifier like "R-001", "R-002"
  roomName: string;
  roomType: string;
  cleanupTime: number; // in minutes
  status: "Active" | "Inactive";
  notes?: string;
}

interface AddEditServiceDrawerRedesignedProps {
  isOpen: boolean;
  service: Service | null;
  locations: Location[];
  providers: Provider[];
  rooms: Room[]; // New prop for rooms
  onClose: () => void;
  onSave: (service: Partial<Service>) => void;
}

export function AddEditServiceDrawerRedesigned({
  isOpen,
  service,
  locations,
  providers,
  rooms,
  onClose,
  onSave,
}: AddEditServiceDrawerRedesignedProps) {
  const [formData, setFormData] = useState<Partial<Service>>({
    name: "",
    roomId: "",
    phases: [],
    price: 0,
    providerIds: [],
    locationIds: [], // Initialize as an array
    allowOnlineBooking: true,
    bookingStartTime: "09:00",
    bookingEndTime: "17:00",
    slotCapacity: 1,
    isActive: true,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (service) {
      // Ensure locationIds is an array (for backward compatibility)
      const serviceData = {
        ...service,
        locationIds: Array.isArray(service.locationIds) 
          ? service.locationIds 
          : service.locationIds 
            ? [service.locationIds] 
            : []
      };
      setFormData(serviceData);
    } else {
      setFormData({
        name: "",
        roomId: "",
        phases: [],
        price: 0,
        providerIds: [],
        locationIds: [], // Initialize as an array
        allowOnlineBooking: true,
        bookingStartTime: "09:00",
        bookingEndTime: "17:00",
        slotCapacity: 1,
        isActive: true,
      });
    }
    setFormErrors({});
  }, [service, isOpen]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      errors.name = "Service name is required";
    }
    if (!formData.roomId) {
      errors.roomId = "Room is required";
    }
    if (!formData.phases || formData.phases.length === 0) {
      errors.phases = "At least one procedure phase is required";
    }
    if (formData.price === undefined || formData.price < 0) {
      errors.price = "Price must be 0 or greater";
    }
    if (!formData.locationIds || formData.locationIds.length === 0) {
      errors.locationIds = "Location is required";
    }
    if (!formData.bookingStartTime) {
      errors.bookingStartTime = "Start time is required";
    }
    if (!formData.bookingEndTime) {
      errors.bookingEndTime = "End time is required";
    }
    if (formData.bookingStartTime && formData.bookingEndTime && formData.bookingStartTime >= formData.bookingEndTime) {
      errors.bookingEndTime = "End time must be after start time";
    }
    if (!formData.slotCapacity || formData.slotCapacity < 1) {
      errors.slotCapacity = "Slot capacity must be at least 1";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    onSave(formData);
  };

  const handleProviderToggle = (providerId: string) => {
    const currentProviders = formData.providerIds || [];
    const newProviders = currentProviders.includes(providerId)
      ? currentProviders.filter((id) => id !== providerId)
      : [...currentProviders, providerId];
    setFormData({ ...formData, providerIds: newProviders });
  };

  const handleLocationToggle = (locationId: string) => {
    const currentLocations = formData.locationIds || [];
    const newLocations = currentLocations.includes(locationId)
      ? currentLocations.filter((id) => id !== locationId)
      : [...currentLocations, locationId];
    setFormData({ ...formData, locationIds: newLocations });
  };

  const handlePhaseAdd = () => {
    const newPhase: ProcedurePhase = {
      id: `phase-${Date.now()}`,
      duration: 15,
      providerRequired: true,
    };
    setFormData({ ...formData, phases: [...(formData.phases || []), newPhase] });
  };

  const handlePhaseDelete = (phaseId: string) => {
    const newPhases = (formData.phases || []).filter((phase) => phase.id !== phaseId);
    setFormData({ ...formData, phases: newPhases });
  };

  const handlePhaseChange = (phaseId: string, field: keyof ProcedurePhase, value: any) => {
    const newPhases = (formData.phases || []).map((phase) =>
      phase.id === phaseId ? { ...phase, [field]: value } : phase
    );
    setFormData({ ...formData, phases: newPhases });
  };

  const selectedRoom = rooms.find((r) => r.id === formData.roomId);

  // Calculate total duration from phases
  const totalDuration = (formData.phases || []).reduce((sum, phase) => sum + phase.duration, 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-white dark:bg-neutral-950 shadow-xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 px-5 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
              {service ? "Edit service" : "Add service"}
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
              Configure bookable appointment service
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
          >
            <X className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-6">
          {/* Service Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Service name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Spinal Decompression Therapy"
              className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
            />
            {formErrors.name && (
              <p className="text-xs text-destructive mt-1">{formErrors.name}</p>
            )}
          </div>

          {/* Room */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Room type <span className="text-destructive">*</span>
            </label>
            <select
              value={formData.roomId}
              onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
              className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
            >
              <option value="">Select room</option>
              {rooms.filter(r => r.status === "Active").map((room) => (
                <option key={room.id} value={room.id}>
                  {room.roomName} ({room.roomId})
                </option>
              ))}
            </select>
            {formErrors.roomId && (
              <p className="text-xs text-destructive mt-1">{formErrors.roomId}</p>
            )}
            {selectedRoom && (
              <div className="mt-2 p-3 bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <DoorClosed className="w-4 h-4 text-neutral-600 dark:text-neutral-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 text-sm">
                    <p className="text-neutral-900 dark:text-white font-medium">{selectedRoom.roomName}</p>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                      <span className="font-medium">Type:</span> {selectedRoom.roomType} • 
                      <span className="font-medium"> Cleanup Time:</span> {selectedRoom.cleanupTime} mins
                    </p>
                    {selectedRoom.notes && (
                      <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                        <span className="font-medium">Notes:</span> {selectedRoom.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Procedure Phases */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Procedure phases <span className="text-destructive">*</span>
              </label>
              <button
                type="button"
                onClick={handlePhaseAdd}
                className="inline-flex items-center gap-1 px-2 py-1 text-sm text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/30 rounded transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add phase
              </button>
            </div>
            
            {totalDuration > 0 && (
              <div className="mb-2 p-2 bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg">
                <p className="text-sm text-primary-700 dark:text-primary-300">
                  <span className="font-semibold">Total Duration:</span> {totalDuration} minutes
                </p>
              </div>
            )}

            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
              {formData.phases && formData.phases.length > 0 ? (
                <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {formData.phases.map((phase, index) => (
                    <div key={phase.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 text-xs font-semibold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                                Duration (minutes)
                              </label>
                              <input
                                type="number"
                                value={phase.duration}
                                onChange={(e) => handlePhaseChange(phase.id, "duration", parseInt(e.target.value) || 0)}
                                min="1"
                                step="5"
                                className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                                Provider required?
                              </label>
                              <button
                                type="button"
                                onClick={() => handlePhaseChange(phase.id, "providerRequired", !phase.providerRequired)}
                                className={`w-full h-9 px-3 rounded-lg text-sm font-medium transition-colors ${
                                  phase.providerRequired
                                    ? "bg-success-100 dark:bg-success-950/30 text-success-700 dark:text-success-400 border border-success-300 dark:border-success-700"
                                    : "bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700"
                                }`}
                              >
                                {phase.providerRequired ? "ACTIVE" : "PASSIVE"}
                              </button>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handlePhaseDelete(phase.id)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors flex-shrink-0"
                          title="Delete phase"
                        >
                          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">No phases added yet</p>
                  <button
                    type="button"
                    onClick={handlePhaseAdd}
                    className="inline-flex items-center gap-2 px-4 h-9 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add phase
                  </button>
                </div>
              )}
            </div>
            {formErrors.phases && (
              <p className="text-xs text-destructive mt-1">{formErrors.phases}</p>
            )}
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
              Example: Spinal Decompression has Phase 1 (5 mins, ACTIVE - provider setup) and Phase 2 (10 mins, PASSIVE - patient alone with provider monitoring)
            </p>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Price (USD) <span className="text-destructive">*</span>
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
              }
              min="0"
              step="0.01"
              className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
            />
            {formErrors.price && (
              <p className="text-xs text-destructive mt-1">{formErrors.price}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Location / Branch <span className="text-destructive">*</span>
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 bg-neutral-50 dark:bg-neutral-900">
              {locations.length === 0 ? (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">No locations available</p>
              ) : (
                locations.map((location) => (
                  <label
                    key={location.id}
                    className="flex items-center gap-2 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.locationIds?.includes(location.id)}
                      onChange={() => handleLocationToggle(location.id)}
                      className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700 rounded focus:ring-2 focus:ring-primary-500/10"
                    />
                    <span className="text-sm text-neutral-900 dark:text-white">
                      {location.name}
                    </span>
                  </label>
                ))
              )}
            </div>
            {formErrors.locationIds && (
              <p className="text-xs text-destructive mt-1">{formErrors.locationIds}</p>
            )}
          </div>

          {/* Providers */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Providers
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 bg-neutral-50 dark:bg-neutral-900">
              {providers.length === 0 ? (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">No providers available</p>
              ) : (
                providers.map((provider) => (
                  <label
                    key={provider.id}
                    className="flex items-center gap-2 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.providerIds?.includes(provider.id)}
                      onChange={() => handleProviderToggle(provider.id)}
                      className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700 rounded focus:ring-2 focus:ring-primary-500/10"
                    />
                    <span className="text-sm text-neutral-900 dark:text-white">
                      {provider.firstName} {provider.lastName}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Booking Time Window */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Allowed booking time window <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Start time
                </label>
                <input
                  type="time"
                  value={formData.bookingStartTime}
                  onChange={(e) =>
                    setFormData({ ...formData, bookingStartTime: e.target.value })
                  }
                  className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                />
                {formErrors.bookingStartTime && (
                  <p className="text-xs text-destructive mt-1">{formErrors.bookingStartTime}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1.5">
                  End time
                </label>
                <input
                  type="time"
                  value={formData.bookingEndTime}
                  onChange={(e) =>
                    setFormData({ ...formData, bookingEndTime: e.target.value })
                  }
                  className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                />
                {formErrors.bookingEndTime && (
                  <p className="text-xs text-destructive mt-1">{formErrors.bookingEndTime}</p>
                )}
              </div>
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
              Only time slots within this window will be available for booking
            </p>
          </div>

          {/* Slot Capacity */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Slot capacity <span className="text-destructive">*</span>
            </label>
            <input
              type="number"
              value={formData.slotCapacity}
              onChange={(e) =>
                setFormData({ ...formData, slotCapacity: parseInt(e.target.value) || 1 })
              }
              min="1"
              className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
            />
            {formErrors.slotCapacity && (
              <p className="text-xs text-destructive mt-1">{formErrors.slotCapacity}</p>
            )}
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
              Number of patients that can book the same time slot
            </p>
          </div>

          {/* Online Booking Toggle */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.allowOnlineBooking}
                onChange={(e) =>
                  setFormData({ ...formData, allowOnlineBooking: e.target.checked })
                }
                className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700 rounded focus:ring-2 focus:ring-primary-500/10"
              />
              <div>
                <span className="text-sm font-medium text-neutral-900 dark:text-white">
                  Allow online booking
                </span>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Patients can book this service online
                </p>
              </div>
            </label>
          </div>

          {/* Active Status Toggle */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700 rounded focus:ring-2 focus:ring-primary-500/10"
              />
              <div>
                <span className="text-sm font-medium text-neutral-900 dark:text-white">
                  Active
                </span>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Service is available for booking
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 px-5 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
          >
            {service ? "Save changes" : "Add service"}
          </button>
        </div>
      </div>
    </>
  );
}