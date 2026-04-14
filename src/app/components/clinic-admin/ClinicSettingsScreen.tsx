import { useState } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { Upload, X, Save, Building2 } from "lucide-react";

interface ClinicSettingsScreenProps {
  onNavigate: (menu: "dashboard" | "branches" | "questionnaires" | "roles" | "users" | "providers" | "consentForms" | "patients" | "master" | "subscription" | "calendar" | "appointment-categories" | "invoices" | "payments" | "email-management" | "clinic-settings") => void;
  onLogout?: () => void;
}

export function ClinicSettingsScreen({
  onNavigate,
  onLogout,
}: ClinicSettingsScreenProps) {
  // Form state
  const [clinicName, setClinicName] = useState("SpineCloudIQ");
  const [tagline, setTagline] = useState("Your trusted partner in spine care");
  const [email, setEmail] = useState("admin@spinecloudiq.com");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [website, setWebsite] = useState("https://www.spinecloudiq.com");
  const [address, setAddress] = useState("123 Main Street");
  const [city, setCity] = useState("New York");
  const [state, setState] = useState("NY");
  const [zipCode, setZipCode] = useState("10001");
  const [country, setCountry] = useState("United States");
  
  // Branding state
  const [primaryColor, setPrimaryColor] = useState("#3B82F6");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  
  // Social media
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [instagram, setInstagram] = useState("");

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleSave = () => {
    // Save logic would be implemented here
    alert("Clinic settings saved successfully!");
  };

  const isFormValid = () => {
    return clinicName.trim() !== "" && email.trim() !== "" && phone.trim() !== "";
  };

  return (
    <ClinicAdminLayout activeMenu="clinic-settings" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Clinic settings</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Manage your clinic details, branding, and white-labeling settings
          </p>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide mb-6">
              Basic Information
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Clinic name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    placeholder="Enter clinic name"
                    className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="Enter tagline"
                    className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Email address <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Phone number <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Website
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://www.example.com"
                  className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter street address"
                  className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                    className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    ZIP code
                  </label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="ZIP"
                    className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Country"
                    className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Branding & White-labeling */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide mb-6">
              Branding & White-labeling
            </h3>

            <div className="space-y-6">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Clinic logo
                </label>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                  Upload your clinic logo for white-labeling. Recommended size: 200x200px (Max 5MB)
                </p>

                {logoPreview ? (
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img
                        src={logoPreview}
                        alt="Clinic logo preview"
                        className="w-32 h-32 object-contain border-2 border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800"
                      />
                      <button
                        onClick={handleRemoveLogo}
                        className="absolute -top-2 -right-2 p-1 bg-destructive hover:bg-red-600 text-white rounded-full transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-neutral-900 dark:text-white font-medium">
                        {logoFile?.name}
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        {logoFile && (logoFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <label className="inline-flex items-center gap-2 px-4 h-9 mt-3 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer">
                        <Upload className="w-4 h-4" />
                        Change logo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-600 transition-colors cursor-pointer bg-neutral-50 dark:bg-neutral-900">
                    <div className="flex flex-col items-center justify-center py-6">
                      <Building2 className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mb-3" />
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Click to upload logo
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Primary Brand Color */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Primary brand color
                </label>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                  This color will be used across the platform for buttons, links, and accents
                </p>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-20 h-10 rounded-lg border border-neutral-200 dark:border-neutral-800 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    placeholder="#3B82F6"
                    className="flex-1 h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                  />
                  <div
                    className="w-24 h-10 rounded-lg border border-neutral-200 dark:border-neutral-800"
                    style={{ backgroundColor: primaryColor }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide mb-6">
              Social Media Links
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Facebook
                  </label>
                  <input
                    type="url"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                    className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Twitter
                  </label>
                  <input
                    type="url"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="https://twitter.com/yourhandle"
                    className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/company/yourcompany"
                    className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="https://instagram.com/yourhandle"
                    className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => onNavigate("dashboard")}
              className="h-10 px-6 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!isFormValid()}
              className="inline-flex items-center gap-2 h-10 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              <Save className="w-4 h-4" />
              Save changes
            </button>
          </div>
        </div>
      </div>
    </ClinicAdminLayout>
  );
}
