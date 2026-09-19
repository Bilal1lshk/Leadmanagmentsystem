"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  Bell,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserPlus,
  TrendingUp,
  TrendingDown,
  Trash2,
  CheckCheck,
  X,
  ChevronRight,
  SlidersHorizontal,
  ShieldAlert,
  CalendarCheck,
  CalendarPlus,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import {
  markAsRead,
  markAllAsRead,
  toggleReadStatus,
  dismissNotification,
  clearCategory,
  clearAllNotifications,
  restoreDefaultNotifications,
  type NotificationItem,
  type NotificationCategory,
  type NotificationPriority,
} from "@/app/redux/notifications";

export type { NotificationItem, NotificationCategory, NotificationPriority };

export default function NotificationDropdown() {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const prevIsOpenRef = useRef(isOpen);

  const notifications = useAppSelector(
    (store) => store?.notifications?.notifications || store?.notificationSlice?.notifications || []
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications]
  );

  // When user opens and closes the dropdown (one time), mark all notifications as read so badge count clears
  useEffect(() => {
    if (prevIsOpenRef.current && !isOpen) {
      if (unreadCount > 0) {
        dispatch(markAllAsRead());
      }
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, unreadCount, dispatch]);

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

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (activeCategory === "unread" && !n.unread) return false;
      if (activeCategory !== "all" && activeCategory !== "unread" && n.category !== activeCategory) {
        return false;
      }
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

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  const handleToggleReadStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleReadStatus(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleDismissNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(dismissNotification(id));
  };

  const handleClearAllInView = () => {
    dispatch(clearCategory(activeCategory));
  };

  const handleResetSampleNotifications = () => {
    dispatch(restoreDefaultNotifications());
  };

  // Two colors only: neutral gray for every icon/tag, teal (#458393) reserved
  // for the brand accent — active states, unread signal, and CTAs.
  const getIconAndBadges = (type: NotificationItem["type"]) => {
    switch (type) {
      case "hot_lead":
        return { icon: Flame, tag: "Hot Lead" };
      case "new_lead":
        return { icon: UserPlus, tag: "New Lead" };
      case "deal_won":
        return { icon: TrendingUp, tag: "Won Deal" };
      case "deal_lost":
        return { icon: TrendingDown, tag: "Lost Deal" };
      case "followup_overdue":
        return { icon: AlertTriangle, tag: "Overdue" };
      case "followup_created":
        return { icon: CalendarPlus, tag: "New Follow-up" };
      case "followup_upcoming":
        return { icon: CalendarCheck, tag: "Follow-up" };
      case "task_deadline":
      case "task_assigned":
        return { icon: Clock, tag: "Task" };
      case "system_alert":
      default:
        return { icon: ShieldAlert, tag: "System" };
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
          border border-slate-200 bg-white text-[#22303A] transition-colors duration-200
          hover:border-[#458393]/40 hover:bg-[#458393]/[0.04] hover:text-[#458393] active:scale-95
          focus:outline-none focus:ring-2 focus:ring-[#458393]/20
          ${isOpen ? "border-[#458393]/40 bg-[#458393]/[0.06] text-[#458393]" : ""}
        `}
      >
        <Bell size={18} strokeWidth={2.2} />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#458393] px-1 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div
            className="
              fixed inset-x-3 top-20 z-50 mx-auto max-h-[85vh] max-w-[94vw] flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl
              sm:max-w-[440px]
              md:absolute md:inset-auto md:right-0 md:top-full md:mt-2 md:w-[420px] md:max-h-[600px]
            "
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3.5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-semibold text-[#22303A]">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-[#458393]/10 px-2 py-0.5 text-[11px] font-medium text-[#458393]">
                      {unreadCount} new
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    title="Mark all as read"
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-[11.5px] font-medium text-[#458393] hover:bg-[#458393]/[0.08] transition-colors"
                  >
                    <CheckCheck size={14} />
                    <span className="hidden sm:inline">Mark read</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                  aria-label="Close notifications"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex shrink-0 gap-1.5 overflow-x-auto border-b border-slate-100 px-3 py-2 scrollbar-none">
              {categories.map((tab) => {
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`
                      flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors
                      ${
                        isActive
                          ? "bg-[#458393] text-white"
                          : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                      }
                    `}
                  >
                    <span>{tab.label}</span>
                    {tab.count > 0 && (
                      <span
                        className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold leading-tight ${
                          isActive ? "bg-white/25 text-white" : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-[380px]">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                  <CheckCircle2 size={24} className="text-slate-300 mb-2.5" strokeWidth={1.75} />
                  <h4 className="text-sm font-medium text-slate-600">All caught up</h4>
                  <p className="mt-1 max-w-[220px] text-xs text-slate-400">
                    {activeCategory === "unread"
                      ? "You have no unread notifications right now."
                      : `No notifications in ${activeCategory === "all" ? "the inbox" : activeCategory}.`}
                  </p>
                  {notifications.length === 0 && (
                    <button
                      onClick={handleResetSampleNotifications}
                      className="mt-4 rounded-lg bg-[#458393]/[0.08] px-3 py-1.5 text-xs font-medium text-[#458393] hover:bg-[#458393]/[0.14] transition-colors"
                    >
                      Restore demo alerts
                    </button>
                  )}
                </div>
              ) : (
                filteredNotifications.map((item) => {
                  const { icon: Icon, tag } = getIconAndBadges(item.type);

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleMarkAsRead(item.id)}
                      className={`group relative flex items-start gap-3 p-3.5 transition-colors cursor-pointer ${
                        item.unread ? "bg-[#458393]/[0.03] hover:bg-[#458393]/[0.06]" : "hover:bg-slate-50"
                      }`}
                    >
                      {/* Icon */}
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 mt-0.5">
                        <Icon size={16} className="text-slate-500" strokeWidth={2.2} />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-1.5 mb-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[11px] font-medium text-slate-400">{tag}</span>
                            {item.priority === "urgent" && (
                              <span className="text-[10px] font-semibold uppercase text-[#458393]">
                                Urgent
                              </span>
                            )}
                            {item.unread && <span className="h-1.5 w-1.5 rounded-full bg-[#458393]" />}
                          </div>
                          <span className="text-[11px] font-medium text-slate-400 shrink-0">
                            {item.time}
                          </span>
                        </div>

                        <h4
                          className={`text-[13px] leading-snug ${
                            item.unread ? "font-semibold text-[#22303A]" : "font-medium text-slate-600"
                          }`}
                        >
                          {item.title}
                        </h4>

                        <p className="mt-0.5 text-[12px] leading-relaxed text-slate-500 line-clamp-2">
                          {item.message}
                        </p>

                        {/* Metadata */}
                        {item.meta && (item.meta.leadName || item.meta.amount || item.meta.dueDate) && (
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                            {item.meta.leadName && <span>{item.meta.leadName}</span>}
                            {item.meta.amount && (
                              <span className="font-semibold text-[#458393]">{item.meta.amount}</span>
                            )}
                            {item.meta.dueDate && <span>Due {item.meta.dueDate}</span>}
                          </div>
                        )}

                        {/* Action CTA */}
                        {item.actionUrl && (
                          <div className="mt-2.5">
                            <Link
                              href={item.actionUrl}
                              onClick={() => {
                                handleMarkAsRead(item.id);
                                setIsOpen(false);
                              }}
                              className="inline-flex items-center gap-1 rounded-md bg-[#458393] px-2.5 py-1 text-[11.5px] font-medium text-white hover:bg-[#3a6f7c] transition-colors"
                            >
                              <span>{item.actionLabel || "View"}</span>
                              <ChevronRight size={12} />
                            </Link>
                          </div>
                        )}
                      </div>

                      {/* Hover Actions */}
                      <div className="flex flex-col items-center gap-1 self-start opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => handleToggleReadStatus(item.id, e)}
                          title={item.unread ? "Mark as read" : "Mark as unread"}
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-[#458393] transition-colors"
                        >
                          <CheckCircle2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDismissNotification(item.id, e)}
                          title="Dismiss notification"
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex shrink-0 items-center justify-between border-t border-slate-100 px-4 py-2.5">
              <div>
                {filteredNotifications.length > 0 && (
                  <button
                    onClick={handleClearAllInView}
                    className="flex items-center gap-1 text-[11.5px] text-slate-500 hover:text-slate-700 transition-colors"
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
                  className="text-[12px] font-medium text-[#458393] hover:underline transition-colors"
                >
                  View full history
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setIsOpen(false)}
                  title="Notification settings"
                  className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
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