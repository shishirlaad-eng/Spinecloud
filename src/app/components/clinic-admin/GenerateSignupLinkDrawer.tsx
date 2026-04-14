import { X, Mail, Copy, Check } from "lucide-react";
import { useState } from "react";

interface GenerateSignupLinkDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (email: string, firstName: string, lastName: string, city: string, state: string, country: string, notes: string) => void;
}

export function GenerateSignupLinkDrawer({
  isOpen,
  onClose,
  onGenerate,
}: GenerateSignupLinkDrawerProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generatedLink, setGeneratedLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!city.trim()) {
      newErrors.city = "City is required";
    }

    if (!state.trim()) {
      newErrors.state = "State is required";
    }

    if (!country.trim()) {
      newErrors.country = "Country is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Generate a unique signup link (mock for now)
    const uniqueId = Math.random().toString(36).substring(2, 15);
    const link = `${window.location.origin}/patient-signup?token=${uniqueId}`;
    setGeneratedLink(link);

    // Call the onGenerate callback
    onGenerate(email.trim(), firstName.trim(), lastName.trim(), city.trim(), state.trim(), country.trim(), notes.trim());
  };

  const handleCopyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleClose = () => {
    // Reset form
    setEmail("");
    setFirstName("");
    setLastName("");
    setCity("");
    setState("");
    setCountry("");
    setNotes("");
    setErrors({});
    setGeneratedLink("");
    setIsCopied(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white dark:bg-neutral-900 z-50 overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Generate sign-up link
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleGenerate} className="p-6 space-y-6">
          {!generatedLink ? (
            <>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Enter the patient's details to generate a personalized sign-up link. The link will be sent to their email address.
              </p>

              {/* Patient Info */}
              <div className="space-y-4">
                {/* Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                      First name <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                      placeholder="Enter first name"
                    />
                    {errors.firstName && (
                      <p className="text-xs text-destructive mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                      Last name <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                      placeholder="Enter last name"
                    />
                    {errors.lastName && (
                      <p className="text-xs text-destructive mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                    Email address <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                    placeholder="email@example.com"
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Location */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                      City <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                      placeholder="Enter city"
                    />
                    {errors.city && (
                      <p className="text-xs text-destructive mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="state" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                      State <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="state"
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                      placeholder="Enter state"
                    />
                    {errors.state && (
                      <p className="text-xs text-destructive mt-1">{errors.state}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="country" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                      Country <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="country"
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                      placeholder="Enter country"
                    />
                    {errors.country && (
                      <p className="text-xs text-destructive mt-1">{errors.country}</p>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                    Staff notes <span className="text-sm font-normal text-neutral-500">(Optional)</span>
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="flex min-h-24 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow] resize-none"
                    placeholder="Add any notes about this patient (visible to staff only)"
                  />
                </div>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg">
                <div className="flex gap-3">
                  <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-primary-900 dark:text-primary-100 font-medium mb-1">
                      Email will be sent automatically
                    </p>
                    <p className="text-sm text-primary-700 dark:text-primary-300">
                      A personalized registration link will be sent to the patient's email address. They can use this link to complete their registration.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={handleClose}
                  className="h-10 px-4 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm"
                >
                  Generate and send link
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="space-y-6">
                {/* Success Message */}
                <div className="p-4 bg-success-50 dark:bg-success-950/30 border border-success-200 dark:border-success-800 rounded-lg">
                  <div className="flex gap-3">
                    <Check className="w-5 h-5 text-success-600 dark:text-success-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-success-900 dark:text-success-100 font-medium mb-1">
                        Link generated successfully
                      </p>
                      <p className="text-sm text-success-700 dark:text-success-300">
                        A registration link has been sent to <span className="font-medium">{email}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Generated Link */}
                <div>
                  <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                    Generated link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={generatedLink}
                      readOnly
                      className="flex h-10 flex-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="h-10 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm inline-flex items-center gap-2"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5">
                    You can also copy this link to share it manually
                  </p>
                </div>

                {/* Patient Info Summary */}
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                    Patient information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600 dark:text-neutral-400">Name:</span>
                      <span className="text-neutral-900 dark:text-white font-medium">
                        {firstName} {lastName}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600 dark:text-neutral-400">Email:</span>
                      <span className="text-neutral-900 dark:text-white font-medium">{email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600 dark:text-neutral-400">Location:</span>
                      <span className="text-neutral-900 dark:text-white font-medium">
                        {city}, {state}, {country}
                      </span>
                    </div>
                    {notes && (
                      <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
                        <span className="text-neutral-600 dark:text-neutral-400 text-sm block mb-1">
                          Notes:
                        </span>
                        <p className="text-sm text-neutral-900 dark:text-white">{notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Close Button */}
                <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="h-10 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm"
                  >
                    Done
                  </button>
                </div>
              </div>
            </>
          )}
        </form>
      </div>
    </>
  );
}