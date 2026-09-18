import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

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

export interface NotificationState {
  notifications: NotificationItem[];
}

export const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
];

const initialState: NotificationState = {
  notifications: DEFAULT_NOTIFICATIONS,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<NotificationItem[]>) => {
      state.notifications = Array.isArray(action.payload) ? action.payload : [];
    },
    addNotification: (state, action: PayloadAction<NotificationItem>) => {
      if (!action.payload) return;
      const index = state.notifications.findIndex((n) => n.id === action.payload.id);
      if (index >= 0) {
        state.notifications[index] = action.payload;
      } else {
        state.notifications.unshift(action.payload);
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const item = state.notifications.find((n) => n.id === action.payload);
      if (item) {
        item.unread = false;
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((n) => {
        n.unread = false;
      });
    },
    toggleReadStatus: (state, action: PayloadAction<string>) => {
      const item = state.notifications.find((n) => n.id === action.payload);
      if (item) {
        item.unread = !item.unread;
      }
    },
    dismissNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    clearCategory: (state, action: PayloadAction<string>) => {
      if (action.payload === "all") {
        state.notifications = [];
      } else if (action.payload === "unread") {
        state.notifications.forEach((n) => {
          n.unread = false;
        });
      } else {
        state.notifications = state.notifications.filter((n) => n.category !== action.payload);
      }
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    restoreDefaultNotifications: (state) => {
      state.notifications = DEFAULT_NOTIFICATIONS;
    },
    syncLeadsToNotifications: (state, action: PayloadAction<any[]>) => {
      if (!Array.isArray(action.payload)) return;
      action.payload.forEach((lead: any, idx: number) => {
        const leadId = lead._id || lead.id || `lead-idx-${idx}`;
        const targetId = `lead-${leadId}`;
        const alreadyExists = state.notifications.some(
          (n) => n.id === targetId || (lead.personId && n.meta?.leadName === lead.personId)
        );

        if (!alreadyExists && (lead.status === "new" || lead.priority === "high" || lead.status === "won")) {
          state.notifications.unshift({
            id: targetId,
            category: "leads",
            type: lead.status === "won" ? "deal_won" : lead.priority === "high" ? "hot_lead" : "new_lead",
            title:
              lead.status === "won"
                ? `Deal Closed: ${lead.personId || "Won Lead"}`
                : lead.priority === "high"
                ? `High Priority Lead: ${lead.personId || "Hot Lead"}`
                : `New Lead: ${lead.personId || "Inquiry"}`,
            message:
              lead.message ||
              `New lead received from ${lead.source || "inbound"}. Status: ${lead.status || "new"}.`,
            time: lead.createdAt
              ? new Date(lead.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "Just now",
            timestamp: lead.createdAt ? new Date(lead.createdAt).getTime() : Date.now(),
            unread: true,
            priority: lead.priority === "high" ? "urgent" : "medium",
            actionLabel: "View Lead",
            actionUrl: "/dashboard/leads",
            meta: {
              leadName: lead.personId,
              amount:
                lead.estimatedValue && Number(lead.estimatedValue) > 0
                  ? `$${Number(lead.estimatedValue).toLocaleString()}`
                  : undefined,
            },
          });
        }
      });
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  toggleReadStatus,
  dismissNotification,
  clearCategory,
  clearAllNotifications,
  restoreDefaultNotifications,
  syncLeadsToNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
