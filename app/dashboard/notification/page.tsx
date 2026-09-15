"use client";

import { useState, useEffect, useMemo } from "react";
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
  Search,
  Filter,
  ShieldAlert,
  CalendarCheck,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import Header from "@/app/components/Dashboard/Homepage/Header";
import Card from "@/app/components/Dashboard/Homepage/Card";
import type { NotificationItem, NotificationCategory, NotificationPriority } from "@/app/components/Dashboard/Homepage/NotificationDropdown";
import { useSelector } from "react-redux";
import { RootState } from "@reduxjs/toolkit/query";
import { useAppSelector } from "@/app/redux/hooks";
import type { Lead } from "@/app/redux/leads";

const STORAGE_KEY = "leadwise_dashboard_notifications_v1";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const leads = useAppSelector((state) => state.LeadSlice.Lead) as Lead[];

  const leadNotifications = useMemo<NotificationItem[]>(() => {
    if (!Array.isArray(leads) || leads.length === 0) {
      return [];
    }

    return leads.map((lead, index) => ({
      id: `lead-${lead._id ?? index}`,
      category: "leads",
      type: lead.status === "won" ? "deal_won" : lead.priority === "high" ? "hot_lead" : "new_lead",
      title: lead.personId ? `${lead.personId} Lead` : "New Lead",
      message:
        lead.message ||
        `${lead.email || "Contact"} is ready for review in ${lead.source || "your pipeline"}.`,
      time: lead.lastContactedAt ? new Date(lead.lastContactedAt).toLocaleDateString() : "New",
      timestamp: lead.lastContactedAt ? new Date(lead.lastContactedAt).getTime() : Date.now(),
      unread: false,
      priority: lead.priority === "high" ? "high" : lead.priority === "medium" ? "medium" : "low",
      actionLabel: "View Lead",
      actionUrl: lead._id ? `/dashboard/leads/${lead._id}` : "/dashboard/leads",
      meta: {
        leadName: lead.personId,
        amount: typeof lead.estimatedValue === "number" && lead.estimatedValue > 0 ? `$${lead.estimatedValue.toLocaleString()}` : undefined,
      },
    }));
  }, [leads]);

  const visibleNotifications = notifications.length > 0 ? notifications : leadNotifications;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotifications(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const updateNotifications = (newList: NotificationItem[]) => {
    setNotifications(newList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch {
      // ignore
    }
  };

  const unreadCount = useMemo(() => visibleNotifications.filter((n) => n.unread).length, [visibleNotifications]);

  const categoryCounts = useMemo(() => {
    return {
      all: visibleNotifications.length,
      unread: visibleNotifications.filter((n) => n.unread).length,
      leads: visibleNotifications.filter((n) => n.category === "leads").length,
      followups: visibleNotifications.filter((n) => n.category === "followups").length,
      tasks: visibleNotifications.filter((n) => n.category === "tasks").length,
      system: visibleNotifications.filter((n) => n.category === "system").length,
    };
  }, [visibleNotifications]);

  const filteredNotifications = useMemo(() => {
    return visibleNotifications.filter((n) => {
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
  }, [visibleNotifications, activeCategory, priorityFilter, searchQuery]);

  const markAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, unread: false } : n));
    updateNotifications(updated);
  };

  const toggleReadStatus = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n));
    updateNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, unread: false }));
    updateNotifications(updated);
  };

  const dismissNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    updateNotifications(updated);
  };

  const clearAll = () => {
    updateNotifications([]);
  };

  const resetSample = () => {
    updateNotifications([]);
  };

  const getIconAndBadges = (type: NotificationItem["type"]) => {
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
    { id: "all", label: "All Notifications", count: categoryCounts.all },
    { id: "unread", label: "Unread", count: categoryCounts.unread },
    { id: "leads", label: "Leads", count: categoryCounts.leads },
    { id: "followups", label: "Follow-ups", count: categoryCounts.followups },
    { id: "tasks", label: "Tasks", count: categoryCounts.tasks },
    { id: "system", label: "System Alerts", count: categoryCounts.system },
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
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5CB90]/60 bg-white text-[#5C6D71] shadow-xs hover:border-[#458393] hover:text-[#458393] transition-colors"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h2 className="text-xl font-bold text-[#22303A]">Notification Center</h2>
              <p className="text-xs text-[#5C6D71]">
                Manage all incoming activity, follow-up alerts, and system notifications
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1.5 rounded-lg border border-[#E5CB90]/60 bg-white px-3 py-1.5 text-xs font-semibold text-[#458393] shadow-xs hover:bg-[#FFFDF8] hover:border-[#458393] transition-colors"
              >
                <CheckCheck size={14} />
                <span>Mark All Read</span>
              </button>
            )}
            {notifications.length > 0 ? (
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 rounded-lg border border-[#E5CB90]/60 bg-white px-3 py-1.5 text-xs font-semibold text-[#5C6D71] shadow-xs hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors"
              >
                <Trash2 size={14} />
                <span>Clear All</span>
              </button>
            ) : (
              <button
                onClick={resetSample}
                className="flex items-center gap-1.5 rounded-lg border border-[#E5CB90]/60 bg-white px-3 py-1.5 text-xs font-semibold text-[#458393] shadow-xs hover:bg-[#FFFDF8] transition-colors"
              >
                <RefreshCw size={14} />
                <span>Restore Sample</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters & Content Grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
          {/* Left Category Sidebar */}
          <div className="flex flex-col gap-2">
            <Card>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-[#8A999D]">Categories</h3>
              <div className="flex flex-col gap-1">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                        isActive
                          ? "bg-[#458393] text-white font-semibold shadow-xs"
                          : "text-[#5C6D71] hover:bg-black/5 hover:text-[#22303A]"
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : cat.id === "unread" && cat.count > 0
                            ? "bg-rose-100 text-rose-700"
                            : "bg-black/5 text-[#5C6D71]"
                        }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Right Notifications List */}
          <Card>
            {/* Search & Filter Bar */}
            <div className="mb-4 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between border-b border-[#E5CB90]/30 pb-3">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A999D]" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-[#E5CB90]/60 bg-[#FFFDF8] py-1.5 pl-9 pr-3 text-xs text-[#22303A] outline-none placeholder:text-[#8A999D] focus:border-[#458393] focus:ring-2 focus:ring-[#458393]/10"
                />
              </div>

              {/* Priority Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#5C6D71] shrink-0">Priority:</span>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="rounded-lg border border-[#E5CB90]/60 bg-[#FFFDF8] px-2.5 py-1.5 text-xs text-[#22303A] outline-none focus:border-[#458393]"
                >
                  <option value="all">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            {/* List */}
            <div className="flex flex-col divide-y divide-[#E5CB90]/30">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E5CB90]/20 text-[#458393] mb-3">
                    <CheckCircle2 size={28} strokeWidth={2} />
                  </div>
                  <h4 className="text-base font-bold text-[#22303A]">No notifications found</h4>
                  <p className="mt-1 text-xs text-[#5C6D71] max-w-sm">
                    {searchQuery
                      ? `No notifications matching "${searchQuery}".`
                      : "There are no notifications matching the selected category."}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((item) => {
                  const { icon: Icon, iconColor, iconBg, tag, tagStyle } = getIconAndBadges(item.type);

                  return (
                    <div
                      key={item.id}
                      className={`group flex items-start gap-3.5 py-3.5 px-2 transition-colors rounded-xl ${
                        item.unread ? "bg-[#FFF9EC]/90" : "hover:bg-black/[0.02]"
                      }`}
                    >
                      {/* Icon */}
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${iconBg} shadow-xs mt-0.5`}
                      >
                        <Icon size={18} className={iconColor} strokeWidth={2.2} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold border ${tagStyle}`}
                            >
                              {tag}
                            </span>
                            {item.priority === "urgent" && (
                              <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-rose-700">
                                Urgent
                              </span>
                            )}
                            {item.unread && (
                              <span className="inline-block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-rose-200" />
                            )}
                          </div>
                          <span className="text-xs text-[#8A999D] font-medium">{item.time}</span>
                        </div>

                        <h4
                          className={`text-sm ${
                            item.unread ? "font-bold text-[#22303A]" : "font-semibold text-[#3A4B54]"
                          }`}
                        >
                          {item.title}
                        </h4>

                        <p className="mt-1 text-xs leading-relaxed text-[#5C6D71]">{item.message}</p>

                        {/* Extra metadata */}
                        {item.meta && (
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                            {item.meta.leadName && (
                              <span className="inline-flex items-center gap-1 rounded bg-[#E5CB90]/30 px-2 py-0.5 text-[#3A4B54] font-medium">
                                Lead: <strong>{item.meta.leadName}</strong>
                              </span>
                            )}
                            {item.meta.amount && (
                              <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-emerald-800 font-semibold">
                                Value: {item.meta.amount}
                              </span>
                            )}
                            {item.meta.dueDate && (
                              <span className="inline-flex items-center gap-1 rounded bg-indigo-100 px-2 py-0.5 text-indigo-800">
                                Due: {item.meta.dueDate}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="mt-3 flex items-center gap-2">
                          {item.actionUrl && (
                            <Link
                              href={item.actionUrl}
                              onClick={() => markAsRead(item.id)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[#458393] px-3 py-1 text-xs font-semibold text-white shadow-xs hover:bg-[#346a78] transition-colors"
                            >
                              <span>{item.actionLabel || "View"}</span>
                              <ChevronRight size={13} />
                            </Link>
                          )}
                          <button
                            onClick={() => toggleReadStatus(item.id)}
                            className="rounded-lg border border-[#E5CB90]/60 bg-white px-2.5 py-1 text-xs font-medium text-[#5C6D71] hover:text-[#22303A] hover:bg-[#FFFDF8] transition-colors"
                          >
                            {item.unread ? "Mark read" : "Mark unread"}
                          </button>
                        </div>
                      </div>

                      {/* Right Action buttons */}
                      <button
                        onClick={() => dismissNotification(item.id)}
                        title="Dismiss"
                        className="rounded-lg p-1.5 text-[#8A999D] hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      >
                        <X size={15} />
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
