import { X, Edit2, Calendar, Clock, Tag, FileText } from "lucide-react";

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

interface RoomDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room;
  onEdit: (room: Room) => void;
}

export function RoomDetailsDrawer({ 
  isOpen, 
  onClose, 
  room,
  onEdit 
}: RoomDetailsDrawerProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: "long", 
      day: "numeric", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-neutral-900 shadow-xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Room details
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={() => onEdit(room)}
            className="inline-flex items-center gap-2 h-9 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit room
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Room ID and Status */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  Room ID
                </p>
                <p className="text-2xl font-semibold text-neutral-900 dark:text-white">
                  {room.roomId}
                </p>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                  room.status === "Active"
                    ? "bg-success-50 dark:bg-success-950/30 text-success-700 dark:text-success-300"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                }`}
              >
                {room.status}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              {room.roomName}
            </h3>
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-200 dark:border-neutral-800" />

          {/* Details Grid */}
          <div className="space-y-4">
            {/* Room Type */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center shrink-0">
                <Tag className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-0.5">
                  Room type
                </p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {room.roomType}
                </p>
              </div>
            </div>

            {/* Cleanup Time */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-0.5">
                  Cleanup time
                </p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {room.cleanupTime} minutes
                </p>
              </div>
            </div>

            {/* Added Date */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-0.5">
                  Added on
                </p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {formatDate(room.addedDate)}
                </p>
              </div>
            </div>

            {/* Updated Date */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-0.5">
                  Last updated
                </p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {formatDate(room.updatedDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {room.notes && (
            <>
              <div className="border-t border-neutral-200 dark:border-neutral-800" />
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Notes
                  </h4>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                    {room.notes}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
