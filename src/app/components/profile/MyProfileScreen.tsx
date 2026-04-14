import { useState, useRef } from "react";
import { DashboardLayout } from "@/app/components/layout/DashboardLayout";
import { User, CreditCard, Camera, X } from "lucide-react";

interface MyProfileScreenProps {
  onNavigate: (menu: "dashboard" | "appointments") => void;
  onBack: () => void;
  onLogout?: () => void;
}

export function MyProfileScreen({ 
  onNavigate, 
  onBack, 
  onLogout 
}: MyProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<"basic" | "insurance">("basic");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Profile Picture
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  
  // Read-only fields (from signup)
  const [name] = useState("John Doe");
  const [email] = useState("john.doe@example.com");
  const [mobile] = useState("+1 (555) 123-4567");

  // Editable fields - Basic Details
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

  // Editable Insurance fields
  const [insuranceProvider, setInsuranceProvider] = useState("Blue Cross Blue Shield");
  const [planNetworkName, setPlanNetworkName] = useState("PPO");
  const [policyNumber, setPolicyNumber] = useState("BCBS123456789");
  const [groupNumber, setGroupNumber] = useState("GRP456");
  const [policyHolderName, setPolicyHolderName] = useState("John Doe");
  const [policyHolderDOB, setPolicyHolderDOB] = useState("1990-05-15");
  const [relationshipToPolicyholder, setRelationshipToPolicyholder] = useState("self");

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

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePicture = () => {
    setProfilePicture(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
              My profile
            </span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                    My profile
                  </h2>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    View and update your personal information
                  </p>
                </div>
                
                {/* Profile Picture Upload */}
                <div className="relative group">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {profilePicture ? (
                    <div className="relative">
                      <img
                        src={profilePicture}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-700"
                      />
                      <button
                        onClick={removeProfilePicture}
                        className="absolute -top-1 -right-1 p-1 bg-destructive text-white rounded-full hover:bg-destructive/90 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <button
                        onClick={handleProfilePictureClick}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Camera className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleProfilePictureClick}
                      className="relative w-16 h-16 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
                    >
                      <User className="w-8 h-8" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-5 h-5 text-white" />
                      </div>
                    </button>
                  )}
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
              <form onSubmit={handleSave}>
                <div className="p-6 space-y-6">
                  {/* Insurance Information */}
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide mb-3">
                      Insurance information
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="insuranceProvider" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                          Insurance provider name
                        </label>
                        <input
                          id="insuranceProvider"
                          type="text"
                          placeholder="e.g., Blue Cross Blue Shield"
                          value={insuranceProvider}
                          onChange={(e) => setInsuranceProvider(e.target.value)}
                          className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                        />
                      </div>
                      <div>
                        <label htmlFor="planNetworkName" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                          Plan / Network name
                        </label>
                        <input
                          id="planNetworkName"
                          type="text"
                          placeholder="e.g., PPO, HMO, EPO"
                          value={planNetworkName}
                          onChange={(e) => setPlanNetworkName(e.target.value)}
                          className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="policyNumber" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                            Policy / Member ID number
                          </label>
                          <input
                            id="policyNumber"
                            type="text"
                            placeholder="Enter policy/member ID"
                            value={policyNumber}
                            onChange={(e) => setPolicyNumber(e.target.value)}
                            className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                          />
                        </div>
                        <div>
                          <label htmlFor="groupNumber" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                            Group number
                          </label>
                          <input
                            id="groupNumber"
                            type="text"
                            placeholder="Enter group number"
                            value={groupNumber}
                            onChange={(e) => setGroupNumber(e.target.value)}
                            className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Policy Holder Information */}
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide mb-3">
                      Policy holder information
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="policyHolderName" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                          Name of policyholder
                        </label>
                        <input
                          id="policyHolderName"
                          type="text"
                          placeholder="Enter full name"
                          value={policyHolderName}
                          onChange={(e) => setPolicyHolderName(e.target.value)}
                          className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="policyHolderDOB" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                            Policyholder date of birth
                          </label>
                          <input
                            id="policyHolderDOB"
                            type="date"
                            value={policyHolderDOB}
                            onChange={(e) => setPolicyHolderDOB(e.target.value)}
                            className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                          />
                        </div>
                        <div>
                          <label htmlFor="relationshipToPolicyholder" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                            Relationship to policyholder
                          </label>
                          <select
                            id="relationshipToPolicyholder"
                            value={relationshipToPolicyholder}
                            onChange={(e) => setRelationshipToPolicyholder(e.target.value)}
                            className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                          >
                            <option value="self">Self</option>
                            <option value="spouse">Spouse</option>
                            <option value="child">Child</option>
                          </select>
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
