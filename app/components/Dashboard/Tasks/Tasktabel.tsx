"use client";

import { ChevronDown } from "lucide-react";
import TaskRow from "./Taskrow";
import { Task } from "./Types";

interface TasksTableProps {
  tasks: Task[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onView: (task: Task) => void;
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
}: TasksTableProps) {
  const allSelected = tasks.length > 0 && tasks.every((t) => selectedIds.has(t.id));

  return (
    <div className="overflow-x-auto rounded-xl border border-brand-line bg-white">
      <table className="w-full min-w-[900px] border-collapse">
        <thead>
          <tr className="border-b border-brand-line bg-brand-cream/60 text-left">
            <th className="w-10 px-4 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleSelectAll}
                className="h-4 w-4 rounded border-brand-line text-brand-teal focus:ring-brand-teal"
              />
            </th>
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-brand-gray"
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
              key={task.id}
              task={task}
              selected={selectedIds.has(task.id)}
              onToggleSelect={onToggleSelect}
              onView={onView}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}