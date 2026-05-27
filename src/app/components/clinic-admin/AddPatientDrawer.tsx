import { X, User, MapPin, Phone, Shield, FileCheck } from "lucide-react";
import { useState } from "react";

interface AddPatientDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patientData: any) => void;
}

export function AddPatientDrawer({ isOpen, onClose, onSave }: AddPatientDrawerProps) {
  // Required fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+1");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");

  // Optional address fields
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("United States");

  // Optional emergency contact
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyCountryCode, setEmergencyCountryCode] = useState("+1");
  const [emergencyPhone, setEmergencyPhone] = useState("");

  // Insurance fields (required if filling insurance)
  const [hasInsurance, setHasInsurance] = useState(false);
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [policyHolderName, setPolicyHolderName] = useState("");
  const [policyHolderDOB, setPolicyHolderDOB] = useState("");
  const [relationshipToPolicyholder, setRelationshipToPolicyholder] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const countryCodes = [
    { code: "+1", country: "US/Canada" },
    { code: "+44", country: "UK" },
    { code: "+61", country: "Australia" },
    { code: "+91", country: "India" },
  ];

  const usStates = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
    "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email format";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    if (!dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!gender) newErrors.gender = "Gender is required";

    if (hasInsurance) {
      if (!insuranceProvider.trim()) newErrors.insuranceProvider = "Insurance provider is required";
      if (!policyNumber.trim()) newErrors.policyNumber = "Policy number is required";
      if (!policyHolderName.trim()) newErrors.policyHolderName = "Policyholder name is required";
      if (!policyHolderDOB) newErrors.policyHolderDOB = "Policyholder date of birth is required";
      if (!relationshipToPolicyholder) newErrors.relationshipToPolicyholder = "Relationship is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      const patientData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        phoneCountryCode,
        dateOfBirth,
        gender,
        address: {
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
          zip: zipCode.trim(),
          country,
        },
        emergencyContact: {
          name: emergencyName.trim(),
          phone: emergencyPhone.trim(),
          countryCode: emergencyCountryCode,
        },
        insurance: hasInsurance ? {
          provider: insuranceProvider.trim(),
          policyNumber: policyNumber.trim(),
          policyHolderName: policyHolderName.trim(),
          policyHolderDOB,
          relationship: relationshipToPolicyholder,
        } : null,
        status: "Active",
        createdAt: new Date().toISOString(),
      };

      onSave(patientData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 w-full max-w-2xl bg-white dark:bg-neutral-900 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Add New Patient</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Quickly register a new patient to the system</p>
          </div>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="add-patient-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-primary-600" />
                <h3 className="font-semibold text-neutral-900 dark:text-white">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">First Name *</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:ring-2 focus:ring-primary-500/10 focus:border-primary-600 transition-all ${errors.firstName ? 'border-destructive' : ''}`}
                    placeholder="John"
                  />
                  {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Last Name *</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:ring-2 focus:ring-primary-500/10 focus:border-primary-600 transition-all ${errors.lastName ? 'border-destructive' : ''}`}
                    placeholder="Doe"
                  />
                  {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mt-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:ring-2 focus:ring-primary-500/10 focus:border-primary-600 transition-all ${errors.email ? 'border-destructive' : ''}`}
                    placeholder="john.doe@example.com"
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Phone Number *</label>
                  <div className="flex">
                    <select
                      value={phoneCountryCode}
                      onChange={(e) => setPhoneCountryCode(e.target.value)}
                      className="h-10 px-2 border border-r-0 border-neutral-200 dark:border-neutral-800 rounded-l-lg text-sm bg-neutral-50 dark:bg-neutral-900 outline-none"
                    >
                      {countryCodes.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                    </select>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`flex-1 h-10 px-3 rounded-r-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:ring-2 focus:ring-primary-500/10 focus:border-primary-600 transition-all ${errors.phone ? 'border-destructive' : ''}`}
                      placeholder="(555) 000-0000"
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Date of Birth *</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className={`w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:ring-2 focus:ring-primary-500/10 focus:border-primary-600 transition-all ${errors.dateOfBirth ? 'border-destructive' : ''}`}
                  />
                  {errors.dateOfBirth && <p className="text-xs text-destructive">{errors.dateOfBirth}</p>}
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Gender *</label>
                <div className="flex gap-4">
                  {["Male", "Female", "Other"].map((g) => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        checked={gender === g}
                        onChange={() => setGender(g)}
                        className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-600"
                      />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">{g}</span>
                    </label>
                  ))}
                </div>
                {errors.gender && <p className="text-xs text-destructive">{errors.gender}</p>}
              </div>
            </section>

            {/* Address Information (Optional) */}
            <section>
              <div className="flex items-center gap-2 mb-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <MapPin className="w-5 h-5 text-primary-600" />
                <h3 className="font-semibold text-neutral-900 dark:text-white">Address Information</h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Street Address</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:ring-2 focus:ring-primary-500/10 focus:border-primary-600 transition-all"
                    placeholder="123 Main St"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:ring-2 focus:ring-primary-500/10 focus:border-primary-600 transition-all"
                      placeholder="New York"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">State</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:ring-2 focus:ring-primary-500/10 focus:border-primary-600 transition-all"
                    >
                      <option value="">Select State</option>
                      {usStates.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Zip Code</label>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:ring-2 focus:ring-primary-500/10 focus:border-primary-600 transition-all"
                      placeholder="10001"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Insurance Information */}
            <section>
              <div className="flex items-center justify-between mb-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary-600" />
                  <h3 className="font-semibold text-neutral-900 dark:text-white">Insurance Information</h3>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasInsurance}
                    onChange={(e) => setHasInsurance(e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-600"
                  />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">Has Insurance</span>
                </label>
              </div>

              {hasInsurance && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Provider *</label>
                      <input
                        type="text"
                        value={insuranceProvider}
                        onChange={(e) => setInsuranceProvider(e.target.value)}
                        className={`w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:ring-2 focus:ring-primary-500/10 focus:border-primary-600 transition-all ${errors.insuranceProvider ? 'border-destructive' : ''}`}
                        placeholder="Blue Cross Blue Shield"
                      />
                      {errors.insuranceProvider && <p className="text-xs text-destructive">{errors.insuranceProvider}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Policy Number *</label>
                      <input
                        type="text"
                        value={policyNumber}
                        onChange={(e) => setPolicyNumber(e.target.value)}
                        className={`w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:ring-2 focus:ring-primary-500/10 focus:border-primary-600 transition-all ${errors.policyNumber ? 'border-destructive' : ''}`}
                        placeholder="POL123456789"
                      />
                      {errors.policyNumber && <p className="text-xs text-destructive">{errors.policyNumber}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Policyholder Name *</label>
                      <input
                        type="text"
                        value={policyHolderName}
                        onChange={(e) => setPolicyHolderName(e.target.value)}
                        className={`w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:ring-2 focus:ring-primary-500/10 focus:border-primary-600 transition-all ${errors.policyHolderName ? 'border-destructive' : ''}`}
                        placeholder="John Doe"
                      />
                      {errors.policyHolderName && <p className="text-xs text-destructive">{errors.policyHolderName}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Relationship *</label>
                      <select
                        value={relationshipToPolicyholder}
                        onChange={(e) => setRelationshipToPolicyholder(e.target.value)}
                        className={`w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:ring-2 focus:ring-primary-500/10 focus:border-primary-600 transition-all ${errors.relationshipToPolicyholder ? 'border-destructive' : ''}`}
                      >
                        <option value="">Select Relationship</option>
                        <option value="Self">Self</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Child">Child</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.relationshipToPolicyholder && <p className="text-xs text-destructive">{errors.relationshipToPolicyholder}</p>}
                    </div>
                  </div>
                </div>
              )}
            </section>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 h-11 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-patient-form"
            className="px-8 h-11 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 active:bg-primary-800 transition-all shadow-lg shadow-primary-600/20"
          >
            Save Patient
          </button>
        </div>
      </div>
    </div>
  );
}