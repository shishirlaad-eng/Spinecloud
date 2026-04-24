import { useState, useMemo } from "react";
import { ProviderLayout } from "./layout/ProviderLayout";
import {
  Calendar,
  CheckCircle,
  Clock,
  Users,
  XCircle,
  FileText,
  Plane,
  ChevronRight,
  TrendingUp,
  Activity,
  ArrowRight,
  ArrowUpRight,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  Map,
  Link,
  Info,
  ExternalLink,
  PieChart,
  Search,
  Zap
} from "lucide-react";
import { DashboardDateFilter, DateRange } from "../common/DashboardDateFilter";

interface Appointment {
  id: string;
  patientName: string;
  service?: string;
  date: string;
  time?: string;
  startTime?: string;
  endTime?: string;
  status: "Scheduled" | "Completed" | "Cancelled" | "Rescheduled" | "Confirmed" | "No-Show";
  location?: string;
  locationId?: string;
  soapFinalized?: boolean;
}

interface ProviderDashboardScreenProps {
  appointments: Appointment[];
  onNavigate: (menu: "dashboard" | "calendar" | "patients" | "spineCloud" | "leaves") => void;
  onViewAppointment: (appointmentId: string) => void;
  onLogout?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToNotifications?: () => void;
  unreadNotificationsCount?: number;
}

// Mock leave data
const mockLeaves = [
  { id: "l1", from: "2026-04-10", to: "2026-04-12", status: "approved" },
  { id: "l2", from: "2026-04-25", to: "2026-04-25", status: "approved" },
];

// Progress Ring Component
function ProgressRing({ progress, size = 60 }: { progress: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className="text-neutral-100 dark:text-neutral-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: offset }}
          className="text-primary-600 transition-all duration-500 ease-in-out"
        />
      </svg>
      <span className="absolute text-[11px] font-bold text-neutral-900 dark:text-white">{progress}%</span>
    </div>
  );
}


export function ProviderDashboardScreen({
  appointments,
  onNavigate,
  onViewAppointment,
  onLogout,
  onNavigateToProfile,
  onNavigateToNotifications,
  unreadNotificationsCount,
}: ProviderDashboardScreenProps) {
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return { start, end, label: "Last 30 days" };
  });

  const today = new Date().toISOString().split("T")[0];
  
  const todaysAppointments = useMemo(
    () => appointments.filter((a) => a.date === today),
    [appointments, today]
  );

  const completedTodayCount = useMemo(
    () => todaysAppointments.filter(a => a.status === "Completed").length,
    [todaysAppointments]
  );

  const scheduledTodayCount = useMemo(
    () => todaysAppointments.filter(a => a.status === "Scheduled" || a.status === "Confirmed").length,
    [todaysAppointments]
  );

  const totalToday = todaysAppointments.length || 1;
  const completionProgress = Math.round((completedTodayCount / totalToday) * 100);

  const totalPatientsCount = useMemo(() => 156, []);
  
  const appointmentStats = useMemo(() => {
    const total = appointments.length;
    const upcoming = appointments.filter(a => a.date > today).length;
    const past = appointments.filter(a => a.date < today).length;
    return { total, upcoming, past, today: todaysAppointments.length };
  }, [appointments, today, todaysAppointments]);

  // Recent SpineCloud assessments
  const recentScans = useMemo(() => [
     { id: "1", name: "Sarah Johnson", score: 78.4, date: "2 Hours ago", trend: "up" },
     { id: "2", name: "Michael Chen", score: 62.1, date: "Morning", trend: "down" },
     { id: "3", name: "Lisa Anderson", score: 85.0, date: "Yesterday", trend: "stable" },
  ], []);

  return (
    <ProviderLayout
      activeMenu="dashboard"
      onNavigate={onNavigate}
      onLogout={onLogout}
      onNavigateToProfile={onNavigateToProfile}
      onNavigateToNotifications={onNavigateToNotifications}
      unreadNotificationsCount={unreadNotificationsCount}
    >
      <div className="p-6 space-y-6">
        {/* Top Section: Redesigned Banner with Search */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 bg-gradient-to-r from-primary-700 to-primary-800 dark:from-primary-900 rounded-3xl p-6 relative overflow-hidden shadow-xl shadow-primary-900/10 min-h-[170px] flex items-center">
              <div className="relative z-10 w-full flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                  <h1 className="text-xl font-bold text-white flex items-center gap-2">
                     Good Morning, Dr. Johnson
                  </h1>
                  <p className="text-primary-100/90 text-[13px] font-medium max-w-sm">
                    Clinical Overview: You have <span className="bg-white/20 px-2 py-0.5 rounded text-white font-black">{scheduledTodayCount}</span> appointments confirmed for today.
                  </p>
                  
                  <div className="pt-2" />
                </div>
                
                <div className="flex flex-col items-end gap-3 shrink-0">
                   <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 min-w-[140px] text-center">
                      <p className="text-[10px] font-bold text-primary-200 uppercase tracking-widest mb-1">Total Appointments</p>
                      <p className="text-3xl font-black text-white">{appointmentStats.total}</p>
                   </div>
                   <button 
                    onClick={() => onNavigate("calendar")}
                    className="w-full h-10 bg-white text-primary-700 rounded-xl text-xs font-black hover:bg-primary-50 hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 shadow-xl"
                  >
                    <Calendar className="w-4 h-4" /> View All Appointments
                  </button>
                </div>
              </div>
              
              {/* Decorative Blur */}
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
           </div>

           {/* KPI Grid Section */}
           <div className="grid grid-cols-2 gap-3">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                 <div className="w-8 h-8 bg-primary-50 dark:bg-primary-950/30 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary-600" />
                 </div>
                 <div className="mt-3">
                    <p className="text-2xl font-black text-neutral-900 dark:text-white leading-none">{totalPatientsCount}</p>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Total Patients</p>
                 </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                 <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-emerald-600" />
                 </div>
                 <div className="mt-3">
                    <p className="text-2xl font-black text-neutral-900 dark:text-white leading-none">{appointmentStats.today}</p>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Present Today</p>
                 </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                 <div className="w-8 h-8 bg-amber-50 dark:bg-amber-950/30 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-amber-600" />
                 </div>
                 <div className="mt-3">
                    <p className="text-2xl font-black text-neutral-900 dark:text-white leading-none">{appointmentStats.upcoming}</p>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Upcoming</p>
                 </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                 <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-indigo-600" />
                 </div>
                 <div className="mt-3">
                    <p className="text-2xl font-black text-neutral-900 dark:text-white leading-none">{appointmentStats.total}</p>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Total Appointments</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Dashboard Body Grid: Asymmetrical */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 space-y-6">
               {/* Recent Activity: SpineCloud Scans */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
                 <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Recent SpineCloud Assessments</h3>
                      <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">Latest Diagnostic Activity</p>
                    </div>
                    <button onClick={() => onNavigate("spineCloud")} className="text-xs font-bold text-primary-600 hover:underline">View All Assessments</button>
                 </div>
                 <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {recentScans.map((scan) => (
                      <button 
                        key={scan.id} 
                        onClick={() => onNavigate("spineCloud")}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                           <div className="w-9 h-9 bg-neutral-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center font-bold text-neutral-600 dark:text-neutral-400">
                              {scan.name[0]}
                           </div>
                           <div>
                              <p className="text-[13px] font-bold text-neutral-900 dark:text-white">{scan.name}</p>
                              <p className="text-[11px] text-neutral-500">{scan.date}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-6">
                           <div className="text-right">
                              <p className={`text-sm font-black ${scan.score > 80 ? 'text-emerald-600' : 'text-primary-600'}`}>{scan.score.toFixed(1)}</p>
                              <p className="text-[9px] font-bold text-neutral-400 uppercase">Score</p>
                           </div>
                           <ChevronRight className="w-4 h-4 text-neutral-300" />
                        </div>
                      </button>
                    ))}
                 </div>
              </div>
           </div>

           {/* Right Column: Demographics & Quick Actions */}
           <div className="space-y-6">
              {/* Demographic Insight Card */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <PieChart className="w-4 h-4 text-primary-600" />
                    <h3 className="text-xs font-black text-neutral-900 dark:text-white uppercase tracking-wider">Demographic Profile</h3>
                  </div>

                  <div className="space-y-4">
                     <div>
                        <div className="flex items-center justify-between mb-1.5">
                           <span className="text-[11px] font-bold text-neutral-500">GENDER: MALE</span>
                           <span className="text-[11px] font-black text-neutral-900 dark:text-white">58%</span>
                        </div>
                        <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                           <div className="h-full bg-primary-600 rounded-full" style={{ width: '58%' }} />
                        </div>
                     </div>
                     <div>
                        <div className="flex items-center justify-between mb-1.5 text-rose-500">
                           <span className="text-[11px] font-bold text-neutral-500">GENDER: FEMALE</span>
                           <span className="text-[11px] font-black text-neutral-900 dark:text-white">42%</span>
                        </div>
                        <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                           <div className="h-full bg-rose-500 rounded-full" style={{ width: '42%' }} />
                        </div>
                     </div>
                     
                     <div className="mt-8">
                        <div className="flex items-center justify-between mb-1.5">
                           <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest font-mono">Top Age Group</span>
                           <span className="text-[11px] font-black text-primary-600">35 - 50</span>
                        </div>
                        <p className="text-[10px] text-neutral-400 italic">Majority clinical focus on postural correction.</p>
                     </div>
                  </div>
              </div>

           </div>
        </div>
      </div>
    </ProviderLayout>
  );
}