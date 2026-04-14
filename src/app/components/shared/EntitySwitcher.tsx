import { User, Building2, Stethoscope, Users } from "lucide-react";

interface EntitySwitcherProps {
  currentEntity: "patient" | "clinicAdmin" | "provider" | "clinic-staff";
  onSwitch: (entity: "patient" | "clinicAdmin" | "provider" | "clinic-staff") => void;
}

export function EntitySwitcher({ currentEntity, onSwitch }: EntitySwitcherProps) {
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg p-1 flex gap-1">
        <button
          onClick={() => onSwitch("patient")}
          className={`flex items-center gap-2 px-4 h-9 rounded-md transition-all font-medium text-sm ${
            currentEntity === "patient"
              ? "bg-primary-600 text-white"
              : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
        >
          <User className="w-4 h-4" />
          Patient
        </button>
        <button
          onClick={() => onSwitch("clinicAdmin")}
          className={`flex items-center gap-2 px-4 h-9 rounded-md transition-all font-medium text-sm ${
            currentEntity === "clinicAdmin"
              ? "bg-primary-600 text-white"
              : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
        >
          <Building2 className="w-4 h-4" />
          Clinic admin
        </button>
        <button
          onClick={() => onSwitch("provider")}
          className={`flex items-center gap-2 px-4 h-9 rounded-md transition-all font-medium text-sm ${
            currentEntity === "provider"
              ? "bg-primary-600 text-white"
              : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          Provider
        </button>
        <button
          onClick={() => onSwitch("clinic-staff")}
          className={`flex items-center gap-2 px-4 h-9 rounded-md transition-all font-medium text-sm ${
            currentEntity === "clinic-staff"
              ? "bg-primary-600 text-white"
              : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
        >
          <Users className="w-4 h-4" />
          Clinic staff
        </button>
      </div>
    </div>
  );
}
