"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  Bell,
  Flame,
  AlertTriangle,
  MessageSquare,
  CheckCircle2,
  Clock,
  UserPlus,
  TrendingUp,
  Trash2,
  CheckCheck,
  X,
  ChevronRight,
  SlidersHorizontal,
  ExternalLink,
  ShieldAlert,
  CalendarCheck,
} from "lucide-react";
import { useAppSelector } from "@/app/redux/hooks";

export type NotificationCategory = "all" | "unread" | "leads" | "followups" | "tasks" | "system";
export type NotificationPriority = "urgent" | "high" | "medium" | "low";

export interface NotificationItem {
  id: string;
  category: "leads" | "followups" | "tasks" | "system";
  type:
    | "hot_lead"
    | "new_lead"
    | "deal_won"
    | "followup_overdue"
    | "followup_upcoming"
    | "task_assigned"
    | "task_deadline"
    | "system_alert";
  title: string;
  message: string;
  time: string;
  timestamp: number;
  unread: boolean;
  priority?: NotificationPriority;
  actionLabel?: string;
  actionUrl?: string;
  meta?: {
    leadName?: string;
    amount?: string;
    dueDate?: string;
    assignee?: string;
  };
}

const STORAGE_KEY = "leadwise_dashboard_notifications_v1";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Redux leads integration to supplement dynamic notifications if leads exist
  const reduxLeads = useAppSelector((store) => store?.LeadSlice?.Lead || []);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotifications(parsed);
          return;
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist to local storage when notifications change
  const updateNotifications = (newList: NotificationItem[]) => {
    setNotifications(newList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch {
      // ignore
    }
  };

  // Close dropdown on outside click or Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Counts
  const unreadCount = useMemo(() => notifications.filter((n) => n.unread).length, [notifications]);

  const categoryCounts = useMemo(() => {
    return {
      all: notifications.length,
      unread: notifications.filter((n) => n.unread).length,
      leads: notifications.filter((n) => n.category === "leads").length,
      followups: notifications.filter((n) => n.category === "followups").length,
      tasks: notifications.filter((n) => n.category === "tasks").length,
      system: notifications.filter((n) => n.category === "system").length,
    };
  }, [notifications]);

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      // Category filter
      if (activeCategory === "unread" && !n.unread) return false;
      if (activeCategory !== "all" && activeCategory !== "unread" && n.category !== activeCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = n.title.toLowerCase().includes(q);
        const matchMsg = n.message.toLowerCase().includes(q);
        const matchLead = n.meta?.leadName?.toLowerCase().includes(q);
        return matchTitle || matchMsg || matchLead;
      }
      return true;
    });
  }, [notifications, activeCategory, searchQuery]);

  // Actions
  const markAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, unread: false } : n));
    updateNotifications(updated);
  };

  const toggleReadStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notifications.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n));
    updateNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, unread: false }));
    updateNotifications(updated);
  };

  const dismissNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notifications.filter((n) => n.id !== id);
    updateNotifications(updated);
  };

  const clearAllInView = () => {
    if (activeCategory === "all") {
      updateNotifications([]);
    } else if (activeCategory === "unread") {
      const updated = notifications.map((n) => ({ ...n, unread: false }));
      updateNotifications(updated);
    } else {
      const updated = notifications.filter((n) => n.category !== activeCategory);
      updateNotifications(updated);
    }
  };

  const resetSampleNotifications = () => {
    updateNotifications([]);
  };

  // Helper for notification icons and color tags
  const getIconAndBadges = (type: NotificationItem["type"], priority?: NotificationPriority) => {
    switch (type) {
      case "hot_lead":
        return {
          icon: Flame,
          iconColor: "text-amber-600",
          iconBg: "bg-amber-500/10 border-amber-500/20",
          tag: "Hot Lead",
          tagStyle: "bg-amber-100 text-amber-800 border-amber-200",
        };
      case "new_lead":
        return {
          icon: UserPlus,
          iconColor: "text-[#458393]",
          iconBg: "bg-[#458393]/10 border-[#458393]/20",
          tag: "New Lead",
          tagStyle: "bg-[#458393]/10 text-[#2f6371] border-[#458393]/20",
        };
      case "deal_won":
        return {
          icon: TrendingUp,
          iconColor: "text-emerald-600",
          iconBg: "bg-emerald-500/10 border-emerald-500/20",
          tag: "Won Deal",
          tagStyle: "bg-emerald-100 text-emerald-800 border-emerald-200",
        };
      case "followup_overdue":
        return {
          icon: AlertTriangle,
          iconColor: "text-rose-600",
          iconBg: "bg-rose-500/10 border-rose-500/20",
          tag: "Overdue",
          tagStyle: "bg-rose-100 text-rose-800 border-rose-200",
        };
      case "followup_upcoming":
        return {
          icon: CalendarCheck,
          iconColor: "text-teal-600",
          iconBg: "bg-teal-500/10 border-teal-500/20",
          tag: "Follow-up",
          tagStyle: "bg-teal-100 text-teal-800 border-teal-200",
        };
      case "task_deadline":
      case "task_assigned":
        return {
          icon: Clock,
          iconColor: "text-indigo-600",
          iconBg: "bg-indigo-500/10 border-indigo-500/20",
          tag: "Task Alert",
          tagStyle: "bg-indigo-100 text-indigo-800 border-indigo-200",
        };
      case "system_alert":
      default:
        return {
          icon: ShieldAlert,
          iconColor: "text-slate-600",
          iconBg: "bg-slate-500/10 border-slate-500/20",
          tag: "System",
          tagStyle: "bg-slate-100 text-slate-700 border-slate-200",
        };
    }
  };

  const categories: { id: NotificationCategory; label: string; count: number }[] = [
    { id: "all", label: "All", count: categoryCounts.all },
    { id: "unread", label: "Unread", count: categoryCounts.unread },
    { id: "leads", label: "Leads", count: categoryCounts.leads },
    { id: "followups", label: "Follow-ups", count: categoryCounts.followups },
    { id: "tasks", label: "Tasks", count: categoryCounts.tasks },
    { id: "system", label: "System", count: categoryCounts.system },
  ];

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Notifications"
        aria-expanded={isOpen}
        className={`
          relative flex h-10 w-10 min-h-10 min-w-10 max-h-10 max-w-10 shrink-0 grow-0 items-center justify-center rounded-full
          border border-[#E5CB90]/60 bg-white text-[#22303A] shadow-sm transition-all duration-200
          hover:border-[#458393] hover:bg-[#FFFDF6] hover:text-[#458393] active:scale-95
          focus:outline-none focus:ring-2 focus:ring-[#458393]/20
          ${isOpen ? "border-[#458393] bg-[#FFF8E7] text-[#458393] shadow-md ring-2 ring-[#458393]/20" : ""}
        `}
      >
        <Bell size={18} strokeWidth={2.2} className="transition-transform duration-200 group-hover:rotate-12" />

        {/* Unread badge indicator */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
            <span className="relative flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <>
          {/* Overlay on mobile */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] md:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div
            className="
              fixed inset-x-3 top-20 z-50 mx-auto max-h-[85vh] max-w-[94vw] flex flex-col overflow-hidden rounded-2xl border border-[#E5CB90]/80 bg-white shadow-2xl
              animate-in fade-in zoom-in-95 duration-150
              sm:max-w-[440px]
              md:absolute md:inset-auto md:right-0 md:top-full md:mt-2 md:w-[420px] md:max-h-[600px]
            "
          >
            {/* 1. Header with Title & Quick Controls */}
            <div className="flex shrink-0 items-center justify-between border-b border-[#E5CB90]/40 bg-[#FFFDF8] px-4 py-3.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#458393]/10 text-[#458393]">
                  <Bell size={16} strokeWidth={2.2} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-bold text-[#22303A]">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-[#458393] px-2 py-0.5 text-[11px] font-semibold text-white">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#5C6D71]">Stay updated with leads, tasks & alerts</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    title="Mark all as read"
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-[11.5px] font-medium text-[#458393] hover:bg-[#458393]/10 transition-colors"
                  >
                    <CheckCheck size={14} />
                    <span className="hidden sm:inline">Mark read</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 text-[#5C6D71] hover:bg-slate-100 hover:text-[#22303A] transition-colors"
                  aria-label="Close notifications"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* 2. Category Filter Tabs */}
            <div className="flex shrink-0 gap-1.5 overflow-x-auto border-b border-[#E5CB90]/30 bg-[#FAF7EE] px-3 py-2 scrollbar-none">
              {categories.map((tab) => {
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`
                      flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-150
                      ${
                        isActive
                          ? "bg-[#458393] text-white shadow-xs font-semibold"
                          : "bg-white/80 text-[#5C6D71] border border-[#E5CB90]/40 hover:bg-white hover:text-[#22303A]"
                      }
                    `}
                  >
                    <span>{tab.label}</span>
                    {tab.count > 0 && (
                      <span
                        className={`
                          rounded-full px-1.5 py-0.2 text-[10px] font-bold leading-tight
                          ${
                            isActive
                              ? "bg-white/20 text-white"
                              : tab.id === "unread" && tab.count > 0
                              ? "bg-rose-100 text-rose-700"
                              : "bg-slate-100 text-slate-600"
                          }
                        `}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* 3. Notifications List Area */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#E5CB90]/20 max-h-[380px] bg-[#FFFDFB]">
              {filteredNotifications.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E5CB90]/20 text-[#458393] mb-3">
                    <CheckCircle2 size={24} strokeWidth={2} />
                  </div>
                  <h4 className="text-sm font-bold text-[#22303A]">All caught up!</h4>
                  <p className="mt-1 max-w-[220px] text-xs text-[#5C6D71]">
                    {activeCategory === "unread"
                      ? "You have no unread notifications right now."
                      : `No notifications in ${activeCategory === "all" ? "the inbox" : activeCategory}.`}
                  </p>
                  {notifications.length === 0 && (
                    <div className="mt-4 rounded-lg border border-dashed border-[#E5CB90] bg-[#FFF9EC] px-3 py-2 text-xs text-[#5C6D71]">
                      No notifications yet.
                    </div>
                  )}
                </div>
              ) : (
                filteredNotifications.map((item) => {
                  const { icon: Icon, iconColor, iconBg, tag, tagStyle } = getIconAndBadges(
                    item.type,
                    item.priority
                  );

                  return (
                    <div
                      key={item.id}
                      onClick={() => markAsRead(item.id)}
                      className={`
                        group relative flex items-start gap-3 p-3.5 transition-all duration-150 cursor-pointer
                        ${
                          item.unread
                            ? "bg-[#FFF9EC]/80 hover:bg-[#FFF4DC]"
                            : "hover:bg-slate-50/80 bg-white"
                        }
                      `}
                    >
                      {/* Left Icon */}
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${iconBg} shadow-xs mt-0.5`}
                      >
                        <Icon size={17} className={iconColor} strokeWidth={2.2} />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-1.5 mb-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span
                              className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold border ${tagStyle}`}
                            >
                              {tag}
                            </span>
                            {item.unread && (
                              <span className="inline-block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-rose-200 animate-pulse" />
                            )}
                          </div>
                          <span className="text-[11px] font-medium text-[#8A999D] shrink-0">
                            {item.time}
                          </span>
                        </div>

                        <h4
                          className={`text-[13px] leading-snug ${
                            item.unread ? "font-bold text-[#22303A]" : "font-semibold text-[#3A4B54]"
                          }`}
                        >
                          {item.title}
                        </h4>

                        <p className="mt-0.5 text-[12px] leading-relaxed text-[#5C6D71] line-clamp-2">
                          {item.message}
                        </p>

                        {/* Extra Metadata chips if present */}
                        {item.meta && (
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                            {item.meta.leadName && (
                              <span className="inline-flex items-center gap-1 rounded bg-[#E5CB90]/25 px-1.5 py-0.5 text-[#425055] font-medium">
                                Lead: <strong>{item.meta.leadName}</strong>
                              </span>
                            )}
                            {item.meta.amount && (
                              <span className="inline-flex items-center gap-1 rounded bg-emerald-100/70 px-1.5 py-0.5 text-emerald-800 font-semibold">
                                Value: {item.meta.amount}
                              </span>
                            )}
                            {item.meta.dueDate && (
                              <span className="inline-flex items-center gap-1 rounded bg-indigo-100/70 px-1.5 py-0.5 text-indigo-800">
                                Due: {item.meta.dueDate}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Action CTA link */}
                        {item.actionUrl && (
                          <div className="mt-2.5 flex items-center gap-2">
                            <Link
                              href={item.actionUrl}
                              onClick={(e) => {
                                markAsRead(item.id);
                                setIsOpen(false);
                              }}
                              className="inline-flex items-center gap-1 rounded-md bg-[#458393] px-2.5 py-1 text-[11.5px] font-semibold text-white shadow-xs hover:bg-[#346a78] transition-colors"
                            >
                              <span>{item.actionLabel || "View"}</span>
                              <ChevronRight size={12} />
                            </Link>
                          </div>
                        )}
                      </div>

                      {/* Hover Action Buttons */}
                      <div className="flex flex-col items-center gap-1 self-start opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => toggleReadStatus(item.id, e)}
                          title={item.unread ? "Mark as read" : "Mark as unread"}
                          className="rounded p-1 text-[#8A999D] hover:bg-white hover:text-[#458393] transition-colors"
                        >
                          <CheckCircle2
                            size={14}
                            className={item.unread ? "text-[#8A999D]" : "text-[#458393] fill-[#458393]/20"}
                          />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => dismissNotification(item.id, e)}
                          title="Dismiss notification"
                          className="rounded p-1 text-[#8A999D] hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* 4. Footer Bar */}
            <div className="flex shrink-0 items-center justify-between border-t border-[#E5CB90]/40 bg-[#FFFDF8] px-4 py-2.5">
              <div className="flex items-center gap-2">
                {filteredNotifications.length > 0 && (
                  <button
                    onClick={clearAllInView}
                    className="flex items-center gap-1 text-[11.5px] text-[#5C6D71] hover:text-rose-600 transition-colors"
                  >
                    <Trash2 size={12} />
                    <span>Clear {activeCategory === "all" ? "all" : activeCategory}</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/notification"
                  onClick={() => setIsOpen(false)}
                  className="text-[12px] font-semibold text-[#458393] hover:text-[#2d5c68] hover:underline transition-colors"
                >
                  View full history
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setIsOpen(false)}
                  title="Notification settings"
                  className="rounded-md p-1 text-[#5C6D71] hover:bg-[#458393]/10 hover:text-[#458393] transition-colors"
                >
                  <SlidersHorizontal size={13} />
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
