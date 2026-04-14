import { ProviderLayout } from "@/app/components/provider/layout/ProviderLayout";
import { Search, Filter, X, Bell, Calendar, AlertCircle, FileText, Users, Clock } from "lucide-react";
import { useState } from "react";

interface Notification {
  id: string;
  type: "reminder" | "alert" | "message" | "action";
  category: "appointment" | "patient" | "document" | "system" | "general";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  isActionable: boolean;
  actionLabel?: string;
  priority?: "high" | "normal" | "low";
}

interface ProviderNotificationsScreenProps {
  notifications: Notification[];
  onNavigate: (menu: "dashboard" | "calendar" | "patients") => void;
  onViewNotification: (notificationId: string) => void;
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  onLogout?: () => void;
}

export function ProviderNotificationsScreen({
  notifications,
  onNavigate,
  onViewNotification,
  onMarkAsRead,
  onMarkAllAsRead,
  onLogout,
}: ProviderNotificationsScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState<"all" | "reminder" | "alert" | "message" | "action">("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "appointment" | "patient" | "document" | "system" | "general">("all");
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
      case "patient":
        return <Users className="w-5 h-5" />;
      case "document":
        return <FileText className="w-5 h-5" />;
      case "system":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
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
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return diffInMinutes < 1 ? "Just now" : `${diffInMinutes}m ago`;
    }
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    if (diffInHours < 48) {
      return "Yesterday";
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleClearFilters = () => {
    setTypeFilter("all");
    setCategoryFilter("all");
    setStatusFilter("all");
  };

  return (
    <ProviderLayout activeMenu="dashboard" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up"}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
            />
          </div>

          {/* Filter Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-4 h-9 border rounded-lg text-sm font-medium transition-colors ${
                showFilters || activeFilterCount > 0
                  ? "bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-950/30 dark:border-primary-800 dark:text-primary-400"
                  : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="px-1.5 py-0.5 bg-primary-600 text-white text-xs rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {activeFilterCount > 0 && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 font-medium transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 space-y-4">
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {["all", "reminder", "alert", "message", "action"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setTypeFilter(type as any)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        typeFilter === type
                          ? "bg-primary-600 text-white"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {["all", "appointment", "patient", "document", "system", "general"].map((category) => (
                    <button
                      key={category}
                      onClick={() => setCategoryFilter(category as any)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        categoryFilter === category
                          ? "bg-primary-600 text-white"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {["all", "unread", "read"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status as any)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        statusFilter === status
                          ? "bg-primary-600 text-white"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          {sortedNotifications.length === 0 ? (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-12 text-center">
              <Bell className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {searchQuery || activeFilterCount > 0
                  ? "No notifications match your search or filters"
                  : "No notifications yet"}
              </p>
            </div>
          ) : (
            sortedNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => {
                  if (!notification.isRead && onMarkAsRead) {
                    onMarkAsRead(notification.id);
                  }
                  onViewNotification(notification.id);
                }}
                className={`bg-white dark:bg-neutral-900 border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
                  notification.isRead
                    ? "border-neutral-200 dark:border-neutral-800"
                    : "border-primary-200 bg-primary-50/30 dark:border-primary-800 dark:bg-primary-950/20"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconColorByType(
                      notification.type,
                      notification.priority
                    )}`}
                  >
                    {getIconByCategory(notification.category)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3
                        className={`text-sm font-medium ${
                          notification.isRead
                            ? "text-neutral-700 dark:text-neutral-300"
                            : "text-neutral-900 dark:text-white"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                      {notification.message}
                    </p>
                    {notification.isActionable && notification.actionLabel && (
                      <div className="mt-2">
                        <span className="inline-flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 font-medium">
                          {notification.actionLabel}
                          <span>→</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Unread Indicator */}
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-1.5" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </ProviderLayout>
  );
}
