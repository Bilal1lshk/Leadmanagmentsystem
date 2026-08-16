import { TaskPriority, TaskStatus } from "./Types";

const priorityStyles: Record<TaskPriority, string> = {
  High: "bg-red-50 text-red-600",
  Medium: "bg-brand-tan/10 text-brand-tan",
  Low: "bg-brand-emerald/10 text-brand-emerald",
};

const statusStyles: Record<TaskStatus, string> = {
  Pending: "bg-brand-cream/60 text-brand-gray",
  "In Progress": "bg-brand-teal/10 text-brand-teal",
  Completed: "bg-brand-emerald/10 text-brand-emerald",
  Overdue: "bg-red-50 text-red-600",
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${priorityStyles[priority]}`}>
      {priority}
    </span>
  );
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${statusStyles[status]}`}>
      {status}
    </span>
  );
}