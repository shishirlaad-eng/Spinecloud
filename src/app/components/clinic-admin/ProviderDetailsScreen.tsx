import { useState } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { ArrowLeft, Clock, Save, Plus, Trash2, MapPin, ChevronDown, Check, Search, X, Edit2, User, Mail, Stethoscope, ChevronRight } from "lucide-react";

interface Branch {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
  branchId: string;
  serviceIds: string[];
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
  role: string;
  specialty: string;
  status: "Active" | "Inactive";
  schedule: Schedule;
  selfBookable?: boolean;
}

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  service: string;
  status: "Confirmed" | "Pending" | "Cancelled" | "Completed";
}

interface ProviderDetailsScreenProps {
  provider: Provider;
  appointments: Appointment[];
  availableBranches: Branch[];
  allServices: Service[];
  onNavigate: (menu: any) => void;
  onBack: () => void;
  onUpdateProvider: (provider: Provider) => void;
  onSaveSchedule: (providerId: string, schedule: Schedule) => void;
  onLogout?: () => void;
}

type Tab = "basic" | "schedule";

const defaultTimeSlot = (branchId: string): TimeSlot => ({
  startTime: "09:00",
  endTime: "12:00",
  branchId: branchId || "",
  serviceIds: [],
});

const defaultDaySchedule: DaySchedule = {
  isWorking: false,
  timeSlots: [],
};

export function ProviderDetailsScreen({
  provider,
  appointments,
  availableBranches,
  allServices,
  onNavigate,
  onBack,
  onUpdateProvider,
  onSaveSchedule,
  onLogout,
}: ProviderDetailsScreenProps) {
  const [activeTab, setActiveTab] = useState<Tab>("basic");
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  
  // Basic info state
  const [firstName, setFirstName] = useState(provider.firstName);
  const [lastName, setLastName] = useState(provider.lastName);
  const [email, setEmail] = useState(provider.email);
  const [specialty, setSpecialty] = useState(provider.specialty);
  const [status, setStatus] = useState(provider.status);
  const [selfBookable, setSelfBookable] = useState(provider.selfBookable ?? false);
  const [basicInfoErrors, setBasicInfoErrors] = useState<Record<string, string>>({});
  
  // Schedule state
  const [schedule, setSchedule] = useState<Schedule>(() => {
    const days: (keyof Schedule)[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const initialSchedule = {} as Schedule;
    
    days.forEach(day => {
      const providerDay = provider.schedule?.[day];
      if (providerDay && 'timeSlots' in providerDay && Array.isArray(providerDay.timeSlots)) {
        initialSchedule[day] = {
          isWorking: providerDay.isWorking,
          timeSlots: providerDay.timeSlots.map((slot: any) => ({
            startTime: slot.startTime || "09:00",
            endTime: slot.endTime || "12:00",
            branchId: slot.branchId || "",
            serviceIds: slot.serviceIds || [],
          })),
        };
      } else {
        initialSchedule[day] = defaultDaySchedule;
      }
    });
    
    return initialSchedule;
  });

  const [openServiceDropdown, setOpenServiceDropdown] = useState<{ day: keyof Schedule, index: number } | null>(null);
  const [serviceSearchQuery, setServiceSearchQuery] = useState("");

  const validateBasicInfo = () => {
    const errors: Record<string, string> = {};
    
    if (!firstName.trim()) errors.firstName = "First name is required";
    if (!lastName.trim()) errors.lastName = "Last name is required";
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format";
    }
    if (!specialty.trim()) errors.specialty = "Specialty is required";
    
    setBasicInfoErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveBasicInfo = () => {
    if (!validateBasicInfo()) return;
    
    const updatedProvider: Provider = {
      ...provider,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      specialty: specialty.trim(),
      status,
      selfBookable,
    };
    
    onUpdateProvider(updatedProvider);
    setIsEditingBasic(false);
  };

  const handleCancelBasicEdit = () => {
    setFirstName(provider.firstName);
    setLastName(provider.lastName);
    setEmail(provider.email);
    setSpecialty(provider.specialty);
    setStatus(provider.status);
    setSelfBookable(provider.selfBookable ?? false);
    setBasicInfoErrors({});
    setIsEditingBasic(false);
  };

  // Schedule functions
  const handleToggleDay = (day: keyof Schedule) => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        isWorking: !schedule[day].isWorking,
      },
    });
  };

  const handleAddTimeSlot = (day: keyof Schedule) => {
    const defaultBranchId = availableBranches[0]?.id || "";
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        timeSlots: [...schedule[day].timeSlots, defaultTimeSlot(defaultBranchId)],
      },
    });
  };

  const handleRemoveTimeSlot = (day: keyof Schedule, index: number) => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        timeSlots: schedule[day].timeSlots.filter((_, i) => i !== index),
      },
    });
  };

  const handleUpdateTimeSlot = (
    day: keyof Schedule,
    index: number,
    field: keyof TimeSlot,
    value: any
  ) => {
    const newSlots = [...schedule[day].timeSlots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        timeSlots: newSlots,
      },
    });
  };

  const handleServiceToggle = (day: keyof Schedule, index: number, serviceId: string) => {
    const currentServices = schedule[day].timeSlots[index].serviceIds || [];
    const newServices = currentServices.includes(serviceId)
      ? currentServices.filter(id => id !== serviceId)
      : [...currentServices, serviceId];
    handleUpdateTimeSlot(day, index, "serviceIds", newServices);
  };

  const handleSelectAllServices = (day: keyof Schedule, index: number) => {
    const currentServices = schedule[day].timeSlots[index].serviceIds || [];
    if (currentServices.length === allServices.length) {
      handleUpdateTimeSlot(day, index, "serviceIds", []);
    } else {
      handleUpdateTimeSlot(day, index, "serviceIds", allServices.map(s => s.id));
    }
  };

  const handleSaveSchedule = () => {
    onSaveSchedule(provider.id, schedule);
  };

  const renderBasicInfo = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-end mb-1">
        {!isEditingBasic ? (
          <button 
            onClick={() => setIsEditingBasic(true)} 
            className="inline-flex items-center gap-2 px-4 h-9 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm font-medium"
          >
            <Edit2 className="w-4 h-4" />Edit info
          </button>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={handleCancelBasicEdit} 
              className="inline-flex items-center gap-2 px-4 h-9 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm font-medium"
            >
              <X className="w-4 h-4" />Cancel
            </button>
            <button 
              onClick={handleSaveBasicInfo} 
              className="inline-flex items-center gap-2 px-4 h-9 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              <Save className="w-4 h-4" />Save changes
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
            </div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Personal Information</h4>
          </div>
          
          {!isEditingBasic ? (
            <div className="space-y-3">
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Full name</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{provider.firstName} {provider.lastName}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Email address</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{provider.email}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Specialty</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-900/50 mt-1">
                  {provider.specialty}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 block mb-1">First name</label>
                  <input 
                    type="text" 
                    value={firstName} 
                    onChange={e => setFirstName(e.target.value)} 
                    className={`h-9 w-full rounded-lg border ${basicInfoErrors.firstName ? 'border-destructive' : 'border-neutral-200 dark:border-neutral-700'} bg-neutral-50 dark:bg-neutral-800 px-3 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10`} 
                  />
                  {basicInfoErrors.firstName && <p className="text-[10px] text-destructive mt-1">{basicInfoErrors.firstName}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 block mb-1">Last name</label>
                  <input 
                    type="text" 
                    value={lastName} 
                    onChange={e => setLastName(e.target.value)} 
                    className={`h-9 w-full rounded-lg border ${basicInfoErrors.lastName ? 'border-destructive' : 'border-neutral-200 dark:border-neutral-700'} bg-neutral-50 dark:bg-neutral-800 px-3 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10`} 
                  />
                  {basicInfoErrors.lastName && <p className="text-[10px] text-destructive mt-1">{basicInfoErrors.lastName}</p>}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 block mb-1">Email address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className={`h-9 w-full rounded-lg border ${basicInfoErrors.email ? 'border-destructive' : 'border-neutral-200 dark:border-neutral-700'} bg-neutral-50 dark:bg-neutral-800 px-3 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10`} 
                />
                {basicInfoErrors.email && <p className="text-[10px] text-destructive mt-1">{basicInfoErrors.email}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 block mb-1">Specialty</label>
                <select 
                  value={specialty} 
                  onChange={e => setSpecialty(e.target.value)} 
                  className="h-9 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
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
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-success-50 dark:bg-success-950/30 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-success-600 dark:text-success-400" />
            </div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Account Settings</h4>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 block mb-2">Account Status</label>
              {!isEditingBasic ? (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  provider.status === "Active"
                    ? "bg-success-50 dark:bg-success-950/30 text-success-700 dark:text-success-300"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                }`}>
                  {provider.status}
                </span>
              ) : (
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="status" checked={status === "Active"} onChange={() => setStatus("Active")} className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                    <span className="text-sm text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="status" checked={status === "Inactive"} onChange={() => setStatus("Inactive")} className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                    <span className="text-sm text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors">Inactive</span>
                  </label>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">Online Booking</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Allow patients to book this provider online</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={selfBookable} 
                    onChange={(e) => setSelfBookable(e.target.checked)} 
                    disabled={!isEditingBasic}
                    className="sr-only peer" 
                  />
                  <div className="w-10 h-5 bg-neutral-300 dark:bg-neutral-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Weekly Schedule</h3>
            <button 
              onClick={handleSaveSchedule} 
              className="h-8 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-2 shadow-sm active:scale-95"
            >
              <Save className="w-3.5 h-3.5" /> Save schedule
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {(Object.keys(schedule) as (keyof Schedule)[]).map((day) => (
            <div key={day} className="p-5 hover:bg-neutral-50/30 dark:hover:bg-neutral-900/30 transition-colors">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="w-32 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={schedule[day].isWorking} onChange={() => handleToggleDay(day)} className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 transition-all" />
                    <span className="text-sm font-semibold capitalize text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors">{day}</span>
                  </label>
                </div>
                
                <div className="flex-1 space-y-4">
                  {!schedule[day].isWorking ? (
                    <div className="py-2 flex items-center gap-2 text-neutral-400">
                      <Clock className="w-3.5 h-3.5" />
                      <p className="text-sm italic">Not working</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {schedule[day].timeSlots.map((slot, index) => (
                        <div key={index} className="flex flex-col gap-4 p-4 border border-neutral-100 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 relative group/slot hover:border-primary-200 dark:hover:border-primary-900/50 transition-all">
                          <button onClick={() => handleRemoveTimeSlot(day, index)} className="absolute top-2 right-2 p-1 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg opacity-0 group-hover/slot:opacity-100 transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Branch</label>
                              <div className="relative">
                                <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-400" />
                                <select
                                  value={slot.branchId}
                                  onChange={(e) => handleUpdateTimeSlot(day, index, "branchId", e.target.value)}
                                  className="w-full h-8 pl-8 pr-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs text-neutral-900 dark:text-white outline-none focus:border-primary-600 transition-all"
                                >
                                  <option value="">Select branch</option>
                                  {availableBranches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Start Time</label>
                              <div className="relative">
                                <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-400" />
                                <input type="time" value={slot.startTime} onChange={(e) => handleUpdateTimeSlot(day, index, "startTime", e.target.value)} className="w-full h-8 pl-8 pr-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs text-neutral-900 dark:text-white outline-none focus:border-primary-600 transition-all" />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">End Time</label>
                              <div className="relative">
                                <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-400" />
                                <input type="time" value={slot.endTime} onChange={(e) => handleUpdateTimeSlot(day, index, "endTime", e.target.value)} className="w-full h-8 pl-8 pr-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs text-neutral-900 dark:text-white outline-none focus:border-primary-600 transition-all" />
                              </div>
                            </div>
                          </div>

                          <div className="relative">
                            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Services</label>
                            
                            <div className="flex flex-wrap gap-1.5 mb-2 min-h-[20px]">
                              {(slot.serviceIds || []).map(svcId => {
                                const service = allServices.find(s => s.id === svcId);
                                return (
                                  <span key={svcId} className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 text-[10px] font-medium rounded-full border border-primary-100 dark:border-primary-800/50">
                                    {service?.name}
                                    <button onClick={(e) => { e.stopPropagation(); handleServiceToggle(day, index, svcId); }} className="p-0.5 hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full transition-colors">
                                      <X className="w-2 h-2" />
                                    </button>
                                  </span>
                                );
                              })}
                              {(slot.serviceIds || []).length === 0 && <span className="text-[10px] text-neutral-400 italic">No services assigned</span>}
                            </div>

                            <button
                              onClick={() => setOpenServiceDropdown(openServiceDropdown?.day === day && openServiceDropdown?.index === index ? null : { day, index })}
                              className={`w-full h-8 px-3 bg-neutral-50 dark:bg-neutral-800 border rounded-lg text-[11px] text-neutral-500 flex items-center justify-between transition-all ${openServiceDropdown?.day === day && openServiceDropdown?.index === index ? 'border-primary-600 ring-2 ring-primary-500/10' : 'border-neutral-200 dark:border-neutral-700'}`}
                            >
                              <span>Select services for this shift...</span>
                              <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform duration-200 ${openServiceDropdown?.day === day && openServiceDropdown?.index === index ? 'rotate-180' : ''}`} />
                            </button>

                            {openServiceDropdown?.day === day && openServiceDropdown?.index === index && (
                              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl z-30 overflow-hidden">
                                <div className="p-2 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50">
                                  <div className="relative">
                                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-400" />
                                    <input
                                      type="text"
                                      autoFocus
                                      value={serviceSearchQuery}
                                      onChange={(e) => setServiceSearchQuery(e.target.value)}
                                      placeholder="Search services..."
                                      className="w-full h-7 pl-7 pr-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-xs outline-none focus:border-primary-600"
                                    />
                                  </div>
                                </div>
                                <div className="max-h-48 overflow-y-auto p-1">
                                  <button
                                    onClick={() => handleSelectAllServices(day, index)}
                                    className="w-full flex items-center justify-between px-2 py-1.5 text-[10px] text-primary-600 hover:bg-primary-50 rounded transition-colors font-semibold"
                                  >
                                    <span>Select All Services</span>
                                    {slot.serviceIds?.length === allServices.length ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                  </button>
                                  <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-1" />
                                  {allServices.filter(s => s.name.toLowerCase().includes(serviceSearchQuery.toLowerCase())).map(service => (
                                    <button
                                      key={service.id}
                                      onClick={() => handleServiceToggle(day, index, service.id)}
                                      className={`w-full flex items-center justify-between px-2 py-1.5 text-[10px] rounded transition-all mb-0.5 ${slot.serviceIds?.includes(service.id) ? 'bg-primary-50 dark:bg-primary-950/30 text-primary-700 font-medium' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'}`}
                                    >
                                      {service.name}
                                      {slot.serviceIds?.includes(service.id) && <Check className="w-3 h-3 text-primary-600" />}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      <button onClick={() => handleAddTimeSlot(day)} className="inline-flex items-center gap-2 px-3 py-1.5 text-primary-600 bg-primary-50 dark:bg-primary-950/30 hover:bg-primary-100 rounded-lg transition-all text-[11px] font-bold border border-primary-100 dark:border-primary-900/50">
                        <Plus className="w-3 h-3" /> Add shift
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <ClinicAdminLayout activeMenu="providers" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-6 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to providers
        </button>

        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                {provider.firstName[0]}{provider.lastName[0]}
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
                  {provider.firstName} {provider.lastName}
                </h1>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    provider.status === "Active"
                      ? "bg-success-50 dark:bg-success-950/30 text-success-700 dark:text-success-300"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                  }`}>
                    {provider.status}
                  </span>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400 border-l border-neutral-200 dark:border-neutral-800 pl-3">
                    {provider.specialty}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-neutral-200 dark:border-neutral-800 mb-6">
          <div className="flex gap-1">
            {[
              { key: "basic",    label: "Overview"      },
              { key: "schedule", label: "Schedule" },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as Tab)}
                className={`px-4 pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-primary-600 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-4xl">
          {activeTab === "basic" ? renderBasicInfo() : renderSchedule()}
        </div>
      </div>
    </ClinicAdminLayout>
  );
}