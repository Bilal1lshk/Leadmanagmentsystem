"use client";

import { useAppSelector } from "@/app/redux/hooks";
import Card from "./Card";

interface Lead {
  personId?: string;
  estimatedValue?: number;
  priority?: string;
  status?: string;
}

export default function LeadPriority() {
  const leads = useAppSelector((store) => store.LeadSlice.Lead);
  const lead = [...leads].reduce<Lead | null>(
    (highest, current) =>
      !highest ||
      Number(current.estimatedValue ?? 0) >
        Number(highest.estimatedValue ?? 0)
        ? current
        : highest,
    null,
  );

  const formatLabel = (value?: string) =>
    value
      ? value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
      : "Unknown";

  const getAction = (status?: string) => {
    if (status === "won") return "Closed Won";
    if (status === "lost") return "Closed Lost";
    if (status === "new") return "Contact Today";
    return "Follow Up";
  };

  return (
    <Card>
      <h3 className="m-0 mb-3 text-sm text-[#22303A]">Lead Priority 🔥</h3>

      <div className="flex justify-between text-[11px] text-[#5C6D71] mb-2">
        <span>Hot Lead</span>
        <span>Value</span>
        <span>Action</span>
      </div>

      {lead ? (
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#458393]/20 text-[10px] font-bold text-[#458393]">
              {(lead.personId ?? "?").slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <span className="block truncate text-[12.5px] text-[#22303A]">
                {lead.personId ?? "Unnamed lead"}
              </span>
              <span className="text-[10px] text-[#7A898D]">
                {formatLabel(lead.priority)} priority
              </span>
            </div>
          </div>
          <span className="shrink-0 text-[12.5px] font-semibold text-[#34A99D]">
            ${Number(lead.estimatedValue ?? 0).toLocaleString()}
          </span>
          <span className="shrink-0 text-[12.5px] font-semibold text-[#458393]">
            {getAction(lead.status)}
          </span>
        </div>
      ) : (
        <p className="text-[11px] text-[#5C6D71]">No leads found</p>
      )}
    </Card>
  );
}