import { DashboardLayout } from "@/app/components/layout/DashboardLayout";
import { Calendar, Clock, CheckCircle, Circle, XCircle, ChevronRight } from "lucide-react";

interface Session {
  id: string;
  date: string;
  time: string;
  status: "Completed" | "Upcoming" | "Cancelled";
  provider: string;
  clinic: string;
}

interface CarePlan {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  frequency: string;
  totalSessions: number;
  completedSessions: number;
  sessions: Session[];
}

interface CareTimelineScreenProps {
  carePlans: CarePlan[];
  onNavigate: (menu: "dashboard" | "appointments" | "careHistory") => void;
  onViewSession: (sessionId: string) => void;
  onLogout?: () => void;
}

export function CareTimelineScreen({
  carePlans,
  onNavigate,
  onViewSession,
  onLogout,
}: CareTimelineScreenProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-5 h-5 text-success-600 dark:text-success-400" />;
      case "Cancelled":
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Circle className="w-5 h-5 text-neutral-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-success-50 dark:bg-success-950/30 text-success-700 dark:text-success-400";
      case "Cancelled":
        return "bg-destructive/10 dark:bg-destructive/20 text-destructive";
      default:
        return "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400";
    }
  };

  return (
    <DashboardLayout activeMenu="dashboard" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-5 md:p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-neutral-900 dark:text-white mb-1">
              Visit & care history
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              View your treatment plans and session history
            </p>
          </div>

          {/* Care Plans */}
          {carePlans.length > 0 ? (
            <div className="space-y-6">
              {carePlans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden"
                >
                  {/* Plan Header */}
                  <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
                          {plan.title}
                        </h2>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Frequency
                        </p>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          {plan.frequency}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Progress
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {plan.completedSessions} of {plan.totalSessions} sessions completed
                        </p>
                      </div>
                      <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-600 dark:bg-primary-500 transition-all"
                          style={{
                            width: `${(plan.completedSessions / plan.totalSessions) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sessions Timeline */}
                  <div className="p-6">
                    <div className="space-y-3">
                      {plan.sessions.map((session, index) => (
                        <button
                          key={session.id}
                          onClick={() => session.status === "Completed" && onViewSession(session.id)}
                          disabled={session.status !== "Completed"}
                          className={`w-full flex items-center gap-4 p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg transition-all group ${
                            session.status === "Completed"
                              ? "hover:border-primary-500 dark:hover:border-primary-600 hover:shadow-md cursor-pointer"
                              : "cursor-not-allowed opacity-75"
                          }`}
                        >
                          {/* Timeline Connector */}
                          <div className="relative flex flex-col items-center">
                            {getStatusIcon(session.status)}
                            {index < plan.sessions.length - 1 && (
                              <div className="absolute top-7 w-0.5 h-8 bg-neutral-200 dark:bg-neutral-700" />
                            )}
                          </div>

                          {/* Session Info */}
                          <div className="flex-1 text-left min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-neutral-400" />
                                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                  {formatDate(session.date)}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-neutral-400" />
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                  {session.time}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                              <span>{session.provider}</span>
                              <span>•</span>
                              <span>{session.clinic}</span>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-md text-sm ${getStatusColor(session.status)}`}>
                              {session.status}
                            </span>
                            {session.status === "Completed" && (
                              <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-neutral-400" />
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                No care history found
              </p>
              <button
                onClick={() => onNavigate("appointments")}
                className="px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium"
              >
                Book your first appointment
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}