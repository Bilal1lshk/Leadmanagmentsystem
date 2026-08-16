"use client";

import { useState } from "react";
import { ArrowLeft, X, Smile } from "lucide-react";
import Avatar from "./Avatar";
import { PriorityBadge, StatusBadge } from "./Badges";
import ActivityFeed from "./Activityfeed";
import { TaskDetail, TaskPriority } from "./Types";

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
  console.log(task,"taskpanel")

  return (
    <aside className="flex h-full w-96 shrink-0 flex-col border-l border-brand-line bg-white">
      <div className="flex items-center justify-between border-b border-brand-line px-5 py-4">
        <button
          type="button"
          onClick={onClose}
          aria-label="Back"
          className="rounded-md p-1 text-brand-gray hover:bg-brand-cream/60"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-md p-1 text-brand-gray hover:bg-brand-cream/60"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <h2 className="text-lg font-semibold text-brand-navy">{task.name}</h2>
        <p className="mt-2 text-sm leading-relaxed text-brand-gray">{task.description}</p>

        <div className="mt-5">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-gray">
            Related Lead
          </h3>
          <div className="space-y-2">
            {task.relatedLeads.map((lead) => (
              <div key={lead.name} className="flex items-center gap-2">
                <Avatar name={lead.name} />
                <span className="text-sm text-brand-navy">{lead.name}</span>
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
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-gray">
              Status
            </h3>
            <StatusBadge status={task.status} />
          </div>
          <div>
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-gray">
              Due Date
            </h3>
            <span className="text-sm text-brand-navy">{task.dueDate}</span>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-gray">
            Activity
          </h3>
          <ActivityFeed items={task.activity} />
        </div>
      </div>

      <div className="border-t border-brand-line px-5 py-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-gray">
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
              className="w-full rounded-lg border border-brand-line bg-brand-cream/40 py-2 pl-3 pr-9 text-sm placeholder:text-brand-gray focus:border-brand-teal focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
            />
            <Smile className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-gray" />
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-t border-brand-line px-5 py-4">
        <button
          type="button"
          onClick={onEdit}
          className="flex-1 rounded-lg bg-brand-teal py-2 text-sm font-medium text-white hover:bg-brand-teal-dark"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onMarkComplete}
          className="flex-1 rounded-lg border border-brand-line py-2 text-sm font-medium text-brand-gray hover:bg-brand-cream/40"
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