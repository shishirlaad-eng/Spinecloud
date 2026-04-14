import { useState } from "react";
import { ArrowLeft, CreditCard, Lock, Check } from "lucide-react";
import type { OrganizationData } from "./OrganizationDetailsScreen";

interface CheckoutScreenProps {
  selectedPlan: {
    id: string;
    name: string;
    billingCycle: "monthly" | "yearly";
    price: number;
    locationLimit: string;
    userLimit: string;
  };
  organizationData: OrganizationData;
  onPaymentSuccess: () => void;
  onBack: () => void;
}

const TEST_CARD_NUMBERS = {
  success: "4242424242424242",
  decline: "4000000000000002",
  insufficient: "4000000000009995",
};

export function CheckoutScreen({
  selectedPlan,
  organizationData,
  onPaymentSuccess,
  onBack,
}: CheckoutScreenProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState(
    `${organizationData.firstName} ${organizationData.lastName}`
  );
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [billingName, setBillingName] = useState(
    `${organizationData.firstName} ${organizationData.lastName}`
  );
  const [billingEmail, setBillingEmail] = useState(organizationData.email);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const validateField = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "cardNumber":
        const cleanedCard = value.replace(/\s/g, "");
        if (!cleanedCard) {
          error = "Card number is required";
        } else if (cleanedCard.length !== 16) {
          error = "Card number must be 16 digits";
        }
        break;
      case "cardName":
      case "billingName":
        if (!value.trim()) {
          error = "This field is required";
        }
        break;
      case "expiryDate":
        if (!value) {
          error = "Expiry date is required";
        } else if (!/^\d{2}\/\d{2}$/.test(value)) {
          error = "Format: MM/YY";
        } else {
          const [month, year] = value.split("/");
          const monthNum = parseInt(month);
          if (monthNum < 1 || monthNum > 12) {
            error = "Invalid month";
          }
        }
        break;
      case "cvv":
        if (!value) {
          error = "CVV is required";
        } else if (!/^\d{3,4}$/.test(value)) {
          error = "CVV must be 3 or 4 digits";
        }
        break;
      case "billingEmail":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Enter a valid email address";
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  const handleBlur = (name: string, value: string) => {
    validateField(name, value);
  };

  const isFormValid = () => {
    const cleanedCard = cardNumber.replace(/\s/g, "");
    return (
      cleanedCard.length === 16 &&
      cardName.trim() &&
      /^\d{2}\/\d{2}$/.test(expiryDate) &&
      /^\d{3,4}$/.test(cvv) &&
      billingName.trim() &&
      billingEmail.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingEmail) &&
      Object.values(errors).every((error) => !error)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError("");

    if (!isFormValid()) {
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const cleanedCard = cardNumber.replace(/\s/g, "");

    // Test card validation
    if (cleanedCard === TEST_CARD_NUMBERS.decline) {
      setPaymentError("Your card was declined. Please try a different card.");
      setIsProcessing(false);
      return;
    }

    if (cleanedCard === TEST_CARD_NUMBERS.insufficient) {
      setPaymentError("Insufficient funds. Please try a different card.");
      setIsProcessing(false);
      return;
    }

    // Success for test card or any other card number
    setIsProcessing(false);
    onPaymentSuccess();
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div>
            <h1 className="text-3xl font-semibold text-neutral-900">SpineCloudIQ</h1>
            <div className="w-16 h-1 bg-primary-600 rounded-full mt-3"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-neutral-200 p-8">
              {/* Back Button */}
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors group mb-6"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back
              </button>

              {/* Title */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                  Payment details
                </h2>
                <p className="text-sm text-neutral-600">
                  Complete your subscription to get started
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Payment Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-neutral-500" />
                    <h3 className="text-sm font-semibold text-neutral-700 tracking-wide">
                      Card information
                    </h3>
                  </div>

                  <div>
                    <label htmlFor="cardNumber" className="text-sm text-neutral-700 font-medium block mb-1.5">
                      Card number <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="cardNumber"
                      type="text"
                      inputMode="numeric"
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={(e) => {
                        const formatted = formatCardNumber(e.target.value.replace(/\s/g, ""));
                        if (formatted.replace(/\s/g, "").length <= 16) {
                          setCardNumber(formatted);
                        }
                      }}
                      onBlur={(e) => handleBlur("cardNumber", e.target.value)}
                      aria-invalid={!!errors.cardNumber}
                      className="flex h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 py-1 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                    />
                    {errors.cardNumber && (
                      <p className="text-xs text-destructive mt-1">{errors.cardNumber}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="cardName" className="text-sm text-neutral-700 font-medium block mb-1.5">
                      Cardholder name <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="cardName"
                      type="text"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      onBlur={(e) => handleBlur("cardName", e.target.value)}
                      aria-invalid={!!errors.cardName}
                      className="flex h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 py-1 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                    />
                    {errors.cardName && (
                      <p className="text-xs text-destructive mt-1">{errors.cardName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="text-sm text-neutral-700 font-medium block mb-1.5">
                        Expiry date <span className="text-destructive">*</span>
                      </label>
                      <input
                        id="expiryDate"
                        type="text"
                        inputMode="numeric"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => {
                          const formatted = formatExpiryDate(e.target.value);
                          if (formatted.replace(/\D/g, "").length <= 4) {
                            setExpiryDate(formatted);
                          }
                        }}
                        onBlur={(e) => handleBlur("expiryDate", e.target.value)}
                        aria-invalid={!!errors.expiryDate}
                        className="flex h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 py-1 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                      />
                      {errors.expiryDate && (
                        <p className="text-xs text-destructive mt-1">{errors.expiryDate}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="cvv" className="text-sm text-neutral-700 font-medium block mb-1.5">
                        CVV <span className="text-destructive">*</span>
                      </label>
                      <input
                        id="cvv"
                        type="text"
                        inputMode="numeric"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 4) {
                            setCvv(value);
                          }
                        }}
                        onBlur={(e) => handleBlur("cvv", e.target.value)}
                        aria-invalid={!!errors.cvv}
                        className="flex h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 py-1 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                      />
                      {errors.cvv && (
                        <p className="text-xs text-destructive mt-1">{errors.cvv}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Billing Details */}
                <div className="space-y-4 pt-6 border-t border-neutral-200">
                  <h3 className="text-sm font-semibold text-neutral-700 tracking-wide">
                    Billing details
                  </h3>

                  <div>
                    <label htmlFor="billingName" className="text-sm text-neutral-700 font-medium block mb-1.5">
                      Billing contact name <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="billingName"
                      type="text"
                      placeholder="John Doe"
                      value={billingName}
                      onChange={(e) => setBillingName(e.target.value)}
                      onBlur={(e) => handleBlur("billingName", e.target.value)}
                      aria-invalid={!!errors.billingName}
                      className="flex h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 py-1 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                    />
                    {errors.billingName && (
                      <p className="text-xs text-destructive mt-1">{errors.billingName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="billingEmail" className="text-sm text-neutral-700 font-medium block mb-1.5">
                      Billing email <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="billingEmail"
                      type="email"
                      placeholder="billing@clinic.com"
                      value={billingEmail}
                      onChange={(e) => setBillingEmail(e.target.value)}
                      onBlur={(e) => handleBlur("billingEmail", e.target.value)}
                      aria-invalid={!!errors.billingEmail}
                      className="flex h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 py-1 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                    />
                    {errors.billingEmail && (
                      <p className="text-xs text-destructive mt-1">{errors.billingEmail}</p>
                    )}
                  </div>
                </div>

                {/* Payment Error */}
                {paymentError && (
                  <div className="p-4 bg-destructive-50 border border-destructive-200 rounded-lg">
                    <p className="text-sm text-destructive">{paymentError}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isFormValid() || isProcessing}
                  className="w-full h-10 px-4 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                >
                  {isProcessing ? "Processing..." : "Complete payment"}
                </button>

                {/* Security Notice */}
                <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
                  <Lock className="w-4 h-4" />
                  <span>Secure 256-bit SSL encrypted payment</span>
                </div>
              </form>
            </div>

            {/* Test Card Info */}
            <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <p className="text-sm font-medium text-primary-900 mb-2">
                Test card numbers
              </p>
              <div className="space-y-1">
                <p className="text-sm text-primary-700">
                  Success: <span className="font-mono">{TEST_CARD_NUMBERS.success}</span>
                </p>
                <p className="text-sm text-primary-700">
                  Decline: <span className="font-mono">{TEST_CARD_NUMBERS.decline}</span>
                </p>
                <p className="text-sm text-primary-700">
                  Insufficient funds: <span className="font-mono">{TEST_CARD_NUMBERS.insufficient}</span>
                </p>
                <p className="text-sm text-primary-600 mt-2">
                  Use any future expiry date and any 3-digit CVV
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-neutral-200 p-6 sticky top-6">
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">
                Order summary
              </h3>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-neutral-900 mb-1">
                    {selectedPlan.name} Plan
                  </p>
                  <p className="text-sm text-neutral-600">
                    {selectedPlan.billingCycle === "monthly" ? "Monthly" : "Yearly"} billing
                  </p>
                </div>

                <div className="space-y-2 text-sm text-neutral-600">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success-600" />
                    <span>{selectedPlan.locationLimit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success-600" />
                    <span>{selectedPlan.userLimit}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-neutral-600">
                    {selectedPlan.billingCycle === "monthly" ? "Monthly" : "Yearly"} subscription
                  </span>
                  <span className="text-sm font-medium text-neutral-900">
                    ${selectedPlan.price}/month
                  </span>
                </div>
                {selectedPlan.billingCycle === "yearly" && (
                  <div className="flex justify-between items-center text-sm text-neutral-500">
                    <span>Billed annually</span>
                    <span>${(selectedPlan.price * 12).toFixed(0)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-neutral-200">
                  <span className="text-sm font-semibold text-neutral-900">Total due today</span>
                  <span className="text-xl font-semibold text-primary-600">
                    ${selectedPlan.billingCycle === "yearly" ? (selectedPlan.price * 12).toFixed(0) : selectedPlan.price}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}