"use client";

import { useEffect, useState } from "react";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import Card from "./Card";

interface Lead {
  _id: string;
  personId: string;
  email: string;
  source: string;
  status: string;
  estimatedValue?: number;
  createdAt: string;
}

interface LeadsResponse {
  data?: Lead[];
  success?: boolean;
}

const statusStyles: Record<string, string> = {
  new: "bg-[#458393]/15 text-[#458393] font-semibold border border-[#458393]/30",
  contacted: " text-blue-600 font-semibold border border-blue-500/30",
  qualified: "bg-[#34A99D]/15 text-[#34A99D] font-semibold border border-[#34A99D]/30",
  proposal: "bg-purple-500/15 text-purple-600 font-semibold border border-purple-500/30",
  won: "bg-emerald-500/15 text-emerald-600 font-semibold border border-emerald-500/30",
  lost: "bg-red-500/15 text-red-600 font-semibold border border-red-500/30",
};

export default function RecentLeadsTable({ onAddLead }: { onAddLead?: () => void }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecentLeads = async () => {
      try {
        const response = await axios.get<LeadsResponse>(
          "/api/dashboardapi/Leads/AllLead",
        );
        const recentLeads = (response.data.data ?? [])
          .slice()
          .sort(
            (first, second) =>
              new Date(second.createdAt).getTime() -
              new Date(first.createdAt).getTime(),
          )
          .slice(0, 5);
        setLeads(recentLeads);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setLeads([]);
        } else {
          console.error("Failed to load recent leads:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadRecentLeads();
  }, []);

  const formatLabel = (value: string) =>
    value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="m-0 text-[15px] text-[#22303A]">Recent Leads</h3>
        <Link
          href="/dashboard/leads/create"
          onClick={onAddLead}
          className="flex items-center gap-1.5 bg-[#34A99D] rounded-lg px-3.5 py-2 text-sm font-semibold text-[#04342C] hover:bg-[#2F998E] transition-colors"
        >
          <Plus size={14} /> Add New Lead
        </Link>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="text-[#5C6D71] text-left">
            {["Lead", "Company", "Source", "Status", "Value", "Date", ""].map((h) => (
              <th key={h} className="font-medium px-2 py-1.5 border-b border-[#E5CB90]/40">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="px-2 py-6 text-center text-[#7A898D]">
                Loading leads...
              </td>
            </tr>
          ) : leads.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-2 py-6 text-center text-[#7A898D]">
                No leads found
              </td>
            </tr>
          ) : leads.map((lead) => (
            <tr key={lead._id}>
              <td className="flex items-center gap-2 px-2 py-2.5 text-[#22303A]">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#458393]/20 text-xs font-bold text-[#458393]">
                  {lead.personId.slice(0, 2).toUpperCase()}
                </div>
                {lead.personId}
              </td>
              <td className="px-2 py-2.5 text-[#4A5A5F]">{lead.email}</td>
              <td className="px-2 py-2.5 text-[#4A5A5F]">{formatLabel(lead.source)}</td>
              <td className="px-2 py-2.5">
                <span className={`rounded-md px-2 py-0.5 text-[11px] ${statusStyles[lead.status] ?? statusStyles.new}`}>
                  {formatLabel(lead.status)}
                </span>
              </td>
              <td className="px-2 py-2.5 font-medium text-[#22303A]">
                ${Number(lead.estimatedValue ?? 0).toLocaleString()}
              </td>
              <td className="px-2 py-2.5 text-[#4A5A5F]">{formatDate(lead.createdAt)}</td>
              <td className="px-2 py-2.5">
                <div className="flex gap-2.5 text-[#5C6D71]">
                  <Link href={`/dashboard/leads/${lead._id}`} aria-label={`View ${lead.personId}`}>
                    <Eye size={14} className="cursor-pointer hover:text-[#22303A]" />
                  </Link>
                  <Link href={`/dashboard/leads/${lead._id}`} aria-label={`Edit ${lead.personId}`}>
                    <Pencil size={14} className="cursor-pointer hover:text-[#22303A]" />
                  </Link>
                  <Link href={`/dashboard/leads/${lead._id}`} aria-label={`Delete ${lead.personId}`}>
                    <Trash2 size={14} className="cursor-pointer hover:text-red-600" />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}