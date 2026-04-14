import { DashboardLayout } from "@/app/components/layout/DashboardLayout";
import { ArrowLeft, Calendar, DollarSign, FileText, Bell, Download, CheckCircle, ExternalLink } from "lucide-react";

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: string;
}

interface NotificationDetail {
  id: string;
  type: "reminder" | "alert" | "message" | "action";
  category: "appointment" | "payment" | "document" | "general";
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

interface NotificationDetailScreenProps {
  notification: NotificationDetail;
  onNavigate: (menu: "dashboard" | "appointments" | "invoices" | "notifications" | "settings") => void;
  onBack: () => void;
  onMarkAsRead?: (notificationId: string) => void;
  onTakeAction?: (actionUrl: string) => void;
  onLogout?: () => void;
}

export function NotificationDetailScreen({
  notification,
  onNavigate,
  onBack,
  onMarkAsRead,
  onTakeAction,
  onLogout,
}: NotificationDetailScreenProps) {
  const getIconByCategory = (category: string) => {
    switch (category) {
      case "appointment":
        return <Calendar className="w-6 h-6" />;
      case "payment":
        return <DollarSign className="w-6 h-6" />;
      case "document":
        return <FileText className="w-6 h-6" />;
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

  const handleMarkAsRead = () => {
    if (onMarkAsRead && !notification.isRead) {
      onMarkAsRead(notification.id);
    }
  };

  const handleAction = () => {
    if (onTakeAction && notification.actionUrl) {
      onTakeAction(notification.actionUrl);
    }
  };

  return (
    <DashboardLayout activeMenu="notifications" onNavigate={onNavigate} onLogout={onLogout}>
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back to notifications
      </button>

      {/* Notification Card */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${getIconColorByType(notification.type, notification.priority)}`}>
              {getIconByCategory(notification.category)}
            </div>

            {/* Title and Timestamp */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  {notification.title}
                </h1>
                {!notification.isRead && (
                  <button
                    onClick={handleMarkAsRead}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-950/50 transition-colors text-sm font-medium"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as read
                  </button>
                )}
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {formatTimestamp(notification.timestamp)}
              </p>

              {/* Type Badge */}
              <div className="mt-3 flex items-center gap-2">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                  notification.priority === "high"
                    ? "bg-destructive-50 dark:bg-destructive-950/30 text-destructive"
                    : notification.type === "alert"
                    ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300"
                    : notification.type === "reminder"
                    ? "bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300"
                    : notification.type === "action"
                    ? "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                }`}>
                  {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-md text-xs font-medium">
                  {notification.category.charAt(0).toUpperCase() + notification.category.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Brief Message */}
          <div className="mb-6">
            <p className="text-sm text-neutral-700 dark:text-neutral-300 font-medium mb-2">
              {notification.message}
            </p>
          </div>

          {/* Full Content */}
          <div className="mb-6">
            <div className="prose prose-sm max-w-none text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-wrap">
              {notification.fullContent}
            </div>
          </div>

          {/* Related Information */}
          {notification.relatedInfo && notification.relatedInfo.length > 0 && (
            <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-lg">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                Related information
              </h3>
              <div className="space-y-2">
                {notification.relatedInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400 font-medium min-w-[120px]">
                      {info.label}:
                    </span>
                    <span className="text-sm text-neutral-900 dark:text-white">
                      {info.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attachments */}
          {notification.attachments && notification.attachments.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                Attachments
              </h3>
              <div className="space-y-2">
                {notification.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          {attachment.name}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {attachment.type} • {attachment.size}
                        </p>
                      </div>
                    </div>
                    <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm font-medium">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          {notification.isActionable && notification.actionLabel && (
            <div className="flex items-center gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <button
                onClick={handleAction}
                className="inline-flex items-center gap-2 h-10 px-6 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm"
              >
                {notification.actionLabel}
                <ExternalLink className="w-4 h-4" />
              </button>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Action required to complete this notification
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}