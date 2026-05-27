import { useState, useEffect } from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import {
  FileText,
  ClipboardList,
  ChevronRight,
  CheckCircle2,
  Download,
  Search,
  ChevronDown
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface PatientForm {
  id: string;
  name: string;
  category: string;
  assignedDate: string;
  status: "Pending" | "Opened" | "Completed";
  completedDate?: string;
  estimatedTime?: string;
}

interface PatientAgreement {
  id: string;
  name: string;
  category: string;
  assignedDate: string;
  status: "Pending" | "Opened" | "Signed";
  signedDate?: string;
}

interface FormsAgreementsPatientScreenProps {
  onNavigate: (screen: any) => void;
  onLogout?: () => void;
  currentEntity?: "patient" | "clinicAdmin" | "provider" | "clinic-staff";
  onEntitySwitch?: (entity: "patient" | "clinicAdmin" | "provider" | "clinic-staff") => void;
  onNavigateToProfile?: () => void;
  notifications?: any[];
  defaultTab?: "forms" | "agreements";
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const MOCK_FORMS: PatientForm[] = [
  {
    id: "f-1",
    name: "General Health Intake Form",
    category: "General Intake",
    assignedDate: "2026-05-01",
    status: "Completed",
    completedDate: "2026-05-02",
    estimatedTime: "5–10 min",
  },
  {
    id: "f-2",
    name: "Neck Pain Index (NDI)",
    category: "Clinical Assessment",
    assignedDate: "2026-05-05",
    status: "Pending",
    estimatedTime: "3–5 min",
  },
  {
    id: "f-3",
    name: "Patient Satisfaction Survey",
    category: "Feedback",
    assignedDate: "2026-04-20",
    status: "Completed",
    completedDate: "2026-04-22",
    estimatedTime: "2–3 min",
  },
  {
    id: "f-4",
    name: "Car Accident Intake Form",
    category: "Specialty Intake",
    assignedDate: "2026-05-06",
    status: "Opened",
    estimatedTime: "10–15 min",
  },
];

const MOCK_AGREEMENTS: PatientAgreement[] = [
  {
    id: "a-1",
    name: "HIPAA Privacy Policy Acknowledgment",
    category: "Privacy & Compliance",
    assignedDate: "2026-04-15",
    status: "Signed",
    signedDate: "2026-04-15",
  },
  {
    id: "a-2",
    name: "Consent to Treat",
    category: "Clinical Consent",
    assignedDate: "2026-04-15",
    status: "Signed",
    signedDate: "2026-04-15",
  },
  {
    id: "a-3",
    name: "Financial Responsibility Agreement",
    category: "Financial",
    assignedDate: "2026-05-01",
    status: "Pending",
  },
  {
    id: "a-4",
    name: "Cancellation Policy",
    category: "Administrative",
    assignedDate: "2026-05-01",
    status: "Opened",
  },
];

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

// ── Component ──────────────────────────────────────────────────────────────────

export function FormsAgreementsPatientScreen({
  onNavigate,
  onLogout,
  currentEntity,
  onEntitySwitch,
  onNavigateToProfile,
  notifications = [],
  defaultTab = "forms",
}: FormsAgreementsPatientScreenProps) {
  const [activeTab, setActiveTab] = useState<"forms" | "agreements">(defaultTab);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeTab]);

  // Filtered Forms
  const filteredForms = MOCK_FORMS.filter((f) => {
    const q = search.toLowerCase();
    return !q || f.name.toLowerCase().includes(q);
  });

  // Filtered Agreements
  const filteredAgreements = MOCK_AGREEMENTS.filter((a) => {
    const q = search.toLowerCase();
    return !q || a.name.toLowerCase().includes(q);
  });

  const handleTabChange = (tab: "forms" | "agreements") => {
    setActiveTab(tab);
    setSearch("");
  };

  const activeData = activeTab === "forms" ? filteredForms : filteredAgreements;
  const totalPages = Math.ceil(activeData.length / pageSize);
  const paginatedData = activeData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <DashboardLayout
      activeMenu="consentForms"
      onNavigate={onNavigate}
      onLogout={onLogout}
      currentEntity={currentEntity}
      onEntitySwitch={onEntitySwitch}
      onNavigateToProfile={onNavigateToProfile}
      notifications={notifications}
    >
      <div className="max-w-6xl">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-1.5 font-sans">
            <span>Home</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-medium text-neutral-900 dark:text-white">Forms &amp; Agreements</span>
          </div>
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-white mb-0.5">
            Forms &amp; Agreements
          </h1>
          <p className="text-sm text-neutral-500">
            Complete clinical questionnaires and review legal agreements assigned by your care team.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-neutral-200 dark:border-neutral-800 mb-6">
          {[
            {
              key: "forms" as const,
              label: "Patient Forms",
              icon: ClipboardList,
            },
            {
              key: "agreements" as const,
              label: "Agreements",
              icon: FileText,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`inline-flex items-center gap-2 px-4 h-10 text-sm font-medium border-b-2 transition-all ${
                  isActive
                    ? "border-primary-600 text-primary-700 dark:text-primary-300"
                    : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${activeTab === "forms" ? "forms" : "agreements"}...`}
              className="w-full h-10 pl-10 pr-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-neutral-900 dark:text-white placeholder:text-neutral-400"
            />
          </div>
        </div>

        {/* Tables */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  {activeTab === "forms" ? (
                    <>
                      {["Form Name", "Assigned", "Actions"].map((col) => (
                        <th key={col} className={`px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider ${col === "Actions" ? "text-right" : ""}`}>
                          <div className={`flex items-center gap-1 ${col === "Actions" ? "justify-end" : ""}`}>
                            {col}
                            {col !== "Actions" && (
                              <div className="flex flex-col scale-75 opacity-40">
                                <ChevronDown className="w-3 h-3 -mb-1 rotate-180" />
                                <ChevronDown className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        </th>
                      ))}
                    </>
                  ) : (
                    <>
                      {["Agreement Name", "Assigned", "Signed On", "Actions"].map((col) => (
                        <th key={col} className={`px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider ${col === "Actions" ? "text-right" : ""}`}>
                          <div className={`flex items-center gap-1 ${col === "Actions" ? "justify-end" : ""}`}>
                            {col}
                            {col !== "Actions" && (
                              <div className="flex flex-col scale-75 opacity-40">
                                <ChevronDown className="w-3 h-3 -mb-1 rotate-180" />
                                <ChevronDown className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        </th>
                      ))}
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center">
                      {activeTab === "forms" ? (
                        <ClipboardList className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
                      ) : (
                        <FileText className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
                      )}
                      <p className="text-sm font-medium text-neutral-900 dark:text-white mb-1">No {activeTab} found</p>
                      <p className="text-xs text-neutral-500">
                        {search ? "Try adjusting your search." : `Your care team hasn't assigned any ${activeTab} yet.`}
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${activeTab === "forms" ? "bg-blue-50 dark:bg-blue-950/30" : "bg-purple-50 dark:bg-purple-950/30"}`}>
                            {activeTab === "forms" ? (
                              <ClipboardList className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            ) : (
                              <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            )}
                          </div>
                          <span className="text-sm font-medium text-neutral-900 dark:text-white">
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                        {fmt(item.assignedDate)}
                      </td>
                      {activeTab === "agreements" && (
                        <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                          {(item as PatientAgreement).signedDate ? (
                            <span className="flex items-center gap-1.5 text-success-700 dark:text-success-400 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              {fmt((item as PatientAgreement).signedDate!)}
                            </span>
                          ) : (
                            <span className="text-neutral-400">—</span>
                          )}
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors" title="Download PDF">
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

        {/* Pagination - Similar to Invoices */}
        {activeData.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-600 dark:text-neutral-400 font-sans">Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="h-9 px-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:border-[#1d77b4] focus:ring-1 focus:ring-[#1d77b4]"
              >
                <option value={8}>8</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-neutral-600 dark:text-neutral-400 ml-2 font-sans">
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, activeData.length)} of {activeData.length} items
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 h-9 flex items-center justify-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-sans"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                      currentPage === i + 1
                        ? "bg-[#1d77b4] text-white shadow-sm"
                        : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 h-9 flex items-center justify-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-sans"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
