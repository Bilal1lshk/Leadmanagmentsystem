"use client";

import { useAppSelector } from "@/app/redux/hooks";
import Card from "./Card";

const statuses = [
  { key: "new", label: "New", color: "bg-[#458393]" },
  { key: "contacted", label: "Contacted", color: "bg-[#34A99D]" },
  { key: "qualified", label: "Qualified", color: "bg-[#E5CB90]" },
  { key: "proposal", label: "Proposal", color: "bg-[#458393]/70" },
  { key: "won", label: "Won", color: "bg-[#34A99D]/70" },
  { key: "lost", label: "Lost", color: "bg-[#C1523F]" },
];

export default function Leadchart() {
  const leads = useAppSelector((store) => store.LeadSlice.Lead);
  const totalLeads = leads.length;

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="m-0 text-sm text-[#22303A]">Lead Status</h3>
          <p className="mt-1 text-[11px] text-[#5C6D71]">
            Current organization pipeline
          </p>
        </div>
        <span className="text-lg font-bold text-[#22303A]">{totalLeads}</span>
      </div>

      <div className="flex flex-col gap-2.5">
        {statuses.map((status) => {
          const count = leads.filter((lead) => lead.status === status.key).length;
          const percentage = totalLeads ? (count / totalLeads) * 100 : 0;

          return (
            <div key={status.key}>
              <div className="mb-1 flex items-center justify-between text-[11px]">
                <span className="text-[#4A5A5F]">{status.label}</span>
                <span className="font-semibold text-[#22303A]">{count}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[#EEF2F3]">
                <div
                  className={`h-full rounded-full transition-all ${status.color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}