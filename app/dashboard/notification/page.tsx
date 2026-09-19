"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
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
  Search,
  ShieldAlert,
  CalendarCheck,
  CalendarPlus,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import Header from "@/app/components/Dashboard/Homepage/Header";
import Card from "@/app/components/Dashboard/Homepage/Card";
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

export default function NotificationPage() {
  const dispatch = useAppDispatch();
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const notifications = useAppSelector(
    (store) => store?.notifications?.notifications || store?.notificationSlice?.notifications || []
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications]
  );

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
      if (priorityFilter !== "all" && n.priority !== priorityFilter) {
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
  }, [notifications, activeCategory, priorityFilter, searchQuery]);

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  const handleToggleReadStatus = (id: string) => {
    dispatch(toggleReadStatus(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleDismissNotification = (id: string) => {
    dispatch(dismissNotification(id));
  };

  const handleClearAll = () => {
    dispatch(clearAllNotifications());
  };

  const handleResetSample = () => {
    dispatch(restoreDefaultNotifications());
  };

  // Single muted icon style for every type — a small colored dot next to plain text
  // carries the meaning instead of six different icon-background colors.
  const getIconAndBadges = (type: NotificationItem["type"]) => {
    switch (type) {
      case "hot_lead":
        return { icon: Flame, dot: "bg-amber-500", tag: "Hot Lead" };
      case "new_lead":
        return { icon: UserPlus, dot: "bg-[#458393]", tag: "New Lead" };
      case "deal_won":
        return { icon: TrendingUp, dot: "bg-emerald-500", tag: "Won Deal" };
      case "deal_lost":
        return { icon: TrendingDown, dot: "bg-rose-500", tag: "Lost Deal" };
      case "followup_overdue":
        return { icon: AlertTriangle, dot: "bg-rose-500", tag: "Overdue" };
      case "followup_created":
        return { icon: CalendarPlus, dot: "bg-[#458393]", tag: "New Follow-up" };
      case "followup_upcoming":
        return { icon: CalendarCheck, dot: "bg-[#458393]", tag: "Follow-up" };
      case "task_deadline":
      case "task_assigned":
        return { icon: Clock, dot: "bg-slate-400", tag: "Task" };
      case "system_alert":
      default:
        return { icon: ShieldAlert, dot: "bg-slate-400", tag: "System" };
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
    <div className="flex min-h-full w-full bg-[#FFF3C8] font-sans text-[#22303A]">
      <main className="flex min-h-full min-w-0 flex-1 flex-col gap-4 p-4 sm:p-5 lg:p-6">
        <Header />

        {/* Page Top Navigation */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5C6D71] hover:bg-black/5 transition-colors"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h2 className="text-lg font-semibold text-[#22303A]">Notifications</h2>
              {unreadCount > 0 && (
                <p className="text-xs text-[#8A999D]">{unreadCount} unread</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[#458393] hover:bg-[#458393]/[0.06] transition-colors"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
            {notifications.length > 0 ? (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[#8A999D] hover:bg-black/5 hover:text-[#5C6D71] transition-colors"
              >
                <Trash2 size={14} />
                Clear all
              </button>
            ) : (
              <button
                onClick={handleResetSample}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[#458393] hover:bg-[#458393]/[0.06] transition-colors"
              >
                <RefreshCw size={14} />
                Restore sample
              </button>
            )}
          </div>
        </div>

        {/* Filters & Content Grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_1fr]">
          {/* Left Category Sidebar */}
          <Card>
            <div className="flex flex-col gap-0.5">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-[#458393]/[0.08] text-[#458393] font-medium"
                        : "text-[#5C6D71] hover:bg-black/[0.03]"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-xs ${isActive ? "text-[#458393]" : "text-[#B5C0C3]"}`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Right Notifications List */}
          <Card>
            {/* Search & Filter Bar */}
            <div className="mb-3 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between border-b border-black/[0.05] pb-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#B5C0C3]" />
                <input
                  type="text"
                  placeholder="Search notifications"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg bg-black/[0.03] py-1.5 pl-8 pr-3 text-xs text-[#22303A] outline-none placeholder:text-[#B5C0C3] focus:bg-white focus:ring-1 focus:ring-[#458393]/30"
                />
              </div>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="rounded-lg bg-black/[0.03] px-2.5 py-1.5 text-xs text-[#5C6D71] outline-none"
              >
                <option value="all">All priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* List */}
            <div className="flex flex-col">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <CheckCircle2 size={24} className="text-[#B5C0C3] mb-2.5" strokeWidth={1.75} />
                  <p className="text-sm font-medium text-[#5C6D71]">No notifications</p>
                  <p className="mt-1 text-xs text-[#B5C0C3]">
                    {searchQuery ? `Nothing matching "${searchQuery}"` : "You're all caught up"}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((item) => {
                  const { icon: Icon, dot, tag } = getIconAndBadges(item.type);

                  return (
                    <div
                      key={item.id}
                      className={`group flex items-start gap-3 py-3.5 px-1.5 border-b border-black/[0.04] last:border-none transition-colors ${
                        item.unread ? "" : "opacity-70"
                      }`}
                    >
                      {/* Icon */}
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black/[0.03] mt-0.5">
                        <Icon size={15} className="text-[#5C6D71]" strokeWidth={2} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                            <span className="text-[11px] font-medium text-[#8A999D]">{tag}</span>
                            {item.priority === "urgent" && (
                              <span className="text-[10px] font-semibold uppercase text-rose-500">
                                Urgent
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#B5C0C3]">{item.time}</span>
                        </div>

                        <h4 className={`mt-1 text-sm ${item.unread ? "font-semibold" : "font-medium"} text-[#22303A]`}>
                          {item.title}
                        </h4>

                        <p className="mt-0.5 text-xs leading-relaxed text-[#8A999D]">{item.message}</p>

                        {/* Extra metadata */}
                        {item.meta && (item.meta.leadName || item.meta.amount || item.meta.dueDate) && (
                          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-[#8A999D]">
                            {item.meta.leadName && <span>{item.meta.leadName}</span>}
                            {item.meta.amount && (
                              <span className="font-medium text-emerald-600">{item.meta.amount}</span>
                            )}
                            {item.meta.dueDate && <span>Due {item.meta.dueDate}</span>}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="mt-2.5 flex items-center gap-3">
                          {item.actionUrl && (
                            <Link
                              href={item.actionUrl}
                              onClick={() => handleMarkAsRead(item.id)}
                              className="inline-flex items-center gap-1 text-xs font-medium text-[#458393] hover:underline"
                            >
                              {item.actionLabel || "View"}
                              <ChevronRight size={12} />
                            </Link>
                          )}
                          <button
                            onClick={() => handleToggleReadStatus(item.id)}
                            className="text-xs text-[#B5C0C3] hover:text-[#5C6D71] transition-colors"
                          >
                            {item.unread ? "Mark read" : "Mark unread"}
                          </button>
                        </div>
                      </div>

                      {/* Dismiss */}
                      <button
                        onClick={() => handleDismissNotification(item.id)}
                        title="Dismiss"
                        className="opacity-0 group-hover:opacity-100 rounded-lg p-1.5 text-[#B5C0C3] hover:bg-black/5 hover:text-[#5C6D71] transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}