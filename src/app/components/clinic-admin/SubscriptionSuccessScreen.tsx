import { CheckCircle, ArrowRight } from "lucide-react";

interface SubscriptionSuccessScreenProps {
  organizationName: string;
  planName: string;
  onContinueToDashboard: () => void;
}

export function SubscriptionSuccessScreen({
  organizationName,
  planName,
  onContinueToDashboard,
}: SubscriptionSuccessScreenProps) {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <div>
            <h1 className="text-3xl font-semibold text-neutral-900">SpineCloudIQ</h1>
            <div className="w-16 h-1 bg-primary-600 rounded-full mt-3"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-success-50 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-success-600" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-neutral-900 mb-3">
            Welcome to SpineCloudIQ!
          </h2>
          <p className="text-sm text-neutral-600 mb-8 max-w-md mx-auto">
            Your {planName} subscription has been successfully activated for {organizationName}.
          </p>

          {/* Details */}
          <div className="bg-neutral-50 rounded-lg p-6 mb-8 max-w-md mx-auto">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Organization</span>
                <span className="font-medium text-neutral-900">{organizationName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Plan</span>
                <span className="font-medium text-neutral-900">{planName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Status</span>
                <span className="font-medium text-success-600">Active</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">
              What's next?
            </h3>
            <div className="text-left max-w-md mx-auto space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 text-sm font-medium">
                  1
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">Set up your account password</p>
                  <p className="text-sm text-neutral-600">Create a secure password for your admin account</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 text-sm font-medium">
                  2
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">Configure your clinic</p>
                  <p className="text-sm text-neutral-600">Add branches, providers, and staff members</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 text-sm font-medium">
                  3
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">Start managing appointments</p>
                  <p className="text-sm text-neutral-600">Begin accepting and managing patient bookings</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={onContinueToDashboard}
            className="inline-flex items-center gap-2 h-10 px-6 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors"
          >
            Continue to dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}