import { useState } from "react";
import { DashboardLayout } from "@/app/components/layout/DashboardLayout";
import { ChevronLeft, User, CreditCard, FileCheck } from "lucide-react";

interface MyProfileScreenWithTabsProps {
  onNavigate: (menu: "dashboard" | "appointments") => void;
  onBack: () => void;
  onLogout?: () => void;
  onNavigateToInsurance?: () => void;
}

export function MyProfileScreenWithTabs({ 
  onNavigate, 
  onBack, 
  onLogout,
  onNavigateToInsurance 
}: MyProfileScreenWithTabsProps) {
  const [activeTab, setActiveTab] = useState<"basic" | "insurance" | "consent">("basic");
  
  // Read-only fields (from signup)
  const [name] = useState("John Doe");
  const [email] = useState("john.doe@example.com");
  const [mobile] = useState("+1 (555) 123-4567");

  // Editable fields
  const [dateOfBirth, setDateOfBirth] = useState("1990-05-15");
  const [gender, setGender] = useState("male");
  const [street, setStreet] = useState("123 Main Street, Apt 4B");
  const [city, setCity] = useState("New York");
  const [state, setState] = useState("New York");
  const [zipCode, setZipCode] = useState("10001");
  const [country, setCountry] = useState("US");
  const [emergencyName, setEmergencyName] = useState("Jane Doe");
  const [emergencyCountryCode, setEmergencyCountryCode] = useState("+1");
  const [emergencyContact, setEmergencyContact] = useState("(555) 987-6543");

  // Mock insurance data
  const [hasInsurance] = useState(true);
  const [insuranceProvider] = useState("Blue Cross Blue Shield");
  const [policyNumber] = useState("BCBS123456789");
  const [relationshipToPolicyholder] = useState("Self");

  // Mock consent data
  const [consentRecords] = useState([
    {
      id: "1",
      date: "2024-01-15",
      type: "Appointment Consent",
      signatureType: "typed" as const,
      signatureName: "John Doe",
    },
  ]);

  const [isSaving, setIsSaving] = useState(false);

  const usStates = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
    "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert("Profile updated successfully!");
    }, 1000);
  };

  return (
    <DashboardLayout activeMenu="dashboard" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-5 md:p-6">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <button
              onClick={onBack}
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Dashboard
            </button>
            <span>/</span>
            <span className="text-neutral-900 dark:text-white font-medium">
              My Profile
            </span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-start gap-3">
                <button
                  onClick={onBack}
                  className="mt-1 w-8 h-8 flex items-center justify-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex-shrink-0"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                    My profile
                  </h2>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    View and update your personal information
                  </p>
                </div>
                <div className="w-16 h-16 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                  <User className="w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("basic")}
                  className={`flex-1 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === "basic"
                      ? "border-primary-600 text-primary-600 dark:text-primary-400"
                      : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <User className="w-4 h-4" />
                    Basic information
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("insurance")}
                  className={`flex-1 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === "insurance"
                      ? "border-primary-600 text-primary-600 dark:text-primary-400"
                      : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Insurance
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("consent")}
                  className={`flex-1 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === "consent"
                      ? "border-primary-600 text-primary-600 dark:text-primary-400"
                      : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FileCheck className="w-4 h-4" />
                    Consent forms
                  </div>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "basic" && (
              <form onSubmit={handleSave}>
                <div className="p-6 space-y-6">
                  {/* Account Information (Read-only) */}
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide mb-3">
                      Account information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                          First name
                        </label>
                        <input
                          type="text"
                          value={name.split(" ")[0]}
                          readOnly
                          disabled
                          className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-sm text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                          Last name
                        </label>
                        <input
                          type="text"
                          value={name.split(" ")[1]}
                          readOnly
                          disabled
                          className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-sm text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                          Email address
                        </label>
                        <input
                          type="email"
                          value={email}
                          readOnly
                          disabled
                          className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-sm text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                          Mobile number
                        </label>
                        <input
                          type="tel"
                          value={mobile}
                          readOnly
                          disabled
                          className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-sm text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Demographics */}
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide mb-3">
                      Demographics
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="dob" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                          Date of birth
                        </label>
                        <input
                          id="dob"
                          type="date"
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                        />
                      </div>
                      <div>
                        <label htmlFor="gender" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                          Gender
                        </label>
                        <select
                          id="gender"
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide mb-3">
                      Address
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="street" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                          Street address
                        </label>
                        <input
                          id="street"
                          type="text"
                          placeholder="123 Main Street, Apt 4B"
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="city" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                            City
                          </label>
                          <input
                            id="city"
                            type="text"
                            placeholder="New York"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                          />
                        </div>
                        <div>
                          <label htmlFor="state" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                            State
                          </label>
                          <select
                            id="state"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                          >
                            {usStates.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="zip" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                            Zip code
                          </label>
                          <input
                            id="zip"
                            type="text"
                            placeholder="10001"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                          />
                        </div>
                        <div>
                          <label htmlFor="country" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                            Country
                          </label>
                          <select
                            id="country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                          >
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="UK">United Kingdom</option>
                            <option value="AU">Australia</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide mb-3">
                      Emergency contact
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="emergencyName" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                          Emergency contact name
                        </label>
                        <input
                          id="emergencyName"
                          type="text"
                          placeholder="John Doe"
                          value={emergencyName}
                          onChange={(e) => setEmergencyName(e.target.value)}
                          className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                        />
                      </div>
                      <div>
                        <label htmlFor="emergencyContact" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                          Emergency contact number
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={emergencyCountryCode}
                            onChange={(e) => setEmergencyCountryCode(e.target.value)}
                            className="flex h-10 w-28 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                          >
                            <option value="+1">+1 (US)</option>
                            <option value="+44">+44 (UK)</option>
                            <option value="+61">+61 (AU)</option>
                            <option value="+91">+91 (IN)</option>
                          </select>
                          <input
                            id="emergencyContact"
                            type="tel"
                            placeholder="(555) 123-4567"
                            value={emergencyContact}
                            onChange={(e) => setEmergencyContact(e.target.value)}
                            className="flex h-10 flex-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex gap-3">
                  <button
                    type="button"
                    onClick={onBack}
                    className="h-10 px-4 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 h-10 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </form>
            )}

            {/* Insurance Tab */}
            {activeTab === "insurance" && (
              <div className="p-6 space-y-6">
                {hasInsurance ? (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Insurance information
                      </h3>
                      <button
                        type="button"
                        onClick={onNavigateToInsurance}
                        className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
                      >
                        Edit insurance
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Insurance provider</p>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">{insuranceProvider}</p>
                      </div>
                      <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Policy number</p>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">{policyNumber}</p>
                      </div>
                      <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Relationship</p>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">{relationshipToPolicyholder}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <CreditCard className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                      No insurance information added yet
                    </p>
                    <button
                      type="button"
                      onClick={onNavigateToInsurance}
                      className="px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium"
                    >
                      Add insurance details
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Consent Forms Tab */}
            {activeTab === "consent" && (
              <div className="p-6 space-y-6">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Signed consent forms
                </h3>
                
                {consentRecords.length > 0 ? (
                  <div className="space-y-3">
                    {consentRecords.map((record) => (
                      <div key={record.id} className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">{record.type}</p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                              Signed on {new Date(record.date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2">
                              Signature: <span className="font-serif italic">{record.signatureName}</span>
                            </p>
                          </div>
                          <FileCheck className="w-5 h-5 text-success-600 dark:text-success-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileCheck className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      No consent forms signed yet
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
