"use client";

import { FileText, Clock, Loader2, CheckCircle2, ArrowUp, ArrowDown } from "lucide-react";
import { StatCardData } from "./Types";

const iconByKind = {
  total: { Icon: FileText, bg: "bg-brand-teal/10", fg: "text-brand-teal" },
  pending: { Icon: Clock, bg: "bg-brand-tan/10", fg: "text-brand-tan" },
  inProgress: { Icon: Loader2, bg: "bg-brand-teal/10", fg: "text-brand-teal" },
  completed: { Icon: CheckCircle2, bg: "bg-brand-emerald/10", fg: "text-brand-emerald" },
} as const;

export default function StatCard({ label, value, changePct, changeDirection, kind }: StatCardData) {
  const { Icon, bg, fg } = iconByKind[kind];
  const isUp = changeDirection === "up";
  return (
    <div className="flex-1 rounded-xl border border-brand-line bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}>
          <Icon className={`h-4 w-4 ${fg}`} />
        </div>
        <span className="text-sm font-medium text-brand-gray">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-semibold text-brand-navy">{value}</span>
        <span
          className={`flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium ${
            isUp ? "bg-brand-emerald/10 text-brand-emerald" : "bg-brand-tan/10 text-brand-tan"
          }`}
        >
          {isUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
          {changePct}
        </span>
      </div>
    </div>
  );
}