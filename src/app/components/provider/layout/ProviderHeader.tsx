import { Menu, LogOut, User, Bell, ChevronDown, Check } from "lucide-react";
import { useState } from "react";
import logo from "../../../../assets/spinecloud-logo.png";

interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read?: boolean;
  type?: string;
}

interface ProviderHeaderProps {
  onToggleSidebar: () => void;
  onLogout?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToNotifications?: () => void;
  unreadNotificationsCount?: number;
  notifications?: Notification[];
  onMarkNotificationRead?: (id: string) => void;
  onMarkAllRead?: () => void;
}

export function ProviderHeader({
  onToggleSidebar,
  onLogout,
  onNavigateToProfile,
  unreadNotificationsCount = 0,
  notifications = [],
  onMarkNotificationRead,
  onMarkAllRead,
}: ProviderHeaderProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const formatTime = (ts: string) => {
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 z-50">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          </button>
          <div className="flex items-center gap-3">
            <img src={logo} alt="SpineCloud IQ" className="h-12 w-auto object-contain" />
          </div>
        </div>

        {/* Right: Notifications + Profile */}
        <div className="flex items-center gap-2">
          {/* Notifications Bell with Popover */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileDropdown(false);
              }}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-20">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Notifications</h3>
                    {unreadNotificationsCount > 0 && (
                      <button
                        onClick={onMarkAllRead}
                        className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center">
                        <Bell className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                        <p className="text-sm text-neutral-500">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.slice(0, 10).map((n) => (
                        <button
                          key={n.id}
                          onClick={() => onMarkNotificationRead?.(n.id)}
                          className={`w-full text-left px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors ${!n.read ? "bg-primary-50/40 dark:bg-primary-950/20" : ""}`}
                        >
                          <p className={`text-sm leading-relaxed ${!n.read ? "font-semibold text-neutral-900 dark:text-white" : "font-normal text-neutral-700 dark:text-neutral-300"}`}>
                            {n.message}
                          </p>
                          <p className="text-xs text-neutral-400 mt-0.5">{formatTime(n.timestamp)}</p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileDropdown(!showProfileDropdown);
                setShowNotifications(false);
              }}
              className="h-9 px-2 flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <div className="w-7 h-7 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                <User className="w-4 h-4" />
              </div>
              <ChevronDown className="w-3.5 h-3.5 hidden lg:inline" />
            </button>

            {showProfileDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowProfileDropdown(false)} />
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl overflow-hidden z-20">
                  <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                        <User className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white mb-0.5">Dr. Provider</p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1 truncate">provider@clinic.com</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-500">Provider</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => { setShowProfileDropdown(false); onNavigateToProfile?.(); }}
                      className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded transition-colors flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      <span>My profile</span>
                    </button>
                  </div>
                  <div className="p-1 border-t border-neutral-200 dark:border-neutral-800">
                    <button
                      onClick={() => { setShowProfileDropdown(false); onLogout?.(); }}
                      className="w-full px-3 py-2 text-left text-sm text-destructive hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors flex items-center gap-2"
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