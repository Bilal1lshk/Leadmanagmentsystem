"use client";

import { FileText, Clock, Loader2, CheckCircle2, ArrowUp, ArrowDown } from "lucide-react";
import { StatCardData } from "./Types";
const iconByKind = {
  total: {
    Icon: FileText,
    bg: "bg-[#DBEAFE]",
    fg: "text-[#1D4ED8]",
  },

  pending: {
    Icon: Clock,
    bg: "bg-[#FEF3C7]",
    fg: "text-[#B45309]",
  },

  inProgress: {
    Icon: Loader2,
    bg: "bg-[#DBEAFE]",
    fg: "text-[#1E40AF]",
  },

  completed: {
    Icon: CheckCircle2,
    bg: "bg-[#FEF3C7]",
    fg: "text-[#A16207]",
  },
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
        
      </div>
    </div>
  );
}