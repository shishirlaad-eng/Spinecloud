import { useState } from "react";
import { ChevronLeft, Upload, X } from "lucide-react";

interface InsuranceDetailsScreenProps {
  onBack: () => void;
  onContinue: (data: {
    insuranceProvider: string;
    planNetworkName?: string;
    policyNumber: string;
    groupNumber?: string;
    policyHolderName: string;
    policyHolderDOB: string;
    relationshipToPolicyholder: string;
    insuranceCardFront?: File | null;
    insuranceCardBack?: File | null;
  }) => void;
  initialData?: {
    insuranceProvider?: string;
    planNetworkName?: string;
    policyNumber?: string;
    groupNumber?: string;
    policyHolderName?: string;
    policyHolderDOB?: string;
    relationshipToPolicyholder?: string;
  };
  isFromProfile?: boolean;
}

export function InsuranceDetailsScreen({
  onBack,
  onContinue,
  initialData,
  isFromProfile = false,
}: InsuranceDetailsScreenProps) {
  const [insuranceProvider, setInsuranceProvider] = useState(initialData?.insuranceProvider ?? "");
  const [planNetworkName, setPlanNetworkName] = useState(initialData?.planNetworkName ?? "");
  const [policyNumber, setPolicyNumber] = useState(initialData?.policyNumber ?? "");
  const [groupNumber, setGroupNumber] = useState(initialData?.groupNumber ?? "");
  const [policyHolderName, setPolicyHolderName] = useState(initialData?.policyHolderName ?? "");
  const [policyHolderDOB, setPolicyHolderDOB] = useState(initialData?.policyHolderDOB ?? "");
  const [relationshipToPolicyholder, setRelationshipToPolicyholder] = useState(
    initialData?.relationshipToPolicyholder ?? ""
  );
  const [insuranceCardFront, setInsuranceCardFront] = useState<File | null>(null);
  const [insuranceCardBack, setInsuranceCardBack] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: "front" | "back") => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }
      if (side === "front") {
        setInsuranceCardFront(file);
      } else {
        setInsuranceCardBack(file);
      }
    }
  };

  const removeFile = (side: "front" | "back") => {
    if (side === "front") {
      setInsuranceCardFront(null);
    } else {
      setInsuranceCardBack(null);
    }
  };

  const isFormValid = () => {
    return (
      insuranceProvider.trim() !== "" &&
      policyNumber.trim() !== "" &&
      policyHolderName.trim() !== "" &&
      policyHolderDOB !== "" &&
      relationshipToPolicyholder !== ""
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onContinue({
        insuranceProvider,
        planNetworkName: planNetworkName || undefined,
        policyNumber,
        groupNumber: groupNumber || undefined,
        policyHolderName,
        policyHolderDOB,
        relationshipToPolicyholder,
        insuranceCardFront,
        insuranceCardBack,
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-5 md:p-6 bg-neutral-50 dark:bg-neutral-950">
      <div className="w-full max-w-2xl">
        {/* Logo - Outside Card */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white">
            SpineCloudIQ
          </h1>
          <div className="w-16 h-1 bg-primary-600 mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group mb-4"
            >
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back
            </button>

            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white text-center">
              Insurance details
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 text-center">
              {isFromProfile
                ? "Update your insurance information"
                : "Add your insurance information"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
              {/* Insurance Information Section */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide mb-3">
                  Insurance information
                </h4>
                <div className="space-y-4">
                  {/* Insurance Provider Name */}
                  <div>
                    <label
                      htmlFor="insuranceProvider"
                      className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
                    >
                      Insurance provider name <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="insuranceProvider"
                      type="text"
                      placeholder="e.g., Blue Cross Blue Shield, Aetna, UnitedHealthcare"
                      value={insuranceProvider}
                      onChange={(e) => setInsuranceProvider(e.target.value)}
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                    />
                  </div>

                  {/* Plan / Network Name */}
                  <div>
                    <label
                      htmlFor="planNetworkName"
                      className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
                    >
                      Plan / Network name <span className="text-sm text-neutral-500">(Optional)</span>
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

                  {/* Policy Number and Group Number */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="policyNumber"
                        className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
                      >
                        Policy / Member ID number <span className="text-destructive">*</span>
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
                      <label
                        htmlFor="groupNumber"
                        className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
                      >
                        Group number <span className="text-sm text-neutral-500">(Optional)</span>
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

              {/* Policy Holder Information Section */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide mb-3">
                  Policy holder information
                </h4>
                <div className="space-y-4">
                  {/* Policy Holder Name */}
                  <div>
                    <label
                      htmlFor="policyHolderName"
                      className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
                    >
                      Name of policyholder <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="policyHolderName"
                      type="text"
                      placeholder="Enter full name (if different from patient)"
                      value={policyHolderName}
                      onChange={(e) => setPolicyHolderName(e.target.value)}
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                    />
                  </div>

                  {/* Policy Holder DOB and Relationship */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="policyHolderDOB"
                        className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
                      >
                        Policyholder date of birth <span className="text-destructive">*</span>
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
                      <label
                        htmlFor="relationshipToPolicyholder"
                        className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
                      >
                        Relationship to policyholder <span className="text-destructive">*</span>
                      </label>
                      <select
                        id="relationshipToPolicyholder"
                        value={relationshipToPolicyholder}
                        onChange={(e) => setRelationshipToPolicyholder(e.target.value)}
                        className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                      >
                        <option value="">Select relationship</option>
                        <option value="self">Self</option>
                        <option value="spouse">Spouse</option>
                        <option value="child">Child</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Insurance Card Upload Section */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide mb-3">
                  Insurance card images
                </h4>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                  Upload photos of the front and back of your insurance card
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Front of Card */}
                  <div>
                    <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                      Insurance card – Front image
                    </label>
                    {!insuranceCardFront ? (
                      <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                        <Upload className="w-8 h-8 text-neutral-400 mb-2" />
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          Click to upload
                        </span>
                        <span className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">
                          PNG, JPG up to 10MB
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "front")}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="relative h-40 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 p-4">
                        <button
                          type="button"
                          onClick={() => removeFile("front")}
                          className="absolute top-2 right-2 p-1 bg-white dark:bg-neutral-800 rounded-full border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                        >
                          <X className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                        </button>
                        <p className="text-sm text-neutral-900 dark:text-white font-medium truncate">
                          {insuranceCardFront.name}
                        </p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                          {(insuranceCardFront.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Back of Card */}
                  <div>
                    <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                      Insurance card – Back image
                    </label>
                    {!insuranceCardBack ? (
                      <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                        <Upload className="w-8 h-8 text-neutral-400 mb-2" />
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          Click to upload
                        </span>
                        <span className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">
                          PNG, JPG up to 10MB
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "back")}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="relative h-40 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 p-4">
                        <button
                          type="button"
                          onClick={() => removeFile("back")}
                          className="absolute top-2 right-2 p-1 bg-white dark:bg-neutral-800 rounded-full border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                        >
                          <X className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                        </button>
                        <p className="text-sm text-neutral-900 dark:text-white font-medium truncate">
                          {insuranceCardBack.name}
                        </p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                          {(insuranceCardBack.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex justify-end gap-3">
                {!isFromProfile && (
                  <button
                    type="button"
                    onClick={() => {
                      // Skip by calling onContinue with empty/minimal data
                      onContinue({
                        insuranceProvider: "",
                        policyNumber: "",
                        policyHolderName: "",
                        policyHolderDOB: "",
                        relationshipToPolicyholder: "",
                        insuranceCardFront: null,
                        insuranceCardBack: null,
                      });
                    }}
                    className="px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
                  >
                    Skip for now
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!isFormValid()}
                  className="px-6 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                >
                  {isFromProfile ? "Save changes" : "Continue"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}