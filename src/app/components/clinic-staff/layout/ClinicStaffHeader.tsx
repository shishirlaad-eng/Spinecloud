import { Building2, LogOut, Bell, User, ChevronDown } from "lucide-react";
import { useState } from "react";

interface ClinicStaffHeaderProps {
  onLogout?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToNotifications?: () => void;
  unreadNotificationsCount?: number;
}

export function ClinicStaffHeader({ onLogout, onNavigateToProfile, onNavigateToNotifications, unreadNotificationsCount = 0 }: ClinicStaffHeaderProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  return (
    <header className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 h-16 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <Building2 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        <div>
          <h1 className="text-sm font-semibold text-neutral-900 dark:text-white">
            SpineCloudIQ
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Clinic Staff Portal
          </p>
        </div>
      </div>

      {/* Right: Notifications + Profile */}
      <div className="flex items-center gap-2">
        {/* Notifications Bell */}
        <button
          onClick={() => onNavigateToNotifications?.()}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative"
        >
          <Bell className="w-5 h-5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-xs font-medium rounded-full flex items-center justify-center">
              {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
            </span>
          )}
        </button>

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
                        Staff User
                      </p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1 truncate">
                        staff@clinic.com
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-500">
                        Clinic Staff
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
                    <span>My profile</span>
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
    </header>
  );
}