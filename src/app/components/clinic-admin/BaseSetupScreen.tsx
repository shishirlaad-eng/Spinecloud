import { ReactNode } from "react";
import { Building2, UserCheck, Settings, ClipboardList, FileText, Shield, Users, Check, AlertCircle } from "lucide-react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";

interface BaseSetupScreenProps {
  branches: any[];
  providers: any[];
  services: any[];
  questionnaires: any[];
  consentForms: any[];
  roles: any[];
  users: any[];
  onNavigate: (menu: string) => void;
  onLogout?: () => void;
}

export function BaseSetupScreen({
  branches,
  providers,
  services,
  questionnaires,
  consentForms,
  roles,
  users,
  onNavigate,
  onLogout,
}: BaseSetupScreenProps) {
  // Check completion states
  const steps = [
    {
      id: "branches",
      title: "Clinic & Branches",
      description: branches.length > 0 ? `${branches.length} branch(es) configured` : "No branches configured yet",
      isComplete: branches.length > 0,
      icon: Building2,
      color: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30",
    },
    {
      id: "providers",
      title: "Providers",
      description: providers.length > 0 ? `${providers.length} provider(s) active` : "No providers added yet",
      isComplete: providers.length > 0,
      icon: UserCheck,
      color: "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30",
    },
    {
      id: "services",
      title: "Services",
      description: services.length > 0 ? `${services.length} service(s) configured` : "No services added yet",
      isComplete: services.length > 0,
      icon: Settings,
      color: "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30",
    },
    {
      id: "questionnaires",
      title: "Patient Forms",
      description: questionnaires.length > 0 ? `${questionnaires.length} intake form(s) created` : "No forms created yet",
      isComplete: questionnaires.length > 0,
      icon: ClipboardList,
      color: "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30",
    },
    {
      id: "consentForms",
      title: "Agreements",
      description: consentForms.length > 0 ? `${consentForms.length} agreement(s) configured` : "No agreements added yet",
      isComplete: consentForms.length > 0,
      icon: FileText,
      color: "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30",
    },
    {
      id: "roles",
      title: "Roles & Permissions",
      description: roles.length > 0 ? `${roles.length} role(s) defined` : "Default roles only",
      isComplete: roles.length > 0,
      icon: Shield,
      color: "bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400 border-violet-100 dark:border-violet-900/30",
    },
    {
      id: "users",
      title: "Users & Invitations",
      description: users.length > 0 ? `${users.length} user(s) invited` : "No users invited yet",
      isComplete: false, // Always show as pending
      icon: Users,
      color: "bg-cyan-50 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400 border-cyan-100 dark:border-cyan-900/30",
    },
  ];

  const completedCount = steps.filter((s) => s.isComplete).length;
  const percentage = Math.round((completedCount / steps.length) * 100);

  return (
    <ClinicAdminLayout activeMenu="baseSetup" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        
        {/* Welcome Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
          {/* Clinic SVG Illustration */}
          <div className="w-48 h-36 shrink-0 flex items-center justify-center bg-primary-50/50 dark:bg-primary-950/10 rounded-2xl p-4">
            <svg viewBox="0 0 200 150" className="w-full h-full text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {/* Ground */}
              <line x1="10" y1="130" x2="190" y2="130" stroke="currentColor" strokeWidth="3" />
              {/* Back Trees */}
              <circle cx="35" cy="95" r="15" fill="currentColor" fillOpacity="0.1" />
              <line x1="35" y1="110" x2="35" y2="130" />
              <circle cx="165" cy="90" r="20" fill="currentColor" fillOpacity="0.1" />
              <line x1="165" y1="110" x2="165" y2="130" />
              {/* Main Building Structure */}
              <rect x="50" y="50" width="100" height="80" rx="4" fill="white" className="dark:fill-neutral-900" />
              <rect x="50" y="50" width="100" height="80" rx="4" />
              {/* Roof Top Sign Structure */}
              <polygon points="45,50 155,50 145,35 55,35" fill="currentColor" fillOpacity="0.1" />
              <polygon points="45,50 155,50 145,35 55,35" />
              {/* Cross symbol */}
              <path d="M95,15 L105,15 M100,10 L100,20" stroke="currentColor" strokeWidth="3" />
              {/* Windows */}
              <rect x="65" y="70" width="20" height="20" rx="2" />
              <line x1="75" y1="70" x2="75" y2="90" />
              <line x1="65" y1="80" x2="85" y2="80" />

              <rect x="115" y="70" width="20" height="20" rx="2" />
              <line x1="125" y1="70" x2="125" y2="90" />
              <line x1="115" y1="80" x2="135" y2="80" />
              {/* Double Door */}
              <rect x="88" y="100" width="24" height="30" rx="2" fill="currentColor" fillOpacity="0.1" />
              <rect x="88" y="100" width="24" height="30" rx="2" />
              <line x1="100" y1="100" x2="100" y2="130" />
              <circle cx="96" cy="115" r="1" fill="currentColor" />
              <circle cx="104" cy="115" r="1" fill="currentColor" />
            </svg>
          </div>

          {/* Welcome Text Section */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white flex items-center justify-center md:justify-start gap-2">
              Welcome to SpineCloudIQ! 🎉
            </h2>
            <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 mt-2">
              Let's get your clinic set up so you can start managing appointments, providers, services, and your patients with ease.
            </p>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
          <div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Clinic Setup Progress</h3>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                {completedCount} of {steps.length} completed
              </span>
            </div>
            {/* Horizontal progress bar */}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex-1 h-3 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-600 dark:bg-primary-500 transition-all duration-500 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">{percentage}%</span>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  onClick={() => onNavigate(step.id)}
                  className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-primary-400 dark:hover:border-primary-500 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[145px]"
                >
                  <div className="space-y-3">
                    {/* Icon container */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${step.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {step.title}
                      </h4>
                      <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 line-clamp-1">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center">
                    {step.isComplete ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                        Complete
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-warning-500 dark:text-warning-400">
                        <span className="w-2 h-2 rounded-full bg-warning-500 animate-pulse" />
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500 pt-4 border-t border-neutral-100 dark:border-neutral-800/60">
            <AlertCircle className="w-4 h-4 text-neutral-400" />
            <span>You can return to setup anytime from the Base Setup section.</span>
          </div>
        </div>

      </div>
    </ClinicAdminLayout>
  );
}
