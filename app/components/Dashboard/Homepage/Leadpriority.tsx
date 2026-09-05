"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";

interface Lead {
  _id: string;
  personId: string;
  estimatedValue?: number;
  priority?: string;
  status?: string;
}

interface LeadsResponse {
  data?: Lead[];
}

export default function LeadPriority() {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHighestValueLead = async () => {
      try {
        const response = await axios.get<LeadsResponse>(
          "/api/dashboardapi/Leads/AllLead",
        );
        const highestValueLead = (response.data.data ?? []).reduce<Lead | null>(
          (highest, current) =>
            !highest ||
            Number(current.estimatedValue ?? 0) >
              Number(highest.estimatedValue ?? 0)
              ? current
              : highest,
          null,
        );
        setLead(highestValueLead);
      } catch (error) {
        console.error("Failed to load highest-value lead:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHighestValueLead();
  }, []);

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

      {loading ? (
        <p className="text-[11px] text-[#5C6D71]">Loading leads...</p>
      ) : lead ? (
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#458393]/20 text-[10px] font-bold text-[#458393]">
              {lead.personId.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <span className="block truncate text-[12.5px] text-[#22303A]">
                {lead.personId}
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