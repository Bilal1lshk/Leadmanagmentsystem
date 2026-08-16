"use client";

import { Plus, Upload, RefreshCw } from "lucide-react";

interface PageActionsProps {
  onNewTask?: () => void;
  onExport?: () => void;
  onRefresh?: () => void;
}

export default function PageActions({ onNewTask, onExport, onRefresh }: PageActionsProps) {
  return (
    <div className="flex justify-end gap-2 px-6 pt-6">
      <button
        type="button"
        onClick={onNewTask}
        className="flex items-center gap-1.5 rounded-lg bg-brand-teal px-4 py-2 text-sm font-medium text-white hover:bg-brand-teal-dark"
      >
        <Plus className="h-4 w-4" />
       <a href="/dashboard/task/newtask" className="text-white hover:text-brand-teal-light">
          New Task
        </a>
      </button>
      <button
        type="button"
        onClick={onExport}
        className="flex items-center gap-1.5 rounded-lg border border-brand-line bg-white px-4 py-2 text-sm font-medium text-brand-gray hover:bg-brand-cream/40"
      >
        <Upload className="h-4 w-4" />
        Export
      </button>
      <button
        type="button"
        onClick={onRefresh}
        aria-label="Refresh"
        className="rounded-lg border border-brand-line bg-white p-2 text-brand-gray hover:bg-brand-cream/40"
      >
        <RefreshCw className="h-4 w-4" />
      </button>
    </div>
  );
}