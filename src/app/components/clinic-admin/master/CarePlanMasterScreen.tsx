import { useState, useEffect } from "react";
import { ClinicAdminLayout } from "@/app/components/clinic-admin/layout/ClinicAdminLayout";
import { Plus, Edit2, Search, Check, X, Filter, MoreVertical, Calendar, ChevronDown } from "lucide-react";
import { useRef } from "react";

interface MasterOption {
  id: string;
  label: string;
  status: "active" | "inactive";
  createdDate: string;
  updatedDate: string;
}

export function CarePlanMasterScreen({ 
  onNavigate, 
  onLogout 
}: { 
  onNavigate: (menu: string) => void; 
  onLogout?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"basedOn" | "actionPlan" | "supplements" | "responsibility">("basedOn");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  
  const [basedOnOptions, setBasedOnOptions] = useState<MasterOption[]>([]);
  const [actionPlanOptions, setActionPlanOptions] = useState<MasterOption[]>([]);
  const [supplements, setSupplements] = useState<MasterOption[]>([]);
  const [responsibilities, setResponsibilities] = useState<MasterOption[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterOption | null>(null);
  const [modalLabel, setModalLabel] = useState("");

  useEffect(() => {
    const loadData = (key: string, defaults: string[]) => {
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
      return defaults.map(d => ({ 
        id: `opt-${Math.random().toString(36).substr(2, 9)}`, 
        label: d,
        status: "active",
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString()
      }));
    };

    setBasedOnOptions(loadData("carePlan_master_basedOn", ["Your Age", "MRI /CT Report", "Digital Foot Scans", "Number of Exam Abnormalities", "Your History and Physical Examination", "Posture/Range of Motion Abnormalities"]));
    setActionPlanOptions(loadData("carePlan_master_actionPlan", ["Spinal Adjustments", "Extremity Adjustments", "Hot Moist Packs", "Electrical Stimulation"]));
    setSupplements(loadData("carePlan_master_supplements", ["Omega 3 Fish oil", "Vitamin D3", "Magnesium Glycinate", "Probiotics"]));
    setResponsibilities(loadData("carePlan_master_responsibility", ["Health Workshop", "Home Exercises", "Traction as Recommended", "Stay Hydrated"]));
  }, []);

  useEffect(() => {
    localStorage.setItem("carePlan_master_basedOn", JSON.stringify(basedOnOptions));
    localStorage.setItem("carePlan_master_actionPlan", JSON.stringify(actionPlanOptions));
    localStorage.setItem("carePlan_master_supplements", JSON.stringify(supplements));
    localStorage.setItem("carePlan_master_responsibility", JSON.stringify(responsibilities));
  }, [basedOnOptions, actionPlanOptions, supplements, responsibilities]);

  const getActiveState = () => {
    switch (activeTab) {
      case "basedOn": return { list: basedOnOptions, set: setBasedOnOptions, title: "Based On Options" };
      case "actionPlan": return { list: actionPlanOptions, set: setActionPlanOptions, title: "Action Plan Options" };
      case "supplements": return { list: supplements, set: setSupplements, title: "Nutritional Supplements" };
      case "responsibility": return { list: responsibilities, set: setResponsibilities, title: "Patient Responsibilities" };
    }
  };

  const { list, set, title } = getActiveState();

  const handleAddItem = () => {
    setEditingItem(null);
    setModalLabel("");
    setIsModalOpen(true);
  };

  const handleEditItem = (item: MasterOption) => {
    setEditingItem(item);
    setModalLabel(item.label);
    setIsModalOpen(true);
  };

  const handleSaveModal = () => {
    if (!modalLabel.trim()) return;
    
    if (editingItem) {
      set(list.map(item => item.id === editingItem.id ? { 
        ...item, 
        label: modalLabel.trim(),
        updatedDate: new Date().toISOString()
      } : item));
    } else {
      const newItem: MasterOption = {
        id: `opt-${Date.now()}`,
        label: modalLabel.trim(),
        status: "active",
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString()
      };
      set([...list, newItem]);
    }
    setIsModalOpen(false);
  };

  const toggleStatus = (id: string) => {
    set(list.map(item => item.id === id ? { 
      ...item, 
      status: item.status === "active" ? "inactive" : "active",
      updatedDate: new Date().toISOString()
    } : item));
  };

  const handleDeleteItem = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      set(list.filter(item => item.id !== id));
    }
  };

  const filteredList = list.filter(item => {
    const matchesSearch = item.label.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <ClinicAdminLayout activeMenu="carePlanMaster" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="flex-1 overflow-auto bg-neutral-50 dark:bg-neutral-950 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Care Plans Master</h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Configure dropdowns and options for clinical care plan builders</p>
              </div>
              <div className="flex items-center gap-3">
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 w-full flex-1 flex flex-col">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col flex-1">
            {/* Tabs */}
            <div className="flex border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
              {[
                { id: "basedOn", label: "Recommended Basis" },
                { id: "actionPlan", label: "Action Plan Items" },
                { id: "supplements", label: "Nutritional Supplements" },
                { id: "responsibility", label: "Patient Responsibility" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                    activeTab === tab.id 
                    ? "text-primary-600 dark:text-primary-400" 
                    : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                  )}
                </button>
              ))}
            </div>

            {/* Toolbar */}
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4">
               <div className="flex items-center gap-3 flex-1">
                  <div className="relative flex-1 max-w-4xl">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input 
                      type="text" 
                      placeholder={`Search ${title.toLowerCase()}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                    />
                  </div>
                  
                  <FilterPopover 
                    statusFilter={statusFilter} 
                    setStatusFilter={setStatusFilter} 
                  />
               </div>
               
               <button 
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-2 h-10 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm font-medium text-sm"
                >
                  <Plus className="w-4 h-4" /> Add New
                </button>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-neutral-50/50 dark:bg-neutral-800/30 sticky top-0 z-10 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="px-6 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider w-[40%]">Name</th>
                    <th className="px-6 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Created Date</th>
                    <th className="px-6 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Updated Date</th>
                    <th className="px-6 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {filteredList.length > 0 ? filteredList.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors group">
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => handleEditItem(item)}
                          className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline transition-all text-left"
                        >
                          {item.label}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {new Date(item.createdDate).toLocaleDateString()} {new Date(item.createdDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {new Date(item.updatedDate).toLocaleDateString()} {new Date(item.updatedDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button 
                            onClick={() => toggleStatus(item.id)}
                            className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${item.status === 'active' ? 'bg-primary-600' : 'bg-neutral-200 dark:bg-neutral-700'}`}
                          >
                            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${item.status === 'active' ? 'translate-x-5' : 'translate-x-0'}`} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-b-2xl m-4">
                        <p className="text-neutral-400 text-sm italic">No items found matching your criteria.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-[60] animate-in fade-in duration-200" onClick={() => setIsModalOpen(false)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl z-[70] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-800/50">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                {editingItem ? `Edit ${title.replace(" Options", "")}` : `Add New ${title.replace(" Options", "")}`}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-full transition-colors text-neutral-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">Item Name</label>
                <input 
                  type="text" 
                  value={modalLabel}
                  onChange={(e) => setModalLabel(e.target.value)}
                  placeholder={`Enter ${title.toLowerCase().replace(" options", "")}...`}
                  autoFocus
                  className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                />
              </div>
            </div>
            <div className="p-6 pt-2 flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl text-sm font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveModal}
                disabled={!modalLabel.trim()}
                className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingItem ? "Update Item" : "Add Item"}
              </button>
            </div>
          </div>
        </>
      )}
    </ClinicAdminLayout>
  );
}

function FilterPopover({ statusFilter, setStatusFilter }: { 
  statusFilter: string, 
  setStatusFilter: (val: any) => void 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={popoverRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-xl border transition-all ${isOpen ? 'bg-primary-50 border-primary-500 text-primary-600' : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-400 hover:border-neutral-300'}`}
      >
        <Filter className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl z-50 p-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
           <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-neutral-900 dark:text-white text-sm uppercase tracking-widest">Filters</h4>
              <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-neutral-600"><X className="w-4 h-4"/></button>
           </div>

           {/* Status */}
           <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Status</label>
              <div className="flex gap-2">
                 {["all", "active", "inactive"].map(opt => (
                   <button 
                     key={opt}
                     onClick={() => setStatusFilter(opt)}
                     className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${statusFilter === opt ? 'bg-primary-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'}`}
                   >
                     {opt}
                   </button>
                 ))}
              </div>
           </div>

           {/* Created Date Range (Visual Placeholder as per user request for structure) */}
           <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-3 h-3"/> Created Date Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                 <input type="date" className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2 py-1.5 text-[10px] outline-none" />
                 <input type="date" className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2 py-1.5 text-[10px] outline-none" />
              </div>
           </div>

           {/* Updated Date Range */}
           <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-3 h-3"/> Updated Date Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                 <input type="date" className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2 py-1.5 text-[10px] outline-none" />
                 <input type="date" className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2 py-1.5 text-[10px] outline-none" />
              </div>
           </div>

           <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex justify-between">
              <button 
                onClick={() => {
                  setStatusFilter("all");
                  setIsOpen(false);
                }}
                className="text-[10px] font-bold text-neutral-400 hover:text-primary-600 uppercase tracking-widest"
              >
                Clear All
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-[10px] font-bold text-primary-600 hover:text-primary-700 uppercase tracking-widest"
              >
                Apply Filters
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
