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
    LucideIcon,
} from "lucide-react";
import axios from "axios";

type TaskStatus =
    | "notstarted"
    | "inprogress"
    | "completed"
    | "Overdue"
    | "Cancelled";

interface PopulatedLead {
    _id: string;
    personId?: string;
    status?: string;
}

interface PopulatedUser {
    _id: string;
    name?: string;
}

interface Task {
    _id: string;
    organization: string;
    title: string;
    leadId: PopulatedLead | string;
    dueDate: string;
    assignedTo?: PopulatedUser | string;
    completed: TaskStatus;
    createdAt?: string;
    updatedAt?: string;
}

interface StatusMetaEntry {
    label: string;
    bg: string;
    text: string;
    icon: LucideIcon;
}

const STATUSES: TaskStatus[] = [
    "notstarted",
    "inprogress",
    "completed",
    "Overdue",
    "Cancelled",
];

const STATUS_META: Record<TaskStatus, StatusMetaEntry> = {
    notstarted: {
        label: "Not Started",
        bg: "#E9ECEE",
        text: "#3D4D51",
        icon: Circle,
    },
    inprogress: {
        label: "In Progress",
        bg: "#C9A24A",
        text: "#FFFFFF",
        icon: CircleDot,
    },
    completed: {
        label: "Completed",
        bg: "#3C8F6B",
        text: "#FFFFFF",
        icon: CheckCircle2,
    },
    Overdue: {
        label: "Overdue",
        bg: "#C1523F",
        text: "#FFFFFF",
        icon: AlertCircle,
    },
    Cancelled: {
        label: "Cancelled",
        bg: "#9A9A8F",
        text: "#FFFFFF",
        icon: XCircle,
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

                <span className="text-sm text-[#22303A] break-words">
                    {value || "—"}
                </span>
            </div>
        </div>
    );
}

export default function TaskDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusMenuOpen, setStatusMenuOpen] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    // =========================
    // GET SINGLE TASK
    // =========================

    useEffect(() => {
        if (!id) return;

        const fetchTask = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(
                    `/api/Task/SingleTask?id=${id}`
                );
                if (!response.data?.singletask) {
                    throw new Error(
                        response.data?.message || "Failed to fetch task"
                    );
                }
                const fetchedTask = response.data?.singletask;
                if (!fetchedTask) {
                    throw new Error("Task data was not returned");
                }

                setTask(fetchedTask);
            } catch (err) {
                console.error("Failed to fetch task:", err);

                if (axios.isAxiosError(err)) {
                    setError(
                        err.response?.data?.message ||
                        "Failed to load task"
                    );
                } else if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Failed to load task");
                }

                setTask(null);
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [id]);

    // =========================
    // UPDATE STATUS
    // =========================

    const handleStatusChange = async (newStatus: TaskStatus) => {
        if (!task || newStatus === task.completed) {
            setStatusMenuOpen(false);
            return;
        }

        setUpdatingStatus(true);
        setStatusMenuOpen(false);

        const previousStatus = task.completed;

        // Optimistic update
        setTask((currentTask) =>
            currentTask
                ? {
                    ...currentTask,
                    completed: newStatus,
                }
                : currentTask
        );

        try {
            const response = await axios.put(
                "/api/Task/UpdateTask",
                {
                    taskId: task._id,
                    completed: newStatus,
                }
            );
            if (!response.data?.success) {
                throw new Error(
                    response.data?.message ||
                    "Failed to update task status"
                );
            }

            // If API returns the updated task,
            // use the server version.
            if (response.data?.task) {
                setTask(response.data.task);
            }
        } catch (err) {
            console.error("Failed to update task status:", err);

            // Roll back optimistic update
            setTask((currentTask) =>
                currentTask
                    ? {
                        ...currentTask,
                        completed: previousStatus,
                    }
                    : currentTask
            );
        } finally {
            setUpdatingStatus(false);
        }
    };

    // =========================
    // MARK AS DONE
    // =========================

    const markAsDone = () => {
        handleStatusChange("completed");
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FFF3C8] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2
                        size={24}
                        className="text-[#458393] animate-spin"
                    />

                    <p className="text-sm text-[#5C6D71]">
                        Loading task...
                    </p>
                </div>
            </div>
        );
    }

    // =========================
    // ERROR / TASK NOT FOUND
    // =========================

    if (!task) {
        return (
            <div className="min-h-screen bg-[#FFF3C8] flex flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="w-12 h-12 rounded-full bg-white border border-[#E5CB90]/60 flex items-center justify-center">
                    <AlertCircle
                        size={22}
                        className="text-[#C1523F]"
                    />
                </div>

                <div>
                    <h2 className="text-lg font-medium text-[#22303A]">
                        Task not found
                    </h2>

                    <p className="text-sm text-[#5C6D71] mt-1">
                        {error ||
                            "This task could not be found."}
                    </p>
                </div>

                <button
                    onClick={() =>
                        router.push("/dashboard/task")
                    }
                    className="px-4 py-2 rounded-lg bg-[#458393] text-white text-sm font-medium hover:bg-[#3A7180] transition-colors"
                >
                    Back to tasks
                </button>
            </div>
        );
    }

    // =========================
    // TASK DATA
    // =========================

    const statusMeta =
        STATUS_META[task.completed] ||
        STATUS_META.notstarted;

    const StatusIcon = statusMeta.icon;

    const isDone = task.completed === "completed";

    const leadLabel =
        typeof task.leadId === "object" &&
            task.leadId !== null
            ? task.leadId.personId
            : task.leadId;

    const assignedLabel =
        typeof task.assignedTo === "object" &&
            task.assignedTo !== null
            ? task.assignedTo.name ||
            task.assignedTo._id
            : task.assignedTo || "Unassigned";

    const formattedDueDate = task.dueDate
        ? new Date(task.dueDate).toLocaleDateString(
            "en-GB",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        )
        : "—";

    const formattedCreatedDate = task.createdAt
        ? new Date(task.createdAt).toLocaleDateString(
            "en-GB",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        )
        : "—";

    // =========================
    // UI
    // =========================

    return (
        <div className="relative min-h-screen bg-[#FFF3C8] text-[#22303A] px-4 sm:px-6 py-8 sm:py-10 flex justify-center overflow-hidden">
            {/* Background decoration */}
            <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-[#458393]/15" />

            <div className="pointer-events-none absolute right-10 top-10 h-40 w-40 rounded-full bg-[#458393]/10" />

            <div className="relative w-full max-w-xl">
                {/* ================= HEADER ================= */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: -8,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.4,
                    }}
                    className="flex items-center gap-3 mb-6"
                >
                    <button
                        onClick={() =>
                            router.push(
                                "/dashboard/task"
                            )
                        }
                        className="w-9 h-9 rounded-lg bg-white border border-[#E5CB90]/60 flex items-center justify-center text-[#5C6D71] hover:text-[#22303A] hover:border-[#458393] transition-colors shadow-sm shrink-0"
                        aria-label="Back to tasks"
                    >
                        <ArrowLeft size={15} />
                    </button>

                    <div className="min-w-0">
                        <h1 className="font-serif text-xl font-medium text-[#22303A] m-0 truncate">
                            {task.title}
                        </h1>

                        <p className="text-xs text-[#5C6D71] mt-0.5">
                            Task details
                        </p>
                    </div>
                </motion.div>

                {/* ================= MAIN CARD ================= */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 12,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.35,
                        delay: 0.05,
                    }}
                    className="bg-white border border-[#E5CB90]/60 rounded-2xl p-5 sm:p-6 shadow-md"
                >
                    {/* ================= STATUS ================= */}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 mb-1 border-b border-[#E5E5E0]">
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setStatusMenuOpen(
                                        (value) => !value
                                    )
                                }
                                disabled={
                                    updatingStatus
                                }
                                style={{
                                    backgroundColor:
                                        statusMeta.bg,
                                    color:
                                        statusMeta.text,
                                }}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-opacity disabled:opacity-60"
                            >
                                {updatingStatus ? (
                                    <Loader2
                                        size={13}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <StatusIcon
                                        size={13}
                                    />
                                )}

                                {statusMeta.label}

                                <ChevronDown
                                    size={12}
                                />
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
                                        transition={{
                                            duration: 0.15,
                                        }}
                                        className="absolute left-0 top-11 z-20 bg-white border border-[#E5CB90]/60 rounded-xl shadow-lg p-1 min-w-[180px]"
                                    >
                                        {STATUSES.map(
                                            (status) => {
                                                const meta =
                                                    STATUS_META[
                                                    status
                                                    ];

                                                const active =
                                                    status ===
                                                    task.completed;

                                                const Icon =
                                                    meta.icon;

                                                return (
                                                    <button
                                                        key={
                                                            status
                                                        }
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                status
                                                            )
                                                        }
                                                        disabled={
                                                            updatingStatus
                                                        }
                                                        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs rounded-lg hover:bg-[#FFF3C8]/60 text-[#22303A] disabled:opacity-50"
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <Icon
                                                                size={
                                                                    13
                                                                }
                                                                style={{
                                                                    color:
                                                                        meta.bg ===
                                                                            "#E9ECEE"
                                                                            ? "#5C6D71"
                                                                            : meta.bg,
                                                                }}
                                                            />

                                                            {
                                                                meta.label
                                                            }
                                                        </span>

                                                        {active && (
                                                            <Check
                                                                size={
                                                                    12
                                                                }
                                                                className="text-[#458393]"
                                                            />
                                                        )}
                                                    </button>
                                                );
                                            }
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* ================= MARK AS DONE ================= */}

                        {!isDone ? (
                            <button
                                onClick={
                                    markAsDone
                                }
                                disabled={
                                    updatingStatus
                                }
                                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#458393] hover:bg-[#3A7180] disabled:opacity-60 transition-colors"
                            >
                                {updatingStatus ? (
                                    <Loader2
                                        size={13}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <CheckCircle2
                                        size={13}
                                    />
                                )}

                                {updatingStatus
                                    ? "Updating..."
                                    : "Mark as done"}
                            </button>
                        ) : (
                            <span className="flex items-center gap-1.5 text-xs font-medium text-[#3C8F6B]">
                                <CheckCircle2
                                    size={13}
                                />
                                Completed
                            </span>
                        )}
                    </div>

                    {/* ================= INFO GRID ================= */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 divide-y sm:divide-y-0 divide-[#F0F0EA]">
                    

                        <InfoRow
                            icon={UserCheck}
                            label="Assigned to"
                            value={assignedLabel}
                        />

                        <InfoRow
                            icon={Calendar}
                            label="Due date"
                            value={
                                formattedDueDate
                            }
                        />

                        <InfoRow
                            icon={Calendar}
                            label="Created"
                            value={
                                formattedCreatedDate
                            }
                        />
                    </div>

                
                </motion.div>
            </div>
        </div>
    );
}