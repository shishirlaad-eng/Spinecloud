import { useState } from "react";
import { Search, Filter, Plus, FileText, ChevronRight, Calendar, User, Activity, Clock, X } from "lucide-react";
import { KDTReport } from "./KDTReportBuilder";

interface KDTReportsTabContentProps {
  reports: KDTReport[];
  onCreateNew: () => void;
  onViewReport: (reportId: string) => void;
}

export function KDTReportsTabContent({ reports, onCreateNew, onViewReport }: KDTReportsTabContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [protocolFilter, setProtocolFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.selectedCondition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.patientName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesProtocol = protocolFilter === "all" || report.protocolType === protocolFilter;
    
    return matchesSearch && matchesProtocol;
  });

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
            placeholder="Search KDT reports..."
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
              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Protocol Type</label>
                <select 
                  value={protocolFilter} 
                  onChange={(e) => setProtocolFilter(e.target.value)}
                  className="w-full h-9 px-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-sm outline-none focus:border-primary-500"
                >
                  <option value="all">All Protocols</option>
                  <option value="Cervical">Cervical</option>
                  <option value="Lumbar">Lumbar</option>
                </select>
              </div>
            </div>
          )}
        </div>
        <button 
          onClick={onCreateNew}
          className="px-4 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
        >
          Create New KDT Report
        </button>
      </div>

      {/* Reports Table */}
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              <th className="px-5 py-3 font-medium">Condition & Assessment</th>
              <th className="px-5 py-3 font-medium">Protocol</th>
              <th className="px-5 py-3 font-medium">Date Created</th>
              <th className="px-5 py-3 font-medium">Pull Force</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 bg-white dark:bg-neutral-900">
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <tr 
                  key={report.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-neutral-900 dark:text-white">
                        {report.selectedCondition}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      report.protocolType === 'Cervical' 
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                      : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                    }`}>
                      {report.protocolType}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-neutral-600 dark:text-neutral-400 font-medium">
                    {formatDate(report.dateCreated)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 font-bold">
                      <Activity className="w-3.5 h-3.5 text-neutral-400" />
                      {report.pullWeight} lbs
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-success-50 text-success-700 border border-success-200">
                      Completed
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => onViewReport(report.id)} className="text-primary-600 dark:text-primary-400 font-medium hover:underline mr-4">Preview</button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const content = `KDT DECOMPRESSION REPORT\n\nPatient: ${report.patientName}\nDate: ${new Date(report.dateCreated).toLocaleDateString()}\nProtocol: ${report.protocolType}\nCondition: ${report.selectedCondition}\n\nPull Weight: ${report.pullWeight} lbs\nDuration: ${report.duration} minutes\nSetup: ${report.treatmentSetup.setupTitle} @ ${report.treatmentSetup.angle}°\n\nClinical Justification:\n${report.clinicalJustification}`;
                        const blob = new Blob([content], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `KDT_Report_${report.patientName.replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.txt`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-neutral-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                      <FileText className="w-8 h-8 text-neutral-300" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">No KDT Reports Found</h3>
                    <p className="text-sm text-neutral-500 mb-6">Start by creating your first decompression report.</p>
                    <button 
                      onClick={onCreateNew}
                      className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary-600/20 transition-all active:scale-95"
                    >
                      Create New KDT Report
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
