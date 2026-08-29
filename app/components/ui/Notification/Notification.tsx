"use client";

import { useState } from "react";
import {
  Bell,
  Flame,
  AlertTriangle,
  MessageSquare,
  CheckCircle2,
  X,
} from "lucide-react";

const initialNotifications = [
  {
    id: 1,
    icon: Flame,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    title: "Hot lead alert",
    message: "John Smith scored 92/100 — contact today",
    time: "5 min ago",
    unread: true,
  },
  {
    id: 2,
    icon: AlertTriangle,
    color: "text-slate-300",
    bg: "bg-slate-500/10",
    title: "Follow-up overdue",
    message: "8 leads haven't been contacted in 7 days",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    icon: MessageSquare,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    title: "New message",
    message: "Sarah Khan replied to your proposal",
    time: "3 hours ago",
    unread: true,
  },
  {
    id: 4,
    icon: CheckCircle2,
    color: "text-blue-300",
    bg: "bg-blue-400/10",
    title: "Deal won",
    message: "TechCorp moved to Won — £2,500",
    time: "Yesterday",
    unread: false,
  },
];

export default function Notifications() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, unread: false }))
    );
  };

  const dismiss = (id) => {
    setNotifications((prev) =>
      prev.filter((n) => n.id !== id)
    );
  };

  return (
    <div className="relative">
      {/* Notification Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center justify-center"
        aria-label="Notifications"
      >
        <Bell
          size={19}
          strokeWidth={1.8}
          className="text-slate-400 hover:text-white transition-colors"
        />

        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />

          {/* Notification Dropdown */}
          <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#111827] border border-[#263248] rounded-2xl shadow-2xl shadow-black/30 z-20 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#263248] bg-[#151d2d]">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-black">
                  Notifications
                </h3>

                {unreadCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20">
                    {unreadCount} new
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <CheckCircle2
                      size={20}
                      className="text-blue-400"
                    />
                  </div>

                  <p className="text-sm text-slate-300">
                    You're all caught up
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    No new notifications
                  </p>
                </div>
              ) : (
                notifications.map((n) => {
                  const Icon = n.icon;

                  return (
                    <div
                      key={n.id}
                      className={`flex gap-3 px-4 py-3.5 border-b border-[#263248] last:border-0 transition-colors group ${
                        n.unread
                          ? "bg-blue-500/[0.03] hover:bg-blue-500/[0.07]"
                          : "hover:bg-[#182235]"
                      }`}
                    >
                      {/* Icon */}
                      <div
                        className={`w-9 h-9 rounded-xl ${n.bg} flex items-center justify-center shrink-0`}
                      >
                        <Icon
                          size={16}
                          strokeWidth={1.8}
                          className={n.color}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] font-medium text-slate-100">
                            {n.title}
                          </span>

                          {n.unread && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                          )}
                        </div>

                        <p className="text-[12.5px] text-slate-400 mt-1 leading-relaxed">
                          {n.message}
                        </p>

                        <span className="text-[11px] text-slate-500">
                          {n.time}
                        </span>
                      </div>

                      {/* Dismiss */}
                      <button
                        onClick={() => dismiss(n.id)}
                        className="opacity-0 group-hover:opacity-100 self-start text-slate-500 hover:text-slate-200 transition-all shrink-0"
                        aria-label="Dismiss notification"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-[#263248] bg-[#151d2d]">
              <button className="text-xs font-medium text-blue-400 hover:text-blue-300 w-full text-center transition-colors">
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}