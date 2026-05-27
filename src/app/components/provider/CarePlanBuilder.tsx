import { useState, useEffect, useRef } from "react";
import { CheckSquare, Square, Search, X, Check, Save, Printer, ArrowLeft, ChevronDown, Calendar } from "lucide-react";
import { BookTreatmentScheduleDrawer } from "./BookTreatmentScheduleDrawer";

export interface CarePlanScheduleRow {
  id: string;
  timesPerWeek: number;
  durationWeeks: number;
}

export interface CarePlan {
  id: string;
  patientId: string;
  datePrepared: string;
  basedOn: string[];
  actionPlan: string[];
  nutritionalSupplements: string;
  scheduleRows: CarePlanScheduleRow[];
  patientResponsibility: string;
  doctorSignatureDate: string;
  patientSignatureDate: string;
  patientName?: string;
  patientEmail?: string;
  providerName?: string;
  branch?: string;
}

interface CarePlanBuilderProps {
  patientId: string;
  patientName: string;
  existingPlanId?: string | null;
  isReadOnly?: boolean;
  onSave: (plan: CarePlan) => void;
  onCancel: () => void;
  services?: any[];
  branches?: any[];
  providers?: any[];
  onBookAppointments?: (appointments: any[]) => void;
}

export const CarePlanBuilder = ({ 
  patientId, 
  patientName, 
  existingPlanId, 
  isReadOnly, 
  onSave, 
  onCancel,
  services = [],
  branches = [],
  providers = [],
  onBookAppointments
}: CarePlanBuilderProps) => {
  const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);
  const [plan, setPlan] = useState<CarePlan>({
    id: `cp-${Date.now()}`,
    patientId,
    datePrepared: new Date().toISOString(),
    basedOn: [],
    actionPlan: [],
    nutritionalSupplements: "",
    scheduleRows: [{ id: `sch-${Date.now()}`, timesPerWeek: 3, durationWeeks: 4 }],
    patientResponsibility: "Health Workshop, Home Exercises, and Traction as Recommended",
    doctorSignatureDate: "",
    patientSignatureDate: ""
  });

  const finalServices = services.length > 0 ? services : [
    { id: "serv-1", name: "Chiropractic Spinal Adjustment", durations: [{ duration: 30 }] },
    { id: "serv-2", name: "Initial Chiropractic Consultation", durations: [{ duration: 60 }] },
    { id: "serv-3", name: "Spinal Decompression Therapy", durations: [{ duration: 45 }] },
    { id: "serv-4", name: "Soft Tissue Massage Therapy", durations: [{ duration: 30 }] }
  ];

  const finalBranches = branches.length > 0 ? branches : [
    { id: "branch-1", name: "Downtown Chiropractic Center" },
    { id: "branch-2", name: "Uptown Spine & Wellness" },
    { id: "branch-3", name: "Westside Chiropractic Clinic" }
  ];

  const finalProviders = providers.length > 0 ? providers : [
    { id: "user-1", firstName: "David", lastName: "Bohn", specialty: "Chiropractor" },
    { id: "user-2", firstName: "Sarah", lastName: "Johnson", specialty: "Spinal Decompression Specialist" },
    { id: "user-3", firstName: "Emily", lastName: "Wilson", specialty: "Massage Therapist" }
  ];

  const [masterOptions, setMasterOptions] = useState({
    basedOn: ["Your Age", "MRI /CT Report", "Digital Foot Scans", "Number of Exam Abnormalities", "Your History and Physical Examination", "Posture/Range of Motion Abnormalities"],
    actionPlan: ["Spinal Adjustments", "Extremity Adjustments", "Hot Moist Packs", "Electrical Stimulation"],
    supplements: ["Omega 3 Fish oil", "Vitamin D3", "Magnesium Glycinate", "Probiotics"],
    responsibility: ["Health Workshop", "Home Exercises", "Traction as Recommended", "Stay Hydrated"]
  });

  useEffect(() => {
    const loadMaster = (key: string, defaults: string[]) => {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
           return parsed.filter((item: any) => item.status === "active").map((item: any) => item.label);
        }
        return parsed.map((item: any) => typeof item === 'string' ? item : item.label);
      }
      return defaults;
    };

    setMasterOptions({
      basedOn: loadMaster("carePlan_master_basedOn", masterOptions.basedOn),
      actionPlan: loadMaster("carePlan_master_actionPlan", masterOptions.actionPlan),
      supplements: loadMaster("carePlan_master_supplements", masterOptions.supplements),
      responsibility: loadMaster("carePlan_master_responsibility", masterOptions.responsibility)
    });
  }, []);

  useEffect(() => {
    if (existingPlanId) {
      const saved = localStorage.getItem(`carePlan_${existingPlanId}`);
      if (saved) {
        setPlan(JSON.parse(saved));
      }
    }
  }, [existingPlanId]);

  const toggleBasedOn = (item: string) => {
    if (isReadOnly) return;
    setPlan(prev => ({
      ...prev,
      basedOn: prev.basedOn.includes(item)
        ? prev.basedOn.filter(i => i !== item)
        : [...prev.basedOn, item]
    }));
  };

  const toggleActionPlan = (item: string) => {
    if (isReadOnly) return;
    setPlan(prev => ({
      ...prev,
      actionPlan: prev.actionPlan.includes(item)
        ? prev.actionPlan.filter(i => i !== item)
        : [...prev.actionPlan, item]
    }));
  };

  const updateScheduleRow = (id: string, field: "timesPerWeek" | "durationWeeks", value: number) => {
    setPlan(prev => ({
      ...prev,
      scheduleRows: prev.scheduleRows.map(row => row.id === id ? { ...row, [field]: value } : row)
    }));
  };

  const addScheduleRow = () => {
    setPlan(prev => ({
      ...prev,
      scheduleRows: [...prev.scheduleRows, { id: `sch-${Date.now()}`, timesPerWeek: 1, durationWeeks: 1 }]
    }));
  };

  const removeScheduleRow = (id: string) => {
    setPlan(prev => ({
      ...prev,
      scheduleRows: prev.scheduleRows.filter(row => row.id !== id)
    }));
  };

  const totalVisits = plan.scheduleRows.reduce((acc, row) => acc + (row.timesPerWeek * row.durationWeeks), 0);
  const totalWeeks = plan.scheduleRows.reduce((acc, row) => acc + row.durationWeeks, 0);
  const totalMonths = (totalWeeks / 4).toFixed(2);

  const handleSave = () => {
    const finalPlan = {
      ...plan,
      patientName: patientName,
      patientEmail: "patient@example.com", // Fallback for mock environment
      providerName: "Dr. David Bohn", // Fallback
      branch: "Main Branch", // Fallback
    };
    localStorage.setItem(`carePlan_${plan.id}`, JSON.stringify(finalPlan));
    onSave(finalPlan);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 bg-neutral-50 dark:bg-neutral-800/50">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
            {existingPlanId ? "Edit Care Plan" : "New Recommended Action Plan"}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 shadow-sm flex items-center gap-2 hidden sm:flex">
             <Printer className="w-4 h-4"/> Print PDF
          </button>
          {!isReadOnly && (
            <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 shadow-sm flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Plan
            </button>
          )}
        </div>
      </div>

      <div className="p-8 w-full mx-auto space-y-10">
        
        {/* Meta Info */}
        <div className="flex justify-between items-center text-sm text-neutral-900 dark:text-neutral-100 font-medium">
           <div>Patient: <span className="font-semibold text-primary-700">{patientName}</span></div>
           <div>Date Prepared: {new Date(plan.datePrepared).toLocaleDateString()}</div>
        </div>

        {/* Based On Section */}
        <div className="space-y-4">
          <h3 className="font-bold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-2">Your Recommended Action Plan is Based On:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pl-4">
              {masterOptions.basedOn.map(item => (
                <label key={item} className={`flex items-center gap-3 ${isReadOnly ? 'cursor-default' : 'cursor-pointer group'} select-none`}>
                  <input type="checkbox" className="hidden" checked={plan.basedOn.includes(item)} onChange={() => toggleBasedOn(item)} disabled={isReadOnly} />
                  <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${plan.basedOn.includes(item) ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-neutral-400 group-hover:border-primary-500'} ${isReadOnly && !plan.basedOn.includes(item) ? 'opacity-50 hover:border-neutral-400' : ''}`}>
                     {plan.basedOn.includes(item) && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">{item}</span>
                </label>
             ))}
          </div>
          <p className="text-xs text-neutral-500 italic mt-4 text-center">My specific recommendations in your particular case are based on your individual exam findings and my experience with many other cases similar to yours over the past 25 years. Please understand that healing and pain relief is a matter of time.</p>
        </div>

        {/* Doctor Action Plan Section */}
        <div className="space-y-4">
          <h3 className="font-bold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-2">Doctor Recommended Action Plan:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-4">
             {masterOptions.actionPlan.map(item => (
                <label key={item} className={`flex items-center gap-3 ${isReadOnly ? 'cursor-default' : 'cursor-pointer group'} select-none`}>
                  <input type="checkbox" className="hidden" checked={plan.actionPlan.includes(item)} onChange={() => toggleActionPlan(item)} disabled={isReadOnly} />
                  <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${plan.actionPlan.includes(item) ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-neutral-400 group-hover:border-primary-500'} ${isReadOnly && !plan.actionPlan.includes(item) ? 'opacity-50 hover:border-neutral-400' : ''}`}>
                     {plan.actionPlan.includes(item) && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">{item}</span>
                </label>
             ))}
          </div>
        </div>

        {/* Supplements */}
        <div className="flex flex-col gap-2 relative">
           <label className="font-bold text-neutral-900 dark:text-white">Nutritional Supplements:</label>
           <SearchableDropdown
             options={masterOptions.supplements}
             value={plan.nutritionalSupplements}
             onChange={(val) => setPlan(prev => ({...prev, nutritionalSupplements: val}))}
             placeholder="Select or type supplement..."
             isReadOnly={isReadOnly}
           />
        </div>

        {/* Treatment Schedule */}
        <div className="space-y-4 bg-neutral-50 dark:bg-neutral-800/30 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <h3 className="font-bold text-neutral-900 dark:text-white mb-4">Your Recommended Treatment Schedule:</h3>
          
          <div className="space-y-3">
             {plan.scheduleRows.map((row, idx) => (
                <div key={row.id} className="flex items-center gap-3 flex-wrap">
                   <input type="number" min="1" max="7" value={row.timesPerWeek} readOnly={isReadOnly} onChange={e => updateScheduleRow(row.id, "timesPerWeek", parseInt(e.target.value) || 0)} className={`w-16 px-2 py-1 text-center font-bold bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded ${isReadOnly ? 'outline-none border-transparent bg-transparent pl-0 text-left' : 'focus:ring-primary-500'}`}/>
                   <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">times a week for</span>
                   <input type="number" min="1" max="52" value={row.durationWeeks} readOnly={isReadOnly} onChange={e => updateScheduleRow(row.id, "durationWeeks", parseInt(e.target.value) || 0)} className={`w-16 px-2 py-1 text-center font-bold bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded ${isReadOnly ? 'outline-none border-transparent bg-transparent pl-0 text-left' : 'focus:ring-primary-500'}`}/>
                   <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">weeks =</span>
                   <span className="text-sm font-bold text-primary-700 w-16 text-center underline underline-offset-4">{row.timesPerWeek * row.durationWeeks} visits</span>
                   {!isReadOnly && plan.scheduleRows.length > 1 && (
                      <button onClick={() => removeScheduleRow(row.id)} className="ml-2 text-neutral-400 hover:text-red-500"><X className="w-4 h-4"/></button>
                   )}
                </div>
             ))}
          </div>

          {!isReadOnly && (
            <button onClick={addScheduleRow} className="text-sm text-primary-600 font-medium hover:underline mt-2">+ Add Phase</button>
          )}

          <div className="pt-4 mt-6 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-between gap-4 flex-wrap text-base font-bold text-neutral-900 dark:text-white">
             <div className="flex items-center gap-4">
                <span>Total Visits <span className="underline underline-offset-4 text-primary-700">{totalVisits}</span></span>
                <span className="text-neutral-400 font-medium">/</span>
                <span><span className="underline underline-offset-4">{totalMonths}</span> Months</span>
             </div>

             <button
               type="button"
               onClick={() => setIsBookingDrawerOpen(true)}
               className="inline-flex items-center gap-2 h-10 px-5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-sm cursor-pointer"
             >
                <Calendar className="w-4 h-4" /> Book Schedule
             </button>
          </div>
        </div>

        {/* Patient Responsibility */}
        <div className="flex flex-col gap-2 relative">
           <label className="font-bold text-neutral-900 dark:text-white">Patient Responsibility:</label>
           <SearchableDropdown
             options={masterOptions.responsibility}
             value={plan.patientResponsibility}
             onChange={(val) => setPlan(prev => ({...prev, patientResponsibility: val}))}
             placeholder="Select or type responsibility..."
             isReadOnly={isReadOnly}
           />
        </div>

        <div className="bg-primary-50/50 dark:bg-primary-900/10 p-4 rounded-lg italic text-sm text-primary-900 dark:text-primary-100 font-medium text-center border border-primary-100 dark:border-primary-900/30">
          Features and Benefits of Your Corrective Care Program, and How It Works: Comparative progress exams every 12 visits. 90 days of tailor-made, trainer directed exercise.
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-3 gap-8 pt-10 mt-8 border-t border-neutral-200 dark:border-neutral-800 pb-10">
           <div className="flex flex-col gap-2 relative">
             {plan.doctorSignatureDate ? (
                <div className="h-10 text-primary-700 font-serif italic text-xl border-b border-neutral-400">Signed Digitally</div>
             ) : (
                isReadOnly ? (
                  <div className="h-10 border-b border-neutral-400 text-left w-full"></div>
                ) : (
                  <button onClick={() => setPlan(prev => ({...prev, doctorSignatureDate: new Date().toISOString()}))} className="h-10 text-sm font-medium text-neutral-500 hover:text-primary-600 border-b border-neutral-400 text-left w-full hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition duration-150">Click to Sign Form</button>
                )
             )}
             <span className="text-sm font-medium text-neutral-600">Doctor Signature</span>
           </div>
           <div className="flex flex-col gap-2 relative">
             <div className="h-10 border-b border-neutral-400"></div>
             <span className="text-sm font-medium text-neutral-600">Patient Signature</span>
           </div>
           <div className="flex flex-col gap-2 relative">
             <div className="h-10 border-b border-neutral-400 flex items-end pb-1 font-semibold text-neutral-800 dark:text-neutral-200">
                {plan.doctorSignatureDate ? new Date(plan.doctorSignatureDate).toLocaleDateString() : ""}
             </div>
             <span className="text-sm font-medium text-neutral-600">Date</span>
           </div>
        </div>

      </div>

      {isBookingDrawerOpen && (
        <BookTreatmentScheduleDrawer
          isOpen={isBookingDrawerOpen}
          onClose={() => setIsBookingDrawerOpen(false)}
          patientId={patientId}
          patientName={patientName}
          scheduleRows={plan.scheduleRows}
          services={finalServices}
          branches={finalBranches}
          providers={finalProviders}
          onConfirmBooking={(newAppts) => {
            if (onBookAppointments) {
              onBookAppointments(newAppts);
            }
          }}
        />
      )}
    </div>
  );
}

function SearchableDropdown({ options, value, onChange, placeholder, isReadOnly }: { 
  options: string[], 
  value: string, 
  onChange: (val: string) => void, 
  placeholder: string,
  isReadOnly?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <input 
          type="text" 
          value={isOpen ? search : value}
          onChange={(e) => {
            if (!isOpen) setIsOpen(true);
            setSearch(e.target.value);
            onChange(e.target.value);
          }}
          onFocus={() => {
            if (!isReadOnly) {
              setIsOpen(true);
              setSearch("");
            }
          }}
          placeholder={placeholder}
          readOnly={isReadOnly}
          className={`w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm bg-neutral-50 dark:bg-neutral-800 dark:text-white pr-10 ${isReadOnly ? 'focus:outline-none cursor-default' : 'focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500'}`}
        />
        {!isReadOnly && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        )}
      </div>

      {isOpen && !isReadOnly && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                  setSearch("");
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 text-neutral-700 dark:text-neutral-300 border-b last:border-0 border-neutral-100 dark:border-neutral-800 transition-colors"
              >
                {opt}
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-neutral-500 italic">No matches found. Press enter to keep custom value.</div>
          )}
        </div>
      )}
    </div>
  );
}
