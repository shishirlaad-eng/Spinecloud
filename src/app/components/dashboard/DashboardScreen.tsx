import { useState, useMemo } from "react";
import { Calendar, Clock, MapPin, User, FileText, MoreVertical, Bell, CalendarX, CreditCard, TrendingUp, TrendingDown, Activity, ChevronRight } from "lucide-react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { DashboardDateFilter, DateRange } from "../common/DashboardDateFilter";

interface UpcomingAppointment {
  id: string;
  appointmentId?: string;
  date: string;
  timeSlot: string;
  provider: string;
  clinic: string;
  service: string;
  status: "Confirmed" | "Completed";
}

interface Notification {
  id: string;
  message: string;
  timestamp: string;
  type: "booking" | "update" | "cancellation";
}

interface DashboardScreenProps {
  appointments: UpcomingAppointment[];
  notifications: Notification[];
  onNavigate: (menu: "dashboard" | "appointments" | "invoices" | "notifications" | "settings") => void;
  onViewAppointment?: (appointmentId: string) => void;
  onRescheduleAppointment?: (appointmentId: string) => void;
  onCancelAppointment?: (appointmentId: string) => void;
  onLogout?: () => void;
  onNavigateToProfile?: () => void;
}

// Mock wellness data
const wellnessHistory = [
  { month: "Oct", score: 64 },
  { month: "Nov", score: 71 },
  { month: "Dec", score: 68 },
  { month: "Jan", score: 75 },
  { month: "Feb", score: 79 },
  { month: "Mar", score: 82 },
];

const mockInvoices = [
  { id: "inv-1", amount: 150, status: "unpaid", date: "2026-03-01" },
  { id: "inv-2", amount: 200, status: "unpaid", date: "2026-02-15" },
  { id: "inv-3", amount: 300, status: "paid", date: "2026-01-20" },
];

function SparklineChart({ data }: { data: { month: string; score: number }[] }) {
  const max = Math.max(...data.map((d) => d.score));
  const min = Math.min(...data.map((d) => d.score));
  const range = max - min || 1;
  const width = 200;
  const height = 50;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d.score - min) / range) * height * 0.8 - height * 0.1;
    return `${x},${y}`;
  });
  const polylinePoints = points.join(" ");
  const lastPoint = points[points.length - 1].split(",");

  return (
    <div className="flex items-end gap-3">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary-500"
          points={polylinePoints}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * width;
          const y = height - ((d.score - min) / range) * height * 0.8 - height * 0.1;
          return (
            <circle key={i} cx={x} cy={y} r={i === data.length - 1 ? 4 : 2.5}
              className={i === data.length - 1 ? "fill-primary-600" : "fill-primary-400"} />
          );
        })}
      </svg>
      <div className="text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
        {data.slice(-3).map((d) => (
          <div key={d.month} className="flex items-center gap-1">
            <span className="w-6 text-right">{d.month}</span>
            <span className="font-medium text-neutral-700 dark:text-neutral-300">{d.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardScreen({
  appointments,
  notifications,
  onNavigate,
  onViewAppointment,
  onRescheduleAppointment,
  onCancelAppointment,
  onLogout,
  onNavigateToProfile,
}: DashboardScreenProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return { start, end, label: "Last 30 days" };
  });

  const today = new Date().toISOString().split("T")[0];

  // KPI computations
  const upcomingCount = useMemo(
    () => appointments.filter((a) => a.date >= today && a.status === "Confirmed").length,
    [appointments, today]
  );

  const pastVisitsCount = useMemo(() => {
    const startStr = dateRange.start.toISOString().split("T")[0];
    const endStr = dateRange.end.toISOString().split("T")[0];
    return appointments.filter(
      (a) => a.status === "Completed" && a.date >= startStr && a.date <= endStr
    ).length;
  }, [appointments, dateRange]);

  const paymentDue = useMemo(() => {
    const startStr = dateRange.start.toISOString().split("T")[0];
    const endStr = dateRange.end.toISOString().split("T")[0];
    return mockInvoices
      .filter((inv) => inv.status === "unpaid" && inv.date >= startStr && inv.date <= endStr)
      .reduce((sum, inv) => sum + inv.amount, 0);
  }, [dateRange]);

  const latestWellness = wellnessHistory[wellnessHistory.length - 1].score;
  const prevWellness = wellnessHistory[wellnessHistory.length - 2].score;
  const wellnessTrend = latestWellness - prevWellness;

  const upcomingAppointments = appointments
    .filter((a) => a.date >= today && a.status === "Confirmed")
    .slice(0, 5);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return formatDate(timestamp);
  };

  const formatAppointmentService = (service: string) => {
    const services: Record<string, string> = {
      initial: "Initial Consultation",
      followup: "Follow-up Visit",
      therapy: "Therapy Session",
    };
    return services[service] || service;
  };

  const handleCancelClick = (appointmentId: string) => {
    setAppointmentToCancel(appointmentId);
    setShowCancelDialog(true);
    setActiveDropdown(null);
  };

  const confirmCancel = () => {
    if (appointmentToCancel && onCancelAppointment) {
      onCancelAppointment(appointmentToCancel);
    }
    setShowCancelDialog(false);
    setAppointmentToCancel(null);
  };

  const kpis = [
    {
      label: "Upcoming Appointments",
      value: upcomingCount,
      icon: Calendar,
      color: "primary",
      sub: "Confirmed & scheduled",
      action: () => onNavigate("appointments"),
    },
    {
      label: "Past Visits",
      value: pastVisitsCount,
      icon: Clock,
      color: "success",
      sub: dateRange.label,
      action: () => onNavigate("appointments"),
    },
    {
      label: "Payment Due",
      value: `$${paymentDue.toFixed(0)}`,
      icon: CreditCard,
      color: "amber",
      sub: "Outstanding balance",
      action: () => onNavigate("invoices"),
    },
    {
      label: "Wellness Index",
      value: latestWellness,
      icon: Activity,
      color: "purple",
      sub: wellnessTrend >= 0 ? `↑ ${wellnessTrend} pts from last month` : `↓ ${Math.abs(wellnessTrend)} pts from last month`,
      trend: wellnessTrend,
      action: undefined,
    },
  ];

  const colorMap: Record<string, { bg: string; icon: string }> = {
    primary: { bg: "bg-primary-100 dark:bg-primary-950/30", icon: "text-primary-600 dark:text-primary-400" },
    success: { bg: "bg-success-100 dark:bg-success-950/30", icon: "text-success-600 dark:text-success-400" },
    amber: { bg: "bg-amber-100 dark:bg-amber-950/30", icon: "text-amber-600 dark:text-amber-400" },
    purple: { bg: "bg-purple-100 dark:bg-purple-950/30", icon: "text-purple-600 dark:text-purple-400" },
  };

  return (
    <DashboardLayout
      activeMenu="dashboard"
      onNavigate={onNavigate}
      onLogout={onLogout}
      onNavigateToProfile={onNavigateToProfile}
    >
      <div className="max-w-7xl mx-auto space-y-6 px-1">
        {/* Page Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Dashboard</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              Your health overview at a glance
            </p>
          </div>
          <DashboardDateFilter
            onChange={(range) => setDateRange(range)}
          />
        </div>

        {/* KPI Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            const colors = colorMap[kpi.color];
            return (
              <div
                key={kpi.label}
                onClick={kpi.action}
                className={`bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 transition-all ${kpi.action ? "cursor-pointer hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700" : ""}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.bg}`}>
                    <Icon className={`w-5 h-5 ${colors.icon}`} />
                  </div>
                  {kpi.action && <ChevronRight className="w-4 h-4 text-neutral-400 mt-1" />}
                </div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">{kpi.value}</p>
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{kpi.label}</p>
                <p className={`text-xs mt-1 ${kpi.trend !== undefined ? (kpi.trend >= 0 ? "text-success-600 dark:text-success-400" : "text-destructive") : "text-neutral-500 dark:text-neutral-400"}`}>
                  {kpi.sub}
                </p>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Upcoming Appointments</h3>
                <button
                  onClick={() => onNavigate("appointments")}
                  className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
                >
                  View all
                </button>
              </div>
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {upcomingAppointments.length === 0 ? (
                  <div className="text-center py-12">
                    <CalendarX className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">No upcoming appointments</p>
                    <button
                      onClick={() => onNavigate("appointments")}
                      className="mt-3 text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline"
                    >
                      Book an appointment
                    </button>
                  </div>
                ) : (
                  upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="px-5 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-1.5 text-sm font-medium text-neutral-900 dark:text-white">
                              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                              {formatDate(appointment.date)}
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                              <Clock className="w-3.5 h-3.5" />
                              {appointment.timeSlot}
                            </div>
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-success-100 dark:bg-success-950/30 text-success-700 dark:text-success-400">
                              {appointment.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-1.5 text-sm text-neutral-700 dark:text-neutral-300">
                              <User className="w-3.5 h-3.5 text-neutral-400" />
                              {appointment.provider}
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                              <MapPin className="w-3.5 h-3.5" />
                              {appointment.clinic}
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                              <FileText className="w-3.5 h-3.5" />
                              {formatAppointmentService(appointment.service)}
                            </div>
                          </div>
                        </div>

                        <div className="relative flex-shrink-0">
                          <button
                            onClick={() => setActiveDropdown(activeDropdown === appointment.id ? null : appointment.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {activeDropdown === appointment.id && (
                            <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg z-10">
                              <button onClick={() => { onViewAppointment?.(appointment.id); setActiveDropdown(null); }}
                                className="w-full px-4 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors rounded-t-lg">
                                View Details
                              </button>
                              <button onClick={() => { onRescheduleAppointment?.(appointment.id); setActiveDropdown(null); }}
                                className="w-full px-4 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                                Reschedule
                              </button>
                              <button onClick={() => handleCancelClick(appointment.id)}
                                className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors rounded-b-lg">
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Wellness Index Card */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Wellness Index</h3>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">6-month trend</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-neutral-900 dark:text-white">{latestWellness}</span>
                <div className={`flex items-center gap-1 text-sm font-medium ${wellnessTrend >= 0 ? "text-success-600 dark:text-success-400" : "text-destructive"}`}>
                  {wellnessTrend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {Math.abs(wellnessTrend)} pts
                </div>
              </div>
              {/* Score bar */}
              <div className="mb-4">
                <div className="h-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500"
                    style={{ width: `${latestWellness}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-neutral-400 mt-1">
                  <span>0</span>
                  <span>100</span>
                </div>
              </div>
              <SparklineChart data={wellnessHistory} />
            </div>


          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-neutral-950/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl w-full max-w-md shadow-2xl">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Cancel Appointment</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Are you sure you want to cancel this appointment? This action cannot be undone.
              </p>
            </div>
            <div className="px-6 pb-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors font-medium text-sm"
              >
                No, Keep It
              </button>
              <button
                onClick={confirmCancel}
                className="px-4 h-10 bg-destructive text-white rounded-lg hover:bg-destructive/90 transition-colors font-medium text-sm"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}