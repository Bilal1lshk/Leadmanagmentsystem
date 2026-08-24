"use client"
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    User,
    Flame,
    Calendar,
    UserCheck,
    Building2,
    Globe,
    Users,
    Megaphone,
    Phone,
    MoreHorizontal,
    Trash2,
    Loader2,
    ChevronDown,
    Check,
    X,
} from "lucide-react";
import axios from "axios";

const SOURCE_META = {
    website: { label: "Website", icon: Globe },
    referral: { label: "Referral", icon: Users },
    ad: { label: "Ad", icon: Megaphone },
    cold_call: { label: "Cold Call", icon: Phone },
    other: { label: "Other", icon: MoreHorizontal },
};

const PRIORITY_META = {
    low: { label: "Low", bg: "#E9ECEE", text: "#3D4D51" },
    medium: { label: "Medium", bg: "#C9A24A", text: "#FFFFFF" },
    high: { label: "High", bg: "#C1523F", text: "#FFFFFF" },
};

const STATUSES = ["new", "contacted", "qualified", "proposal", "won", "lost"];

const STATUS_META = {
    new: { label: "New", bg: "#E9ECEE", text: "#3D4D51" },
    contacted: { label: "Contacted", bg: "#DCE9EC", text: "#2E5B65" },
    qualified: { label: "Qualified", bg: "#458393", text: "#FFFFFF" },
    proposal: { label: "Proposal", bg: "#C9A24A", text: "#FFFFFF" },
    won: { label: "Won", bg: "#3C8F6B", text: "#FFFFFF" },
    lost: { label: "Lost", bg: "#C1523F", text: "#FFFFFF" },
};

function InfoRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-3 py-3">
            <div className="w-8 h-8 rounded-lg bg-[#FFF3C8]/70 flex items-center justify-center shrink-0">
                <Icon size={14} className="text-[#458393]" />
            </div>
            <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-[#9A9A8F] font-medium">{label}</span>
                <span className="text-sm text-[#22303A]">{value || "—"}</span>
            </div>
        </div>
    );
}

export default function LeadDetailPage() {
    const { id } = useParams();
    const router = useRouter();

    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [statusMenuOpen, setStatusMenuOpen] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchLead = async () => {
            try {
                const res = await axios.get(`/api/dashboardapi/SingleLead?id=${id}`);
                setLead(res.data?.data?.findedlead);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchLead();
    }, [id]);

    const handleStatusChange = async (newStatus) => {
        if (!lead || newStatus === lead.status) {
            setStatusMenuOpen(false);
            return;
        }

        setUpdatingStatus(true);

        const previous = lead.status;

        setLead((l) => ({ ...l, status: newStatus }));
        setStatusMenuOpen(false);

        try {
            await axios.patch(`/api/dashboardapi/Leads/UpdateStatus`, {
                leadId: lead._id,
                status: newStatus,
            });
        } catch (err) {
            console.error(err);
            setLead((l) => ({ ...l, status: previous }));
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);

        try {
            await axios.delete(`/api/dashboardapi/Leads/DeleteLead?id=${lead._id}`);
            router.push("/dashboard/leads");
        } catch (err) {
            console.error(err);
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FFF3C8] flex items-center justify-center">
                <Loader2 size={22} className="text-[#458393] animate-spin" />
            </div>
        );
    }

    if (!lead) {
        return (
            <div className="min-h-screen bg-[#FFF3C8] flex flex-col items-center justify-center gap-2 text-[#5C6D71]">
                <p className="text-sm">This lead couldn't be found.</p>

                <button
                    onClick={() => router.push("/dashboard/leads")}
                    className="text-sm text-[#458393] font-medium hover:underline"
                >
                    Back to leads
                </button>
            </div>
        );
    }

    const sourceMeta = SOURCE_META[lead.source] || SOURCE_META.other;
    const priorityMeta = PRIORITY_META[lead.priority] || PRIORITY_META.medium;
    const statusMeta = STATUS_META[lead.status] || STATUS_META.new;
    const SourceIcon = sourceMeta.icon;

    return (
        <div className="relative min-h-screen bg-[#FFF3C8] text-[#22303A] px-6 py-10 flex justify-center overflow-hidden">
            <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-[#458393]/15" />
            <div className="pointer-events-none absolute right-10 top-10 h-40 w-40 rounded-full bg-[#458393]/10" />

            <div className="relative w-full max-w-2xl">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-3 mb-6"
                >
                    <button
                        onClick={() => router.push("/dashboard/leads")}
                        className="w-8 h-8 rounded-lg bg-white border border-[#E5CB90]/60 flex items-center justify-center text-[#5C6D71] hover:text-[#22303A] hover:border-[#458393] transition-colors shadow-sm"
                    >
                        <ArrowLeft size={15} />
                    </button>

                    <div className="flex-1">
                        <h1 className="font-serif text-xl font-medium text-[#22303A] m-0">
                            {lead.personId}
                        </h1>

                        <p className="text-xs text-[#5C6D71] mt-0.5">
                            Lead details
                        </p>
                    </div>
                </motion.div>

                {/* Main card */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.05 }}
                    className="bg-white border border-[#E5CB90]/60 rounded-2xl p-6 shadow-md"
                >

                    {/* Status + Priority + Value row */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-1 border-b border-[#E5E5E0]">

                        <div className="flex items-center gap-2">

                            {/* Status dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setStatusMenuOpen((v) => !v)}
                                    disabled={updatingStatus}
                                    style={{
                                        backgroundColor: statusMeta.bg,
                                        color: statusMeta.text,
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity disabled:opacity-60"
                                >
                                    {updatingStatus ? (
                                        <Loader2
                                            size={12}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                                    )}

                                    {statusMeta.label}

                                    <ChevronDown size={12} />
                                </button>

                                <AnimatePresence>
                                    {statusMenuOpen && (
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                y: -4,
                                                scale: 0.97,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                scale: 1,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                y: -4,
                                                scale: 0.97,
                                            }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute left-0 top-9 z-20 bg-white border border-[#E5CB90]/60 rounded-xl shadow-lg p-1 min-w-[150px]"
                                        >
                                            {STATUSES.map((s) => {
                                                const meta = STATUS_META[s];
                                                const active =
                                                    s === lead.status;

                                                return (
                                                    <button
                                                        key={s}
                                                        onClick={() =>
                                                            handleStatusChange(s)
                                                        }
                                                        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs rounded-lg hover:bg-[#FFF3C8]/60 text-[#22303A]"
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <span
                                                                className="w-2 h-2 rounded-full"
                                                                style={{
                                                                    backgroundColor:
                                                                        meta.bg,
                                                                }}
                                                            />

                                                            {meta.label}
                                                        </span>

                                                        {active && (
                                                            <Check
                                                                size={12}
                                                                className="text-[#458393]"
                                                            />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Priority badge (read-only here) */}
                            <span
                                style={{
                                    backgroundColor: priorityMeta.bg,
                                    color: priorityMeta.text,
                                }}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold"
                            >
                                <Flame size={12} />
                                {priorityMeta.label}
                            </span>
                        </div>

                        <div className="text-right">
                            <p className="text-[11px] text-[#9A9A8F] font-medium">
                                Estimated value
                            </p>

                            <p className="text-lg font-semibold text-[#22303A]">
                                $
                                {Number(
                                    lead.estimatedValue || 0
                                ).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Info grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 divide-y sm:divide-y-0 divide-[#F0F0EA]">

                        <InfoRow
                            icon={User}
                            label="Name"
                            value={lead.name}
                        />

                        <InfoRow
                            icon={Phone}
                            label="Email"
                            value={lead.email}
                        />

                        <InfoRow
                            icon={Building2}
                            label="Lead / Organization"
                            value={lead.personId}
                        />

                        <InfoRow
                            icon={SourceIcon}
                            label="Source"
                            value={sourceMeta.label}
                        />

                        <InfoRow
                            icon={Calendar}
                            label="Last contacted"
                            value={
                                lead.lastContactedAt
                                    ? new Date(
                                          lead.lastContactedAt
                                      ).toLocaleDateString("en-GB", {
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric",
                                      })
                                    : null
                            }
                        />

                        <InfoRow
                            icon={Calendar}
                            label="Created"
                            value={new Date(
                                lead.createdAt
                            ).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            })}
                        />

                        <InfoRow
                            icon={UserCheck}
                            label="Assigned to"
                            value={lead.assignedTo}
                        />

                        <InfoRow
                            icon={User}
                            label="Sourced by"
                            value={lead.sourcedby}
                        />
                    </div>

                    {lead.status === "lost" && lead.lostReason && (
                        <div className="mt-3 p-3 rounded-xl bg-[#FBEFEC] border border-[#C1523F]/20">
                            <p className="text-[11px] text-[#C1523F] font-semibold mb-1">
                                Lost reason
                            </p>

                            <p className="text-sm text-[#7A3B30]">
                                {lead.lostReason}
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 mt-6 pt-5 border-t border-[#E5E5E0]">

                        {!confirmDelete ? (
                            <button
                                onClick={() => setConfirmDelete(true)}
                                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-[#C1523F] border border-[#C1523F]/30 hover:bg-[#C1523F]/5 transition-colors"
                            >
                                <Trash2 size={14} />
                                Delete lead
                            </button>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, x: 8 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-2"
                            >
                                <span className="text-xs text-[#5C6D71] mr-1">
                                    Delete this lead?
                                </span>

                                <button
                                    onClick={() =>
                                        setConfirmDelete(false)
                                    }
                                    disabled={deleting}
                                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium text-[#5C6D71] border border-[#E5E5E0] hover:bg-[#F7F7F2] transition-colors"
                                >
                                    <X size={12} />
                                    Cancel
                                </button>

                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#C1523F] hover:bg-[#A8432F] disabled:opacity-60 transition-colors"
                                >
                                    {deleting ? (
                                        <Loader2
                                            size={12}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <Trash2 size={12} />
                                    )}

                                    Confirm delete
                                </button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}