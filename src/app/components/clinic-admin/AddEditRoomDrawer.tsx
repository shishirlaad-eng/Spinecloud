import { X } from "lucide-react";
import { useState, useEffect } from "react";

interface Room {
  id: string;
  roomId: string;
  roomName: string;
  roomType: string;
  cleanupTime: number; // in minutes
  status: "Active" | "Inactive";
  notes?: string;
  addedDate: string;
  updatedDate: string;
}

interface AddEditRoomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  room?: Room; // If provided, we're editing; otherwise, we're adding
  onSave: (roomData: {
    roomId: string;
    roomName: string;
    roomType: string;
    cleanupTime: number;
    status: "Active" | "Inactive";
    notes?: string;
  }) => void;
}

export function AddEditRoomDrawer({ 
  isOpen, 
  onClose, 
  room, 
  onSave 
}: AddEditRoomDrawerProps) {
  const [roomId, setRoomId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [roomType, setRoomType] = useState("");
  const [cleanupTime, setCleanupTime] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Available room types
  const roomTypes = [
    "Examination Room",
    "Treatment Room",
    "Consultation Room",
    "Operating Room",
    "Recovery Room",
    "X-Ray Room",
    "MRI Room",
    "Physical Therapy Room",
    "Laboratory",
    "Storage Room",
    "Office",
  ];

  // Initialize form with room data if editing
  useEffect(() => {
    if (room) {
      setRoomId(room.roomId);
      setRoomName(room.roomName);
      setRoomType(room.roomType);
      setCleanupTime(room.cleanupTime.toString());
      setStatus(room.status);
      setNotes(room.notes || "");
    } else {
      // Reset form when adding new room
      setRoomId("");
      setRoomName("");
      setRoomType("");
      setCleanupTime("");
      setStatus("Active");
      setNotes("");
    }
    setErrors({});
  }, [room, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!roomId.trim()) {
      newErrors.roomId = "Room ID is required";
    }
    if (!roomName.trim()) {
      newErrors.roomName = "Room name is required";
    }
    if (!roomType) {
      newErrors.roomType = "Room type is required";
    }
    if (!cleanupTime.trim()) {
      newErrors.cleanupTime = "Cleanup time is required";
    } else if (isNaN(Number(cleanupTime)) || Number(cleanupTime) <= 0) {
      newErrors.cleanupTime = "Cleanup time must be a positive number";
    }
    if (!status) {
      newErrors.status = "Status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const roomData = {
      roomId: roomId.trim(),
      roomName: roomName.trim(),
      roomType,
      cleanupTime: Number(cleanupTime),
      status,
      notes: notes.trim() || undefined,
    };

    onSave(roomData);
    handleClose();
  };

  const handleClose = () => {
    // Reset form
    setRoomId("");
    setRoomName("");
    setRoomType("");
    setCleanupTime("");
    setStatus("Active");
    setNotes("");
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-neutral-900 shadow-xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              {room ? "Edit room" : "Add room"}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Room ID */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Room ID <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID (e.g., R-001)"
                className={`w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-950 border rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow] ${
                  errors.roomId ? "border-destructive" : "border-neutral-200 dark:border-neutral-800"
                }`}
              />
              {errors.roomId && (
                <p className="mt-1 text-xs text-destructive">{errors.roomId}</p>
              )}
            </div>

            {/* Room Name */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Room name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter room name"
                className={`w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-950 border rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow] ${
                  errors.roomName ? "border-destructive" : "border-neutral-200 dark:border-neutral-800"
                }`}
              />
              {errors.roomName && (
                <p className="mt-1 text-xs text-destructive">{errors.roomName}</p>
              )}
            </div>

            {/* Room Type */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Room type <span className="text-destructive">*</span>
              </label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className={`w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-950 border rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow] ${
                  errors.roomType ? "border-destructive" : "border-neutral-200 dark:border-neutral-800"
                }`}
              >
                <option value="">Select room type</option>
                {roomTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.roomType && (
                <p className="mt-1 text-xs text-destructive">{errors.roomType}</p>
              )}
            </div>

            {/* Cleanup Time */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Cleanup time (in minutes) <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={cleanupTime}
                onChange={(e) => setCleanupTime(e.target.value)}
                placeholder="Enter cleanup time"
                className={`w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-950 border rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow] ${
                  errors.cleanupTime ? "border-destructive" : "border-neutral-200 dark:border-neutral-800"
                }`}
              />
              {errors.cleanupTime && (
                <p className="mt-1 text-xs text-destructive">{errors.cleanupTime}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Status <span className="text-destructive">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")}
                className={`w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-950 border rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow] ${
                  errors.status ? "border-destructive" : "border-neutral-200 dark:border-neutral-800"
                }`}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-xs text-destructive">{errors.status}</p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter any additional notes"
                rows={4}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow] resize-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 h-10 px-4 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-10 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {room ? "Save changes" : "Add room"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
