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
        className="flex items-center gap-1.5 rounded-lg  px-4 py-2 text-sm font-medium text-black bg-white"
      >
        <Plus className="h-4 w-4" />
       <a href="/dashboard/task/newtask" className="text-black font-bold hover:text-blue-200">
          New Task
        </a>
      </button>
      <button
        type="button"
        onClick={onExport}
        className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
      >
        <Upload className="h-4 w-4" />
        Export
      </button>
      <button
        type="button"
        onClick={onRefresh}
        aria-label="Refresh"
        className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50"
      >
        <RefreshCw className="h-4 w-4" />
      </button>
    </div>
  );
}