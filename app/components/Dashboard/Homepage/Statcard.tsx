"use client"

import { Users, Sparkles, Target, Wallet, CheckCircle2 } from "lucide-react";
import Card from "./Card";
import { useAppSelector } from "@/app/redux/hooks";
import { useState } from "react";
export default function StatCards() {
  const data = useAppSelector((store) => store.LeadSlice.Lead);
  const newLeads = data?.filter((lead) => lead?.status === "new");
  const won = data?.filter((lead) => lead?.status === "won")
  const converationrate = data.length > 0 ? (won.length / data.length) * 100 : 0;
  const qualifiedleads = data?.filter((lead) => lead?.status === "qualified")
  const pipelinevalue = data.reduce((acc, lead) => acc + (lead?.estimatedValue ?? 0), 0);
  const stats = [
    {
      icon: Users, color: "text-[#458393]", label: "Total Leads", value: Number(data?.length)
    },
    { icon: Sparkles, color: "text-[#34A99D]", label: "New Leads", value: Number(newLeads.length), sub: "this month" },
    { icon: Target, color: "text-[#E5CB90]", label: "Qualified Leads", value: Number(qualifiedleads.length) },
    { icon: Wallet, color: "text-[#458393]", label: "Pipeline Value", value: `${pipelinevalue}$` },
    { icon: CheckCircle2, color: "text-[#34A99D]", label: "Conversion Rate", value: `${converationrate}%`  },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
      {stats.map((s) => (
        <Card key={s.label}>
          <div className="flex items-center gap-2 mb-2.5">
            <s.icon size={16} className={s.color} />
            <span className="text-[13px] text-[#5C6D71]">{s.label}</span>
          </div>
          <div className="text-2xl font-bold text-[#22303A]">{s.value}</div>
          {s.sub && <div className="text-xs text-[#5C6D71] mt-0.5">{s.sub}</div>}
        </Card>
      ))}
    </div>
  );
}