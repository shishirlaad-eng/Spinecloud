import { useState } from "react";
import { Check, Building2, Users, Calendar, FileText, MessageSquare, DollarSign, BarChart3 } from "lucide-react";

interface SubscriptionSelectionScreenProps {
  onSelectPlan: (planId: string, billingCycle: "monthly" | "yearly") => void;
  onNavigateToLogin: () => void;
}

interface PlanFeature {
  name: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  locationLimit: string;
  userLimit: string;
  bestFor: string;
  features: PlanFeature[];
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 99,
    yearlyPrice: 79,
    locationLimit: "1 location",
    userLimit: "Up to 5 users",
    bestFor: "Small clinics getting started",
    features: [
      { name: "Scheduling", included: true },
      { name: "Intake forms", included: true },
      { name: "Basic messaging", included: true },
      { name: "Billing", included: false },
      { name: "Advanced reports", included: false },
    ],
  },
  {
    id: "professional",
    name: "Professional",
    monthlyPrice: 249,
    yearlyPrice: 199,
    locationLimit: "Up to 5 locations",
    userLimit: "Up to 25 users",
    bestFor: "Growing multi-location practices",
    popular: true,
    features: [
      { name: "Scheduling", included: true },
      { name: "Intake forms", included: true },
      { name: "Messaging", included: true },
      { name: "Billing", included: true },
      { name: "Advanced reports", included: true },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: 499,
    yearlyPrice: 399,
    locationLimit: "Unlimited locations",
    userLimit: "Unlimited users",
    bestFor: "Large healthcare organizations",
    features: [
      { name: "Scheduling", included: true },
      { name: "Intake forms", included: true },
      { name: "Messaging", included: true },
      { name: "Billing", included: true },
      { name: "Advanced reports", included: true },
      { name: "Priority support", included: true },
    ],
  },
];

export function SubscriptionSelectionScreen({
  onSelectPlan,
  onNavigateToLogin,
}: SubscriptionSelectionScreenProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const getPrice = (plan: Plan) => {
    return billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getYearlySavings = (plan: Plan) => {
    return ((plan.monthlyPrice - plan.yearlyPrice) * 12).toFixed(0);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-neutral-900">SpineCloudIQ</h1>
              <div className="w-16 h-1 bg-primary-600 rounded-full mt-3"></div>
            </div>
            <button
              onClick={onNavigateToLogin}
              className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Already have an account? Login
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-neutral-900 mb-3">
            Choose your plan
          </h2>
          <p className="text-sm text-neutral-600 max-w-2xl mx-auto">
            Select the plan that best fits your clinic's needs. Start managing your clinic operations with our comprehensive platform.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-sm font-medium ${billingCycle === "monthly" ? "text-neutral-900" : "text-neutral-500"}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingCycle === "yearly" ? "bg-primary-600" : "bg-neutral-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === "yearly" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === "yearly" ? "text-neutral-900" : "text-neutral-500"}`}>
              Yearly
            </span>
            {billingCycle === "yearly" && (
              <span className="text-xs text-success-600 font-medium bg-success-50 px-2 py-1 rounded-full">
                Save up to 20%
              </span>
            )}
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-xl border-2 p-6 flex flex-col ${
                plan.popular
                  ? "border-primary-500 shadow-lg"
                  : "border-neutral-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-neutral-600 mb-6">{plan.bestFor}</p>

                <div className="mb-4">
                  {billingCycle === "yearly" && (
                    <div className="text-sm text-neutral-500 line-through mb-1">
                      ${plan.monthlyPrice}/month
                    </div>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-semibold text-neutral-900">
                      ${getPrice(plan)}
                    </span>
                    <span className="text-sm text-neutral-600">/month</span>
                  </div>
                  {billingCycle === "yearly" && (
                    <div className="text-sm text-neutral-600 mt-2">
                      ${(getPrice(plan) * 12).toFixed(0)} billed yearly
                    </div>
                  )}
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-neutral-700">
                    <Building2 className="w-4 h-4 text-neutral-500" />
                    <span>{plan.locationLimit}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-700">
                    <Users className="w-4 h-4 text-neutral-500" />
                    <span>{plan.userLimit}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-6 mb-6 flex-1">
                <p className="text-sm font-medium text-neutral-700 mb-4">Features included:</p>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          feature.included
                            ? "text-success-600"
                            : "text-neutral-300"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          feature.included
                            ? "text-neutral-700"
                            : "text-neutral-400"
                        }`}
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onSelectPlan(plan.id, billingCycle)}
                className={`w-full h-10 px-4 rounded-lg font-medium text-sm transition-colors ${
                  plan.popular
                    ? "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800"
                    : "border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                Get started
              </button>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-xl border border-neutral-200 p-8">
          <h3 className="text-xl font-semibold text-neutral-900 mb-6">
            All plans include:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-neutral-900 mb-1">
                  Smart scheduling
                </h4>
                <p className="text-sm text-neutral-600">
                  Automated appointment management and reminders
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-neutral-900 mb-1">
                  Digital intake
                </h4>
                <p className="text-sm text-neutral-600">
                  Customizable patient intake and consent forms
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-neutral-900 mb-1">
                  Secure messaging
                </h4>
                <p className="text-sm text-neutral-600">
                  HIPAA-compliant patient communications
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}