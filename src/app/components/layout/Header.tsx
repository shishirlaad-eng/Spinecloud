import { Menu, Bell, User, ChevronDown, LogOut, Calendar, DollarSign, FileText, ArrowRight } from "lucide-react";
import { useState } from "react";
import logo from "../../../assets/spinecloud-logo.png";

interface Notification {
  id: string;
  type: "reminder" | "alert" | "message" | "action";
  category: "appointment" | "payment" | "document" | "general";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

interface HeaderProps {
  onToggleSidebar: () => void;
  onLogout?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToNotifications?: () => void;
  onViewNotification?: (notificationId: string) => void;
  notifications?: Notification[];
}

export function Header({ 
  onToggleSidebar, 
  onLogout, 
  onNavigateToProfile,
  onNavigateToNotifications,
  onViewNotification,
  notifications = []
}: HeaderProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const recentNotifications = notifications.slice(0, 5);

  const getIconByCategory = (category: string) => {
    switch (category) {
      case "appointment":
        return <Calendar className="w-4 h-4" />;
      case "payment":
        return <DollarSign className="w-4 h-4" />;
      case "document":
        return <FileText className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getIconColorByType = (type: string) => {
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
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 z-50">
      <div className="h-full flex items-center justify-between px-4 gap-4">
        {/* Left: Menu Toggle + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
            <img src={logo} alt="SpineCloud IQ" className="h-10 w-auto object-contain" />
        </div>

        {/* Right: Notifications + Profile */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 size-2 bg-destructive rounded-full" />
            )}
          </button>
          
          {/* Notifications Dropdown */}
          {showNotificationsDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowNotificationsDropdown(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl overflow-hidden z-20">
                {/* Header */}
                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Notifications
                    </h2>
                    {unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center px-2 py-0.5 bg-primary-600 text-white rounded-full text-xs font-medium">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Notifications List */}
                {recentNotifications.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto">
                    {recentNotifications.map((notification) => (
                      <button
                        key={notification.id}
                        onClick={() => {
                          setShowNotificationsDropdown(false);
                          onViewNotification?.(notification.id);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors border-b border-neutral-200 dark:border-neutral-800 last:border-b-0 ${
                          !notification.isRead ? "bg-primary-50/30 dark:bg-primary-950/10" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getIconColorByType(notification.type)}`}>
                            {getIconByCategory(notification.category)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <p className={`text-sm font-medium ${!notification.isRead ? "text-neutral-900 dark:text-white" : "text-neutral-700 dark:text-neutral-300"}`}>
                                {notification.title}
                              </p>
                              {!notification.isRead && (
                                <span className="size-2 bg-primary-600 rounded-full shrink-0 mt-1.5" />
                              )}
                            </div>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-500">
                              {formatTimestamp(notification.timestamp)}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Bell className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      No notifications
                    </p>
                  </div>
                )}

              </div>
            </>
          )}
          
          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="h-9 px-2 flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <div className="w-7 h-7 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                <User className="w-4 h-4" />
              </div>
              <ChevronDown className="w-3.5 h-3.5 hidden lg:inline" />
            </button>

            {/* Dropdown Menu */}
            {showProfileDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowProfileDropdown(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl overflow-hidden z-20">
                  {/* User Info */}
                  <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                        <User className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white mb-0.5">
                          John Doe
                        </p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1 truncate">
                          john.doe@example.com
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-500">
                          Patient
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-1">
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        onNavigateToProfile?.();
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded transition-colors flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="p-1 border-t border-neutral-200 dark:border-neutral-800">
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        onLogout?.();
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-destructive hover:bg-error-50 dark:hover:bg-error-950 rounded transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}