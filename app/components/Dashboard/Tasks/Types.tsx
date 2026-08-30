export type TaskStatus = "Pending" | "In Progress" | "Completed" | "Overdue";
export type TaskPriority = "Low" | "Medium" | "High";

export interface Assignee {
  name: string;
  avatarUrl?: string;
}

export interface Task {
  _id?: string;
  id: string;
  name: string;
  relatedLead: string;
  assignedTo: Assignee;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
}

export interface ActivityItem {
  id: string;
  label?: string;
  timeAgo?: string;
  icon?: "check" | "assign" | "comment";
  user?: string;
  action?: string;
  time?: string;
}

export interface TaskDetail extends Task {
  description: string;
  relatedLeads: Assignee[];
  activity: ActivityItem[];
}

export type StatKind = "total" | "pending" | "inProgress" | "completed";

export interface StatCardData {
  kind: StatKind;
  label: string;
  value: string;
  changePct: string;
  changeDirection: "up" | "down";
}

export interface FilterState {
  search: string;
  status: string;
  priority: string;
  assignedTo: string;
  lead: string;
  dueDate: string;
}