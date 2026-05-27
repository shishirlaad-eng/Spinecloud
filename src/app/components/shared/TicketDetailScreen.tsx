import { useState } from "react";
import { 
  ChevronLeft, 
  Send, 
  Paperclip, 
  Download, 
  User, 
  Tag, 
  MessageSquare,
  FileText,
  Calendar,
} from "lucide-react";
import { ClinicAdminLayout } from "../clinic-admin/layout/ClinicAdminLayout";
import { DashboardLayout } from "../layout/DashboardLayout";

interface Message {
  id: string;
  author: string;
  role: string;
  avatar?: string;
  content: string;
  timestamp: string;
  isYou: boolean;
}

interface Attachment {
  name: string;
  size: string;
  url: string;
}

interface Ticket {
  id: string;
  ticketId: string;
  subject: string;
  category: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  createdBy: string;
  createdByRole: string;
  createdAt: string;
  messageCount: number;
  description: string;
  attachments?: Attachment[];
}

interface TicketDetailScreenProps {
  ticket: Ticket;
  messages: Message[];
  portal: "admin" | "patient" | "provider";
  onBack: () => void;
  onUpdateStatus?: (status: Ticket["status"]) => void;
  onSendReply: (message: string, attachments?: File[]) => void;
  // Layout props
  activeMenu?: string;
  onNavigate: (menu: string) => void;
  onLogout?: () => void;
  onNavigateToProfile?: () => void;
  currentEntity?: "patient" | "clinicAdmin" | "provider" | "clinic-staff";
  onEntitySwitch?: (entity: "patient" | "clinicAdmin" | "provider" | "clinic-staff") => void;
  // Notification props
  unreadNotificationsCount?: number;
  onNavigateToNotifications?: () => void;
  notifications?: any[];
}

export function TicketDetailScreen({
  ticket,
  messages: initialMessages,
  portal,
  onBack,
  onUpdateStatus,
  onSendReply,
  onNavigate,
  onLogout,
  onNavigateToProfile,
  currentEntity,
  onEntitySwitch,
  unreadNotificationsCount,
  onNavigateToNotifications,
  notifications,
  activeMenu,
}: TicketDetailScreenProps) {
  const [replyText, setReplyText] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [currentStatus, setCurrentStatus] = useState<Ticket["status"]>(ticket.status);

  const handleSend = () => {
    if (!replyText.trim()) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      author: "You",
      role: portal === "admin" ? "Clinic Admin" : portal === "patient" ? "Patient" : "Provider",
      content: replyText,
      timestamp: new Date().toISOString(),
      isYou: true
    };
    
    setMessages([...messages, newMessage]);
    onSendReply(replyText);
    setReplyText("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800";
      case "In Progress":
        return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800";
      case "Resolved":
        return "bg-success-100 text-success-700 border-success-200 dark:bg-success-950/30 dark:text-success-400 dark:border-success-800";
      case "Closed":
        return "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700";
      default:
        return "bg-neutral-100 text-neutral-600 border-neutral-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const content = (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-4 group"
          >
            <ChevronLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to tickets
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
              Ticket <span className="text-neutral-400 font-medium">#{ticket.ticketId}</span>
            </h1>
            {portal === "admin" ? (
              <select
                value={currentStatus}
                onChange={(e) => {
                  const newStatus = e.target.value as Ticket["status"];
                  setCurrentStatus(newStatus);
                  onUpdateStatus?.(newStatus);
                }}
                className={`text-xs font-bold px-3 py-1.5 rounded-full border outline-none cursor-pointer transition-all shadow-sm ${getStatusColor(currentStatus)}`}
              >
                <option value="Open">OPEN</option>
                <option value="In Progress">IN PROGRESS</option>
                <option value="Resolved">RESOLVED</option>
                <option value="Closed">CLOSED</option>
              </select>
            ) : (
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${getStatusColor(currentStatus)}`}>
                {currentStatus}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Details Card */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
        <div className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-neutral-100 dark:divide-neutral-800 border-b border-neutral-100 dark:border-neutral-800">
            <div className="p-5 space-y-1.5">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Created By</p>
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-full bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center text-[10px] font-bold text-primary-600">
                  {ticket.createdBy[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-900 dark:text-white leading-none">{ticket.createdBy}</p>
                  <p className="text-[10px] font-medium text-neutral-500 mt-0.5">{ticket.createdByRole}</p>
                </div>
              </div>
            </div>
            <div className="p-5 space-y-1.5">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Category</p>
              <div className="flex items-center gap-2 text-neutral-900 dark:text-white">
                <Tag className="size-3.5 text-neutral-400" />
                <p className="text-sm font-bold">{ticket.category}</p>
              </div>
            </div>
            <div className="p-5 space-y-1.5">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Created Date</p>
              <div className="flex items-center gap-2 text-neutral-900 dark:text-white">
                <Calendar className="size-3.5 text-neutral-400" />
                <p className="text-sm font-bold">{formatDate(ticket.createdAt)}</p>
              </div>
            </div>
            <div className="p-5 space-y-1.5">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Messages</p>
              <div className="flex items-center gap-2 text-neutral-900 dark:text-white">
                <MessageSquare className="size-3.5 text-neutral-400" />
                <p className="text-sm font-bold">{messages.length} messages</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-3 tracking-tight">{ticket.subject}</h2>
              <div className="bg-neutral-50 dark:bg-neutral-950/50 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800/50 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed shadow-inner">
                {ticket.description}
              </div>
            </div>

            {ticket.attachments && ticket.attachments.length > 0 && (
              <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">Attachments</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ticket.attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-primary-500/50 hover:shadow-md transition-all group">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="size-10 rounded-lg bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center text-neutral-400 group-hover:text-primary-600 transition-colors">
                          <FileText className="size-5" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300 truncate">{file.name}</p>
                          <p className="text-[10px] text-neutral-500 font-medium">{file.size}</p>
                        </div>
                      </div>
                      <button className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/30 rounded-lg transition-colors">
                        <Download className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conversation Card */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-success-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-widest">Conversation Activity</h3>
          </div>
          <span className="text-[10px] font-medium text-neutral-400">{messages.length} Total Messages</span>
        </div>
        <div className="p-6 space-y-8 max-h-[600px] overflow-y-auto custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.isYou ? "items-end" : "items-start"}`}>
              <div className={`flex items-center gap-3 mb-2 ${msg.isYou ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                  msg.isYou ? "bg-neutral-900 text-white" : "bg-primary-100 text-primary-700"
                }`}>
                  {msg.author[0]}
                </div>
                <div className={`flex flex-col ${msg.isYou ? "items-end" : "items-start"}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">{msg.author}</span>
                    <span className="text-[10px] text-neutral-400 font-medium">{formatTime(msg.timestamp)}</span>
                  </div>
                </div>
              </div>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.isYou 
                  ? "bg-neutral-900 text-white rounded-tr-none" 
                  : "bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-tl-none"
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reply Card */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-widest">Send a Reply</h3>
        </div>
        <div className="p-6">
          <div className="relative group">
            <textarea
              placeholder="Type your detailed response here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full h-32 p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all resize-none dark:text-white shadow-inner"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl text-xs font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:border-primary-500 transition-all">
              <Paperclip className="size-4" />
              Attach File(s)
            </button>
            <button 
              onClick={handleSend}
              disabled={!replyText.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-600/20 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              <Send className="size-4" />
              Submit Response
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (portal === "admin") {
    return (
      <ClinicAdminLayout 
        activeMenu={activeMenu || "tickets"} 
        onNavigate={onNavigate} 
        onLogout={onLogout}
        onNavigateToProfile={onNavigateToProfile}
        onNavigateToNotifications={onNavigateToNotifications}
        unreadNotificationsCount={unreadNotificationsCount}
      >
        {content}
      </ClinicAdminLayout>
    );
  }

  return (
    <DashboardLayout 
      activeMenu={(activeMenu as any) || "tickets"} 
      onNavigate={onNavigate as any} 
      onLogout={onLogout}
      currentEntity={currentEntity}
      onEntitySwitch={onEntitySwitch}
      onNavigateToProfile={onNavigateToProfile}
      onNavigateToNotifications={onNavigateToNotifications}
      notifications={notifications}
    >
      {content}
    </DashboardLayout>
  );
}
