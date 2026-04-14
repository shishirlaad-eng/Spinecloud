import { useState } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  service: string;
  status: "Confirmed" | "Pending" | "Cancelled" | "Completed";
}

interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
}

interface ProviderCalendarScreenProps {
  provider: Provider;
  appointments: Appointment[];
  onNavigate: (menu: "dashboard" | "branches" | "questionnaires" | "roles" | "users" | "providers") => void;
  onBack: () => void;
  onLogout?: () => void;
}

export function ProviderCalendarScreen({
  provider,
  appointments,
  onNavigate,
  onBack,
  onLogout,
}: ProviderCalendarScreenProps) {
  console.log('ProviderCalendarScreen - Total appointments received:', appointments.length);
  console.log('ProviderCalendarScreen - Appointments data:', appointments);
  const [view, setView] = useState<"week" | "day" | "month">("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  console.log('ProviderCalendarScreen - Current date:', currentDate);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const getWeekDays = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (view === "day") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1));
    } else if (view === "week") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    } else {
      newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    console.log('getAppointmentsForDate - Looking for date:', dateStr);
    const filtered = appointments.filter((apt) => {
      console.log('Checking appointment:', apt.id, 'Date:', apt.date, 'Match:', apt.date === dateStr);
      return apt.date === dateStr;
    });
    console.log('getAppointmentsForDate - Found:', filtered.length, 'appointments');
    return filtered;
  };

  const getAppointmentsForMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      return aptDate.getFullYear() === year && aptDate.getMonth() === month;
    });
  };

  const getAppointmentColor = (service: string) => {
    const serviceKey = service.toLowerCase();
    if (serviceKey.includes("initial") || serviceKey.includes("consultation")) {
      return "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900";
    } else if (serviceKey.includes("follow-up") || serviceKey.includes("follow up")) {
      return "bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900";
    } else if (serviceKey.includes("physical therapy") || serviceKey.includes("therapy")) {
      return "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900";
    } else if (serviceKey.includes("chiropractic")) {
      return "bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-900";
    } else if (serviceKey.includes("massage")) {
      return "bg-pink-100 dark:bg-pink-950/30 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-900";
    } else {
      return "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700";
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      Confirmed: "bg-success-100 dark:bg-success-950/30 text-success-700 dark:text-success-400",
      Pending: "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400",
      Cancelled: "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400",
      Completed: "bg-primary-100 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400",
    };
    return colors[status as keyof typeof colors] || colors.Confirmed;
  };

  const weekDays = getWeekDays(currentDate);
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <ClinicAdminLayout activeMenu="providers" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group mb-4"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to providers
            </button>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-950/30 flex items-center justify-center">
                  <span className="text-xl font-semibold text-primary-600 dark:text-primary-400">
                    {provider.firstName[0]}
                    {provider.lastName[0]}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
                    {provider.firstName} {provider.lastName}'s Calendar
                  </h1>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {provider.specialty}
                  </p>
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
                {(["day", "week", "month"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`px-4 h-8 rounded-md text-sm font-medium transition-colors ${
                      view === v
                        ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Calendar Navigation */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateDate("prev")}
                className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <CalendarIcon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {view === "month" ? formatMonthYear(currentDate) : formatDate(currentDate)}
                </h2>
                <button
                  onClick={goToToday}
                  className="px-3 h-8 text-sm font-medium text-primary-700 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 rounded-lg transition-colors"
                >
                  Today
                </button>
              </div>

              <button
                onClick={() => navigateDate("next")}
                className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Color Legend */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
              Services
            </h3>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Initial Consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Follow-up</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Physical Therapy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Chiropractic</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Massage</span>
              </div>
            </div>
          </div>

          {/* Week View */}
          {view === "week" && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              <div className="grid grid-cols-7 border-b border-neutral-200 dark:border-neutral-800">
                {weekDays.map((day, index) => (
                  <div
                    key={index}
                    className={`p-4 text-center border-r border-neutral-200 dark:border-neutral-800 last:border-r-0 ${
                      isToday(day) ? "bg-primary-50 dark:bg-primary-950/30" : ""
                    }`}
                  >
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                      {day.toLocaleDateString("en-US", { weekday: "short" })}
                    </p>
                    <p className={`text-sm font-semibold ${
                      isToday(day) 
                        ? "text-primary-600 dark:text-primary-400" 
                        : "text-neutral-900 dark:text-white"
                    }`}>
                      {day.getDate()}
                    </p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 min-h-[500px]">
                {weekDays.map((day, index) => {
                  const dayAppointments = getAppointmentsForDate(day);
                  return (
                    <div
                      key={index}
                      className={`p-2 border-r border-neutral-200 dark:border-neutral-800 last:border-r-0 ${
                        isToday(day) ? "bg-primary-50/30 dark:bg-primary-950/10" : ""
                      }`}
                    >
                      <div className="space-y-1.5">
                        {dayAppointments.map((apt) => (
                          <div
                            key={apt.id}
                            className={`p-2 rounded-lg border text-xs ${getAppointmentColor(
                              apt.service
                            )}`}
                          >
                            <p className="font-semibold truncate">{apt.time}</p>
                            <p className="truncate">{apt.patientName}</p>
                            <p className="truncate opacity-90">{apt.service}</p>
                            <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium mt-1 ${getStatusBadge(apt.status)}`}>
                              {apt.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Day View */}
          {view === "day" && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
              <div className="space-y-3">
                {getAppointmentsForDate(currentDate).length > 0 ? (
                  getAppointmentsForDate(currentDate)
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((apt) => (
                      <div
                        key={apt.id}
                        className={`p-4 rounded-lg border ${getAppointmentColor(apt.service)}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-sm font-semibold mb-1">{apt.patientName}</h3>
                            <p className="text-sm opacity-90">{apt.service}</p>
                          </div>
                          <span className="text-sm font-semibold">{apt.time}</span>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-current/20">
                          <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${getStatusBadge(apt.status)}`}>
                            {apt.status}
                          </span>
                          <p className="text-xs opacity-75">{apt.timeSlot}</p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-12">
                    <CalendarIcon className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                    <p className="text-neutral-500 dark:text-neutral-400">
                      No appointments scheduled for this day
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Month View */}
          {view === "month" && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
              <div className="space-y-2">
                {getAppointmentsForMonth().length > 0 ? (
                  getAppointmentsForMonth()
                    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
                    .map((apt) => (
                      <div
                        key={apt.id}
                        className={`p-3 rounded-lg border ${getAppointmentColor(apt.service)}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="text-center min-w-[60px]">
                              <p className="text-sm font-semibold">
                                {new Date(apt.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                              <p className="text-xs opacity-75">{apt.time}</p>
                            </div>
                            <div className="border-l border-current/20 pl-3 flex-1">
                              <p className="text-sm font-medium">{apt.patientName}</p>
                              <p className="text-xs opacity-90">{apt.service}</p>
                            </div>
                          </div>
                          <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${getStatusBadge(apt.status)}`}>
                            {apt.status}
                          </span>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-12">
                    <CalendarIcon className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                    <p className="text-neutral-500 dark:text-neutral-400">
                      No appointments scheduled this month
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ClinicAdminLayout>
  );
}