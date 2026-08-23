"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import StatCard from "@/app/components/Dashboard/followups/StatCard"
import {
  Calendar,
  CheckCircle2,
  Clock3,
  MoreHorizontal,
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
import Sidebar from "@/app/components/Dashboard/Homepage/Sidebar";

export type FollowupStatus =
  | "pending"
  | "completed"
  | "missed"
  | "rescheduled";

export interface Lead {
  _id: string;
  name: string;
  company?: string;
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
  followups: Followup[];
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
  loading = false,
  error = null,
  onCreate,
  onEdit,
  onDelete,
  onComplete,
  onReschedule,
}: FollowupsPageProps) {
  const [search, setSearch] = useState("");
  const [data, setdata] = useState([])
  const [status, setStatus] = useState<
    "all" | FollowupStatus
  >("all");
  const pendingleads = data?.filter((pending: object) => pending?.status === "pending")
  const completedleads = data?.filter((pending: object) => pending?.status === "completed")
  const date = Date.now();
  const duedate = data?.filter((pending: object) =>  new Date(pending.duedate).getTime() < date)
  console.log("duedate",duedate)
  const [dateFilter, setDateFilter] = useState("this-week");

  const [openMenu, setOpenMenu] = useState<string | null>(
    null
  );
  const overdue = followups?.filter(
    (followup) =>
      followup?.status === "pending" &&
      new Date(followup.duedate).getTime() < Date.now()
  ).length;
  useEffect(() => {
    const gettingdata = async () => {
      const response = await axios.get(`/api/followups/All`);
      console.log(data, "Alldata")
      setdata(response.data.data)

    }
    gettingdata()
  }, [])
  console.log(data)
  const filteredFollowups = useMemo(() => {
    const query = search?.toLowerCase()?.trim();

    return followups?.filter((followup) => {
      const matchesSearch =
        !query ||
        followup.lead?.name
          ?.toLowerCase()
          .includes(query) ||
        followup.lead?.company
          ?.toLowerCase()
          .includes(query) ||
        followup.assignedTo?.name
          ?.toLowerCase()
          .includes(query) ||
        followup.comments
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        status === "all" ||
        followup?.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [followups, search, status]);

  return (
    <section className="min-h-screen bg-gray-50 flex flex-row  -start p-4 md:p-6">
      <div className="mx-auto max-w-[1400px]">

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

            {/* Search */}

            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
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

            {/* Status */}

            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value as
                  | "all"
                  | FollowupStatus
                )
              }
              className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="missed">Missed</option>
              <option value="rescheduled">
                Rescheduled
              </option>
            </select>

            {/* Date */}

            <select
              value={dateFilter}
              onChange={(event) =>
                setDateFilter(event.target.value)
              }
              className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="this-week">This Week</option>
              <option value="overdue">Overdue</option>
            </select>

            {/* Create */}
            <Link href={"/dashboard/followups/create"}>
              <button
                type="button"
                onClick={onCreate}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                <Plus size={18} />
                New Follow-up
              </button>
            </Link>
          </div>
        </div>


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
            value={pendingleads?.length}
            description="Scheduled actions"
            iconClass="bg-yellow-400"
          />

          <StatCard
            icon={<CheckCircle2 size={22} />}
            title="Completed"
            value={completedleads?.length}
            description="Successfully handled"
            iconClass="bg-green-500"
          />

          <StatCard
            icon={<TriangleAlert size={22} />}
            title="Overdue"
            value={duedate.length}
            description="Missed deadlines"
            iconClass="bg-red-500"
          />
        </div>


        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

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
                ) : filteredFollowups?.length === 0 ? (
                  <EmptyState onCreate={onCreate} />
                ) : (
                  filteredFollowups?.map((followup) => (
                    <FollowupRow
                      key={followup._id}
                      followup={followup}
                      menuOpen={
                        openMenu === followup._id
                      }
                      onMenuToggle={() =>
                        setOpenMenu((current) =>
                          current === followup._id
                            ? null
                            : followup._id
                        )
                      }
                      onEdit={() =>
                        onEdit?.(followup)
                      }
                      onDelete={() =>
                        onDelete?.(followup)
                      }
                      onComplete={() =>
                        onComplete?.(followup)
                      }
                      onReschedule={() =>
                        onReschedule?.(followup)
                      }
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