import { useState, useRef, useEffect } from "react";
import { User, Building2, Stethoscope, ChevronDown } from "lucide-react";

interface EntitySwitcherProps {
  currentEntity: "patient" | "clinicAdmin" | "provider" | "clinic-staff";
  onSwitch: (entity: "patient" | "clinicAdmin" | "provider" | "clinic-staff") => void;
  inline?: boolean;
}

const entities = [
  { id: "patient" as const, label: "Patient", icon: User },
  { id: "clinicAdmin" as const, label: "Clinic admin", icon: Building2 },
  { id: "provider" as const, label: "Provider", icon: Stethoscope },
];

export function EntitySwitcher({ currentEntity, onSwitch, inline }: EntitySwitcherProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = entities.find((e) => e.id === currentEntity) || entities[0];
  const CurrentIcon = current.icon;

  return (
    <div
      ref={ref}
      style={{
        position: inline ? "relative" : "fixed",
        top: inline ? "auto" : "12px",
        right: inline ? "auto" : "16px",
        zIndex: inline ? 10 : 9999,
        fontFamily: "'Avenir', 'Avenir Next', 'Nunito Sans', sans-serif",
      }}
    >
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "7px",
          height: "36px",
          padding: "0 12px",
          borderRadius: "10px",
          backgroundColor: "#FFFFFF",
          border: "1.5px solid #DCE9FF",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: 600,
          color: "#404750",
          boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
          transition: "box-shadow 0.15s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.boxShadow = "0 2px 10px rgba(29,119,180,0.18)")}
        onMouseOut={(e) => (e.currentTarget.style.boxShadow = "0 1px 6px rgba(0,0,0,0.08)")}
      >
        <CurrentIcon size={15} style={{ color: "#1D77B4" }} />
        <span>{current.label}</span>
        <ChevronDown
          size={14}
          style={{
            color: "#1D77B4",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "44px",
            backgroundColor: "#FFFFFF",
            border: "1.5px solid #DCE9FF",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            overflow: "hidden",
            minWidth: "160px",
          }}
        >
          {entities.map((entity) => {
            const Icon = entity.icon;
            const isActive = currentEntity === entity.id;
            return (
              <button
                key={entity.id}
                onClick={() => {
                  onSwitch(entity.id);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                  width: "100%",
                  padding: "10px 14px",
                  fontSize: "13px",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#1D77B4" : "#404750",
                  backgroundColor: isActive ? "#EFF4FF" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background-color 0.1s",
                }}
                onMouseOver={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "#F8F9FF";
                }}
                onMouseOut={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <Icon size={15} style={{ color: isActive ? "#1D77B4" : "#7A8694" }} />
                {entity.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
