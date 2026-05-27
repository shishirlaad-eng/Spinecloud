import { useState, useEffect } from "react";
import { X, Plus, Trash2, ChevronDown, Check, Search } from "lucide-react";

interface BookingWindow {
  id: string;
  startTime: string;
  endTime: string;
  duration: number; // 15, 30, 60
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

interface AddEditServiceDrawerRedesignedProps {
  isOpen: boolean;
  service: Service | null;
  locations: Location[];
  onClose: () => void;
  onSave: (service: Partial<Service>) => void;
}

export function AddEditServiceDrawerRedesigned({
  isOpen,
  service,
  locations,
  onClose,
  onSave,
}: AddEditServiceDrawerRedesignedProps) {
  const [formData, setFormData] = useState<Partial<Service>>({
    name: "",
    price: 0,
    locationIds: [],
    bookingWindows: [{ id: "window-1", startTime: "09:00", endTime: "17:00", duration: 30, slotCapacity: 1 }],
    allowOnlineBooking: true,
    isActive: true,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState("");

  useEffect(() => {
    if (service) {
      setFormData(service);
    } else {
      setFormData({
        name: "",
        price: 0,
        locationIds: [],
        bookingWindows: [{ id: "window-1", startTime: "09:00", endTime: "17:00", duration: 30, slotCapacity: 1 }],
        selfBookingAllowed: true,
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
    if (formData.price === undefined || formData.price < 0) {
      errors.price = "Price must be 0 or greater";
    }
    if (!formData.locationIds || formData.locationIds.length === 0) {
      errors.locationIds = "At least one location is required";
    }
    
    formData.bookingWindows?.forEach((window, index) => {
      if (!window.startTime) errors[`window-${index}-startTime`] = "Start time is required";
      if (!window.endTime) errors[`window-${index}-endTime`] = "End time is required";
      if (window.startTime && window.endTime && window.startTime >= window.endTime) {
        errors[`window-${index}-endTime`] = "End time must be after start time";
      }
      if (!window.slotCapacity || window.slotCapacity < 1) {
        errors[`window-${index}-slotCapacity`] = "Capacity must be at least 1";
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    onSave(formData);
  };

  const handleLocationToggle = (locationId: string) => {
    const currentLocations = formData.locationIds || [];
    const newLocations = currentLocations.includes(locationId)
      ? currentLocations.filter((id) => id !== locationId)
      : [...currentLocations, locationId];
    setFormData({ ...formData, locationIds: newLocations });
  };

  const handleSelectAllLocations = () => {
    if (formData.locationIds?.length === locations.length) {
      setFormData({ ...formData, locationIds: [] });
    } else {
      setFormData({ ...formData, locationIds: locations.map(l => l.id) });
    }
  };

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
    const newWindows = (formData.bookingWindows || []).filter((w) => w.id !== windowId);
    setFormData({ ...formData, bookingWindows: newWindows });
  };

  const handleWindowChange = (windowId: string, field: keyof BookingWindow, value: any) => {
    const newWindows = (formData.bookingWindows || []).map((w) =>
      w.id === windowId ? { ...w, [field]: value } : w
    );
    setFormData({ ...formData, bookingWindows: newWindows });
  };

  const filteredLocations = locations.filter(l => 
    l.name.toLowerCase().includes(locationSearchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-white dark:bg-neutral-950 shadow-xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 px-5 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
              {service ? "Edit service" : "Add service"}
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
              Configure service details and booking windows
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors">
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

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Price (USD) <span className="text-destructive">*</span>
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              min="0"
              step="0.01"
              className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
            />
            {formErrors.price && (
              <p className="text-xs text-destructive mt-1">{formErrors.price}</p>
            )}
          </div>

          {/* Location Multi-select */}
          <div className="relative">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Location <span className="text-destructive">*</span>
            </label>
            
            {/* Chips Container */}
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.locationIds?.map(locId => {
                const location = locations.find(l => l.id === locId);
                return (
                  <span key={locId} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full border border-primary-100 dark:border-primary-800">
                    {location?.name}
                    <button onClick={() => handleLocationToggle(locId)} className="p-0.5 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-full">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
            </div>

            <button
              onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
              className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white flex items-center justify-between focus:border-primary-600 transition-all shadow-sm"
            >
              <span className="text-neutral-500">Select locations...</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isLocationDropdownOpen ? "rotate-180" : ""}`} />
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
                      placeholder="Search locations..."
                      className="w-full h-8 pl-8 pr-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-md text-xs outline-none focus:border-primary-600"
                    />
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto p-1">
                  <button
                    onClick={handleSelectAllLocations}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/30 rounded-md transition-colors font-medium"
                  >
                    Select All
                    {formData.locationIds?.length === locations.length && <Check className="w-4 h-4" />}
                  </button>
                  <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-1" />
                  {filteredLocations.map(location => (
                    <button
                      key={location.id}
                      onClick={() => handleLocationToggle(location.id)}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-md transition-colors"
                    >
                      {location.name}
                      {formData.locationIds?.includes(location.id) && <Check className="w-4 h-4 text-primary-600" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {formErrors.locationIds && (
              <p className="text-xs text-destructive mt-1">{formErrors.locationIds}</p>
            )}
          </div>

          {/* Booking Time Windows */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Booking Time Windows <span className="text-destructive">*</span>
              </label>
              <button
                onClick={handleAddWindow}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-xs shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Window
              </button>
            </div>

            <div className="space-y-3">
              {formData.bookingWindows?.map((window, index) => (
                <div key={window.id} className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 space-y-4 shadow-sm relative group">
                  {formData.bookingWindows!.length > 1 && (
                    <button
                      onClick={() => handleDeleteWindow(window.id)}
                      className="absolute top-2 right-2 p-1.5 text-neutral-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Start Time</label>
                      <input
                        type="time"
                        value={window.startTime}
                        onChange={(e) => handleWindowChange(window.id, "startTime", e.target.value)}
                        className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none transition-all shadow-sm"
                      />
                      {formErrors[`window-${index}-startTime`] && <p className="text-[10px] text-destructive mt-1">{formErrors[`window-${index}-startTime`]}</p>}
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">End Time</label>
                      <input
                        type="time"
                        value={window.endTime}
                        onChange={(e) => handleWindowChange(window.id, "endTime", e.target.value)}
                        className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none transition-all shadow-sm"
                      />
                      {formErrors[`window-${index}-endTime`] && <p className="text-[10px] text-destructive mt-1">{formErrors[`window-${index}-endTime`]}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Duration</label>
                      <select
                        value={window.duration}
                        onChange={(e) => handleWindowChange(window.id, "duration", parseInt(e.target.value))}
                        className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none transition-all shadow-sm appearance-none"
                      >
                        <option value={15}>15 mins</option>
                        <option value={30}>30 mins</option>
                        <option value={45}>45 mins</option>
                        <option value={60}>60 mins</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Slot Capacity</label>
                      <input
                        type="number"
                        value={window.slotCapacity}
                        onChange={(e) => handleWindowChange(window.id, "slotCapacity", parseInt(e.target.value) || 1)}
                        min="1"
                        placeholder="Enter capacity"
                        className="w-full h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none transition-all shadow-sm"
                      />
                      {formErrors[`window-${index}-slotCapacity`] && <p className="text-[10px] text-destructive mt-1">{formErrors[`window-${index}-slotCapacity`]}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Self-booking Toggle */}
          <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800">
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">Self-booking allowed</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Allow patients to book this service online
              </p>
            </div>
            <button
              onClick={() => setFormData({ ...formData, allowOnlineBooking: !formData.allowOnlineBooking })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 ${
                formData.allowOnlineBooking ? "bg-primary-600" : "bg-neutral-200 dark:bg-neutral-700"
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.allowOnlineBooking ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>

          {/* Active Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800">
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">Active status</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Inactive services cannot be selected for new appointments
              </p>
            </div>
            <button
              onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 ${
                formData.isActive ? "bg-primary-600" : "bg-neutral-200 dark:bg-neutral-700"
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isActive ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 px-5 py-4 flex gap-3 justify-end shadow-lg">
          <button onClick={onClose} className="px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm">
            Cancel
          </button>
          <button onClick={handleSave} className="px-6 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm shadow-sm">
            {service ? "Save changes" : "Add service"}
          </button>
        </div>
      </div>
    </>
  );
}