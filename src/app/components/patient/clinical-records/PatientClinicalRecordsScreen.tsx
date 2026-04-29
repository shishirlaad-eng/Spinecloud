import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "../../layout/DashboardLayout";
import {
  ClipboardList, Heart, Wallet, Scan, Dumbbell, Activity, Brain,
  Search, Filter, Eye, Download, X, ChevronDown, FileText,
  FolderOpen
} from "lucide-react";
import { UnifiedReportPreviewModal } from "../../common/UnifiedReportPreviewModal";

// ── Types ──────────────────────────────────────────────────────────────────────

type TabId = "soapNote" | "carePlan" | "financialPlan" | "structuralIntegrity" | "kdt" | "dicom" | "spineCloud";

interface ClinicalRecord {
  id: string;
  date: string;
  title: string;
  provider: string;
  branch: string;
  data: any;
}

// ── Tab config ─────────────────────────────────────────────────────────────────

const TABS: { id: TabId; label: string; icon: any }[] = [
  { id: "soapNote",            label: "SOAP Notes",               icon: ClipboardList },
  { id: "dicom",               label: "DICOM / Imaging",          icon: FolderOpen    },
  { id: "structuralIntegrity", label: "Structural Integrity",      icon: Scan          },
  { id: "carePlan",            label: "Care Plans",                icon: Heart         },
  { id: "financialPlan",       label: "Financial Plans",           icon: Wallet        },
  { id: "spineCloud",          label: "SpineCloud Wellness Index", icon: Brain         },
  { id: "kdt",                 label: "KDT Reports",               icon: Dumbbell      },
];

// ── Column definitions per tab ─────────────────────────────────────────────────

const COLUMNS: Record<TabId, string[]> = {
  soapNote:            ["Date", "Note Title", "Provider", "Branch", "Actions"],
  carePlan:            ["Date", "Plan Title", "Provider", "Branch", "Actions"],
  financialPlan:       ["Date", "Agreement",  "Provider", "Branch", "Actions"],
  structuralIntegrity: ["Date", "Report",     "Provider", "Branch", "Actions"],
  kdt:                 ["Date", "Protocol",   "Provider", "Branch", "Actions"],
  dicom:               ["Date", "Study Type", "Provider", "Branch", "Actions"],
  spineCloud:          ["Date", "Assessment", "Provider", "Branch", "Actions"],
};

// ── Mock / localStorage loader ─────────────────────────────────────────────────

function loadRecords(): Record<TabId, ClinicalRecord[]> {
  const result: Record<TabId, ClinicalRecord[]> = {
    soapNote: [], carePlan: [], financialPlan: [],
    structuralIntegrity: [], kdt: [], dicom: [], spineCloud: [],
  };

  // SOAP Notes
  Object.keys(localStorage)
    .filter(k => k.startsWith("soapNote_"))
    .forEach(key => {
      try {
        const d = JSON.parse(localStorage.getItem(key) || "{}");
        if (d?.id && d.status === "final") {
          result.soapNote.push({
            id: d.id, date: d.finalizedAt || new Date().toISOString(),
            title: "SOAP Clinical Note", provider: d.finalizedBy || d.providerName || (Math.random() > 0.5 ? "Dr. John" : "Dr. David"),
            branch: d.branch || d.location || (Math.random() > 0.5 ? "Uptown Branch" : "Downtown Branch"), data: d,
          });
        }
      } catch {}
    });

  // Care Plans
  Object.keys(localStorage)
    .filter(k => k.startsWith("carePlan_") && !k.startsWith("carePlan_master"))
    .forEach(key => {
      try {
        const d = JSON.parse(localStorage.getItem(key) || "{}");
        if (d?.id) {
          result.carePlan.push({
            id: d.id, date: d.datePrepared || new Date().toISOString(),
            title: "Care Plan", provider: d.providerName || (Math.random() > 0.5 ? "Dr. John" : "Dr. David"),
            branch: d.branch || (Math.random() > 0.5 ? "Uptown Branch" : "Downtown Branch"), data: d,
          });
        }
      } catch {}
    });

  // Financial Plans
  Object.keys(localStorage)
    .filter(k => k.startsWith("financialPlan_"))
    .forEach(key => {
      try {
        const d = JSON.parse(localStorage.getItem(key) || "{}");
        if (d?.id) {
          result.financialPlan.push({
            id: d.id, date: d.datePrepared || new Date().toISOString(),
            title: "Financial Agreement", provider: d.providerName || "Clinic Administration",
            branch: d.branch || (Math.random() > 0.5 ? "Uptown Branch" : "Downtown Branch"), data: d,
          });
        }
      } catch {}
    });

  // Structural Integrity
  Object.keys(localStorage)
    .filter(k => k.startsWith("structuralIntegrity_"))
    .forEach(key => {
      try {
        const d = JSON.parse(localStorage.getItem(key) || "{}");
        if (d?.id) {
          result.structuralIntegrity.push({
            id: d.id, date: d.date || new Date().toISOString(),
            title: "Structural Integrity Analysis", provider: d.provider || (Math.random() > 0.5 ? "Dr. John" : "Dr. David"),
            branch: d.branch || (Math.random() > 0.5 ? "Uptown Branch" : "Downtown Branch"), data: d,
          });
        }
      } catch {}
    });

  // KDT Reports
  Object.keys(localStorage)
    .filter(k => k.startsWith("kdtReport_"))
    .forEach(key => {
      try {
        const d = JSON.parse(localStorage.getItem(key) || "{}");
        if (d?.id) {
          result.kdt.push({
            id: d.id, date: d.dateCreated || new Date().toISOString(),
            title: `KDT – ${d.protocolType || "Lumbar"}`, provider: d.providerName || (Math.random() > 0.5 ? "Dr. John" : "Dr. David"),
            branch: d.branch || (Math.random() > 0.5 ? "Uptown Branch" : "Downtown Branch"), data: d,
          });
        }
      } catch {}
    });

  // SpineCloud Wellness Index (from localStorage)
  Object.keys(localStorage)
    .filter(k => k.startsWith("spineCloudResults_") || k.startsWith("spinecloud_"))
    .forEach(key => {
      try {
        const d = JSON.parse(localStorage.getItem(key) || "{}");
        if (d?.id || d?.sessionId) {
          result.spineCloud.push({
            id: d.id || d.sessionId,
            date: d.completedAt || d.date || new Date().toISOString(),
            title: "SpineCloud Wellness Assessment",
            provider: d.providerName || "SpineCloud AI",
            branch: d.branch || "Main Branch",
            data: d,
          });
        }
      } catch {}
    });

  // DICOM (mock)
  result.dicom = [
    { 
      id: "dicom-1", 
      date: "2025-01-15T10:00:00", 
      title: "Comprehensive Spinal X-Ray Series",
      provider: "Radiology", 
      branch: "Uptown Branch",
      data: { 
        id: "dicom-1", 
        images: [
          {
            type: "Cervical Flexion",
            imageUrl: "/assets/clinical/cervical_flexion.png",
            findings: "ABNORMAL: Significant loss of cervical lordosis in flexion. Evidence of mild C5-C6 degenerative disc disease with anterior osteophyte formation. Spinal alignment shows early signs of structural instability."
          },
          {
            type: "Lumbar Lateral",
            imageUrl: "/assets/clinical/lumbar_lateral.png",
            findings: "NORMAL: Well-maintained lumbar lordosis. Vertebral body heights are preserved. Disc spaces are healthy at all levels. No evidence of spondylolisthesis or acute bony injury."
          },
          {
            type: "AP Cervical",
            imageUrl: "/assets/clinical/ap_cervical.png",
            findings: "NORMAL: Spinous processes are midline. No lateral tilt or rotation detected in the cervical vertebrae. Paraspinal soft tissues are within normal limits."
          }
        ]
      } 
    },
  ];

  // Structural Integrity mock if empty
  if (result.structuralIntegrity.length === 0) {
    result.structuralIntegrity = [
      {
        id: "si-1",
        date: "2025-02-12T10:00:00",
        title: "Structural Integrity Analysis",
        provider: "Dr. John",
        branch: "Uptown Branch",
        data: {
          id: "si-1",
          notes: "Evidence of cervical translation and lumbar unleveling. Sagittal balance restoration recommended.",
          findings: { cervical: "8.2mm Translation", pelvic: "4.5° Tilt", atlas: "2.1° Angle" }
        },
      }
    ];
  }

  // SpineCloud mock if empty
  if (result.spineCloud.length === 0) {
    result.spineCloud = [
      { id: "sc-1", date: "2025-02-15T09:00:00", title: "SpineCloud Wellness Assessment",
        provider: "SpineCloud AI", branch: "Uptown Branch",
        data: { id: "sc-1", score: 84, metrics: { mobility: 78, stability: 82, alignment: 91, pain: 15 }, recommendations: "Continue current care plan. Focus on lumbar stability exercises." } },
    ];
  }

  // Sort each list newest-first
  (Object.keys(result) as TabId[]).forEach(tab => {
    result[tab].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  return result;
}

// ── Filter state per tab ───────────────────────────────────────────────────────

interface TabFilter {
  search: string;
  branch: string;
  dateRange: string;
  provider: string;
}

const defaultFilter = (): TabFilter => ({ search: "", branch: "all", dateRange: "all", provider: "all" });

// ── Main component ─────────────────────────────────────────────────────────────

interface PatientClinicalRecordsScreenProps {
  patientName: string;
  onNavigate: (menu: "dashboard" | "appointments" | "invoices" | "notifications" | "spineCloud" | "tickets" | "settings" | "clinicalRecords") => void;
  onLogout?: () => void;
  onNavigateToProfile?: () => void;
  clinicSettings?: {
    patientPortal: {
      showSOAPNotes: boolean;
      showDICOMReports: boolean;
      showWellnessIndex: boolean;
      showKDTReports: boolean;
      showCarePlans: boolean;
      showFinancialPlans: boolean;
      showStructuralIntegrity: boolean;
    }
  };
}

const PAGE_SIZE = 8;

export function PatientClinicalRecordsScreen({
  patientName,
  onNavigate,
  onLogout,
  onNavigateToProfile,
  clinicSettings,
}: PatientClinicalRecordsScreenProps) {
  // Filter tabs based on clinic settings
  const availableTabs = TABS.filter(tab => {
    if (!clinicSettings) return true; // Default to all if not provided
    const portal = clinicSettings.patientPortal;
    switch (tab.id) {
      case "soapNote": return portal.showSOAPNotes;
      case "dicom": return portal.showDICOMReports;
      case "structuralIntegrity": return portal.showStructuralIntegrity;
      case "carePlan": return portal.showCarePlans;
      case "financialPlan": return portal.showFinancialPlans;
      case "spineCloud": return portal.showWellnessIndex;
      case "kdt": return portal.showKDTReports;
      default: return true;
    }
  });

  const [activeTab, setActiveTab] = useState<TabId>(availableTabs[0]?.id || "soapNote");
  
  // Ensure active tab is valid if settings change
  useEffect(() => {
    if (!availableTabs.find(t => t.id === activeTab) && availableTabs.length > 0) {
      setActiveTab(availableTabs[0].id);
    }
  }, [availableTabs, activeTab]);

  const [allRecords, setAllRecords] = useState<Record<TabId, ClinicalRecord[]>>(() => loadRecords());
  const [filters, setFilters] = useState<Record<TabId, TabFilter>>(() =>
    Object.fromEntries(TABS.map(t => [t.id, defaultFilter()])) as Record<TabId, TabFilter>
  );
  const [pages, setPages] = useState<Record<TabId, number>>(() =>
    Object.fromEntries(TABS.map(t => [t.id, 1])) as Record<TabId, number>
  );
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [previewRecord, setPreviewRecord] = useState<ClinicalRecord | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAllRecords(loadRecords());
  }, []);

  // Close filter dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const f = filters[activeTab];
  const records = allRecords[activeTab];

  // Unique values for filter dropdowns
  const uniqueBranches   = ["all", ...Array.from(new Set(records.map(r => r.branch)))];
  const uniqueProviders  = ["all", ...Array.from(new Set(records.map(r => r.provider)))];

  const filtered = records.filter(r => {
    const q = f.search.toLowerCase();
    const matchSearch = !q || r.title.toLowerCase().includes(q) || r.provider.toLowerCase().includes(q) || r.branch.toLowerCase().includes(q);
    const matchBranch  = f.branch === "all"   || r.branch   === f.branch;
    const matchProv    = f.provider === "all"  || r.provider === f.provider;

    let matchDate = true;
    if (f.dateRange !== "all") {
      const d = new Date(r.date); const today = new Date(); today.setHours(23, 59, 59, 999);
      if (f.dateRange === "7d")  { const x = new Date(); x.setDate(x.getDate() - 7);   matchDate = d >= x; }
      if (f.dateRange === "30d") { const x = new Date(); x.setDate(x.getDate() - 30);  matchDate = d >= x; }
      if (f.dateRange === "3m")  { const x = new Date(); x.setMonth(x.getMonth() - 3); matchDate = d >= x; }
      if (f.dateRange === "6m")  { const x = new Date(); x.setMonth(x.getMonth() - 6); matchDate = d >= x; }
    }
    return matchSearch && matchBranch && matchProv && matchDate;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(pages[activeTab], totalPages);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const setFilter = (key: keyof TabFilter, value: string) => {
    setFilters(prev => ({ ...prev, [activeTab]: { ...prev[activeTab], [key]: value } }));
    setPages(prev => ({ ...prev, [activeTab]: 1 }));
  };

  const setPage = (n: number) => setPages(prev => ({ ...prev, [activeTab]: n }));

  const activeFilterCount =
    (f.branch !== "all" ? 1 : 0) +
    (f.dateRange !== "all" ? 1 : 0) +
    (f.provider !== "all" ? 1 : 0);

  const clearFilters = () => {
    setFilters(prev => ({ ...prev, [activeTab]: { ...defaultFilter(), search: prev[activeTab].search } }));
    setPages(prev => ({ ...prev, [activeTab]: 1 }));
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const handleDownload = (rec: ClinicalRecord) => {
    const blob = new Blob([JSON.stringify(rec.data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTab}_${rec.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const cols = COLUMNS[activeTab];

  return (
    <DashboardLayout activeMenu="clinicalRecords" onNavigate={onNavigate as any} onLogout={onLogout} onNavigateToProfile={onNavigateToProfile}>
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-white mb-1">
            Clinical Records
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            View and download your personal health documents and clinical reports
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-neutral-200 dark:border-neutral-800 mb-6 overflow-x-auto">
          {availableTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const count = allRecords[tab.id]?.length || 0;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setShowFilterDropdown(false); }}
                className={`inline-flex items-center gap-2 px-4 h-10 text-sm font-medium border-b-2 whitespace-nowrap transition-all ${
                  isActive
                    ? "border-primary-600 text-primary-700 dark:text-primary-300"
                    : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-600"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {count > 0 && (
                  <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                    isActive ? "bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Controls — search + filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder={`Search ${availableTabs.find(t => t.id === activeTab)?.label || "records"}...`}
              value={f.search}
              onChange={e => setFilter("search", e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-neutral-900 dark:text-white placeholder:text-neutral-400"
            />
          </div>

          {/* Filter button */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilterDropdown(v => !v)}
              className={`inline-flex items-center gap-2 h-10 px-4 border rounded-lg text-sm font-medium transition-all ${
                activeFilterCount > 0
                  ? "bg-primary-50 dark:bg-primary-950/30 border-primary-600 text-primary-700 dark:text-primary-300"
                  : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filter
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 top-12 w-72 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl z-30 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-neutral-900 dark:text-white">Filters</span>
                  <button onClick={() => setShowFilterDropdown(false)} className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Branch */}
                <div>
                  <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-2">Branch</label>
                  <select
                    value={f.branch}
                    onChange={e => setFilter("branch", e.target.value)}
                    className="w-full h-9 px-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    {uniqueBranches.map(b => (
                      <option key={b} value={b}>{b === "all" ? "All Branches" : b}</option>
                    ))}
                  </select>
                </div>

                {/* Date Range */}
                <div>
                  <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-2">Date Range</label>
                  <select
                    value={f.dateRange}
                    onChange={e => setFilter("dateRange", e.target.value)}
                    className="w-full h-9 px-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="all">All time</option>
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="3m">Last 3 months</option>
                    <option value="6m">Last 6 months</option>
                  </select>
                </div>

                {/* Provider */}
                <div>
                  <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-2">Provider</label>
                  <select
                    value={f.provider}
                    onChange={e => setFilter("provider", e.target.value)}
                    className="w-full h-9 px-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    {uniqueProviders.map(p => (
                      <option key={p} value={p}>{p === "all" ? "All Providers" : p}</option>
                    ))}
                  </select>
                </div>

                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="w-full h-9 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-sm font-medium transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  {cols.map(col => (
                    <th
                      key={col}
                      className={`px-6 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-white ${col === "Actions" ? "text-right" : ""}`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={cols.length} className="px-6 py-16 text-center">
                      <FolderOpen className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">No records found</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        {f.search || activeFilterCount > 0
                          ? "Try adjusting your search or filters."
                          : "Your records will appear here once your provider creates them."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginated.map(rec => (
                    <tr key={rec.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white whitespace-nowrap">
                        {formatDate(rec.date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white font-medium">
                        {rec.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                        {rec.provider}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                        {rec.branch}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setPreviewRecord(rec)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/20 transition-colors"
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownload(rec)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Showing{" "}
              <span className="font-medium">{(page - 1) * PAGE_SIZE + 1}</span>
              {" "}to{" "}
              <span className="font-medium">{Math.min(page * PAGE_SIZE, filtered.length)}</span>
              {" "}of{" "}
              <span className="font-medium">{filtered.length}</span>{" "}records
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 h-9 flex items-center justify-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                      page === i + 1
                        ? "bg-primary-600 text-white shadow-sm"
                        : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 h-9 flex items-center justify-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewRecord && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <UnifiedReportPreviewModal
            type={activeTab}
            data={previewRecord.data}
            patientName={patientName}
            onClose={() => setPreviewRecord(null)}
          />
        </div>
      )}
    </DashboardLayout>
  );
}
