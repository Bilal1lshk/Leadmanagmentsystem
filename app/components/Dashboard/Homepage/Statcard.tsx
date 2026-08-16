"use client"

import { Users, Sparkles, Target, Wallet, CheckCircle2 } from "lucide-react";
import Card from "./Card";
import { useAppSelector } from "@/app/redux/hooks";
import { useState } from "react";
export default function StatCards() {
  const [pipelinevalue ,setpipelinevalue]=useState(0)
    const data = useAppSelector((store) => store.LeadSlice.Lead);
     const newLeads = data?.filter((lead) => lead?.status === "new");
     const qualifiedleads=data?.filter((lead)=>lead?.status==="qualified")
    
  const stats = [
  { icon: Users, color: "text-brand-teal-light", label: "Total Leads", value:Number(data?.length) 
 },
  { icon: Sparkles, color: "text-brand-teal-light", label: "New Leads", value: Number(newLeads.length), sub: "this month" },
  { icon: Target, color: "text-red-400", label: "Qualified Leads", value: Number(qualifiedleads.length) },
  { icon: Wallet, color: "text-brand-tan-light", label: "Pipeline Value", value:`${pipelinevalue}$` },
  { icon: CheckCircle2, color: "text-brand-emerald-light", label: "Conversion Rate", value: "24.8%" },
];
  return (
    <div className="grid grid-cols-5 gap-3.5">
      {stats.map((s) => (
        <Card key={s.label}>
          <div className="flex items-center gap-2 mb-2.5">
            <s.icon size={16} className={s.color} />
            <span className="text-[13px] text-brand-gray-light">{s.label}</span>
          </div>
          <div className="text-2xl font-bold text-white">{s.value}</div>
          {s.sub && <div className="text-xs text-brand-gray-light mt-0.5">{s.sub}</div>}
        </Card>
      ))}
    </div>
  );
}