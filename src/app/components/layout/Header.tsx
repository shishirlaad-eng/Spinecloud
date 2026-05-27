import { Menu, User, ChevronDown, LogOut } from "lucide-react";
import { useState } from "react";
import logo from "../../../assets/spinecloud-logo.png";
import { EntitySwitcher } from "../shared/EntitySwitcher";

interface HeaderProps {
  onToggleSidebar: () => void;
  onLogout?: () => void;
  onNavigateToProfile?: () => void;
  currentEntity?: "patient" | "clinicAdmin" | "provider" | "clinic-staff";
  onEntitySwitch?: (entity: "patient" | "clinicAdmin" | "provider" | "clinic-staff") => void;
}

export function Header({
  onToggleSidebar,
  onLogout,
  onNavigateToProfile,
  currentEntity = "patient",
  onEntitySwitch = () => {},
}: HeaderProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "64px",
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #EFF4FF",
        zIndex: 50,
        fontFamily: "'Avenir', 'Avenir Next', 'Nunito Sans', sans-serif",
      }}
    >
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
        {/* Left: Hamburger + Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={onToggleSidebar}
            style={{
              width: "34px",
              height: "34px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "transparent",
              cursor: "pointer",
              color: "#404750",
            }}
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
          <img src={logo} alt="SpineCloud IQ" style={{ height: "40px", width: "auto", objectFit: "contain" }} />
        </div>

        {/* Right: Entity Switcher + Profile */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {currentEntity && (
            <EntitySwitcher 
              currentEntity={currentEntity} 
              onSwitch={onEntitySwitch} 
              inline 
            />
          )}

          <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              height: "36px",
              padding: "0 8px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "transparent",
              cursor: "pointer",
              color: "#404750",
            }}
          >
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                backgroundColor: "#1D77B4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
              }}
            >
              <User size={16} />
            </div>
            <ChevronDown size={14} style={{ color: "#7A8694" }} />
          </button>

          {showProfileDropdown && (
            <>
              <div
                style={{ position: "fixed", inset: 0, zIndex: 10 }}
                onClick={() => setShowProfileDropdown(false)}
              />
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 8px)",
                  width: "220px",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #EFF4FF",
                  borderRadius: "12px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  zIndex: 20,
                }}
              >
                {/* User info */}
                <div style={{ padding: "14px 16px", borderBottom: "1px solid #F0F4FF" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "#1D77B4",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <User size={20} style={{ color: "#FFFFFF" }} />
                    </div>
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "#0B1C30", marginBottom: "2px" }}>John Doe</p>
                      <p style={{ fontSize: "12px", color: "#7A8694" }}>Patient</p>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div style={{ padding: "6px" }}>
                  <button
                    onClick={() => { setShowProfileDropdown(false); onNavigateToProfile?.(); }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "9px",
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "7px",
                      border: "none",
                      backgroundColor: "transparent",
                      cursor: "pointer",
                      fontSize: "13px",
                      color: "#404750",
                      fontWeight: 500,
                      textAlign: "left",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#F8F9FF")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <User size={15} />
                    My Profile
                  </button>
                </div>

                <div style={{ padding: "6px", borderTop: "1px solid #F0F4FF" }}>
                  <button
                    onClick={() => { setShowProfileDropdown(false); onLogout?.(); }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "9px",
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "7px",
                      border: "none",
                      backgroundColor: "transparent",
                      cursor: "pointer",
                      fontSize: "13px",
                      color: "#BA1A1A",
                      fontWeight: 500,
                      textAlign: "left",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#FFF8F7")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <LogOut size={15} />
                    Logout
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