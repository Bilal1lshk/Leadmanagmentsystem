"use client";

import { FileText, Clock, Loader2, CheckCircle2, ArrowUp, ArrowDown } from "lucide-react";
import { StatCardData } from "./types";

const iconByKind = {
  total: { Icon: FileText, bg: "bg-blue-50", fg: "text-blue-600" },
  pending: { Icon: Clock, bg: "bg-amber-50", fg: "text-amber-600" },
  inProgress: { Icon: Loader2, bg: "bg-sky-50", fg: "text-sky-600" },
  completed: { Icon: CheckCircle2, bg: "bg-emerald-50", fg: "text-emerald-600" },
} as const;

export default function StatCard({ label, value, changePct, changeDirection, kind }: StatCardData) {
  const { Icon, bg, fg } = iconByKind[kind];
  const isUp = changeDirection === "up";

  return (
    <div className="flex-1 rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}>
          <Icon className={`h-4 w-4 ${fg}`} />
        </div>
        <span className="text-sm font-medium text-slate-500">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-semibold text-slate-900">{value}</span>
        <span
          className={`flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium ${
            isUp ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
          }`}
        >
          {isUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
          {changePct}
        </span>
      </div>
    </div>
  );
}