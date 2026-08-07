"use client";

import { useState } from "react";
import { ArrowLeft, X, Smile } from "lucide-react";
import Avatar from "./Avatar";
import { PriorityBadge, StatusBadge } from "./Badges";
import ActivityFeed from "./ActivityFeed";
import { TaskDetail, TaskPriority } from "./types";

interface TaskDetailPanelProps {
  task: TaskDetail;
  onClose: () => void;
  onEdit?: () => void;
  onMarkComplete?: () => void;
  onDelete?: () => void;
}

const allPriorities: TaskPriority[] = ["High", "Medium", "Low"];

export default function TaskDetailPanel({
  task,
  onClose,
  onEdit,
  onMarkComplete,
  onDelete,
}: TaskDetailPanelProps) {
  const [comment, setComment] = useState("");

  return (
    <aside className="flex h-full w-96 shrink-0 flex-col border-l border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <button
          type="button"
          onClick={onClose}
          aria-label="Back"
          className="rounded-md p-1 text-slate-400 hover:bg-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-md p-1 text-slate-400 hover:bg-slate-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-900">{task.name}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">{task.description}</p>

        <div className="mt-5">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Related Lead
          </h3>
          <div className="space-y-2">
            {task.relatedLeads.map((lead) => (
              <div key={lead.name} className="flex items-center gap-2">
                <Avatar name={lead.name} />
                <span className="text-sm text-slate-700">{lead.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          {allPriorities.map((p) => (
            <PriorityBadge key={p} priority={p} />
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div>
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Status
            </h3>
            <StatusBadge status={task.status} />
          </div>
          <div>
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Due Date
            </h3>
            <span className="text-sm text-slate-700">{task.dueDate}</span>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Activity
          </h3>
          <ActivityFeed items={task.activity} />
        </div>
      </div>

      <div className="border-t border-slate-100 px-5 py-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Comments
        </h3>
        <div className="flex items-center gap-2">
          <Avatar name="You" />
          <div className="relative flex-1">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-3 pr-9 text-sm placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <Smile className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-t border-slate-100 px-5 py-4">
        <button
          type="button"
          onClick={onEdit}
          className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onMarkComplete}
          className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Mark Complete
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex-1 rounded-lg border border-red-200 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </aside>
  );
}