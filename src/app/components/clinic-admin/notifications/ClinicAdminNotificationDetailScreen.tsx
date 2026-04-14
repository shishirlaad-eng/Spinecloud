import { ClinicAdminLayout } from "@/app/components/clinic-admin/layout/ClinicAdminLayout";
import { ArrowLeft, Calendar, DollarSign, FileText, Bell, Download, CheckCircle, ExternalLink, Users, Building2, AlertCircle } from "lucide-react";

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: string;
}

interface NotificationDetail {
  id: string;
  type: "reminder" | "alert" | "message" | "action";
  category: "appointment" | "payment" | "system" | "user" | "branch" | "general";
  title: string;
  message: string;
  fullContent: string;
  timestamp: string;
  isRead: boolean;
  isActionable: boolean;
  actionLabel?: string;
  actionUrl?: string;
  priority?: "high" | "normal" | "low";
  attachments?: Attachment[];
  relatedInfo?: {
    label: string;
    value: string;
  }[];
}

interface ClinicAdminNotificationDetailScreenProps {
  notification: NotificationDetail;
  onNavigate: (menu: "dashboard" | "branches" | "questionnaires" | "roles" | "users" | "providers" | "consentForms" | "patients" | "master" | "subscription" | "calendar" | "appointment-categories" | "invoices" | "payments" | "reports") => void;
  onBack: () => void;
  onMarkAsRead?: (notificationId: string) => void;
  onTakeAction?: (actionUrl: string) => void;
  onLogout?: () => void;
}

export function ClinicAdminNotificationDetailScreen({
  notification,
  onNavigate,
  onBack,
  onMarkAsRead,
  onTakeAction,
  onLogout,
}: ClinicAdminNotificationDetailScreenProps) {
  const getIconByCategory = (category: string) => {
    switch (category) {
      case "appointment":
        return <Calendar className="w-6 h-6" />;
      case "payment":
        return <DollarSign className="w-6 h-6" />;
      case "user":
        return <Users className="w-6 h-6" />;
      case "branch":
        return <Building2 className="w-6 h-6" />;
      case "system":
        return <AlertCircle className="w-6 h-6" />;
      default:
        return <Bell className="w-6 h-6" />;
    }
  };

  const getIconColorByType = (type: string, priority?: string) => {
    if (priority === "high") {
      return "bg-destructive-50 text-destructive dark:bg-destructive-950/30 dark:text-destructive";
    }
    switch (type) {
      case "alert":
        return "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400";
      case "reminder":
        return "bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400";
      case "action":
        return "bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400";
      default:
        return "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Mark as read when viewing
  if (!notification.isRead && onMarkAsRead) {
    onMarkAsRead(notification.id);
  }

  return (
    <ClinicAdminLayout activeMenu="dashboard" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to notifications
        </button>

        <div className="max-w-3xl">
          {/* Notification Card */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getIconColorByType(
                    notification.type,
                    notification.priority
                  )}`}
                >
                  {getIconByCategory(notification.category)}
                </div>

                {/* Title and Metadata */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                    {notification.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                    <span>{formatTimestamp(notification.timestamp)}</span>
                    <span>•</span>
                    <span className="capitalize">{notification.category}</span>
                    {notification.priority === "high" && (
                      <>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 text-destructive">
                          <AlertCircle className="w-4 h-4" />
                          High priority
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                {notification.isRead ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Read</span>
                  </div>
                ) : (
                  <div className="px-3 py-1.5 bg-primary-100 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400 rounded-lg text-sm font-medium">
                    New
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Short Message */}
              <div>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 font-medium mb-2">
                  {notification.message}
                </p>
              </div>

              {/* Full Content */}
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-line">
                  {notification.fullContent}
                </p>
              </div>

              {/* Related Information */}
              {notification.relatedInfo && notification.relatedInfo.length > 0 && (
                <div className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                    Related information
                  </h3>
                  <dl className="space-y-2">
                    {notification.relatedInfo.map((info, index) => (
                      <div key={index} className="flex items-start justify-between gap-4">
                        <dt className="text-sm text-neutral-600 dark:text-neutral-400">
                          {info.label}
                        </dt>
                        <dd className="text-sm font-medium text-neutral-900 dark:text-white text-right">
                          {info.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Attachments */}
              {notification.attachments && notification.attachments.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                    Attachments
                  </h3>
                  <div className="space-y-2">
                    {notification.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-neutral-400" />
                          <div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">
                              {attachment.name}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              {attachment.type} • {attachment.size}
                            </p>
                          </div>
                        </div>
                        <button className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                          <Download className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              {notification.isActionable && notification.actionLabel && notification.actionUrl && (
                <div className="pt-4">
                  <button
                    onClick={() => onTakeAction && onTakeAction(notification.actionUrl!)}
                    className="inline-flex items-center gap-2 px-6 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
                  >
                    {notification.actionLabel}
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ClinicAdminLayout>
  );
}
