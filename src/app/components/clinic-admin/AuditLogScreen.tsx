import { useState } from "react";
import { Search, Filter, X, ChevronDown, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { Pagination } from "../shared/Pagination";

interface AuditLogEntry {
  id: string;
  dateTime: string;
  activity: string;
  module: string;
  entityReference: string;
  performedBy: string;
  role: string;
  clinic: string;
  status: "Success" | "Failed" | "Pending" | "Warning";
}

interface AuditLogScreenProps {
  onNavigate: (menu: string) => void;
  onLogout?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToNotifications?: () => void;
  unreadNotificationsCount?: number;
}

const mockAuditLogs: AuditLogEntry[] = [
  { id: "a001", dateTime: "2026-05-06T08:32:00", activity: "User Logged In", module: "Authentication", entityReference: "User: Dr. James Harlow", performedBy: "Dr. James Harlow", role: "Provider", clinic: "SpineWell Chiropractic - Denver", status: "Success" },
  { id: "a002", dateTime: "2026-05-06T08:45:00", activity: "SOAP Note Signed", module: "Clinical Records", entityReference: "Patient: Maria Gonzalez | Appt: APT-2026-0412", performedBy: "Dr. James Harlow", role: "Provider", clinic: "SpineWell Chiropractic - Denver", status: "Success" },
  { id: "a003", dateTime: "2026-05-06T09:10:00", activity: "Appointment Rescheduled", module: "Appointments", entityReference: "Patient: Robert Chen | Appt: APT-2026-0398", performedBy: "Sarah Mitchell", role: "Front Desk", clinic: "SpineWell Chiropractic - Denver", status: "Success" },
  { id: "a004", dateTime: "2026-05-06T09:22:00", activity: "Invoice Generated", module: "Invoices", entityReference: "Invoice: INV-2026-1084 | Patient: Maria Gonzalez", performedBy: "Sarah Mitchell", role: "Front Desk", clinic: "SpineWell Chiropractic - Denver", status: "Success" },
  { id: "a005", dateTime: "2026-05-06T09:35:00", activity: "Failed Login Attempt", module: "Authentication", entityReference: "User: unknown@mail.com", performedBy: "Unknown", role: "—", clinic: "SpineWell Chiropractic - Boulder", status: "Failed" },
  { id: "a006", dateTime: "2026-05-06T09:48:00", activity: "Patient Profile Updated", module: "Patients", entityReference: "Patient: Linda Patel (PAT-0289)", performedBy: "Jennifer Torres", role: "Clinic Admin", clinic: "SpineWell Chiropractic - Boulder", status: "Success" },
  { id: "a007", dateTime: "2026-05-06T10:02:00", activity: "Care Plan Updated", module: "Care Plans", entityReference: "Patient: Thomas Reed | Plan: CP-2026-0045", performedBy: "Dr. Amy Nguyen", role: "Provider", clinic: "AlignCare Spine Center - Aurora", status: "Success" },
  { id: "a008", dateTime: "2026-05-06T10:15:00", activity: "Intake Form Submitted", module: "Questionnaires", entityReference: "Patient: Karen Williams (PAT-0312)", performedBy: "Karen Williams", role: "Patient", clinic: "AlignCare Spine Center - Aurora", status: "Success" },
  { id: "a009", dateTime: "2026-05-06T10:28:00", activity: "Payment Added", module: "Payments", entityReference: "Invoice: INV-2026-1081 | $320.00", performedBy: "Michael Brooks", role: "Billing Staff", clinic: "SpineWell Chiropractic - Denver", status: "Success" },
  { id: "a010", dateTime: "2026-05-06T10:45:00", activity: "Provider Assigned to Patient", module: "Patients", entityReference: "Patient: James Okafor → Dr. Amy Nguyen", performedBy: "Jennifer Torres", role: "Clinic Admin", clinic: "AlignCare Spine Center - Aurora", status: "Success" },
  { id: "a011", dateTime: "2026-05-06T11:00:00", activity: "User Logged In", module: "Authentication", entityReference: "User: Jennifer Torres", performedBy: "Jennifer Torres", role: "Clinic Admin", clinic: "AlignCare Spine Center - Aurora", status: "Success" },
  { id: "a012", dateTime: "2026-05-06T11:12:00", activity: "SOAP Note Signed", module: "Clinical Records", entityReference: "Patient: Thomas Reed | Appt: APT-2026-0421", performedBy: "Dr. Amy Nguyen", role: "Provider", clinic: "AlignCare Spine Center - Aurora", status: "Success" },
  { id: "a013", dateTime: "2026-05-06T11:25:00", activity: "Consent Form Submitted", module: "Consent Forms", entityReference: "Patient: Karen Williams | Form: CF-HIPAA-2026", performedBy: "Karen Williams", role: "Patient", clinic: "AlignCare Spine Center - Aurora", status: "Success" },
  { id: "a014", dateTime: "2026-05-06T11:40:00", activity: "Appointment Rescheduled", module: "Appointments", entityReference: "Patient: Linda Patel | Appt: APT-2026-0405", performedBy: "Sarah Mitchell", role: "Front Desk", clinic: "SpineWell Chiropractic - Denver", status: "Success" },
  { id: "a015", dateTime: "2026-05-06T11:55:00", activity: "Invoice Generated", module: "Invoices", entityReference: "Invoice: INV-2026-1090 | Patient: Robert Chen", performedBy: "Michael Brooks", role: "Billing Staff", clinic: "SpineWell Chiropractic - Denver", status: "Success" },
  { id: "a016", dateTime: "2026-05-06T12:10:00", activity: "Failed Login Attempt", module: "Authentication", entityReference: "User: jharlow@spinewellco.com", performedBy: "Dr. James Harlow", role: "Provider", clinic: "SpineWell Chiropractic - Denver", status: "Failed" },
  { id: "a017", dateTime: "2026-05-06T12:22:00", activity: "Patient Profile Updated", module: "Patients", entityReference: "Patient: James Okafor (PAT-0278)", performedBy: "Jennifer Torres", role: "Clinic Admin", clinic: "AlignCare Spine Center - Aurora", status: "Success" },
  { id: "a018", dateTime: "2026-05-06T12:38:00", activity: "Care Plan Updated", module: "Care Plans", entityReference: "Patient: Karen Williams | Plan: CP-2026-0049", performedBy: "Dr. Amy Nguyen", role: "Provider", clinic: "AlignCare Spine Center - Aurora", status: "Success" },
  { id: "a019", dateTime: "2026-05-06T13:05:00", activity: "Payment Added", module: "Payments", entityReference: "Invoice: INV-2026-1088 | $185.00", performedBy: "Michael Brooks", role: "Billing Staff", clinic: "SpineWell Chiropractic - Boulder", status: "Success" },
  { id: "a020", dateTime: "2026-05-06T13:20:00", activity: "Provider Assigned to Patient", module: "Patients", entityReference: "Patient: Sandra Liu → Dr. James Harlow", performedBy: "Sarah Mitchell", role: "Front Desk", clinic: "SpineWell Chiropractic - Denver", status: "Success" },
  { id: "a021", dateTime: "2026-05-06T13:42:00", activity: "Role Permission Updated", module: "Roles", entityReference: "Role: Front Desk | Module: Invoices", performedBy: "Jennifer Torres", role: "Clinic Admin", clinic: "SpineWell Chiropractic - Denver", status: "Success" },
  { id: "a022", dateTime: "2026-05-06T14:00:00", activity: "User Account Created", module: "Users", entityReference: "User: Daniel Park | Role: Billing Staff", performedBy: "Jennifer Torres", role: "Clinic Admin", clinic: "SpineWell Chiropractic - Boulder", status: "Success" },
  { id: "a023", dateTime: "2026-05-06T14:15:00", activity: "SOAP Note Signed", module: "Clinical Records", entityReference: "Patient: Sandra Liu | Appt: APT-2026-0429", performedBy: "Dr. James Harlow", role: "Provider", clinic: "SpineWell Chiropractic - Denver", status: "Success" },
  { id: "a024", dateTime: "2026-05-06T14:30:00", activity: "Invoice Generated", module: "Invoices", entityReference: "Invoice: INV-2026-1095 | Patient: James Okafor", performedBy: "Daniel Park", role: "Billing Staff", clinic: "AlignCare Spine Center - Aurora", status: "Success" },
  { id: "a025", dateTime: "2026-05-06T14:45:00", activity: "Intake Form Submitted", module: "Questionnaires", entityReference: "Patient: Michael Torres (PAT-0330)", performedBy: "Michael Torres", role: "Patient", clinic: "SpineWell Chiropractic - Boulder", status: "Success" },
];

const MODULES = ["All Modules", "Authentication", "Clinical Records", "Appointments", "Invoices", "Patients", "Care Plans", "Questionnaires", "Payments", "Consent Forms", "Roles", "Users"];
const ROLES = ["All Roles", "Clinic Admin", "Provider", "Front Desk", "Billing Staff", "Patient"];
const CLINICS = ["All Clinics", "SpineWell Chiropractic - Denver", "SpineWell Chiropractic - Boulder", "AlignCare Spine Center - Aurora"];
const STATUSES = ["All Statuses", "Success", "Failed", "Pending", "Warning"];

export function AuditLogScreen({ onNavigate, onLogout }: AuditLogScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All Modules");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [clinicFilter, setClinicFilter] = useState("All Clinics");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [performedByFilter, setPerformedByFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const activeFilterCount =
    (dateFrom ? 1 : 0) +
    (dateTo ? 1 : 0) +
    (moduleFilter !== "All Modules" ? 1 : 0) +
    (roleFilter !== "All Roles" ? 1 : 0) +
    (clinicFilter !== "All Clinics" ? 1 : 0) +
    (statusFilter !== "All Statuses" ? 1 : 0) +
    (performedByFilter ? 1 : 0);

  const clearFilters = () => {
    setDateFrom(""); setDateTo(""); setModuleFilter("All Modules");
    setRoleFilter("All Roles"); setClinicFilter("All Clinics");
    setStatusFilter("All Statuses"); setPerformedByFilter("");
    setCurrentPage(1);
  };

  const filtered = mockAuditLogs.filter((entry) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ||
      entry.activity.toLowerCase().includes(q) ||
      entry.entityReference.toLowerCase().includes(q) ||
      entry.performedBy.toLowerCase().includes(q) ||
      entry.module.toLowerCase().includes(q);
    const entryDate = new Date(entry.dateTime);
    const matchesFrom = !dateFrom || entryDate >= new Date(dateFrom);
    const matchesTo = !dateTo || entryDate <= new Date(dateTo + "T23:59:59");
    const matchesModule = moduleFilter === "All Modules" || entry.module === moduleFilter;
    const matchesRole = roleFilter === "All Roles" || entry.role === roleFilter;
    const matchesClinic = clinicFilter === "All Clinics" || entry.clinic === clinicFilter;
    const matchesStatus = statusFilter === "All Statuses" || entry.status === statusFilter;
    const matchesPerformedBy = !performedByFilter || entry.performedBy.toLowerCase().includes(performedByFilter.toLowerCase());
    return matchesSearch && matchesFrom && matchesTo && matchesModule && matchesRole && matchesClinic && matchesStatus && matchesPerformedBy;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatDateTime = (dt: string) => {
    const d = new Date(dt);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
      " " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };

  const getStatusBadge = (status: AuditLogEntry["status"]) => {
    const map = {
      Success: { bg: "bg-success-50 dark:bg-success-950/30 text-success-700 dark:text-success-400", icon: <CheckCircle className="w-3 h-3" /> },
      Failed: { bg: "bg-destructive-50 dark:bg-destructive-950/30 text-destructive dark:text-red-400", icon: <XCircle className="w-3 h-3" /> },
      Pending: { bg: "bg-warning-50 dark:bg-warning-950/30 text-warning-700 dark:text-warning-400", icon: <Clock className="w-3 h-3" /> },
      Warning: { bg: "bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400", icon: <AlertCircle className="w-3 h-3" /> },
    };
    const cfg = map[status];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.bg}`}>
        {cfg.icon}{status}
      </span>
    );
  };

  return (
    <ClinicAdminLayout activeMenu="auditLog" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">Audit Log</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Track all system activity and user actions across your clinic</p>
        </div>

        {/* Search + Filter Bar */}
        <div className="mb-4 flex gap-3 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by activity, entity, user, or module..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full h-10 pl-9 pr-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center justify-center w-10 h-10 border rounded-lg transition-colors ${
                  activeFilterCount > 0
                    ? "border-primary-500 dark:border-primary-600 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400"
                    : "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                }`}
                title="Filters"
              >
                <Filter className="w-4 h-4" />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-600 dark:bg-primary-500 text-white text-[10px] font-bold border-2 border-white dark:border-neutral-950">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {showFilters && (
                <div className="absolute right-0 top-12 w-[420px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg z-20">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Filters</h3>
                      <button onClick={() => setShowFilters(false)} className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Date From */}
                      <div>
                        <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block mb-1">Date From</label>
                        <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
                          className="w-full h-10 px-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none" />
                      </div>
                      {/* Date To */}
                      <div>
                        <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block mb-1">Date To</label>
                        <input type="date" value={dateTo} min={dateFrom} onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
                          className="w-full h-10 px-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none" />
                      </div>
                      {/* Module */}
                      <div>
                        <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block mb-1">Module</label>
                        <div className="relative">
                          <select value={moduleFilter} onChange={(e) => { setModuleFilter(e.target.value); setCurrentPage(1); }}
                            className="w-full h-10 px-3 pr-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none appearance-none">
                            {MODULES.map(m => <option key={m}>{m}</option>)}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                        </div>
                      </div>
                      {/* Role */}
                      <div>
                        <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block mb-1">Role</label>
                        <div className="relative">
                          <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
                            className="w-full h-10 px-3 pr-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none appearance-none">
                            {ROLES.map(r => <option key={r}>{r}</option>)}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                        </div>
                      </div>
                      {/* Clinic */}
                      <div>
                        <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block mb-1">Clinic</label>
                        <div className="relative">
                          <select value={clinicFilter} onChange={(e) => { setClinicFilter(e.target.value); setCurrentPage(1); }}
                            className="w-full h-10 px-3 pr-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none appearance-none">
                            {CLINICS.map(c => <option key={c}>{c}</option>)}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                        </div>
                      </div>
                      {/* Status */}
                      <div>
                        <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block mb-1">Status</label>
                        <div className="relative">
                          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                            className="w-full h-10 px-3 pr-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none appearance-none">
                            {STATUSES.map(s => <option key={s}>{s}</option>)}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                        </div>
                      </div>
                      {/* Performed By */}
                      <div className="col-span-2">
                        <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block mb-1">Performed By</label>
                        <input type="text" placeholder="Filter by user name..." value={performedByFilter}
                          onChange={(e) => { setPerformedByFilter(e.target.value); setCurrentPage(1); }}
                          className="w-full h-10 px-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none" />
                      </div>
                    </div>

                    {activeFilterCount > 0 && (
                      <button onClick={clearFilters} className="mt-4 w-full h-9 flex items-center justify-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                        <X className="w-3.5 h-3.5" /> Clear all filters
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  {["Date & Time", "Activity", "Module", "Entity Reference", "Performed By", "Role", "Clinic", "Status"].map((col) => (
                    <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {paginated.length > 0 ? paginated.map((entry) => (
                  <tr key={entry.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="px-4 py-3 text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">{formatDateTime(entry.dateTime)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-white whitespace-nowrap">{entry.activity}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium whitespace-nowrap">
                        {entry.module}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400 max-w-[200px] truncate" title={entry.entityReference}>{entry.entityReference}</td>
                    <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-white whitespace-nowrap">{entry.performedBy}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400 whitespace-nowrap">{entry.role}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400 max-w-[160px] truncate" title={entry.clinic}>{entry.clinic}</td>
                    <td className="px-4 py-3">{getStatusBadge(entry.status)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center text-sm text-neutral-400 dark:text-neutral-500">
                      No audit log entries found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filtered.length}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(v) => { setItemsPerPage(v); setCurrentPage(1); }}
          />
        </div>
      </div>
    </ClinicAdminLayout>
  );
}
