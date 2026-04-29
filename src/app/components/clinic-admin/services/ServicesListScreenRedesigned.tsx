import { useState } from "react";
import { ClinicAdminLayout } from "@/app/components/clinic-admin/layout/ClinicAdminLayout";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  FolderOpen, 
  Clock, 
  DollarSign, 
  Users, 
  MapPin, 
  Globe,
  Calendar,
  ChevronDown,
  ChevronUp,
  DoorClosed
} from "lucide-react";

interface ProcedurePhase {
  id: string;
  duration: number; // in minutes
  providerRequired: boolean; // true = ACTIVE, false = PASSIVE
}

interface Service {
  id: string;
  name: string;
  roomId: string; // Room selection
  phases: ProcedurePhase[]; // Procedure phases
  price: number;
  providerIds: string[];
  locationIds: string[]; // Changed from locationId to locationIds (array)
  allowOnlineBooking: boolean;
  bookingStartTime: string; // HH:MM format
  bookingEndTime: string; // HH:MM format
  slotCapacity: number;
  isActive: boolean;
  questionnaireId?: string; // Attached questionnaire
  createdAt: string;
  updatedAt: string;
}

interface Questionnaire {
  id: string;
  categoryName: string;
}

interface Location {
  id: string;
  name: string;
}

interface Provider {
  id: string;
  firstName: string;
  lastName: string;
}

interface Room {
  id: string;
  roomId: string; // Room identifier like "R-001", "R-002"
  roomName: string;
  roomType: string;
  cleanupTime: number; // in minutes
  status: "Active" | "Inactive";
  notes?: string;
}

interface ServicesListScreenRedesignedProps {
  services: Service[];
  locations: Location[];
  providers: Provider[];
  rooms: Room[]; // Add rooms prop
  questionnaires: Questionnaire[]; // New prop for questionnaires
  onNavigate: (menu: string) => void;
  onAddService: () => void;
  onEditService: (serviceId: string) => void;
  onDeleteService: (serviceId: string) => void;
  onLogout?: () => void;
}

export function ServicesListScreenRedesigned({
  services,
  locations,
  providers,
  rooms,
  questionnaires,
  onNavigate,
  onAddService,
  onEditService,
  onDeleteService,
  onLogout,
}: ServicesListScreenRedesignedProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);

  const getLocationName = (locationId: string) => {
    return locations.find((l) => l.id === locationId)?.name || "Unknown";
  };

  const getRoomName = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    return room ? room.roomName : "Unknown";
  };

  const getRoomType = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    return room ? room.roomType : "Unknown";
  };

  const getProviderNames = (providerIds: string[]) => {
    return providerIds
      .map((id) => {
        const provider = providers.find((p) => p.id === id);
        return provider ? `${provider.firstName} ${provider.lastName}` : null;
      })
      .filter(Boolean)
      .join(", ");
  };

  const getTotalDuration = (phases: ProcedurePhase[], roomId: string) => {
    const phaseDuration = phases.reduce((sum, phase) => sum + phase.duration, 0);
    const room = rooms.find(r => r.id === roomId);
    const cleanupTime = room ? room.cleanupTime : 0;
    return phaseDuration + cleanupTime;
  };

  const getActiveDuration = (phases: ProcedurePhase[]) => {
    return phases.filter(p => p.providerRequired).reduce((sum, phase) => sum + phase.duration, 0);
  };

  const getPassiveDuration = (phases: ProcedurePhase[]) => {
    return phases.filter(p => !p.providerRequired).reduce((sum, phase) => sum + phase.duration, 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Filter services
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      searchQuery === "" ||
      service.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const handleDeleteClick = (service: Service) => {
    setSelectedService(service);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedService) {
      onDeleteService(selectedService.id);
      setShowDeleteDialog(false);
    }
  };

  const toggleExpand = (serviceId: string) => {
    setExpandedServiceId(expandedServiceId === serviceId ? null : serviceId);
  };

  return (
    <ClinicAdminLayout activeMenu="services" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        {/* Header */}
        <div className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 px-5 md:px-6 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  Services
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Manage bookable appointment services and configurations
                </p>
              </div>
              <button
                onClick={onAddService}
                className="inline-flex items-center gap-2 h-10 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                Add service
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-5 md:px-6 py-6">
          {filteredServices.length === 0 ? (
            <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-12 text-center">
              <FolderOpen className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-neutral-900 dark:text-white mb-2">
                {searchQuery ? "No services found" : "No services yet"}
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Create your first service to get started"}
              </p>
              {!searchQuery && (
                <button
                  onClick={onAddService}
                  className="inline-flex items-center gap-2 h-10 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add service
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Service name
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Duration
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Location
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Price
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Status
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((service) => {
                    const isExpanded = expandedServiceId === service.id;
                    
                    return [
                      // Main Row
                      <tr
                        key={service.id}
                        className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleExpand(service.id)}
                              className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                              )}
                            </button>
                            <div>
                              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                {service.name}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                {service.roomId && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full text-xs font-medium">
                                    <DoorClosed className="w-3 h-3" />
                                    {getRoomType(service.roomId)}
                                  </span>
                                )}
                                {service.allowOnlineBooking && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-100 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium">
                                    <Globe className="w-3 h-3" />
                                    Online booking
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {service.phases && service.phases.length > 0 ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                                <span className="text-sm font-medium text-neutral-900 dark:text-white">
                                  {getTotalDuration(service.phases, service.roomId)} mins
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                {getActiveDuration(service.phases) > 0 && (
                                  <span className="text-success-600 dark:text-success-400 font-medium">
                                    {getActiveDuration(service.phases)}m ACTIVE
                                  </span>
                                )}
                                {getPassiveDuration(service.phases) > 0 && (
                                  <span className="text-neutral-600 dark:text-neutral-400 font-medium">
                                    {getPassiveDuration(service.phases)}m PASSIVE
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                                No phases
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {service.locationIds && service.locationIds.length > 0
                              ? service.locationIds.map(locationId => getLocationName(locationId)).join(', ')
                              : 'No locations assigned'}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-neutral-900 dark:text-white">
                            {formatPrice(service.price)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm ${
                              service.isActive
                                ? "bg-success-100 dark:bg-success-950/30 text-success-700 dark:text-success-400"
                                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                            }`}
                          >
                            {service.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onEditService(service.id)}
                              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                              title="Edit service"
                            >
                              <Edit2 className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(service)}
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                              title="Delete service"
                            >
                              <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>,

                      // Expanded Row
                      isExpanded && (
                        <tr key={`${service.id}-expanded`} className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
                          <td colSpan={6} className="px-6 py-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* Providers */}
                              <div>
                                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
                                  <Users className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                                  Assigned providers
                                </h4>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                  {getProviderNames(service.providerIds) || "No providers assigned"}
                                </p>
                              </div>

                              {/* Booking Time */}
                              <div>
                                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                                  Booking hours
                                </h4>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                  {formatTime(service.bookingStartTime)} - {formatTime(service.bookingEndTime)}
                                </p>
                              </div>

                              {/* Slot Capacity */}
                              <div>
                                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
                                  <Globe className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                                  Slot capacity
                                </h4>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                  {service.slotCapacity} patient{service.slotCapacity !== 1 ? "s" : ""} per slot
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )
                    ].filter(Boolean);
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg w-full max-w-md">
            <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Delete service
              </h3>
            </div>
            <div className="p-5">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Are you sure you want to delete <span className="font-medium text-neutral-900 dark:text-white">{selectedService.name}</span>? This action cannot be undone.
              </p>
            </div>
            <div className="px-5 pb-5 flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 h-10 bg-destructive text-white rounded-lg hover:bg-destructive/90 transition-colors font-medium text-sm"
              >
                Delete service
              </button>
            </div>
          </div>
        </div>
      )}
    </ClinicAdminLayout>
  );
}