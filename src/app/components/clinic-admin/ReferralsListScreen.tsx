import { useState } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { Send, Search, Filter, Plus, Eye, Download, X, ChevronDown, Calendar, User, Mail, Building } from "lucide-react";
import { Pagination } from "../shared/Pagination";

interface Referral {
  id: string;
  date: string;
  patientName: string;
  patientEmail: string;
  referringProvider: string;
  referralType: "Imaging" | "Specialist" | "Lab Test" | "Other";
  testName: string;
  status: "Pending" | "Sent" | "Completed";
  branch: string;
}

const MOCK_REFERRALS: Referral[] = [
  {
    id: "REF-001",
    date: "2026-05-01",
    patientName: "Sarah Johnson",
    patientEmail: "sarah.j@email.com",
    referringProvider: "Dr. Emily Wilson",
    referralType: "Imaging",
    testName: "Lumbar Spine MRI",
    status: "Sent",
    branch: "Downtown Clinic",
  },
  {
    id: "REF-002",
    date: "2026-05-03",
    patientName: "Michael Chen",
    patientEmail: "m.chen@email.com",
    referringProvider: "Dr. James Smith",
    referralType: "Specialist",
    testName: "Orthopedic Consultation",
    status: "Pending",
    branch: "Uptown Branch",
  },
  {
    id: "REF-003",
    date: "2026-04-28",
    patientName: "Lisa Anderson",
    patientEmail: "lisa.a@email.com",
    referringProvider: "Dr. Emily Wilson",
    referralType: "Lab Test",
    testName: "Full Blood Panel",
    status: "Completed",
    branch: "Downtown Clinic",
  },
];

interface ReferralsListScreenProps {
  onNavigate: (menu: string) => void;
  onLogout?: () => void;
}

export function ReferralsListScreen({ onNavigate, onLogout }: ReferralsListScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "sent" | "completed">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredReferrals = MOCK_REFERRALS.filter(ref => {
    const matchesSearch = 
      ref.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.testName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = 
      activeTab === "all" || 
      ref.status.toLowerCase() === activeTab;

    return matchesSearch && matchesTab;
  });

  return (
    <ClinicAdminLayout 
      activeMenu="referrals" 
      onNavigate={onNavigate} 
      onLogout={onLogout}
    >
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Referrals</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Manage and track patient referrals for imaging, labs, and specialists
            </p>
          </div>
          <button className="h-10 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary-600/20 transition-all">
            <Plus className="w-4 h-4" /> Create New Referral
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Total Referrals</p>
            <p className="text-2xl font-black text-neutral-900 dark:text-white">{MOCK_REFERRALS.length}</p>
          </div>
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">Pending</p>
            <p className="text-2xl font-black text-neutral-900 dark:text-white">{MOCK_REFERRALS.filter(r => r.status === "Pending").length}</p>
          </div>
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">Completed</p>
            <p className="text-2xl font-black text-neutral-900 dark:text-white">{MOCK_REFERRALS.filter(r => r.status === "Completed").length}</p>
          </div>
        </div>

        {/* Controls & Table */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
          {/* Tabs & Search */}
          <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
              {(["all", "pending", "sent", "completed"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                    activeTab === tab
                      ? "bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 shadow-sm"
                      : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search referrals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-neutral-50 dark:bg-neutral-800 border-none rounded-xl text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50/50 dark:bg-neutral-800/50 border-b border-neutral-100 dark:border-neutral-800">
                  <th className="px-6 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Referral Info</th>
                  <th className="px-6 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Patient</th>
                  <th className="px-6 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Referring Provider</th>
                  <th className="px-6 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filteredReferrals.length > 0 ? (
                  filteredReferrals.map((ref) => (
                    <tr key={ref.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-neutral-900 dark:text-white">{ref.testName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 uppercase">{ref.referralType}</span>
                          <span className="text-[10px] text-neutral-400">{ref.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-950/30 flex items-center justify-center text-primary-600 font-bold text-xs">
                            {ref.patientName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-neutral-900 dark:text-white">{ref.patientName}</p>
                            <p className="text-[11px] text-neutral-400">{ref.patientEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{ref.referringProvider}</p>
                        <p className="text-[11px] text-neutral-400">{ref.branch}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          ref.status === "Completed" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400" :
                          ref.status === "Sent" ? "bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400" :
                          "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            ref.status === "Completed" ? "bg-emerald-600" :
                            ref.status === "Sent" ? "bg-primary-600" :
                            "bg-amber-600"
                          }`} />
                          {ref.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-primary-600 hover:bg-primary-50 transition-all">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-all">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="w-8 h-8 text-neutral-200" />
                        <p className="text-sm font-bold text-neutral-400">No referrals found matching your search</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-neutral-100 dark:border-neutral-800">
            <Pagination 
              currentPage={currentPage}
              totalPages={Math.ceil(filteredReferrals.length / itemsPerPage)}
              itemsPerPage={itemsPerPage}
              totalItems={filteredReferrals.length}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        </div>
      </div>
    </ClinicAdminLayout>
  );
}
