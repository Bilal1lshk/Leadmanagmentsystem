"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import StatCard from "@/app/components/Dashboard/followups/StatCard";
import {
  Calendar,
  CheckCircle2,
  Clock3,
  Plus,
  Search,
  TriangleAlert,
  X,
} from "lucide-react";
import TableHeader from "@/app/components/Dashboard/followups/TableHeader";
import LoadingRows from "@/app/components/Dashboard/followups/LoadingsRows";
import EmptyState from "@/app/components/Dashboard/followups/EmptyState";
import FollowupRow from "@/app/components/Dashboard/followups/FollowupRow";
import axios from "axios";

export type FollowupStatus =
  | "pending"
  | "completed"
  | "missed"
  | "rescheduled";

export interface Lead {
  _id: string;
  name?: string;
  company?: string;
  personId?: string;
  email?: string;
}

export interface User {
  _id: string;
  name: string;
  avatar?: string;
}

export interface Followup {
  _id: string;
  lead: Lead;
  comments: string;
  duedate: string;
  CreatedBy: User;
  assignedTo: User;
  status: FollowupStatus;
  createdAt?: string;
  updatedAt?: string;
}

interface FollowupsPageProps {
  followups?: Followup[];
  loading?: boolean;
  error?: string | null;

  onCreate?: () => void;
  onEdit?: (followup: Followup) => void;
  onDelete?: (followup: Followup) => void;
  onComplete?: (followup: Followup) => void;
  onReschedule?: (followup: Followup) => void;
}

export const statusConfig: Record<
  FollowupStatus,
  {
    label: string;
    className: string;
  }
> = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800",
  },
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-800",
  },
  missed: {
    label: "Missed",
    className: "bg-red-100 text-red-800",
  },
  rescheduled: {
    label: "Rescheduled",
    className: "bg-blue-100 text-blue-800",
  },
};

export default function FollowupsPage({
  followups,
  loading: initialLoading = false,
  error: initialError = null,
  onCreate,
  onEdit,
  onDelete: customDelete,
  onComplete: customComplete,
  onReschedule: customReschedule,
}: FollowupsPageProps) {
  const [search, setSearch] = useState("");
  const [data, setdata] = useState<Followup[]>([]);
  const [loading, setLoading] = useState(initialLoading || true);
  const [error, setError] = useState<string | null>(initialError);
  const [status, setStatus] = useState<"all" | FollowupStatus>("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const fetchFollowups = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/followups/All`);
      if (response.data?.data) {
        setdata(response.data.data);
      }
    } catch (err: any) {
      console.error("Error loading followups:", err);
      setError(err.response?.data?.message || "Failed to load follow-ups.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowups();
  }, []);

  const pendingLeads = useMemo(
    () => data?.filter((item) => item?.status === "pending") || [],
    [data]
  );
  const completedLeads = useMemo(
    () => data?.filter((item) => item?.status === "completed") || [],
    [data]
  );
  const overdueLeads = useMemo(
    () =>
      data?.filter(
        (item) =>
          item?.status === "pending" &&
          new Date(item.duedate).getTime() < Date.now()
      ) || [],
    [data]
  );

  const filteredFollowups = useMemo(() => {
    const listToFilter = data && data.length > 0 ? data : followups || [];
    const query = search?.toLowerCase()?.trim();

    return listToFilter?.filter((item) => {
      const leadIdentifier =
        item.lead?.name || item.lead?.company || item.lead?.personId || "";
      const matchesSearch =
        !query ||
        leadIdentifier.toLowerCase().includes(query) ||
        item.assignedTo?.name?.toLowerCase().includes(query) ||
        item.comments?.toLowerCase().includes(query);

      const matchesStatus = status === "all" || item?.status === status;

      let matchesDate = true;
      if (dateFilter !== "all" && item.duedate) {
        const dueDateObj = new Date(item.duedate);
        const now = new Date();
        const startOfToday = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const startOfTomorrow = new Date(startOfToday.getTime() + 86400000);
        const startOfNextDay = new Date(startOfTomorrow.getTime() + 86400000);

        if (dateFilter === "today") {
          matchesDate =
            dueDateObj >= startOfToday && dueDateObj < startOfTomorrow;
        } else if (dateFilter === "tomorrow") {
          matchesDate =
            dueDateObj >= startOfTomorrow && dueDateObj < startOfNextDay;
        } else if (dateFilter === "this-week") {
          const endOfWeek = new Date(startOfToday.getTime() + 7 * 86400000);
          matchesDate = dueDateObj >= startOfToday && dueDateObj <= endOfWeek;
        } else if (dateFilter === "overdue") {
          matchesDate =
            item.status === "pending" && dueDateObj.getTime() < Date.now();
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [data, followups, search, status, dateFilter]);

  const handleComplete = async (item: Followup) => {
    if (customComplete) {
      customComplete(item);
      return;
    }
    try {
      const response = await axios.patch("/api/followups/UpdateStatus", {
        id: item._id,
        status: "completed",
      });
      if (response.data?.success) {
        setdata((prev) =>
          prev.map((f) =>
            f._id === item._id ? { ...f, status: "completed" } : f
          )
        );
      }
    } catch (err) {
      console.error("Failed to complete followup:", err);
    }
  };

  const handleDelete = async (item: Followup) => {
    if (customDelete) {
      customDelete(item);
      return;
    }
    if (!confirm("Are you sure you want to delete this follow-up?")) return;
    try {
      const response = await axios.delete(
        `/api/followups/Delete?id=${item._id}`
      );
      if (response.data?.success) {
        setdata((prev) => prev.filter((f) => f._id !== item._id));
      }
    } catch (err) {
      console.error("Failed to delete followup:", err);
    }
  };

  const handleReschedule = async (item: Followup) => {
    if (customReschedule) {
      customReschedule(item);
      return;
    }
    // Bump due date by 1 day
    const nextDate = new Date(
      new Date(item.duedate).getTime() + 86400000
    ).toISOString();
    try {
      const response = await axios.patch("/api/followups/UpdateStatus", {
        id: item._id,
        status: "rescheduled",
        duedate: nextDate,
      });
      if (response.data?.success) {
        setdata((prev) =>
          prev.map((f) =>
            f._id === item._id
              ? { ...f, status: "rescheduled", duedate: nextDate }
              : f
          )
        );
      }
    } catch (err) {
      console.error("Failed to reschedule followup:", err);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 flex flex-row p-4 md:p-6">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Header Bar */}
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Follow-ups
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage scheduled customer follow-ups
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            {/* Search Input */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by lead, user, comments..."
                className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-9 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-[300px]"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as "all" | FollowupStatus)
              }
              className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="missed">Missed</option>
              <option value="rescheduled">Rescheduled</option>
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="this-week">This Week</option>
              <option value="overdue">Overdue</option>
            </select>

            {/* Create Button */}
            <Link href="/dashboard/followups/create">
              <button
                type="button"
                onClick={onCreate}
                className="inline-flex h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                <Plus size={18} />
                New Follow-up
              </button>
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<Calendar size={22} />}
            title="Total Follow-ups"
            value={data.length}
            description="All records"
            iconClass="bg-blue-600"
            highlighted
          />

          <StatCard
            icon={<Clock3 size={22} />}
            title="Pending"
            value={pendingLeads.length}
            description="Scheduled actions"
            iconClass="bg-yellow-400"
          />

          <StatCard
            icon={<CheckCircle2 size={22} />}
            title="Completed"
            value={completedLeads.length}
            description="Successfully handled"
            iconClass="bg-green-500"
          />

          <StatCard
            icon={<TriangleAlert size={22} />}
            title="Overdue"
            value={overdueLeads.length}
            description="Missed deadlines"
            iconClass="bg-red-500"
          />
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Data Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="w-12 px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </th>
                  <TableHeader>Lead</TableHeader>
                  <TableHeader>Assigned To</TableHeader>
                  <TableHeader>Due Date</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Comments</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <LoadingRows />
                ) : !filteredFollowups || filteredFollowups.length === 0 ? (
                  <EmptyState onCreate={onCreate} />
                ) : (
                  filteredFollowups.map((item) => (
                    <FollowupRow
                      key={item._id}
                      followup={item}
                      menuOpen={openMenu === item._id}
                      onMenuToggle={() =>
                        setOpenMenu((current) =>
                          current === item._id ? null : item._id
                        )
                      }
                      onEdit={() => onEdit?.(item)}
                      onDelete={() => handleDelete(item)}
                      onComplete={() => handleComplete(item)}
                      onReschedule={() => handleReschedule(item)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}