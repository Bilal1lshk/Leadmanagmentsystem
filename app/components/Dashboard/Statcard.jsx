"use client"

import { Users, Sparkles, Target, Wallet, CheckCircle2 } from "lucide-react";
import Card from "./Card.jsx";
import { useAppSelector } from "@/app/redux/hooks";
import { useState } from "react";
export default function StatCards() {
  const [pipelinevalue ,setpipelinevalue]=useState(0)
    const data = useAppSelector((store) => store.LeadSlice.Lead);
     const newLeads = data?.filter((lead) => lead?.status === "new");
     const qualifiedleads=data?.filter((lead)=>lead?.status==="qualified")
    
  const stats = [
  { icon: Users, color: "text-blue-400", label: "Total Leads", value:Number(data?.length) 
 },
  { icon: Sparkles, color: "text-violet-400", label: "New Leads", value: Number(newLeads.length), sub: "this month" },
  { icon: Target, color: "text-red-400", label: "Qualified Leads", value: Number(qualifiedleads.length) },
  { icon: Wallet, color: "text-amber-400", label: "Pipeline Value", value:`${pipelinevalue}$` },
  { icon: CheckCircle2, color: "text-emerald-400", label: "Conversion Rate", value: "24.8%" },
];
  return (
    <div className="grid grid-cols-5 gap-3.5">
      {stats.map((s) => (
        <Card key={s.label}>
          <div className="flex items-center gap-2 mb-2.5">
            <s.icon size={16} className={s.color} />
            <span className="text-[13px] text-slate-400">{s.label}</span>
          </div>
          <div className="text-2xl font-bold text-white">{s.value}</div>
          {s.sub && <div className="text-xs text-slate-400 mt-0.5">{s.sub}</div>}
        </Card>
      ))}
    </div>
  );
}