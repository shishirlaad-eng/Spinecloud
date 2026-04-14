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
  UserPlus,
  Lock,
  Search,
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

// Sparkline Component
function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const width = 80;
  const height = 24;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - (d / max) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-primary-600 dark:text-primary-400"
        points={points}
      />
    </svg>
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

  const pendingSOAP = useMemo(
    () => appointments.filter((a) => a.status === "Completed" && a.soapFinalized === false).length,
    [appointments]
  );

  const nextUp = useMemo(
    () => {
      const scheduled = todaysAppointments.filter(a => a.status === "Scheduled" || a.status === "Confirmed");
      if (scheduled.length === 0) return undefined;
      return scheduled.sort((a,b) => {
        const timeA = a.time || a.startTime || "";
        const timeB = b.time || b.startTime || "";
        return timeA.localeCompare(timeB);
      })[0];
    },
    [todaysAppointments]
  );

  const trendData = [4, 6, 5, 8, 7, 9, 10]; // Mock trend data

  return (
    <ProviderLayout
      activeMenu="dashboard"
      onNavigate={onNavigate}
      onLogout={onLogout}
      onNavigateToProfile={onNavigateToProfile}
      onNavigateToNotifications={onNavigateToNotifications}
      unreadNotificationsCount={unreadNotificationsCount}
    >
      <div className="p-6 space-y-8">
        {/* Top Section: Welcome & Completion Ring */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-900 dark:to-neutral-950 rounded-2xl p-8 relative overflow-hidden shadow-lg shadow-primary-900/10">
            <div className="relative z-10 flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white">Good Morning, Dr. Johnson</h1>
                <p className="text-primary-100/80 max-w-sm">
                  You have {scheduledTodayCount} more appointments today. Your first one starts in 15 minutes.
                </p>
                <div className="flex items-center gap-4 mt-6">
                  <button 
                    onClick={() => onNavigate("calendar")}
                    className="px-5 py-2.5 bg-white text-primary-700 rounded-lg text-sm font-semibold hover:bg-primary-50 transition-colors inline-flex items-center gap-2 shadow-sm"
                  >
                    View Schedule <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="hidden sm:flex flex-col items-center bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
                <span className="text-xs font-semibold text-primary-100 mb-3 uppercase tracking-wider">Today's Progress</span>
                <ProgressRing progress={completionProgress} size={80} />
                <span className="text-xs text-primary-50 mt-3">{completedTodayCount}/{totalToday} Completed</span>
              </div>
            </div>
            
            {/* Decorative element */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:w-96">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 bg-orange-50 dark:bg-orange-950/30 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <Sparkline data={trendData} />
              </div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">{pendingSOAP}</p>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Pending SOAP</p>
              <button 
                onClick={() => onNavigate("patients")}
                className="mt-3 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1"
              >
                Review all <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 bg-purple-50 dark:bg-purple-950/30 rounded-lg flex items-center justify-center">
                  <Plane className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-[10px] font-bold text-success-600 bg-success-50 dark:bg-success-950/30 px-2 py-0.5 rounded-full">3 APPR.</div>
              </div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">12-14</p>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Next Leave (Apr)</p>
              <button 
                onClick={() => onNavigate("leaves")}
                className="mt-3 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1"
              >
                Managed <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Daily Workflow */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-600" />
              Clinical Workflow
            </h2>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                <div className="w-2 h-2 rounded-full bg-success-500" /> Done
              </span>
              <span className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                <div className="w-2 h-2 rounded-full bg-primary-500" /> Upcoming
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {todaysAppointments.length > 0 ? (
              todaysAppointments.sort((a,b) => (a.time || a.startTime || "").localeCompare(b.time || b.startTime || "")).map((apt) => (
                <div 
                  key={apt.id}
                  className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 hover:border-primary-500 transition-all cursor-pointer shadow-sm hover:shadow-md"
                  onClick={() => onViewAppointment(apt.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="text-center w-14 border-r border-neutral-100 dark:border-neutral-800 pr-4">
                        <p className="text-xs font-bold text-neutral-400 dark:text-neutral-600">
                          {apt.time ? apt.time.split(" ")[1] : (apt.startTime ? apt.startTime.split(" ")[1] : "TBD")}
                        </p>
                        <p className="text-sm font-black text-neutral-900 dark:text-white">
                          {apt.time ? apt.time.split(" ")[0] : (apt.startTime ? apt.startTime.split(" ")[0] : "TBD")}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {apt.patientName}
                        </h3>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-1 mt-0.5">
                          {apt.service} · <span className="text-neutral-400">{apt.location}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {apt.status === "Completed" ? (
                        <div className="flex items-center gap-2 text-success-600 dark:text-success-400 text-xs font-bold bg-success-50 dark:bg-success-950/30 px-3 py-1.5 rounded-lg border border-success-100 dark:border-success-800/50">
                          <CheckCircle className="w-3.5 h-3.5" /> COMPLETED
                        </div>
                      ) : (
                        <button className="px-4 py-2 bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 text-xs font-bold rounded-lg border border-primary-200 dark:border-primary-800/50 group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all">
                          START SESSION
                        </button>
                      )}
                      <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-primary-500 transition-colors" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-12 bg-neutral-50 dark:bg-neutral-950 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl text-center">
                <div className="w-16 h-16 bg-white dark:bg-neutral-900 rounded-full flex items-center justify-center shadow-sm mb-4">
                  <Calendar className="w-8 h-8 text-neutral-300" />
                </div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">All caught up!</h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-[200px]">No scheduled appointments for today.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProviderLayout>
  );
}