"use client";

import { MoreHorizontal } from "lucide-react";
import Avatar from "./Avatar";
import { PriorityBadge, StatusBadge } from "./Badges";
import { Task } from "./Types";

interface TaskRowProps {
  task: Task;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onView: (task: Task) => void;
}

export default function TaskRow({ task, selected, onToggleSelect, onView }: TaskRowProps) {
  return (
    <tr className="border-b border-[#E5CB90]/40 last:border-0 hover:bg-[#FFF3C8]/20">
      <td className="w-10 px-4 py-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect(task.id)}
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
      </td>
      <td className="px-4 py-3 text-sm font-medium text-[#22303A]">{task.name}</td>
      <td className="px-4 py-3 text-sm text-[#4A5A5F]">{task.relatedLead}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Avatar name={task.assignedTo?.name || "?"} />
          <span className="text-sm text-[#4A5A5F]">{task.assignedTo?.name || "Unassigned"}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <PriorityBadge priority={task.priority} />
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={task.status} />
      </td>
      <td className="px-4 py-3 text-sm text-[#4A5A5F]">{task.dueDate}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3 text-sm">
          <button
            type="button"
            onClick={() => onView(task)}
            className="font-medium text-[#458393] hover:underline"
          >
            View
          </button>
          <button type="button" className="font-medium text-[#5C6D71] hover:underline">
            Edit
          </button>
          <button type="button" className="font-medium text-red-600 hover:underline">
            Delete
          </button>
          <button
            type="button"
            aria-label="More actions"
            className="text-[#5C6D71] hover:text-[#22303A]"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}