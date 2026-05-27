import { Menu, LogOut, Bell, User, ChevronDown, Check, Search, Settings, Sun, Moon } from "lucide-react";
import { useState } from "react";

interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read?: boolean;
  type?: string;
}

interface ClinicAdminHeaderProps {
  onToggleSidebar: () => void;
  onLogout?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToNotifications?: () => void;
  unreadNotificationsCount?: number;
  notifications?: Notification[];
  onMarkNotificationRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  isSidebarCollapsed?: boolean;
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
  mode?: "light" | "dark";
  onModeChange?: (mode: "light" | "dark") => void;
}

export function ClinicAdminHeader({
  onToggleSidebar,
  onLogout,
  onNavigateToProfile,
  unreadNotificationsCount = 0,
  notifications = [],
  onMarkNotificationRead,
  onMarkAllRead,
  isSidebarCollapsed = false,
  currentTheme = "ocean",
  onThemeChange,
  mode = "light",
  onModeChange,
}: ClinicAdminHeaderProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAppearancePanel, setShowAppearancePanel] = useState(false);
  const [menuLayout, setMenuLayout] = useState<"vertical" | "horizontal">("vertical");
  const [language, setLanguage] = useState("English");

  const colorThemes = [
    { id: "black", label: "Default Black", swatch: "bg-neutral-900" },
    { id: "ocean", label: "Ocean Blue", swatch: "bg-[#1766C2]" },
    { id: "emerald", label: "Emerald Green", swatch: "bg-emerald-500" },
    { id: "violet", label: "Violet Purple", swatch: "bg-violet-500" },
    { id: "amber", label: "Amber Orange", swatch: "bg-amber-500" },
  ];

  const formatTime = (ts: string) => {
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <header className="sticky top-0 h-12 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 z-30">
      <div className="flex items-center justify-between h-full px-6 gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <button
            onClick={onToggleSidebar}
            className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          </button>
          {isSidebarCollapsed && (
            <div className="hidden md:block text-sm font-semibold text-neutral-900 dark:text-white whitespace-nowrap">
              SpineCloudIQ
            </div>
          )}
          <div className="relative flex-1 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-neutral-500 dark:text-neutral-400" />
            <input
              type="text"
              placeholder="Search clinic admin..."
              className="w-full h-9 pl-10 pr-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
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
                setShowAppearancePanel(false);
              }}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-error-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl overflow-hidden z-20">
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

          {/* Appearance Settings */}
          <div className="relative">
            <button
              onClick={() => {
                setShowAppearancePanel(!showAppearancePanel);
                setShowNotifications(false);
                setShowProfileDropdown(false);
              }}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                showAppearancePanel
                  ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
              title="Appearance settings"
              aria-label="Appearance settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {showAppearancePanel && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowAppearancePanel(false)} />
                <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl overflow-hidden z-20">
                  <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Appearance</h3>
                  </div>

                  <div className="px-4 py-4 border-b border-neutral-200 dark:border-neutral-800">
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-3">
                      Color Theme
                    </p>
                    <div className="space-y-1">
                      {colorThemes.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => onThemeChange?.(theme.id)}
                          className="w-full flex items-center justify-between gap-3 px-2 py-2 rounded-lg text-left text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                        >
                          <span className="flex items-center gap-3 min-w-0">
                            <span className={`w-3.5 h-3.5 rounded-full shrink-0 ${theme.swatch}`} />
                            <span className="text-sm truncate">{theme.label}</span>
                          </span>
                          {currentTheme === theme.id && (
                            <Check className="w-4 h-4 text-neutral-900 dark:text-white shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="px-4 py-4 border-b border-neutral-200 dark:border-neutral-800">
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-3">
                      Mode
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onModeChange?.("light")}
                        className={`h-10 rounded-lg border text-sm flex items-center justify-center gap-2 transition-colors ${
                          mode === "light"
                            ? "bg-neutral-200 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
                            : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                        }`}
                      >
                        <Sun className="w-4 h-4" />
                        Light
                      </button>
                      <button
                        onClick={() => onModeChange?.("dark")}
                        className={`h-10 rounded-lg border text-sm flex items-center justify-center gap-2 transition-colors ${
                          mode === "dark"
                            ? "bg-neutral-200 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
                            : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                        }`}
                      >
                        <Moon className="w-4 h-4" />
                        Dark
                      </button>
                    </div>
                  </div>

                  <div className="px-4 py-4 border-b border-neutral-200 dark:border-neutral-800">
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-3">
                      Menu Layout
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {(["vertical", "horizontal"] as const).map((layout) => (
                        <button
                          key={layout}
                          onClick={() => setMenuLayout(layout)}
                          className={`h-10 rounded-lg border text-sm capitalize transition-colors ${
                            menuLayout === layout
                              ? "bg-neutral-200 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
                              : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                          }`}
                        >
                          {layout}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-3">
                      Language
                    </p>
                    <select
                      value={language}
                      onChange={(event) => setLanguage(event.target.value)}
                      className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10"
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
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
                setShowAppearancePanel(false);
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
                        <p className="text-sm font-medium text-neutral-900 dark:text-white mb-0.5">Admin User</p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1 truncate">admin@clinic.com</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-500">Clinic Admin</p>
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
                      className="w-full px-3 py-2 text-left text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-950 rounded transition-colors flex items-center gap-2"
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
