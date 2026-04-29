import { useState, useMemo } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { Calendar, Users, DollarSign, XCircle, ChevronRight, TrendingUp } from "lucide-react";
import { DashboardDateFilter, DateRange } from "@/app/components/common/DashboardDateFilter";

interface ClinicAdminDashboardScreenProps {
  onNavigate: (menu: any) => void;
  onLogout?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToNotifications?: () => void;
  unreadNotificationsCount?: number;
  appointments: any[];
  patients: any[];
}

// ─── Mock Data ────────────────────────────────────────────
// Removed static mock data to use live props

// ─── Chart Components ──────────────────────────────────────

// Bar + Line combo chart
function AppointmentBarLineChart({ data }: { data: { label: string; total: number; completed: number }[] }) {
  const maxTotal = Math.max(...data.map((d) => d.total), 1);
  const height = 120;
  const width = 300;
  const barWidth = (width / data.length) * 0.5;
  const gap = width / data.length;

  const linePoints = data.map((d, i) => {
    const x = gap * i + gap / 2;
    const y = height - 20 - ((d.completed / maxTotal) * (height - 30));
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {data.map((d, i) => {
        const x = gap * i + gap / 2 - barWidth / 2;
        const barH = ((d.total / maxTotal) * (height - 30));
        const y = height - 20 - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barWidth} height={barH}
              className="fill-primary-200 dark:fill-primary-900/50" rx="2" />
            <text x={x + barWidth / 2} y={height - 5} textAnchor="middle"
              className="fill-neutral-400" fontSize="8">{d.label}</text>
          </g>
        );
      })}
      <polyline fill="none" stroke="currentColor" strokeWidth="2"
        className="text-secondary-500" points={linePoints} strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => {
        const x = gap * i + gap / 2;
        const y = height - 20 - ((d.completed / maxTotal) * (height - 30));
        return <circle key={i} cx={x} cy={y} r="3" className="fill-secondary-500" />;
      })}
    </svg>
  );
}

// Line chart
function RevenueLineChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const height = 100;
  const width = 300;
  const gap = width / (data.length - 1);

  const points = data.map((d, i) => {
    const x = i * gap;
    const y = height - 20 - ((d.value / max) * (height - 30));
    return `${x},${y}`;
  });

  const areaPoints = [
    `0,${height - 20}`,
    ...points,
    `${(data.length - 1) * gap},${height - 20}`,
  ].join(" ");

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-primary-500)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--color-primary-500)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#revGrad)" />
      <polyline fill="none" stroke="currentColor" strokeWidth="2"
        className="text-primary-500" points={points.join(" ")} strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => {
        const x = i * gap;
        const y = height - 20 - ((d.value / max) * (height - 30));
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="3" className="fill-primary-500" />
            <text x={x} y={height - 5} textAnchor="middle" className="fill-neutral-400" fontSize="8">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

// Donut chart
function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const r = 42;
  const cx = 55;
  const cy = 55;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex items-center gap-4">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor"
          className="text-neutral-100 dark:text-neutral-800" strokeWidth="14" />
        {segments.map((seg, i) => {
          const pct = seg.value / total;
          const dashArray = `${pct * circumference} ${circumference}`;
          const el = (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={seg.color} strokeWidth="14"
              strokeDasharray={dashArray}
              strokeDashoffset={-offset * circumference}
              strokeLinecap="round"
              style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
            />
          );
          offset += pct;
          return el;
        })}
        <text x={cx} y={cy - 5} textAnchor="middle" fontSize="18" fontWeight="700"
          className="fill-neutral-900 dark:fill-white">{total}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9"
          className="fill-neutral-500">total</text>
      </svg>
      <div className="space-y-1.5">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: seg.color }} />
            <span className="text-xs text-neutral-600 dark:text-neutral-400">{seg.label}</span>
            <span className="text-xs font-semibold text-neutral-900 dark:text-white ml-auto">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Horizontal bar chart
function HorizontalBarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={i}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-neutral-600 dark:text-neutral-400 truncate max-w-[70%]">{d.label}</span>
            <span className="text-xs font-semibold text-neutral-900 dark:text-white">{d.value}</span>
          </div>
          <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-400 transition-all duration-500"
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────
export function ClinicAdminDashboardScreen({
  onNavigate,
  onLogout,
  onNavigateToProfile,
  onNavigateToNotifications,
  unreadNotificationsCount,
  appointments,
  patients,
}: ClinicAdminDashboardScreenProps) {
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return { start, end, label: "Last 30 days" };
  });

  // Filter appointments by date range
  const filtered = useMemo(() => {
    const startStr = dateRange.start.toISOString().split("T")[0];
    const endStr = dateRange.end.toISOString().split("T")[0];
    return appointments.map(a => {
      const serviceName = a.service || a.type || "";
      return {
        ...a,
        revenue: a.status === "Completed" ? (serviceName.includes("Initial") ? 150 : 80) : 0
      };
    }).filter((a) => a.date >= startStr && a.date <= endStr);
  }, [dateRange, appointments]);

  // KPIs
  const totalAppointments = filtered.length;
  const activePatients = new Set(filtered.map((a) => a.patientId)).size;
  const revenueCollected = filtered.filter((a) => a.status === "Completed").reduce((s, a) => s + a.revenue, 0);
  const cancelled = filtered.filter((a) => a.status === "Cancelled" || a.status === "No-Show").length;
  const cancellationRate = totalAppointments > 0 ? Math.round((cancelled / totalAppointments) * 100) : 0;

  // Chart data: appointment volume by week (last 6 weeks)
  const volumeData = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const weekStart = new Date(dateRange.end);
      weekStart.setDate(weekStart.getDate() - (5 - i) * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      const ws = weekStart.toISOString().split("T")[0];
      const we = weekEnd.toISOString().split("T")[0];
      const weekApts = appointments.filter((a) => a.date >= ws && a.date <= we);
      return {
        label: `W${i + 1}`,
        total: weekApts.length,
        completed: weekApts.filter((a) => a.status === "Completed").length,
      };
    });
  }, [dateRange, appointments]);

  // Revenue trend (last 6 months)
  const revenueTrend = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      const month = d.toLocaleDateString("en-US", { month: "short" });
      const value = appointments
        .filter((a) => {
          const aptMonth = new Date(a.date).getMonth();
          const aptYear = new Date(a.date).getFullYear();
          return aptMonth === d.getMonth() && aptYear === d.getFullYear() && a.status === "Completed";
        })
        .reduce((s, a) => {
          const serviceName = a.service || a.type || "";
          return s + (serviceName.includes("Initial") ? 150 : 80);
        }, 0);
      return { label: month, value };
    });
  }, [appointments]);

  // Status breakdown
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { Completed: 0, Scheduled: 0, Cancelled: 0, "No-Show": 0 };
    filtered.forEach((a) => { if (counts[a.status] !== undefined) counts[a.status]++; });
    return counts;
  }, [filtered]);

  const donutSegments = [
    { label: "Completed", value: statusCounts["Completed"], color: "#22c55e" },
    { label: "Scheduled", value: statusCounts["Scheduled"], color: "#00669C" },
    { label: "Cancelled", value: statusCounts["Cancelled"], color: "#ef4444" },
    { label: "No-Show", value: statusCounts["No-Show"], color: "#f59e0b" },
  ];

  // Service type breakdown
  const serviceData = useMemo(() => {
    const counts: Record<string, number> = {};
    filtered.forEach((a) => { 
      const serviceName = a.service || a.type || "Other";
      counts[serviceName] = (counts[serviceName] || 0) + 1; 
    });
    return Object.entries(counts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [filtered]);

  const kpis = [
    {
      label: "Total Appointments",
      value: totalAppointments,
      icon: Calendar,
      color: "primary" as const,
      sub: dateRange.label,
      action: () => onNavigate("calendar"),
    },
    {
      label: "Active Patients",
      value: activePatients,
      icon: Users,
      color: "success" as const,
      sub: "Unique patients with visits",
      action: () => onNavigate("patients"),
    },
    {
      label: "Revenue Collected",
      value: `$${revenueCollected.toLocaleString()}`,
      icon: DollarSign,
      color: "amber" as const,
      sub: "From completed visits",
      action: () => onNavigate("invoices"),
    },
    {
      label: "Cancellation Rate",
      value: `${cancellationRate}%`,
      icon: XCircle,
      color: "red" as const,
      sub: `${cancelled} cancelled / no-shows`,
      action: undefined,
    },
  ];

  const colorMap = {
    primary: { bg: "bg-primary-100 dark:bg-primary-950/30", icon: "text-primary-600 dark:text-primary-400" },
    success: { bg: "bg-success-100 dark:bg-success-950/30", icon: "text-success-600 dark:text-success-400" },
    amber: { bg: "bg-amber-100 dark:bg-amber-950/30", icon: "text-amber-600 dark:text-amber-400" },
    red: { bg: "bg-red-100 dark:bg-red-950/30", icon: "text-red-600 dark:text-red-400" },
  };

  return (
    <ClinicAdminLayout
      activeMenu="dashboard"
      onNavigate={onNavigate}
      onLogout={onLogout}
      onNavigateToProfile={onNavigateToProfile}
      onNavigateToNotifications={onNavigateToNotifications}
      unreadNotificationsCount={unreadNotificationsCount}
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Dashboard</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              Your clinic at a glance
            </p>
          </div>
          <DashboardDateFilter onChange={(range) => setDateRange(range)} />
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
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{kpi.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Row 1: Volume + Revenue */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appointment Volume */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Appointment Volume</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Weekly total (bars) vs completed (line)</p>
              </div>
              <TrendingUp className="w-4 h-4 text-primary-500" />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-primary-200 dark:bg-primary-900/70" />
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Total</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-1.5 rounded-full bg-secondary-500" />
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Completed</span>
              </div>
            </div>
            <AppointmentBarLineChart data={volumeData} />
          </div>

          {/* Revenue Trend */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Revenue Trend</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Monthly revenue from completed visits</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-neutral-900 dark:text-white">
                  ${revenueTrend.reduce((s, d) => s + d.value, 0).toLocaleString()}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Last 6 months</p>
              </div>
            </div>
            <div className="mt-4">
              <RevenueLineChart data={revenueTrend} />
            </div>
          </div>
        </div>

        {/* Charts Row 2: Status Breakdown + Top Services */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Breakdown */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">Appointment Status</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">Breakdown by status for {dateRange.label}</p>
            <DonutChart segments={donutSegments} />
          </div>

          {/* Top Service Types */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">Top Service Types</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">Most booked services for {dateRange.label}</p>
            {serviceData.length > 0 ? (
              <HorizontalBarChart data={serviceData} />
            ) : (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-6">No data available</p>
            )}
          </div>
        </div>
      </div>
    </ClinicAdminLayout>
  );
}