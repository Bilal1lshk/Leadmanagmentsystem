"use client";

import { ChevronDown } from "lucide-react";
import TaskRow from "./Taskrow";
import { Task } from "./Types";

interface TasksTableProps {
  tasks: Task[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;

}

const columns = [
  "Task Name",
  "Related Lead",
  "Assigned To",
  "Priority",
  "Status",
  "Due Date",
  "Actions",
];

export default function TasksTable({
  tasks,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onView,
  onDelete,
}: TasksTableProps) {
  const allSelected = tasks.length > 0 && tasks.every((t) => selectedIds.has(t.id));

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[900px] border-collapse">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/60 text-left">
            <th className="w-10 px-4 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleSelectAll}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
            </th>
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                <span className="flex items-center gap-1">
                  {col}
                  {col === "Due Date" && <ChevronDown className="h-3 w-3" />}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <TaskRow
              key={task._id}
              task={task}
              selected={selectedIds.has(task._id)}
              onToggleSelect={onToggleSelect}
              onView={onView}
            onDelete = { onDelete }
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}