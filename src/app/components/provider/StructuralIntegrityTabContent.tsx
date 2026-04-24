import { useState } from "react";
import { Search, Filter, Plus, FileText, ChevronRight, Calculator, Activity, Clock, X } from "lucide-react";

interface SIReport {
  id: string;
  type: string;
  date: string;
}

interface StructuralIntegrityTabContentProps {
  reports: SIReport[];
  onCreateNew: () => void;
  onViewReport: (reportId: string) => void;
}

export function StructuralIntegrityTabContent({ reports, onCreateNew, onViewReport }: StructuralIntegrityTabContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Filter out non-SI reports if any got passed
  const siReports = reports.filter(r => r.type === "structural-integrity");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-5">
      {/* Top Action Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
          <input
            type="text"
            placeholder="Search structural integrity reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 outline-none"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`h-10 w-10 flex items-center justify-center border rounded-lg transition-colors ${
              showFilters 
              ? "bg-primary-50 border-primary-200 text-primary-600 dark:bg-primary-900/30 dark:border-primary-800 dark:text-primary-400" 
              : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            }`}
          >
            <Filter className="w-4 h-4" />
          </button>
          
          {showFilters && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg p-4 z-50 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                 <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Filters</h4>
                 <button onClick={() => setShowFilters(false)} className="text-neutral-400 hover:text-neutral-600"><X className="w-4 h-4" /></button>
              </div>
              <p className="text-sm text-neutral-500">More filters coming soon.</p>
            </div>
          )}
        </div>
        <button 
          onClick={onCreateNew}
          className="px-4 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap flex items-center gap-2"
        >
          <Calculator className="w-4 h-4" />
          New Structural Integrity
        </button>
      </div>

      {/* Reports Table */}
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              <th className="px-5 py-3 font-medium">Report Type</th>
              <th className="px-5 py-3 font-medium">Date Generated</th>
              <th className="px-5 py-3 font-medium">Impairment Rating</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 bg-white dark:bg-neutral-900">
            {siReports.length > 0 ? (
              siReports.map((report) => (
                <tr 
                  key={report.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                        <Activity className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-neutral-900 dark:text-white">
                        Structural Integrity
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-neutral-600 dark:text-neutral-400 font-medium">
                    {formatDate(report.date)}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-neutral-900 dark:text-white">
                      12% Whole Person
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-success-50 text-success-700 border border-success-200">
                      Finalized
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <button 
                      onClick={() => onViewReport(report.id)}
                      className="text-primary-600 dark:text-primary-400 font-medium hover:underline mr-4"
                    >
                      Preview
                    </button>
                    <button className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
                      Download
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                      <Calculator className="w-8 h-8 text-neutral-400" />
                    </div>
                    <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-1">No Structural Integrity Reports</h3>
                    <p className="text-sm text-neutral-500 max-w-sm mb-6">
                      Assess DRE and ROM impairments to generate accurate structural integrity qualifications.
                    </p>
                    <button
                      onClick={onCreateNew}
                      className="text-primary-600 dark:text-primary-400 font-medium hover:underline text-sm"
                    >
                      Create First Report
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
