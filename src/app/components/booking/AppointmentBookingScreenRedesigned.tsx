import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Clock, DollarSign, AlertCircle } from "lucide-react";

interface Service {
  id: string;
  appointmentCategoryId: string;
  name: string;
  duration: number;
  price: number;
  providerIds: string[];
  locationId: string;
  allowOnlineBooking: boolean;
  bookingStartTime: string;
  bookingEndTime: string;
  slotCapacity: number;
  isActive: boolean;
}

interface AppointmentCategory {
  id: string;
  name: string;
}

interface ClinicLocation {
  id: string;
  name: string;
  address: string;
}

interface Provider {
  id: string;
  firstName: string;
  lastName: string;
}

interface TimeSlot {
  time: string;
  display: string;
  available: boolean;
  currentCapacity: number;
  maxCapacity: number;
}

interface AppointmentBookingScreenRedesignedProps {
  selectedClinic: ClinicLocation;
  selectedProvider: Provider;
  services: Service[];
  appointmentCategories: AppointmentCategory[];
  existingAppointments?: any[]; // For checking capacity
  onBack: () => void;
  onContinue: (data: {
    service: Service;
    date: string;
    timeSlot: string;
  }) => void;
}

export function AppointmentBookingScreenRedesigned({
  selectedClinic,
  selectedProvider,
  services,
  appointmentCategories,
  existingAppointments = [],
  onBack,
  onContinue,
}: AppointmentBookingScreenRedesignedProps) {
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  
  // Filter services for online booking and active status
  const availableServices = services.filter(
    (s) => s.isActive && s.allowOnlineBooking && s.locationId === selectedClinic.id
  );

  const selectedService = availableServices.find((s) => s.id === selectedServiceId);

  // Generate time slots based on service configuration
  const generateTimeSlots = (): TimeSlot[] => {
    if (!selectedService || !selectedDate) return [];

    const slots: TimeSlot[] = [];
    const startTime = selectedService.bookingStartTime;
    const endTime = selectedService.bookingEndTime;
    const duration = selectedService.duration;

    // Convert time strings to minutes
    const timeToMinutes = (time: string) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };

    // Convert minutes to time string
    const minutesToTime = (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
    };

    // Format time for display
    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${displayHour}:${minutes} ${ampm}`;
    };

    let currentMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    while (currentMinutes + duration <= endMinutes) {
      const slotTime = minutesToTime(currentMinutes);
      const slotEndTime = minutesToTime(currentMinutes + duration);

      // Check how many appointments exist for this slot
      const appointmentsInSlot = existingAppointments.filter(
        (apt) =>
          apt.date === selectedDate &&
          apt.time === slotTime &&
          apt.serviceId === selectedServiceId &&
          apt.status !== "Cancelled"
      );

      const currentCapacity = appointmentsInSlot.length;
      const available = currentCapacity < selectedService.slotCapacity;

      slots.push({
        time: slotTime,
        display: `${formatTime(slotTime)} - ${formatTime(slotEndTime)}`,
        available,
        currentCapacity,
        maxCapacity: selectedService.slotCapacity,
      });

      currentMinutes += duration;
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Generate next 30 days for date selection
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  };

  const availableDates = generateDates();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleContinue = () => {
    if (!selectedService || !selectedDate || !selectedTimeSlot) return;

    onContinue({
      service: selectedService,
      date: selectedDate,
      timeSlot: timeSlots.find((slot) => slot.time === selectedTimeSlot)?.display || "",
    });
  };

  const isFormValid = selectedServiceId && selectedDate && selectedTimeSlot;

  // Reset date and time when service changes
  useEffect(() => {
    setSelectedDate("");
    setSelectedTimeSlot("");
  }, [selectedServiceId]);

  // Reset time when date changes
  useEffect(() => {
    setSelectedTimeSlot("");
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-5">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white">
            SpineCloudIQ
          </h1>
          <div className="w-16 h-1 bg-primary-600 rounded-full mx-auto mt-3" />
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm">
          {/* Back Button */}
          <div className="px-6 pt-6">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back
            </button>
          </div>

          {/* Header */}
          <div className="px-6 py-4 text-center border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Book appointment
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Select service, date, and time
            </p>
          </div>

          {/* Form */}
          <div className="p-6 space-y-6">
            {/* Selected Details */}
            <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">Clinic</span>
                <span className="font-medium text-neutral-900 dark:text-white">
                  {selectedClinic.name}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">Provider</span>
                <span className="font-medium text-neutral-900 dark:text-white">
                  {selectedProvider.firstName} {selectedProvider.lastName}
                </span>
              </div>
            </div>

            {/* Service Selection */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Select service <span className="text-destructive">*</span>
              </label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
              >
                <option value="">Choose a service</option>
                {availableServices.map((service) => {
                  const category = appointmentCategories.find(
                    (c) => c.id === service.appointmentCategoryId
                  );
                  return (
                    <option key={service.id} value={service.id}>
                      {service.name} - {service.duration} mins - {formatPrice(service.price)}
                      {category ? ` (${category.name})` : ""}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Service Details */}
            {selectedService && (
              <div className="p-4 bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg">
                <div className="flex items-start gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-primary-700 dark:text-primary-300">
                    Service details
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-primary-700 dark:text-primary-300">
                    <Clock className="w-4 h-4" />
                    <span>Duration: {selectedService.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-primary-700 dark:text-primary-300">
                    <DollarSign className="w-4 h-4" />
                    <span>Price: {formatPrice(selectedService.price)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-primary-700 dark:text-primary-300">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Available: {formatTime(selectedService.bookingStartTime)} -{" "}
                      {formatTime(selectedService.bookingEndTime)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Date Selection */}
            {selectedService && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Select date <span className="text-destructive">*</span>
                </label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                >
                  <option value="">Choose a date</option>
                  {availableDates.map((date) => (
                    <option key={date} value={date}>
                      {formatDate(date)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Time Slot Selection */}
            {selectedService && selectedDate && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Select time <span className="text-destructive">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 bg-neutral-50 dark:bg-neutral-900">
                  {timeSlots.length === 0 ? (
                    <div className="col-span-2 text-center py-6">
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        No time slots available for this date
                      </p>
                    </div>
                  ) : (
                    timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => slot.available && setSelectedTimeSlot(slot.time)}
                        disabled={!slot.available}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                          selectedTimeSlot === slot.time
                            ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400 ring-2 ring-primary-500/20"
                            : slot.available
                            ? "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white hover:border-primary-400"
                            : "border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 cursor-not-allowed"
                        }`}
                      >
                        <div>{slot.display}</div>
                        {selectedService.slotCapacity > 1 && (
                          <div className="text-xs mt-1">
                            {slot.available
                              ? `${slot.maxCapacity - slot.currentCapacity} of ${slot.maxCapacity} available`
                              : "Fully booked"}
                          </div>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <button
              onClick={handleContinue}
              disabled={!isFormValid}
              className="w-full h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function for time formatting
function formatTime(time: string) {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
}
