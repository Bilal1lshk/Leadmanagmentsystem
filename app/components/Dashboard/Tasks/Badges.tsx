import { TaskPriority, TaskStatus } from "./Types";

const priorityStyles: Record<TaskPriority, string> = {
  High: "bg-red-50 text-red-600",
  Medium: "bg-amber-50 text-amber-600",
  Low: "bg-emerald-50 text-emerald-600",
};

const statusStyles: Record<TaskStatus, string> = {
  Pending: "bg-slate-100 text-slate-600",
  "In Progress": "bg-blue-50 text-blue-600",
  Completed: "bg-emerald-50 text-emerald-600",
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