import { useState } from "react";
import { Calendar, CreditCard, CheckCircle, XCircle, Clock, TrendingUp, AlertTriangle } from "lucide-react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";

interface SubscriptionManagementScreenProps {
  onNavigate: (menu: "dashboard" | "branches" | "questionnaires" | "roles" | "users" | "providers" | "consentForms" | "patients" | "master" | "subscription") => void;
  onUpgrade: () => void;
  onCancel: () => void;
  onLogout?: () => void;
}

interface Subscription {
  id: string;
  plan: string;
  billingCycle: "monthly" | "yearly";
  amount: number;
  startDate: string;
  expirationDate: string;
  duration: string;
  status: "active" | "expired" | "cancelled";
}

// Mock data for demonstration
const mockSubscriptions: Subscription[] = [
  {
    id: "sub_001",
    plan: "Professional",
    billingCycle: "monthly",
    amount: 249,
    startDate: "2026-01-22",
    expirationDate: "2027-01-22",
    duration: "12 months",
    status: "active",
  },
  {
    id: "sub_002",
    plan: "Starter",
    billingCycle: "yearly",
    amount: 948,
    startDate: "2025-01-22",
    expirationDate: "2026-01-22",
    duration: "12 months",
    status: "expired",
  },
  {
    id: "sub_003",
    plan: "Starter",
    billingCycle: "monthly",
    amount: 99,
    startDate: "2024-07-15",
    expirationDate: "2024-12-15",
    duration: "5 months",
    status: "cancelled",
  },
];

export function SubscriptionManagementScreen({
  onNavigate,
  onUpgrade,
  onCancel,
  onLogout,
}: SubscriptionManagementScreenProps) {
  const [subscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const activeSubscription = subscriptions.find((sub) => sub.status === "active");
  const pastSubscriptions = subscriptions.filter((sub) => sub.status !== "active");

  const getStatusBadge = (status: Subscription["status"]) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-success-50 text-success-700 text-sm font-medium rounded-full">
            <CheckCircle className="w-3.5 h-3.5" />
            Active
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 text-neutral-600 text-sm font-medium rounded-full">
            <Clock className="w-3.5 h-3.5" />
            Expired
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-destructive-50 text-destructive text-sm font-medium rounded-full">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleCancelConfirm = () => {
    // Handle cancellation logic here
    setShowCancelDialog(false);
    onCancel();
  };

  return (
    <ClinicAdminLayout
      activeMenu="subscription"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
            Subscription management
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            View and manage your subscription plans
          </p>
        </div>

      {/* Active Subscription Card */}
      {activeSubscription && (
        <div className="bg-white dark:bg-neutral-900 rounded-xl border-2 border-primary-500 dark:border-primary-600 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Current subscription
                </h2>
                {getStatusBadge(activeSubscription.status)}
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Your active subscription plan details
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Plan</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {activeSubscription.plan}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Billing cycle</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white capitalize">
                  {activeSubscription.billingCycle}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Amount</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  ${activeSubscription.amount}/{activeSubscription.billingCycle === "monthly" ? "mo" : "yr"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Start date</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {formatDate(activeSubscription.startDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Expiration date</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {formatDate(activeSubscription.expirationDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Duration</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {activeSubscription.duration}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <button
              onClick={onUpgrade}
              className="inline-flex items-center gap-2 h-9 px-4 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors"
            >
              <TrendingUp className="w-4 h-4" />
              Upgrade plan
            </button>
            <button
              onClick={() => setShowCancelDialog(true)}
              className="inline-flex items-center gap-2 h-9 px-4 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-medium rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel subscription
            </button>
          </div>
        </div>
      )}

      {/* Past Subscriptions */}
      {pastSubscriptions.length > 0 && (
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Subscription history
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              View all your past subscriptions
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Billing
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Start date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Expiration date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {pastSubscriptions.map((subscription) => (
                  <tr key={subscription.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <td className="px-6 py-4 text-sm font-medium text-neutral-900 dark:text-white">
                      {subscription.plan}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400 capitalize">
                      {subscription.billingCycle}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                      ${subscription.amount}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                      {formatDate(subscription.startDate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                      {formatDate(subscription.expirationDate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                      {subscription.duration}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(subscription.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-xl max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-destructive-50 dark:bg-destructive-950/30 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  Cancel subscription
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Are you sure you want to cancel your subscription? You will lose access to all premium features at the end of your current billing period.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="h-9 px-4 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-medium rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Keep subscription
              </button>
              <button
                onClick={handleCancelConfirm}
                className="h-9 px-4 bg-destructive text-white text-sm font-medium rounded-lg hover:bg-destructive/90 transition-colors"
              >
                Cancel subscription
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </ClinicAdminLayout>
  );
}
