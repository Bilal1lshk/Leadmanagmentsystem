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

import Sidebar from "@/app/components/Dashboard/Homepage/Sidebar";
import { useAppSelector } from "@/app/redux/hooks";

/* =========================================================
   TYPES
========================================================= */

type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "won"
  | "lost";

type LeadPriority = "low" | "medium" | "high";

type LeadSource =
  | "website"
  | "referral"
  | "ad"
  | "cold_call"
  | "other";

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

/* =========================================================
   STYLES
========================================================= */

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

/* =========================================================
   HELPERS
========================================================= */

const formatLabel = (value: string) => {
  if (!value) return "";

  return value.charAt(0).toUpperCase() + value.slice(1);
};

const formatSource = (value: string) => {
  return value.replace("_", " ");
};

const formatCurrency = (value: number = 0) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (value?: string) => {
  if (!value) return "Never contacted";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Never contacted";
  }

  return date.toLocaleDateString("en-GB");
};

const getInitials = (name?: string) => {
  if (!name) return "?";

  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

/* =========================================================
   PAGE
========================================================= */

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

  /*
   * Keeping this selector because it already exists in
   * your project. The actual table/statistics use the API
   * response below so all displayed numbers stay consistent.
   */
  useAppSelector((store) => store.LeadSlice.Lead);

  /* =======================================================
     FETCH LEADS
  ======================================================= */

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
        console.error("Failed to fetch leads:", error);
        setLeads([]);
      }
    };

    getLeads();
  }, []);

  /* =======================================================
     FILTERED LEADS
  ======================================================= */

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesSearch =
        !query ||
        lead.personId?.toLowerCase().includes(query) ||
        lead.email?.toLowerCase().includes(query) ||
        lead.source?.toLowerCase().includes(query) ||
        lead.assignedTo?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || lead.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" || lead.priority === priorityFilter;

      const matchesSource =
        sourceFilter === "all" || lead.source === sourceFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesSource
      );
    });
  }, [
    leads,
    search,
    statusFilter,
    priorityFilter,
    sourceFilter,
  ]);

  /* =======================================================
     STATISTICS
  ======================================================= */

  const highPriorityLeads = useMemo(() => {
    return leads.filter((lead) => lead.priority === "high").length;
  }, [leads]);

  const qualifiedLeads = useMemo(() => {
    return leads.filter((lead) => lead.status === "qualified").length;
  }, [leads]);

  const totalValue = useMemo(() => {
    return leads.reduce(
      (sum, lead) => sum + (lead.estimatedValue || 0),
      0
    );
  }, [leads]);

  /* =======================================================
     SELECTION
  ======================================================= */

  const toggleSelectLead = (id: string) => {
    setSelectedLeads((previous) =>
      previous.includes(id)
        ? previous.filter((leadId) => leadId !== id)
        : [...previous, id]
    );
  };

  const toggleSelectAll = () => {
    if (filteredLeads.length === 0) return;

    const allSelected = filteredLeads.every((lead) =>
      selectedLeads.includes(lead.id)
    );

    if (allSelected) {
      setSelectedLeads((previous) =>
        previous.filter(
          (id) => !filteredLeads.some((lead) => lead.id === id)
        )
      );
    } else {
      setSelectedLeads((previous) => [
        ...new Set([
          ...previous,
          ...filteredLeads.map((lead) => lead.id),
        ]),
      ]);
    }
  };

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setSourceFilter("all");
  };

  const hasActiveFilters =
    search.length > 0 ||
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    sourceFilter !== "all";

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="min-h-screen bg-[#0D1421] text-white">
      <div className="flex min-h-screen">

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <section className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 xl:px-10">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <header className="mb-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                      Leads
                    </h1>

                    <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400">
                      {leads.length} total
                    </span>
                  </div>

                  <p className="mt-2 max-w-xl text-sm text-slate-400">
                    Manage, track, and convert your sales opportunities.
                  </p>
                </div>

                <Link
                  href="/dashboard/leads/create"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium shadow-lg shadow-blue-600/10 transition-all hover:bg-blue-500 hover:shadow-blue-500/20 active:scale-[0.98]"
                >
                  <Plus size={17} />
                  Add New Lead
                </Link>
              </div>
            </header>

            {/* =================================================
                STAT CARDS
            ================================================= */}

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">

              <StatCard
                icon={Users}
                label="Total Leads"
                value={leads.length}
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
                value={formatCurrency(totalValue)}
                description="Estimated opportunity value"
                iconStyle="bg-emerald-500/10 text-emerald-400"
              />

            </div>

            {/* =================================================
                FILTER BAR
            ================================================= */}

            <div className="mb-5 rounded-2xl border border-[#263248] bg-[#111827] p-4">

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(240px,1fr)_repeat(3,minmax(140px,180px))_40px]">

                {/* Search */}

                <div className="relative sm:col-span-2 xl:col-span-1">
                  <Search
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="text"
                    placeholder="Search leads, emails, sources..."
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    className="h-10 w-full rounded-xl border border-[#263248] bg-[#0D1421] pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-blue-500/60"
                  />
                </div>

                {/* Status */}

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

                {/* Priority */}

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

                {/* Source */}

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

                {/* Clear */}

                <button
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                  title="Clear filters"
                  className="flex h-10 items-center justify-center rounded-xl border border-[#263248] text-slate-400 transition-colors hover:bg-[#182235] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <X size={16} />
                </button>

              </div>
            </div>

            {/* =================================================
                LEADS CONTAINER
            ================================================= */}

            <div className="overflow-hidden rounded-2xl border border-[#263248] bg-[#111827]">

              {/* =================================================
                  TABLE TOOLBAR
              ================================================= */}

              <div className="flex flex-col gap-3 border-b border-[#263248] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">

                <div className="flex flex-wrap items-center gap-3">

                  <SlidersHorizontal
                    size={17}
                    className="text-slate-500"
                  />

                  <span className="text-sm text-slate-400">
                    Showing{" "}
                    <span className="font-medium text-white">
                      {filteredLeads.length}
                    </span>{" "}
                    leads
                  </span>

                  {selectedLeads.length > 0 && (
                    <span className="rounded-full bg-blue-500/10 px-2 py-1 text-xs text-blue-400">
                      {selectedLeads.length} selected
                    </span>
                  )}

                </div>

                <button className="flex items-center gap-2 self-start text-xs text-slate-400 transition-colors hover:text-white sm:self-auto">
                  <ArrowUpDown size={14} />
                  Sort by
                  <ChevronDown size={14} />
                </button>

              </div>

              {/* =================================================
                  DESKTOP TABLE
              ================================================= */}

              <div className="hidden overflow-x-auto lg:block">

                <table className="w-full min-w-[1100px]">

                  <thead>
                    <tr className="border-b border-[#263248] text-left">

                      <th className="w-12 px-5 py-3">
                        <input
                          type="checkbox"
                          checked={
                            filteredLeads.length > 0 &&
                            filteredLeads.every((lead) =>
                              selectedLeads.includes(lead.id)
                            )
                          }
                          onChange={toggleSelectAll}
                          className="h-4 w-4 cursor-pointer accent-blue-500"
                        />
                      </th>

                      <TableHeader>Lead</TableHeader>
                      <TableHeader>Source</TableHeader>
                      <TableHeader>Status</TableHeader>
                      <TableHeader>Priority</TableHeader>
                      <TableHeader>Est. Value</TableHeader>
                      <TableHeader>Assigned To</TableHeader>
                      <TableHeader>Last Contact</TableHeader>

                      <th className="w-12 px-5 py-3" />
                    </tr>
                  </thead>

                  <tbody>

                    {filteredLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="border-b border-[#263248] transition-colors last:border-0 hover:bg-[#151F31]"
                      >

                        {/* Checkbox */}

                        <td className="px-5 py-4">
                          <input
                            type="checkbox"
                            checked={selectedLeads.includes(lead.id)}
                            onChange={() =>
                              toggleSelectLead(lead.id)
                            }
                            className="h-4 w-4 cursor-pointer accent-blue-500"
                          />
                        </td>

                        {/* Lead */}

                        <td className="min-w-[240px] px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-sm font-semibold text-blue-400">
                              {getInitials(lead.personId)}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-white">
                                {lead.personId}
                              </p>

                              <p className="mt-0.5 truncate text-xs text-slate-500">
                                {lead.email}
                              </p>
                            </div>

                          </div>

                        </td>

                        {/* Source */}

                        <td className="px-5 py-4">
                          <span className="text-sm capitalize text-slate-300">
                            {formatSource(lead.source)}
                          </span>
                        </td>

                        {/* Status */}

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
                              statusStyles[lead.status]
                            }`}
                          >
                            {formatLabel(lead.status)}
                          </span>
                        </td>

                        {/* Priority */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">

                            <span
                              className={`h-2 w-2 rounded-full ${
                                lead.priority === "high"
                                  ? "bg-red-400"
                                  : lead.priority === "medium"
                                  ? "bg-amber-400"
                                  : "bg-slate-500"
                              }`}
                            />

                            <span
                              className={`text-sm capitalize ${
                                priorityStyles[lead.priority]
                              }`}
                            >
                              {lead.priority}
                            </span>

                          </div>
                        </td>

                        {/* Value */}

                        <td className="px-5 py-4">
                          <span className="text-sm font-medium text-slate-200">
                            {formatCurrency(
                              lead.estimatedValue
                            )}
                          </span>
                        </td>

                        {/* Assigned */}

                        <td className="px-5 py-4">
                          <span className="text-sm text-slate-300">
                            {lead.assignedTo}
                          </span>
                        </td>

                        {/* Last Contact */}

                        <td className="px-5 py-4">
                          <span className="whitespace-nowrap text-xs text-slate-500">
                            {formatDate(
                              lead.lastContactedAt
                            )}
                          </span>
                        </td>

                        {/* Actions */}

                        <td className="px-5 py-4">
                          <button
                            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-[#263248] hover:text-white"
                            aria-label={`Actions for ${lead.personId}`}
                          >
                            <MoreHorizontal size={17} />
                          </button>
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

              {/* =================================================
                  MOBILE CARDS
              ================================================= */}

              <div className="divide-y divide-[#263248] lg:hidden">

                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-4 transition-colors hover:bg-[#151F31] sm:p-5"
                  >

                    {/* Lead Header */}

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-sm font-semibold text-blue-400">
                          {getInitials(lead.personId)}
                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-sm font-medium text-white">
                            {lead.personId}
                          </p>

                          <p className="truncate text-xs text-slate-500">
                            {lead.email}
                          </p>

                        </div>

                      </div>

                      <button
                        className="shrink-0 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-[#263248] hover:text-white"
                        aria-label={`Actions for ${lead.personId}`}
                      >
                        <MoreHorizontal size={17} />
                      </button>

                    </div>

                    {/* Badges */}

                    <div className="mt-4 flex flex-wrap gap-2">

                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs ${
                          statusStyles[lead.status]
                        }`}
                      >
                        {formatLabel(lead.status)}
                      </span>

                      <span className="rounded-full bg-[#182235] px-2.5 py-1 text-xs capitalize text-slate-400">
                        {lead.priority} priority
                      </span>

                      <span className="rounded-full bg-[#182235] px-2.5 py-1 text-xs text-slate-400">
                        {formatCurrency(
                          lead.estimatedValue
                        )}
                      </span>

                    </div>

                    {/* Details */}

                    <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4">

                      <MobileDetail
                        label="Source"
                        value={formatSource(lead.source)}
                        capitalize
                      />

                      <MobileDetail
                        label="Assigned To"
                        value={lead.assignedTo}
                      />

                      <MobileDetail
                        label="Last Contact"
                        value={formatDate(
                          lead.lastContactedAt
                        )}
                      />

                      <MobileDetail
                        label="Created"
                        value={formatDate(lead.createdAt)}
                      />

                    </div>

                    {/* Actions */}

                    <div className="mt-4 grid grid-cols-2 gap-2">

                      <button className="flex h-9 items-center justify-center gap-2 rounded-lg bg-blue-500/10 text-xs text-blue-400 transition-colors hover:bg-blue-500/20">
                        <Phone size={14} />
                        Call
                      </button>

                      <button className="flex h-9 items-center justify-center gap-2 rounded-lg bg-[#182235] text-xs text-slate-300 transition-colors hover:bg-[#263248]">
                        <Mail size={14} />
                        Email
                      </button>

                    </div>

                  </div>
                ))}

              </div>

              {/* =================================================
                  EMPTY STATE
              ================================================= */}

              {filteredLeads.length === 0 && (
                <div className="px-4 py-16 text-center sm:px-6">

                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#182235]">
                    <Users
                      size={24}
                      className="text-slate-500"
                    />
                  </div>

                  <p className="text-sm font-medium text-white">
                    No leads found
                  </p>

                  <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
                    Try adjusting your filters or search query.
                  </p>

                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="mt-4 text-xs font-medium text-blue-400 transition-colors hover:text-blue-300"
                    >
                      Clear filters
                    </button>
                  )}

                </div>
              )}

            </div>

          </div>
        </section>

      </div>
    </main>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

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
    <div className="rounded-2xl border border-[#263248] bg-[#111827] p-4 transition-colors hover:border-[#34445f]">

      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">

          <p className="text-xs text-slate-500">
            {label}
          </p>

          <p className="mt-2 truncate text-2xl font-semibold text-white">
            {value}
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            {description}
          </p>

        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}
        >
          <Icon size={19} />
        </div>

      </div>

    </div>
  );
}

/* =========================================================
   FILTER SELECT
========================================================= */

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}

function FilterSelect({
  value,
  onChange,
  options,
}: FilterSelectProps) {
  return (
    <div className="relative">

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-10 w-full cursor-pointer appearance-none rounded-xl border border-[#263248] bg-[#0D1421] px-3 pr-9 text-sm text-slate-300 outline-none transition-colors focus:border-blue-500/60"
      >
        {options.map(([optionValue, label]) => (
          <option
            key={optionValue}
            value={optionValue}
          >
            {label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
      />

    </div>
  );
}

/* =========================================================
   TABLE HEADER
========================================================= */

function TableHeader({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <th className="whitespace-nowrap px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-slate-500">
      {children}
    </th>
  );
}

/* =========================================================
   MOBILE DETAIL
========================================================= */

interface MobileDetailProps {
  label: string;
  value: string;
  capitalize?: boolean;
}

function MobileDetail({
  label,
  value,
  capitalize = false,
}: MobileDetailProps) {
  return (
    <div className="min-w-0">

      <p className="text-[11px] text-slate-500">
        {label}
      </p>

      <p
        className={`mt-1 truncate text-xs text-slate-300 ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value}
      </p>

    </div>
  );
}