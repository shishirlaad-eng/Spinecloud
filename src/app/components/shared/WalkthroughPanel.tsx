import { useState, useEffect } from "react";
import { CheckCircle2, X, ChevronRight, Building2, Users, FileText, FileSignature, Stethoscope, ListChecks } from "lucide-react";
import { getCompletedSteps, getStepLabel } from "./walkthroughUtils";

interface WalkthroughPanelProps {
  onNavigate: (menu: any) => void;
  activeMenu?: string;
}

const STEPS = [
  { id: "branches", title: "Add your first branch", desc: "Set up your clinic locations", icon: <Building2 className="w-4 h-4" />, route: "branches" },
  { id: "roles", title: "Configure user roles", desc: "Define permissions for staff", icon: <Users className="w-4 h-4" />, route: "roles" },
  { id: "providers", title: "Add providers", desc: "Add doctors and therapists", icon: <Stethoscope className="w-4 h-4" />, route: "providers" },
  { id: "questionnaires", title: "Setup questionnaires", desc: "Create patient intake forms", icon: <FileText className="w-4 h-4" />, route: "questionnaires" },
  { id: "consentForms", title: "Configure consent forms", desc: "Add mandatory consent documents", icon: <FileSignature className="w-4 h-4" />, route: "consentForms" },
];

/**
 * A persistent floating checklist orb + slide-up panel shown on all clinic admin pages.
 * Replaces the dashboard-only DashboardWalkthrough for non-dashboard pages.
 */
export function WalkthroughPanel({ onNavigate, activeMenu }: WalkthroughPanelProps) {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Refresh completed steps whenever the panel opens (picks up changes from saves)
  useEffect(() => {
    const refresh = () => setCompletedSteps(getCompletedSteps());
    refresh();
    
    // Also refresh when localStorage changes (e.g. after a form save in another component)
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);

  const totalDone = completedSteps.length;
  const allDone = totalDone >= STEPS.length;

  // Auto-open on dashboard for the first time
  useEffect(() => {
    if (activeMenu === "dashboard" && !allDone) {
      const autoOpened = localStorage.getItem("spinecloud_panel_auto_opened");
      if (!autoOpened) {
        setIsOpen(true);
        localStorage.setItem("spinecloud_panel_auto_opened", "true");
      }
    }
  }, [activeMenu, allDone]);

  // Also refresh on open
  const handleToggle = () => {
    setCompletedSteps(getCompletedSteps());
    setIsOpen((prev) => !prev);
  };

  if (allDone) return null; // Hide once all done

  const handleNavigate = (stepId: string, route: string) => {
    localStorage.setItem("spinecloud_active_guide", stepId);
    setIsOpen(false);
    onNavigate(route);
  };

  return (
    <>
      {/* Floating orb */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {/* Slide-up panel */}
        {isOpen && (
          <div className="w-80 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
            {/* Header */}
            <div className="bg-primary-900 px-4 py-3 text-white flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">Getting Started</p>
                <p className="text-primary-200 text-xs mt-0.5">{totalDone} of {STEPS.length} steps done</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 text-primary-200 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-neutral-200 dark:bg-neutral-800">
              <div
                className="h-full bg-primary-500 transition-all duration-500"
                style={{ width: `${Math.round((totalDone / STEPS.length) * 100)}%` }}
              />
            </div>

            {/* Steps */}
            <div className="p-2">
              {STEPS.map((step, idx) => {
                const done = completedSteps.includes(step.id);
                return (
                  <button
                    key={step.id}
                    onClick={() => handleNavigate(step.id, step.route)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group text-left"
                  >
                    {/* Step number / check */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                      done ? "bg-success-100 dark:bg-success-900/30 text-success-600" : "bg-primary-50 dark:bg-primary-950/30 text-primary-600"
                    }`}>
                      {done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium leading-snug ${done ? "line-through text-neutral-400" : "text-neutral-800 dark:text-neutral-100"}`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-neutral-400 mt-0.5">{step.desc}</p>
                    </div>
                    {!done && <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-primary-500 shrink-0 transition-colors" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Orb button */}
        <button
          onClick={handleToggle}
          className="relative w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg transition-all hover:scale-105 flex items-center justify-center"
          aria-label="Setup checklist"
        >
          <ListChecks className="w-5 h-5" />
          {totalDone < STEPS.length && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-warning-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {STEPS.length - totalDone}
            </span>
          )}
        </button>
      </div>
    </>
  );
}
