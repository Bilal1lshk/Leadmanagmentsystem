"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import type { LucideIcon } from "lucide-react";
import {
  Search,
  SlidersHorizontal,
  Plus,
  MoreHorizontal,
  Phone,
  Mail,
  ChevronDown,
  ArrowUpDown,
  Flame,
  Users,
  TrendingUp,
  CircleDollarSign,
  X,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useAppSelector } from "@/app/redux/hooks";
import lead from "@/app/models/lead";
type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "won"
  | "lost";

type LeadPriority = "low" | "medium" | "high";

type LeadSource = "website" | "referral" | "ad" | "cold_call" | "other";

interface Lead {
  id: string;
  personId: string;
  email: string;
  assignedTo: string;
  status: LeadStatus;
  priority: LeadPriority;
  source: LeadSource;
  estimatedValue?: number;
  lastContactedAt?: string;
  createdAt: string;
}

const statusStyles: Record<LeadStatus, string> = {
  new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  contacted: "bg-slate-500/10 text-slate-300 border-slate-500/20",
  qualified: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  proposal: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  won: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  lost: "bg-red-500/10 text-red-400 border-red-500/20",
};

const priorityStyles: Record<LeadPriority, string> = {
  low: "text-slate-400",
  medium: "text-amber-400",
  high: "text-red-400",
};

const formatLabel = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const formatCurrency = (value: number = 0) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  console.log(statusFilter)
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const data = useAppSelector((store) => store.LeadSlice.Lead);
  const newLeads = data?.filter((lead) => lead?.status === "new");
  const qualifiedleads = data?.filter((lead) => lead.status === "qualified");
  const totalvalue = leads.reduce((sum, lead) => sum + (lead?.estimatedValue || 0), 0);
  useEffect(() => {
    const getLeads = async () => {
      try {
        const response = await axios.get<{
          message: string;
          data: Lead[];
          success: boolean;
        }>("/api/dashboardapi/Leads/AllLead", {
          withCredentials: true,
        });
        setLeads(response.data.data ?? []);
      } catch (error) {
        console.error(error);
      }
    };

    getLeads();
  }, []);

 const filteredLeads =  useMemo(() => {
  return leads.filter((lead) => {
    const matchesSearch =
      lead?.personId?.toLowerCase()?.includes(search?.toLowerCase()) ||
      lead?.email?.toLowerCase()?.includes(search?.toLowerCase()) ||
      lead?.source?.toLowerCase()?.includes(search?.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
}, [leads, search, statusFilter]);
console.log(filteredLeads)
  const qualifiedLeads = Number(qualifiedleads.length)

  const highPriorityLeads = Number(newLeads.length)
  const toggleSelectLead = (id: string) => {
    setSelectedLeads((prev) =>
      prev.includes(id)
        ? prev.filter((leadId) => leadId !== id)
        : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedLeads?.length === filteredLeads?.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map((lead) => lead.id));
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setSourceFilter("all");
  };

  return (
    <main className="min-h-screen bg-[#0D1421] text-white p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Leads
            </h1>

            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {leads?.length} total
            </span>
          </div>

          <p className="text-sm text-slate-400 mt-2">
            Manage, track, and convert your sales opportunities.
          </p>
        </div>

        <Link href="/dashboard/leads/create">
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-medium transition-colors shadow-lg shadow-blue-600/10">
            <Plus size={17} />
            Add New Lead
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Users}
          label="Total Leads"
          value={leads?.length}
          description="All active leads"
          iconStyle="bg-blue-500/10 text-blue-400"
        />

        <StatCard
          icon={Flame}
          label="High Priority"
          value={highPriorityLeads}
          description="Need immediate attention"
          iconStyle="bg-red-500/10 text-red-400"
        />

        <StatCard
          icon={TrendingUp}
          label="Qualified Leads"
          value={qualifiedLeads}
          description="Ready for conversion"
          iconStyle="bg-cyan-500/10 text-cyan-400"
        />

        <StatCard
          icon={CircleDollarSign}
          label="Pipeline Value"
          value={totalvalue}
          description="Estimated opportunity value"
          iconStyle="bg-emerald-500/10 text-emerald-400"
        />
      </div>

      <div className="bg-[#111827] border border-[#263248] rounded-2xl p-4 mb-5">
        <div className="flex flex-col xl:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              placeholder="Search leads, emails, or assignees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#0D1421] border border-[#263248] text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500/60 transition-colors"
            />
          </div>

          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              ["all", "All Status"],
              ["new", "New"],
              ["contacted", "Contacted"],
              ["qualified", "Qualified"],
              ["proposal", "Proposal"],
              ["won", "Won"],
              ["lost", "Lost"],
            ]}
          />

          <FilterSelect
            value={priorityFilter}
            onChange={setPriorityFilter}
            options={[
              ["all", "All Priority"],
              ["high", "High"],
              ["medium", "Medium"],
              ["low", "Low"],
            ]}
          />

          <FilterSelect
            value={sourceFilter}
            onChange={setSourceFilter}
            options={[
              ["all", "All Sources"],
              ["website", "Website"],
              ["referral", "Referral"],
              ["ad", "Advertisement"],
              ["cold_call", "Cold Call"],
              ["other", "Other"],
            ]}
          />

          <button
            onClick={clearFilters}
            className="h-10 px-3 rounded-xl border border-[#263248] text-slate-400 hover:text-white hover:bg-[#182235] transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="bg-[#111827] border border-[#263248] rounded-2xl overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-[#263248]">
          <div className="flex items-center gap-3">
            <SlidersHorizontal size={17} className="text-slate-500" />

            <span className="text-sm text-slate-400">
              Showing{" "}
              <span className="text-white font-medium">
                {filteredLeads?.length}
              </span>{" "}
              leads
            </span>

            {selectedLeads?.length > 0 && (
              <span className="text-xs text-blue-400">
                {selectedLeads?.length} selected
              </span>
            )}
          </div>

          <button className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
            <ArrowUpDown size={14} />
            Sort by
            <ChevronDown size={14} />
          </button>
        </div>

        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#263248] text-left">
                <th className="px-5 py-3">
                  <input
                    type="checkbox"
                    checked={
                      filteredLeads?.length > 0 &&
                      selectedLeads?.length === filteredLeads?.length
                    }
                    onChange={toggleSelectAll}
                    className="accent-blue-500"
                  />
                </th>
                <TableHeader>Lead</TableHeader>
                <TableHeader>Source</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Priority</TableHeader>
                <TableHeader>Est. Value</TableHeader>
                <TableHeader>Assigned To</TableHeader>
                <TableHeader>Last Contact</TableHeader>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads?.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-[#263248] last:border-0 hover:bg-[#151F31] transition-colors"
                >
                  <td className="px-5 py-4">
                    <input
                      type="checkbox"
                      checked={selectedLeads?.includes(lead.id)}
                      onChange={() => toggleSelectLead(lead.id)}
                      className="accent-blue-500"
                    />
                  </td>

                  <td className="px-5 py-4 min-w-[240px]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-sm font-semibold text-blue-400">
                        {lead?.personId
                          ?.split(" ")
                          ?.map((name) => name[0])
                          ?.join("")}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-white">
                          {lead?.personId
                          }
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {lead?.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-300 capitalize">
                      {lead?.source?.replace("_", " ")}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-medium ${statusStyles[lead.status]}`}
                    >
                      {formatLabel(lead.status)}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${lead.priority === "high"
                          ? "bg-red-400"
                          : lead.priority === "medium"
                            ? "bg-amber-400"
                            : "bg-slate-500"
                          }`}
                      />

                      <span
                        className={`text-sm capitalize ${priorityStyles[lead.priority]}`}
                      >
                        {lead.priority}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-slate-200">
                      {formatCurrency(lead.estimatedValue)}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-300">
                      {lead.assignedTo}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-xs text-slate-500">
                      {lead.lastContactedAt
                        ? new Date(lead.lastContactedAt).toLocaleDateString(
                          "en-GB",
                        )
                        : "Never contacted"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <button className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-[#263248] transition-colors">
                      <MoreHorizontal size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:hidden divide-y divide-[#263248]">
          {filteredLeads?.map((lead) => (
            <div
              key={lead.id}
              className="p-4 hover:bg-[#151F31] transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-sm font-semibold text-blue-400">
                    {lead?.name
                      ?.split(" ")
                      ?.map((name) => name[0])
                      ?.join("")}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white">
                      {lead?.name}
                    </p>
                    <p className="text-xs text-slate-500">{lead?.email}</p>
                  </div>
                </div>

                <button className="text-slate-500 hover:text-white">
                  <MoreHorizontal size={17} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <span
                  className={`px-2.5 py-1 rounded-full border text-xs ${statusStyles[lead.status]}`}
                >
                  {formatLabel(lead.status)}
                </span>

                <span className="px-2.5 py-1 rounded-full bg-[#182235] text-xs text-slate-400 capitalize">
                  {lead.priority} priority
                </span>

                <span className="px-2.5 py-1 rounded-full bg-[#182235] text-xs text-slate-400">
                  {formatCurrency(lead.estimatedValue)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div>
                  <p className="text-[11px] text-slate-500">Source</p>
                  <p className="text-xs text-slate-300 capitalize mt-1">
                    {lead.source.replace("_", " ")}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] text-slate-500">Assigned To</p>
                  <p className="text-xs text-slate-300 mt-1">
                    {lead.assignedTo}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] text-slate-500">Last Contact</p>
                  <p className="text-xs text-slate-300 mt-1">
                    {lead.lastContactedAt
                      ? new Date(lead.lastContactedAt).toLocaleDateString(
                        "en-GB",
                      )
                      : "Never"}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] text-slate-500">Created</p>
                  <p className="text-xs text-slate-300 mt-1">
                    {new Date(lead.createdAt).toLocaleDateString("en-GB")}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg bg-blue-500/10 text-blue-400 text-xs hover:bg-blue-500/20">
                  <Phone size={14} />
                  Call
                </button>

                <button className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg bg-[#182235] text-slate-300 text-xs hover:bg-[#263248]">
                  <Mail size={14} />
                  Email
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredLeads?.length < 0 && (
          <div className="py-16 text-center">
            <Users size={32} className="mx-auto text-slate-600 mb-3" />
            <p className="text-sm text-slate-400">No leads found</p>
            <p className="text-xs text-slate-600 mt-1">
              Try adjusting your filters or search query.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  description: string;
  iconStyle: string;
}

function StatCard({
  icon: Icon,
  label,
  value,
  description,
  iconStyle,
}: StatCardProps) {
  return (
    <div className="bg-[#111827] border border-[#263248] rounded-2xl p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-2xl font-semibold text-white mt-2">{value}</p>
          <p className="text-[11px] text-slate-500 mt-1">{description}</p>
        </div>

        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconStyle}`}
        >
          <Icon size={19} />
        </div>
      </div>
    </div>
  );
}

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}

function FilterSelect({ value, onChange, options }: FilterSelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none h-10 min-w-[140px] w-full px-3 pr-9 rounded-xl bg-[#0D1421] border border-[#263248] text-sm text-slate-300 outline-none focus:border-blue-500/60 cursor-pointer"
      >
        {options.map(([optionValue, label]) => (
          <option key={optionValue} value={optionValue}>
            {label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={15}
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"
      />
    </div>
  );
}

function TableHeader({ children }: { children: ReactNode }) {
  return (
    <th className="px-5 py-3 text-[11px] uppercase tracking-wider font-medium text-slate-500 whitespace-nowrap">
      {children}
    </th>
  );
}
