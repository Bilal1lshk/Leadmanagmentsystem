"use client";

import { useMemo } from "react";
import { TrendingUp, Users, DollarSign, CheckCircle2, XCircle, type LucideIcon } from "lucide-react";
import { type Lead } from "@/app/redux/leads";

/* ---------------------------------- Types --------------------------------- */

interface PipelineStatsProps {
    leads: Lead[];
}

interface StatCard {
    icon: LucideIcon;
    label: string;
    value: string | number;
    sub: string;
    color: string;
    bg: string;
}

/* ------------------------------- Component --------------------------------- */

export default function PipelineStats({ leads }: PipelineStatsProps) {
    const stats = useMemo<StatCard[]>(() => {
        const total = leads.length;
        const won = leads.filter((l) => l.status === "won").length;
        const lost = leads.filter((l) => l.status === "lost").length;
        const pipelineValue = leads
            .filter((l) => l.status && !["won", "lost"].includes(l.status))
            .reduce((s, l) => s + (l.estimatedValue || 0), 0);
        const wonValue = leads
            .filter((l) => l.status === "won")
            .reduce((s, l) => s + (l.estimatedValue || 0), 0);
        const convRate = total > 0 ? Math.round((won / total) * 100) : 0;

        return [
            { icon: Users, label: "Total Leads", value: total, sub: "in pipeline", color: "text-[#458393]", bg: "bg-[#458393]/10" },
            { icon: DollarSign, label: "Pipeline Value", value: `£${pipelineValue.toLocaleString()}`, sub: "active stages", color: "text-[#C9A24A]", bg: "bg-[#E5CB90]/25" },
            { icon: CheckCircle2, label: "Won Deals", value: won, sub: `£${wonValue.toLocaleString()} closed`, color: "text-emerald-600", bg: "bg-emerald-50" },
            { icon: XCircle, label: "Lost Deals", value: lost, sub: "this cycle", color: "text-red-500", bg: "bg-red-50" },
            { icon: TrendingUp, label: "Conversion Rate", value: `${convRate}%`, sub: "won vs total", color: "text-[#34A99D]", bg: "bg-[#34A99D]/10" },
        ];
    }, [leads]);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            {stats.map((s) => (
                <div
                    key={s.label}
                    className="bg-white border border-[#E5CB90]/60 rounded-2xl p-4 flex flex-col gap-2"
                >
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>
                            <s.icon size={16} className={s.color} />
                        </div>
                        <span className="text-xs text-[#5C6D71] font-medium leading-tight">{s.label}</span>
                    </div>
                    <p className="text-2xl font-bold text-[#22303A] leading-none">{s.value}</p>
                    <p className="text-[11px] text-[#5C6D71]">{s.sub}</p>
                </div>
            ))}
        </div>
    );
}