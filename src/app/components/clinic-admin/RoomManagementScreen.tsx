import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { Search, Plus, Filter, ArrowUpDown, X, Download } from "lucide-react";
import { useState } from "react";

interface Room {
  id: string;
  roomId: string; // Room identifier like "R-001", "R-002"
  roomName: string;
  roomType: string;
  cleanupTime: number; // in minutes
  status: "Active" | "Inactive";
  notes?: string;
  addedDate: string;
  updatedDate: string;
}

interface RoomManagementScreenProps {
  rooms: Room[];
  onNavigate: (menu: "dashboard" | "branches" | "questionnaires" | "roles" | "users" | "providers" | "consentForms" | "patients" | "master" | "subscription" | "calendar" | "appointment-categories" | "invoices" | "payments" | "reports" | "activityLog" | "auditLog" | "rooms") => void;
  onAddRoom?: () => void;
  onViewRoom: (roomId: string) => void;
  onLogout?: () => void;
}

export function RoomManagementScreen({
  rooms,
  onNavigate,
  onAddRoom,
  onViewRoom,
  onLogout,
}: RoomManagementScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Inactive">("all");
  const [roomTypeFilter, setRoomTypeFilter] = useState<"all" | string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<"roomName" | "roomId" | "roomType" | "cleanupTime" | "addedDate" | "updatedDate">("roomName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Get unique room types for filter
  const uniqueRoomTypes = Array.from(new Set(rooms.map(room => room.roomType)));

  // Filter rooms based on search, status, and room type
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      searchQuery === "" ||
      room.roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.roomId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.roomType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || room.status === statusFilter;

    const matchesRoomType =
      roomTypeFilter === "all" || room.roomType === roomTypeFilter;

    return matchesSearch && matchesStatus && matchesRoomType;
  });

  // Sort filtered rooms
  const sortedRooms = [...filteredRooms].sort((a, b) => {
    let compareValue = 0;
    
    switch (sortField) {
      case "roomName":
        compareValue = a.roomName.localeCompare(b.roomName);
        break;
      case "roomId":
        compareValue = a.roomId.localeCompare(b.roomId);
        break;
      case "roomType":
        compareValue = a.roomType.localeCompare(b.roomType);
        break;
      case "cleanupTime":
        compareValue = a.cleanupTime - b.cleanupTime;
        break;
      case "addedDate":
        compareValue = new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime();
        break;
      case "updatedDate":
        compareValue = new Date(a.updatedDate).getTime() - new Date(b.updatedDate).getTime();
        break;
    }
    
    return sortDirection === "asc" ? compareValue : -compareValue;
  });

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const activeFilterCount = 
    (statusFilter !== "all" ? 1 : 0) +
    (roomTypeFilter !== "all" ? 1 : 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <ClinicAdminLayout activeMenu="rooms" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
                Room management
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Manage and view all clinic rooms
              </p>
            </div>
            {onAddRoom && (
              <button
                onClick={onAddRoom}
                className="inline-flex items-center gap-2 h-10 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add room
              </button>
            )}
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by room name, room ID, or type"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
              />
            </div>

            {/* Export Button */}
            <button
              onClick={() => console.log("Exporting rooms...")}
              className="inline-flex items-center gap-2 h-10 px-4 border rounded-lg font-medium transition-colors text-sm bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <Download className="w-4 h-4" />
              Export
            </button>

            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 h-10 px-4 border rounded-lg font-medium transition-colors text-sm ${
                  activeFilterCount > 0
                    ? "bg-primary-50 dark:bg-primary-950/30 border-primary-600 text-primary-700 dark:text-primary-300"
                    : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-600 dark:bg-primary-500 text-white text-xs">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Filter Dropdown */}
              {showFilters && (
                <div className="absolute right-0 top-12 w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg z-10">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Filters
                      </h3>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Status Filter */}
                      <div>
                        <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                          Status
                        </label>
                        <div className="space-y-2">
                          {[
                            { value: "all", label: "All statuses" },
                            { value: "Active", label: "Active" },
                            { value: "Inactive", label: "Inactive" },
                          ].map((option) => (
                            <label
                              key={option.value}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="status"
                                checked={statusFilter === option.value}
                                onChange={() =>
                                  setStatusFilter(option.value as typeof statusFilter)
                                }
                                className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700"
                              />
                              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                                {option.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Room Type Filter */}
                      <div>
                        <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                          Room type
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="roomType"
                              checked={roomTypeFilter === "all"}
                              onChange={() => setRoomTypeFilter("all")}
                              className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700"
                            />
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
                              All types
                            </span>
                          </label>
                          {uniqueRoomTypes.map((type) => (
                            <label
                              key={type}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="roomType"
                                checked={roomTypeFilter === type}
                                onChange={() => setRoomTypeFilter(type)}
                                className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700"
                              />
                              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                                {type}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                      <button
                        onClick={() => {
                          setStatusFilter("all");
                          setRoomTypeFilter("all");
                        }}
                        className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Showing {sortedRooms.length} of {rooms.length} rooms
          </p>
        </div>

        {/* Rooms Table */}
        {sortedRooms.length === 0 ? (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <Search className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              No rooms found
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
              {searchQuery || statusFilter !== "all" || roomTypeFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No rooms have been added yet"}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort("addedDate")}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        Added date
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort("roomId")}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        Room ID
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort("roomName")}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        Room name
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort("roomType")}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        Room type
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort("cleanupTime")}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        Cleanup time
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort("updatedDate")}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        Updated on
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-white">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {sortedRooms.map((room) => (
                    <tr
                      key={room.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors"
                    >
                      {/* Added Date */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {formatDate(room.addedDate)}
                        </p>
                      </td>

                      {/* Room ID */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          {room.roomId}
                        </p>
                      </td>

                      {/* Room Name */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => onViewRoom(room.id)}
                          className="text-left hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                          <p className="text-sm font-medium text-neutral-900 dark:text-white">
                            {room.roomName}
                          </p>
                        </button>
                      </td>

                      {/* Room Type */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {room.roomType}
                        </p>
                      </td>

                      {/* Cleanup Time */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {room.cleanupTime} min
                        </p>
                      </td>

                      {/* Updated Date */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {formatDate(room.updatedDate)}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                            room.status === "Active"
                              ? "bg-success-50 dark:bg-success-950/30 text-success-700 dark:text-success-300"
                              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                          }`}
                        >
                          {room.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ClinicAdminLayout>
  );
}
