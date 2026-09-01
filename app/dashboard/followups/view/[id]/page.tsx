"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  UserCheck,
  Building2,
  ChevronDown,
  Check,
  Loader2,
  Circle,
  CircleDot,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MessageSquare,
  User,
  LucideIcon,
  Pencil,
} from "lucide-react";
import axios from "axios";
import Link from "next/link";

export type FollowupStatus =
  | "pending"
  | "completed"
  | "missed"
  | "rescheduled";

interface PopulatedLead {
  _id: string;
  name?: string;
  company?: string;
  personId?: string;
  email?: string;
}

interface PopulatedUser {
  _id: string;
  name?: string;
  email?: string;
  avatar?: string;
}

interface Followup {
  _id: string;
  organization: string;
  lead: PopulatedLead | string;
  comments: string;
  duedate: string;
  assignedTo?: PopulatedUser | string;
  CreatedBy?: PopulatedUser | string;
  status: FollowupStatus;
  createdAt?: string;
  updatedAt?: string;
}

interface StatusMetaEntry {
  label: string;
  bg: string;
  text: string;
  icon: LucideIcon;
}

const STATUSES: FollowupStatus[] = [
  "pending",
  "completed",
  "missed",
  "rescheduled",
];

const STATUS_META: Record<FollowupStatus, StatusMetaEntry> = {
  pending: {
    label: "Pending",
    bg: "#FEF08A", // yellow-200
    text: "#854D0E", // yellow-800
    icon: CircleDot,
  },
  completed: {
    label: "Completed",
    bg: "#3C8F6B",
    text: "#FFFFFF",
    icon: CheckCircle2,
  },
  missed: {
    label: "Missed",
    bg: "#C1523F",
    text: "#FFFFFF",
    icon: AlertCircle,
  },
  rescheduled: {
    label: "Rescheduled",
    bg: "#3B82F6",
    text: "#FFFFFF",
    icon: Circle,
  },
};

interface InfoRowProps {
  icon: LucideIcon;
  label: string;
  value?: string | null;
}

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="w-8 h-8 rounded-lg bg-[#FFF3C8]/70 flex items-center justify-center shrink-0">
        <Icon size={14} className="text-[#458393]" />
      </div>

      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[11px] text-[#9A9A8F] font-medium">
          {label}
        </span>

        <span className="text-sm text-[#22303A] break-words font-medium">
          {value || "—"}
        </span>
      </div>
    </div>
  );
}

export default function FollowupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [followup, setFollowup] = useState<Followup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // =========================
  // GET SINGLE FOLLOW-UP
  // =========================
  useEffect(() => {
    if (!id) return;

    const fetchFollowup = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `/api/followups/Singlefollowup?id=${id}`
        );
        if (!response.data?.singlefollowup) {
          throw new Error(
            response.data?.message || "Failed to fetch follow-up"
          );
        }
        setFollowup(response.data.singlefollowup);
      } catch (err: any) {
        console.error("Failed to fetch follow-up:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load follow-up"
        );
        setFollowup(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowup();
  }, [id]);

  // =========================
  // UPDATE STATUS
  // =========================
  const handleStatusChange = async (newStatus: FollowupStatus) => {
    if (!followup || newStatus === followup.status) {
      setStatusMenuOpen(false);
      return;
    }

    setUpdatingStatus(true);
    setStatusMenuOpen(false);

    const previousStatus = followup.status;

    // Optimistic update
    setFollowup((current) =>
      current ? { ...current, status: newStatus } : current
    );

    try {
      const response = await axios.patch("/api/followups/UpdateStatus", {
        id: followup._id,
        status: newStatus,
      });

      if (response.data?.data) {
        setFollowup(response.data.data);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      // Rollback
      setFollowup((current) =>
        current ? { ...current, status: previousStatus } : current
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const markAsDone = () => {
    handleStatusChange("completed");
  };

  // =========================
  // LOADING / ERROR STATES
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF3C8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={24} className="text-[#458393] animate-spin" />
          <p className="text-sm text-[#5C6D71]">Loading follow-up...</p>
        </div>
      </div>
    );
  }

  if (!followup) {
    return (
      <div className="min-h-screen bg-[#FFF3C8] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="w-12 h-12 rounded-full bg-white border border-[#E5CB90]/60 flex items-center justify-center">
          <AlertCircle size={22} className="text-[#C1523F]" />
        </div>

        <div>
          <h2 className="text-lg font-medium text-[#22303A]">
            Follow-up not found
          </h2>
          <p className="text-sm text-[#5C6D71] mt-1">
            {error || "This follow-up record could not be found."}
          </p>
        </div>

        <button
          onClick={() => router.push("/dashboard/followups")}
          className="px-4 py-2 rounded-lg bg-[#458393] text-white text-sm font-medium hover:bg-[#3A7180] transition-colors"
        >
          Back to Follow-ups
        </button>
      </div>
    );
  }

  // =========================
  // PREPARE DISPLAY DATA
  // =========================
  const statusMeta =
    STATUS_META[followup.status] || STATUS_META.pending;

  const StatusIcon = statusMeta.icon;
  const isDone = followup.status === "completed";

  const leadLabel =
    typeof followup.lead === "object" && followup.lead !== null
      ? followup.lead.company || followup.lead.name || followup.lead.personId
      : followup.lead || "Unassigned Lead";

  const assignedLabel =
    typeof followup.assignedTo === "object" && followup.assignedTo !== null
      ? followup.assignedTo.name || followup.assignedTo._id
      : followup.assignedTo || "Unassigned";

  const createdByLabel =
    typeof followup.CreatedBy === "object" && followup.CreatedBy !== null
      ? followup.CreatedBy.name || followup.CreatedBy._id
      : followup.CreatedBy || "System";

  const formattedDueDate = followup.duedate
    ? new Date(followup.duedate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  const formattedCreatedDate = followup.createdAt
    ? new Date(followup.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="relative min-h-screen bg-[#FFF3C8] text-[#22303A] px-4 sm:px-6 py-8 sm:py-10 flex justify-center overflow-hidden">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-[#458393]/15" />
      <div className="pointer-events-none absolute right-10 top-10 h-40 w-40 rounded-full bg-[#458393]/10" />

      <div className="relative w-full max-w-xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between gap-3 mb-6"
        >
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => router.push("/dashboard/followups")}
              className="w-9 h-9 rounded-lg bg-white border border-[#E5CB90]/60 flex items-center justify-center text-[#5C6D71] hover:text-[#22303A] hover:border-[#458393] transition-colors shadow-sm shrink-0"
              aria-label="Back to followups"
            >
              <ArrowLeft size={15} />
            </button>

            <div className="min-w-0">
              <h1 className="font-serif text-xl font-medium text-[#22303A] m-0 truncate">
                {leadLabel}
              </h1>
              <p className="text-xs text-[#5C6D71] mt-0.5">
                Follow-up details
              </p>
            </div>
          </div>

          <Link href={`/dashboard/followups/${followup._id}`}>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[#E5CB90]/60 text-xs font-semibold text-[#458393] hover:bg-[#FFF3C8]/40 transition-colors">
              <Pencil size={13} />
              Edit
            </button>
          </Link>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="bg-white border border-[#E5CB90]/60 rounded-2xl p-5 sm:p-6 shadow-md"
        >
          {/* Status Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 mb-1 border-b border-[#E5E5E0]">
            <div className="relative">
              <button
                onClick={() => setStatusMenuOpen((v) => !v)}
                disabled={updatingStatus}
                style={{
                  backgroundColor: statusMeta.bg,
                  color: statusMeta.text,
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-opacity disabled:opacity-60"
              >
                {updatingStatus ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <StatusIcon size={13} />
                )}
                {statusMeta.label}
                <ChevronDown size={12} />
              </button>

              <AnimatePresence>
                {statusMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-11 z-20 bg-white border border-[#E5CB90]/60 rounded-xl shadow-lg p-1 min-w-[180px]"
                  >
                    {STATUSES.map((st) => {
                      const meta = STATUS_META[st];
                      const active = st === followup.status;
                      const Icon = meta.icon;

                      return (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(st)}
                          disabled={updatingStatus}
                          className="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs rounded-lg hover:bg-[#FFF3C8]/60 text-[#22303A] disabled:opacity-50"
                        >
                          <span className="flex items-center gap-2">
                            <Icon
                              size={13}
                              style={{
                                color:
                                  meta.bg === "#FEF08A"
                                    ? "#854D0E"
                                    : meta.bg,
                              }}
                            />
                            {meta.label}
                          </span>
                          {active && (
                            <Check size={12} className="text-[#458393]" />
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mark as Done button */}
            {!isDone ? (
              <button
                onClick={markAsDone}
                disabled={updatingStatus}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#458393] hover:bg-[#3A7180] disabled:opacity-60 transition-colors"
              >
                {updatingStatus ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={13} />
                )}
                {updatingStatus ? "Updating..." : "Mark as done"}
              </button>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-medium text-[#3C8F6B]">
                <CheckCircle2 size={13} />
                Completed
              </span>
            )}
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 divide-y sm:divide-y-0 divide-[#F0F0EA] border-b border-[#E5E5E0] pb-4">
            <InfoRow
              icon={Building2}
              label="Related Lead"
              value={leadLabel}
            />

            <InfoRow
              icon={UserCheck}
              label="Assigned to"
              value={assignedLabel}
            />

            <InfoRow
              icon={Calendar}
              label="Due date"
              value={formattedDueDate}
            />

            <InfoRow
              icon={User}
              label="Created by"
              value={createdByLabel}
            />

            <InfoRow
              icon={Calendar}
              label="Created date"
              value={formattedCreatedDate}
            />
          </div>

          {/* Comments Section */}
          <div className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={15} className="text-[#458393]" />
              <h3 className="text-xs font-semibold text-[#9A9A8F] uppercase tracking-wider">
                Follow-up Details & Comments
              </h3>
            </div>
            <div className="bg-[#FFF3C8]/40 border border-[#E5CB90]/40 rounded-xl p-3.5 text-sm text-[#22303A] leading-relaxed whitespace-pre-wrap">
              {followup.comments || "No comments provided."}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
