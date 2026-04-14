import { useState, useRef } from "react";
import { ClinicStaffLayout } from "@/app/components/clinic-staff/layout/ClinicStaffLayout";
import { Camera, X, Check } from "lucide-react";

interface ClinicStaffProfileScreenProps {
  onNavigate: (menu: "calendar" | "patients") => void;
  onLogout?: () => void;
}

export function ClinicStaffProfileScreen({
  onNavigate,
  onLogout,
}: ClinicStaffProfileScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Picture
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  // Basic Details
  const [firstName, setFirstName] = useState("Staff");
  const [lastName, setLastName] = useState("User");
  const [email, setEmail] = useState("staff@clinic.com");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [role, setRole] = useState("Receptionist");
  const [department, setDepartment] = useState("Front Desk");

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
      setShowSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <ClinicStaffLayout
      activeMenu="calendar"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="p-6">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-success-50 dark:bg-success-950/30 border border-success-200 dark:border-success-800 rounded-lg p-4 flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-success-600 flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 text-white" />
            </div>
            <p className="text-sm text-success-700 dark:text-success-400">
              Profile updated successfully
            </p>
          </div>
        )}

        <div className="max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
              My profile
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Manage your profile information
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
            <form onSubmit={handleSave}>
              {/* Profile Picture Section */}
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
                  Profile picture
                </h2>
                <div className="flex items-start gap-6">
                  {/* Profile Picture */}
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center overflow-hidden">
                      {profilePicture ? (
                        <img
                          src={profilePicture}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl font-semibold text-neutral-400 dark:text-neutral-600">
                          {firstName.charAt(0)}
                          {lastName.charAt(0)}
                        </span>
                      )}
                    </div>
                    {profilePicture && (
                      <button
                        type="button"
                        onClick={removeProfilePicture}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-destructive hover:bg-destructive/90 rounded-full flex items-center justify-center transition-colors"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    )}
                  </div>

                  {/* Upload Button */}
                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={handleProfilePictureClick}
                      className="inline-flex items-center gap-2 px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                    >
                      <Camera className="w-4 h-4" />
                      {profilePicture ? "Change picture" : "Upload picture"}
                    </button>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                      JPG, PNG or GIF. Max size 5MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="p-6 space-y-6">
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Basic information
                </h2>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      First name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Last name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                    />
                  </div>
                </div>

                {/* Contact Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Email address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Phone number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                    />
                  </div>
                </div>

                {/* Role and Department */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Role
                    </label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Department
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="h-10 px-6 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none transition-colors font-medium text-sm"
                >
                  {isSaving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ClinicStaffLayout>
  );
}
