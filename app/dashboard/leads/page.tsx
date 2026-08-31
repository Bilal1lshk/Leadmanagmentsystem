"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LucideIcon } from "lucide-react";
import {
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  Plus,
  ChevronDown,
  Flame,
  Users,
  TrendingUp,
  CircleDollarSign,
  X,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";

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
  _id: string;
  id?: string;
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

interface LeadsResponse {
  message?: string;
  data?: Lead[];
  success?: boolean;
}

/* =========================================================
   STYLES
========================================================= */

const statusStyles: Record<LeadStatus, string> = {
  new: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  contacted:
    "border-indigo-500/20 bg-indigo-500/10 text-indigo-400",
  qualified:
    "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",
  proposal:
    "border-violet-500/20 bg-violet-500/10 text-violet-400",
  won:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  lost:
    "border-rose-500/20 bg-rose-500/10 text-rose-400",
};

const priorityStyles: Record<LeadPriority, string> = {
  low: "text-slate-400",
  medium: "text-amber-400",
  high: "text-red-400",
};

const priorityDotStyles: Record<LeadPriority, string> = {
  low: "bg-slate-500",
  medium: "bg-amber-400",
  high: "bg-red-400",
};

/* =========================================================
   HELPERS
========================================================= */

const formatLabel = (value?: string): string => {
  if (!value) return "Unknown";

  return value.charAt(0).toUpperCase() + value.slice(1);
};

const formatSource = (value?: string): string => {
  if (!value) return "Unknown";

  return value.replaceAll("_", " ");
};

const formatCurrency = (value?: number): string => {
  const amount = Number(value) || 0;

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (
  value?: string,
  fallback = "Never contacted"
): string => {
  if (!value) return fallback;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name?: string): string => {
  if (!name?.trim()) return "?";

  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

/* =========================================================
   PAGE
========================================================= */

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);

  const [search, setSearch] = useState<string>("");

  const [statusFilter, setStatusFilter] =
    useState<string>("all");

  const [priorityFilter, setPriorityFilter] =
    useState<string>("all");

  const [sourceFilter, setSourceFilter] =
    useState<string>("all");

  const [selectedLeads, setSelectedLeads] =
    useState<string[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<string>("");

  /* =======================================================
     FETCH LEADS
  ======================================================= */

  const getLeads = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get<LeadsResponse>(
        "/api/dashboardapi/Leads/AllLead",
        {
          withCredentials: true,
        }
      );

      const apiLeads = Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      setLeads(apiLeads);
    } catch (error) {
      console.error("Failed to fetch leads:", error);

      setLeads([]);

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Unable to load leads. Please try again."
        );
      } else {
        setError("Unable to load leads. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void getLeads();
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
        lead.assignedTo?.toLowerCase().includes(query) ||
        lead.status?.toLowerCase().includes(query) ||
        lead.priority?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        lead.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" ||
        lead.priority === priorityFilter;

      const matchesSource =
        sourceFilter === "all" ||
        lead.source === sourceFilter;

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
    return leads.filter(
      (lead) => lead.priority === "high"
    ).length;
  }, [leads]);

  const qualifiedLeads = useMemo(() => {
    return leads.filter(
      (lead) => lead.status === "qualified"
    ).length;
  }, [leads]);

  const totalValue = useMemo(() => {
    return leads.reduce(
      (sum, lead) =>
        sum + (Number(lead.estimatedValue) || 0),
      0
    );
  }, [leads]);

  /* =======================================================
     SELECTION
  ======================================================= */

  const toggleSelectLead = (id: string): void => {
    setSelectedLeads((previous) => {
      if (previous.includes(id)) {
        return previous.filter(
          (leadId) => leadId !== id
        );
      }

      return [...previous, id];
    });
  };

  const toggleSelectAll = (): void => {
    if (filteredLeads.length === 0) {
      return;
    }

    const filteredIds = filteredLeads.map(
      (lead) => lead._id
    );

    const allSelected = filteredIds.every((id) =>
      selectedLeads.includes(id)
    );

    if (allSelected) {
      setSelectedLeads((previous) =>
        previous.filter(
          (id) => !filteredIds.includes(id)
        )
      );

      return;
    }

    setSelectedLeads((previous) => [
      ...new Set([...previous, ...filteredIds]),
    ]);
  };

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const clearFilters = (): void => {
    setSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setSourceFilter("all");
  };

  const hasActiveFilters =
    search.trim().length > 0 ||
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    sourceFilter !== "all";

  /* =======================================================
     CALL LEAD
  ======================================================= */

  const handleCall = (
    event: React.MouseEvent<HTMLButtonElement>,
    email: string
  ): void => {
    event.stopPropagation();

    if (!email) return;

    window.location.href = `tel:${email}`;
  };

  /* =======================================================
     EMAIL LEAD
  ======================================================= */

  const handleEmail = (
    event: React.MouseEvent<HTMLButtonElement>,
    email: string
  ): void => {
    event.stopPropagation();

    if (!email) return;

    window.location.href = `mailto:${email}`;
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="min-h-screen bg-[#0D1421] text-white">
      <div className="min-h-screen">
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

                    <span className="rounded-full border border-blue-500/20 px-2.5 py-1 text-xs font-medium text-blue-400">
                      {leads.length} total
                    </span>
                  </div>

                  <p className="mt-2 max-w-xl text-sm text-slate-400">
                    Manage, track, and convert your sales
                    opportunities.
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
                ERROR
            ================================================= */}

            {error && (
              <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-red-400">
                    Something went wrong
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {error}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => void getLeads()}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20"
                >
                  <RefreshCw size={14} />
                  Retry
                </button>
              </div>
            )}

            {/* =================================================
                STAT CARDS
            ================================================= */}

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
              <StatCard
  icon={Users}
  label="Total Leads"
  value={loading ? "—" : leads.length}
  description="All active leads"
  iconStyle="border-blue-400/20 bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent text-blue-400 shadow-lg shadow-blue-500/10"
/>

<StatCard
  icon={Flame}
  label="High Priority"
  value={loading ? "—" : highPriorityLeads}
  description="Need immediate attention"
  iconStyle="border-orange-400/20 bg-gradient-to-br from-orange-500/20 via-red-500/10 to-transparent text-orange-400 shadow-lg shadow-orange-500/10"
/>

<StatCard
  icon={TrendingUp}
  label="Qualified Leads"
  value={loading ? "—" : qualifiedLeads}
  description="Ready for conversion"
  iconStyle="border-cyan-400/20 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent text-cyan-400 shadow-lg shadow-cyan-500/10"
/>

<StatCard
  icon={CircleDollarSign}
  label="Pipeline Value"
  value={loading ? "—" : formatCurrency(totalValue)}
  description="Estimated opportunity value"
  iconStyle="border-emerald-400/20 bg-gradient-to-br from-emerald-500/20 via-green-500/10 to-transparent text-emerald-400 shadow-lg shadow-emerald-500/10"
/>
            </div>

            {/* =================================================
                FILTER BAR
            ================================================= */}

            <div className="mb-5 rounded-2xl border border-[#263248] bg-[#111827] p-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(260px,1fr)_180px_180px_180px_44px]">

                {/* Search */}

                <div className="relative sm:col-span-2 xl:col-span-1">
                  <Search
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search leads, emails, sources..."
                    className="h-10 w-full rounded-xl border border-[#263248] bg-[#0D1421] pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
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

              </div>
            </div>

            {/* =================================================
                LEADS CONTAINER
            ================================================= */}

            <div className="overflow-hidden rounded-2xl border border-[#263248] bg-[#111827]">

              {/* =================================================
                  TOOLBAR
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
                    <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400">
                      {selectedLeads.length} selected
                    </span>
                  )}
                </div>

               
              </div>

              {/* =================================================
                  LOADING
              ================================================= */}

              {loading && (
                <LoadingState />
              )}

              {/* =================================================
                  DESKTOP TABLE
              ================================================= */}

              {!loading && filteredLeads.length > 0 && (
                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full min-w-[1200px] table-fixed">

                    <colgroup>
                      <col className="w-[48px]" />
                      <col className="w-[24%]" />
                      <col className="w-[11%]" />
                      <col className="w-[11%]" />
                      <col className="w-[10%]" />
                      <col className="w-[13%]" />
                      <col className="w-[12%]" />
                      <col className="w-[11%]" />
                      <col className="w-[52px]" />
                    </colgroup>

                    {/* HEADER */}

                    <thead>
                      <tr className="border-b border-[#263248] ">
                        <th className="px-5 py-4 text-left">
                          <input
                            type="checkbox"
                            checked={
                              filteredLeads.length > 0 &&
                              filteredLeads.every(
                                (lead) =>
                                  selectedLeads.includes(
                                    lead._id
                                  )
                              )
                            }
                            onChange={toggleSelectAll}
                            className="h-4 w-4 cursor-pointer accent-blue-500"
                            aria-label="Select all leads"
                          />
                        </th>

                        <TableHeader>
                          Lead
                        </TableHeader>

                        <TableHeader>
                          Source
                        </TableHeader>

                        <TableHeader>
                          Status
                        </TableHeader>

                        <TableHeader>
                          Priority
                        </TableHeader>

                        <TableHeader align="right">
                          Estimated Value
                        </TableHeader>

                      </tr>
                    </thead>

                    {/* BODY */}

                    <tbody>
                      {filteredLeads.map((lead) => (
                        <tr
                          key={lead._id}
                          onClick={() => {
                            window.location.href = `/dashboard/leads/${lead._id}`;
                          }}
                          className="h-[76px] cursor-pointer border-b border-[#263248] transition-colors last:border-0 hover:bg-[#151F31]"
                        >

                          {/* CHECKBOX */}

                          <td className="px-5 py-4">
                            <input
                              type="checkbox"
                              checked={selectedLeads.includes(
                                lead._id
                              )}
                              onChange={(event) => {
                                event.stopPropagation();

                                toggleSelectLead(
                                  lead._id
                                );
                              }}
                              onClick={(event) =>
                                event.stopPropagation()
                              }
                              className="h-4 w-4 cursor-pointer accent-blue-500"
                              aria-label={`Select ${lead.personId}`}
                            />
                          </td>

                          {/* LEAD */}

                          <td className="px-5 py-4">
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-500/20text-sm font-semibold text-blue-400">
                                {getInitials(
                                  lead.personId
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-white">
                                  {lead.personId ||
                                    "Unnamed Lead"}
                                </p>

                                <p className="mt-0.5 truncate text-xs text-slate-500">
                                  {lead.email ||
                                    "No email"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* SOURCE */}

                          <td className="px-5 py-4">
                            <span className="block truncate text-sm capitalize text-slate-300">
                              {formatSource(
                                lead.source
                              )}
                            </span>
                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
                              
                                  lead.status
                                
                              }`}
                            >
                              {lead.status}
                            </span>
                          </td>

                          {/* PRIORITY */}

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`h-2 w-2 shrink-0 rounded-full ${
                                  priorityDotStyles[
                                    lead.priority
                                  ]
                                }`}
                              />

                              <span
                                className={`text-sm capitalize ${
                                  priorityStyles[
                                    lead.priority
                                  ]
                                }`}
                              >
                                {lead.priority}
                              </span>
                            </div>
                          </td>

                          {/* VALUE */}

                          <td className="px-5 py-4 text-right">
                            <span className="whitespace-nowrap text-sm font-semibold text-slate-200">
                              {formatCurrency(
                                lead.estimatedValue
                              )}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* =================================================
                  MOBILE CARDS
              ================================================= */}

              {!loading &&
                filteredLeads.length > 0 && (
                  <div className="divide-y divide-[#263248] lg:hidden">
                    {filteredLeads.map((lead) => (
                      <div
                        key={lead._id}
                        className="p-4 transition-colors hover:bg-[#151F31] sm:p-5"
                      >

                        {/* HEADER */}

                        <div className="flex items-start justify-between gap-3">
                          <Link
                            href={`/dashboard/leads/${lead._id}`}
                            className="flex min-w-0 items-center gap-3"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-sm font-semibold text-blue-400">
                              {getInitials(
                                lead.personId
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-white">
                                {lead.personId ||
                                  "Unnamed Lead"}
                              </p>

                              <p className="truncate text-xs text-slate-500">
                                {lead.email ||
                                  "No email"}
                              </p>
                            </div>
                          </Link>

                          <button
                            type="button"
                            className="shrink-0 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-[#263248] hover:text-white"
                            aria-label={`Actions for ${lead.personId}`}
                          >
                            <MoreHorizontal
                              size={17}
                            />
                          </button>
                        </div>

                        {/* BADGES */}

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                              statusStyles[
                                lead.status
                              ]
                            }`}
                          >
                            {formatLabel(
                              lead.status
                            )}
                          </span>

                          <span className="rounded-full border border-[#263248] bg-[#182235] px-2.5 py-1 text-xs capitalize text-slate-400">
                            {lead.priority} priority
                          </span>

                          <span className="rounded-full border border-[#263248] bg-[#182235] px-2.5 py-1 text-xs font-medium text-slate-300">
                            {formatCurrency(
                              lead.estimatedValue
                            )}
                          </span>
                        </div>

                        {/* DETAILS */}

                        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4">
                          <MobileDetail
                            label="Source"
                            value={formatSource(
                              lead.source
                            )}
                            capitalize
                          />

                          <MobileDetail
                            label="Assigned To"
                            value={
                              lead.assignedTo ||
                              "Unassigned"
                            }
                          />

                          <MobileDetail
                            label="Last Contact"
                            value={formatDate(
                              lead.lastContactedAt
                            )}
                          />

                          <MobileDetail
                            label="Created"
                            value={formatDate(
                              lead.createdAt,
                              "Unknown"
                            )}
                          />
                        </div>

                        {/* ACTIONS */}

                      </div>
                    ))}
                  </div>
                )}

              {/* =================================================
                  EMPTY STATE
              ================================================= */}

              {!loading &&
                filteredLeads.length === 0 && (
                  <EmptyState
                    hasActiveFilters={
                      hasActiveFilters
                    }
                    clearFilters={clearFilters}
                  />
                )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/* =========================================================
   LOADING STATE
========================================================= */

function LoadingState() {
  return (
    <div className="space-y-0">
      {Array.from({ length: 6 }).map(
        (_, index) => (
          <div
            key={index}
            className="flex h-[76px] items-center gap-5 border-b border-[#263248] px-5 last:border-0"
          >
            <div className="h-4 w-4 animate-pulse rounded bg-[#263248]" />

            <div className="flex flex-1 items-center gap-3">
              <div className="h-9 w-9 animate-pulse rounded-xl bg-[#263248]" />

              <div className="space-y-2">
                <div className="h-3 w-32 animate-pulse rounded bg-[#263248]" />

                <div className="h-2.5 w-44 animate-pulse rounded bg-[#263248]" />
              </div>
            </div>

            <div className="hidden h-3 w-20 animate-pulse rounded bg-[#263248] lg:block" />

            <div className="hidden h-6 w-20 animate-pulse rounded-full bg-[#263248] lg:block" />

            <div className="hidden h-3 w-16 animate-pulse rounded bg-[#263248] lg:block" />
          </div>
        )
      )}
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

interface EmptyStateProps {
  hasActiveFilters: boolean;
  clearFilters: () => void;
}

function EmptyState({
  hasActiveFilters,
  clearFilters,
}: EmptyStateProps) {
  return (
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

      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
        {hasActiveFilters
          ? "Try adjusting your filters or search query."
          : "You don't have any leads yet. Create your first lead to get started."}
      </p>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="mt-4 text-xs font-medium text-blue-400 transition-colors hover:text-blue-300"
        >
          Clear filters
        </button>
      )}
    </div>
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
    <div className="rounded-2xl border border-[#263248] bg-[#111827] p-4 transition-all hover:border-[#34445f] hover:bg-[#121C2C]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-2 truncate text-2xl font-semibold tracking-tight text-white">
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
        className="h-10 w-full cursor-pointer appearance-none rounded-xl border border-[#263248] bg-[#0D1421] px-3 pr-9 text-sm text-slate-300 outline-none transition-colors focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
      >
        {options.map(
          ([optionValue, label]) => (
            <option
              key={optionValue}
              value={optionValue}
              className="bg-[#111827] text-white"
            >
              {label}
            </option>
          )
        )}
      </select>

      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
      />
    </div>
  );
}



interface TableHeaderProps {
  children: ReactNode;
  align?: "left" | "right";
}

function TableHeader({
  children,
  align = "left",
}: TableHeaderProps) {
  const alignmentClass =
    align === "right"
      ? "text-right"
      : "text-left";

  return (
    <th
      className={`whitespace-nowrap px-5 py-4 ${alignmentClass} text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500`}
    >
      {children}
    </th>
  );
}

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
      <p className="text-[11px] font-medium text-slate-500">
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