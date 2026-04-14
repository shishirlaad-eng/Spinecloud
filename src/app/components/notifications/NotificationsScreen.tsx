import { DashboardLayout } from "@/app/components/layout/DashboardLayout";
import { Search, Filter, X, Bell, Calendar, AlertCircle, CheckCircle, FileText, DollarSign, Clock } from "lucide-react";
import { useState } from "react";

interface Notification {
  id: string;
  type: "reminder" | "alert" | "message" | "action";
  category: "appointment" | "payment" | "document" | "general";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  isActionable: boolean;
  actionLabel?: string;
  priority?: "high" | "normal" | "low";
}

interface NotificationsScreenProps {
  notifications: Notification[];
  onNavigate: (menu: "dashboard" | "appointments" | "invoices" | "notifications" | "settings") => void;
  onViewNotification: (notificationId: string) => void;
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  onLogout?: () => void;
}

export function NotificationsScreen({
  notifications,
  onNavigate,
  onViewNotification,
  onMarkAsRead,
  onMarkAllAsRead,
  onLogout,
}: NotificationsScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState<"all" | "reminder" | "alert" | "message" | "action">("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "appointment" | "payment" | "document" | "general">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "read" | "unread">("all");

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      searchQuery === "" ||
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === "all" || notification.type === typeFilter;
    const matchesCategory = categoryFilter === "all" || notification.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "read" && notification.isRead) ||
      (statusFilter === "unread" && !notification.isRead);

    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });

  // Sort: unread first, then by timestamp
  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    if (a.isRead !== b.isRead) {
      return a.isRead ? 1 : -1;
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const activeFilterCount =
    (typeFilter !== "all" ? 1 : 0) +
    (categoryFilter !== "all" ? 1 : 0) +
    (statusFilter !== "all" ? 1 : 0);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIconByCategory = (category: string) => {
    switch (category) {
      case "appointment":
        return <Calendar className="w-5 h-5" />;
      case "payment":
        return <DollarSign className="w-5 h-5" />;
      case "document":
        return <FileText className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getIconColorByType = (type: string, priority?: string) => {
    if (priority === "high") {
      return "bg-destructive-50 text-destructive";
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
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

  return (
    <DashboardLayout activeMenu="notifications" onNavigate={onNavigate} onLogout={onLogout}>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-white mb-1">
            Notifications
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && onMarkAllAsRead && (
          <button
            onClick={onMarkAllAsRead}
            className="inline-flex items-center gap-2 h-10 px-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
          >
            <CheckCircle className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
          />
        </div>

        {/* Filter Button */}
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 h-10 px-4 border rounded-lg font-medium transition-colors text-sm ${
              activeFilterCount > 0
                ? "bg-primary-50 dark:bg-primary-950/30 border-primary-600 text-primary-700 dark:text-primary-300"
                : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-600 dark:bg-primary-500 text-white text-xs">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Filter Dropdown */}
          {showFilters && (
            <div className="absolute right-0 top-12 w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg z-10">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Filters
                  </h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Type Filter */}
                  <div>
                    <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                      Type
                    </label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value as any)}
                      className="w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                    >
                      <option value="all">All types</option>
                      <option value="reminder">Reminder</option>
                      <option value="alert">Alert</option>
                      <option value="message">Message</option>
                      <option value="action">Action required</option>
                    </select>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                      Category
                    </label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value as any)}
                      className="w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                    >
                      <option value="all">All categories</option>
                      <option value="appointment">Appointment</option>
                      <option value="payment">Payment</option>
                      <option value="document">Document</option>
                      <option value="general">General</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                    >
                      <option value="all">All</option>
                      <option value="unread">Unread</option>
                      <option value="read">Read</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                  <button
                    onClick={() => {
                      setTypeFilter("all");
                      setCategoryFilter("all");
                      setStatusFilter("all");
                    }}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {sortedNotifications.length > 0 ? (
        <div className="space-y-3">
          {sortedNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white dark:bg-neutral-900 border rounded-lg p-4 transition-all cursor-pointer hover:shadow-sm ${
                !notification.isRead
                  ? "border-primary-200 dark:border-primary-800 bg-primary-50/30 dark:bg-primary-950/10"
                  : "border-neutral-200 dark:border-neutral-800"
              }`}
              onClick={() => onViewNotification(notification.id)}
            >
              <div className="flex gap-4">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${getIconColorByType(notification.type, notification.priority)}`}>
                  {getIconByCategory(notification.category)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className={`text-sm font-medium ${!notification.isRead ? "text-neutral-900 dark:text-white" : "text-neutral-700 dark:text-neutral-300"}`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                      {!notification.isRead && (
                        <span className="size-2 bg-primary-600 rounded-full" />
                      )}
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-2">
                    {notification.message}
                  </p>

                  {/* Action Badge */}
                  {notification.isActionable && notification.actionLabel && (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 rounded-md text-xs font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {notification.actionLabel}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-neutral-400" />
          </div>
          <p className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
            No notifications found
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {searchQuery || activeFilterCount > 0
              ? "Try adjusting your search or filters"
              : "You're all caught up! No new notifications"}
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}