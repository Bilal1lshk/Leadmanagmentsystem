"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
    ArrowLeft,
    User,
    Flame,
    DollarSign,
    Calendar,
    UserCheck,
    Check,
    Loader2,
    Globe,
    Users,
    Megaphone,
    Phone,
    Mail,
    MoreHorizontal,
    MessageSquare,
    type LucideIcon,
} from "lucide-react";
import axios from "axios";

/* ---------------------------------- Types --------------------------------- */

type SourceValue = "website" | "referral" | "ad" | "cold_call" | "other";
type PriorityValue = "low" | "medium" | "high";
type StatusValue =
    | "new"
    | "contacted"
    | "qualified"
    | "proposal"
    | "won"
    | "lost";
type SubmitStatus = "idle" | "saving" | "saved" | "error";

interface AssignableUser {
    _id: string;
    name: string;
}

interface LeadFormState {
    personId: string;
    email: string;
    phone: string;
    message: string;
    source: SourceValue;
    status: StatusValue;
    priority: PriorityValue;
    estimatedValue: string;
    assignedTo: string | null;
    lastContactedAt: string;
    lostReason: string;
}

interface SourceOption {
    value: SourceValue;
    label: string;
    icon: LucideIcon;
}

interface PriorityOption {
    value: PriorityValue;
    label: string;
    activeBg: string;
    activeText: string;
}

/* --------------------------------- Constants ------------------------------- */
/* Moved outside the component so they aren't recreated on every render. */

const SOURCES: SourceOption[] = [
    { value: "website", label: "Website", icon: Globe },
    { value: "referral", label: "Referral", icon: Users },
    { value: "ad", label: "Ad", icon: Megaphone },
    { value: "cold_call", label: "Cold Call", icon: Phone },
    { value: "other", label: "Other", icon: MoreHorizontal },
];

const PRIORITIES: PriorityOption[] = [
    { value: "low", label: "Low", activeBg: "#E9ECEE", activeText: "#3D4D51" },
    { value: "medium", label: "Medium", activeBg: "#C9A24A", activeText: "#FFFFFF" },
    { value: "high", label: "High", activeBg: "#C1523F", activeText: "#FFFFFF" },
];

const STATUSES: StatusValue[] = [
    "new",
    "contacted",
    "qualified",
    "proposal",
    "won",
    "lost",
];

const INITIAL_FORM: LeadFormState = {
    personId: "",
    email: "",
    phone: "",
    message: "",
    source: "website",
    status: "new",
    priority: "medium",
    estimatedValue: "",
    assignedTo: null,
    lastContactedAt: "",
    lostReason: "",
};

const container:Variants= {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.06, delayChildren: 0.05 },
    },
};

const item:Variants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const inputClass =
    "w-full bg-white border border-[#D8D8D0] rounded-xl px-3.5 py-3 text-sm text-[#22303A] placeholder:text-[#9A9A8F] outline-none focus:border-[#458393] transition-colors";

/* ---------------------------------- Field --------------------------------- */

function Field({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-xs text-[#5C6D71] font-medium">{label}</label>
            {children}
        </div>
    );
}

/* ------------------------------- Main component ---------------------------- */

export default function CreateLeadPage() {
    const router = useRouter();

    const [users, setUsers] = useState<AssignableUser[]>([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [form, setForm] = useState<LeadFormState>(INITIAL_FORM);
    const [status, setStatus] = useState<SubmitStatus>("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Guards against setState calls after the component has unmounted
    // (e.g. the fetch resolves after the user has navigated away).
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        const fetchUsers = async () => {
            setUsersLoading(true);

            try {
                const response = await fetch("/api/User/AllUser", {
                    method: "GET",
                    headers: { "content-type": "application/json" },
                    signal: controller.signal,
                });

                if (!response.ok) return;

                const payload: { allusers?: AssignableUser[] } =
                    await response.json();

                if (isMounted.current) {
                    setUsers(payload.allusers ?? []);
                }
            } catch (error) {
                if ((error as { name?: string })?.name !== "AbortError") {
                    console.error(error);
                }
            } finally {
                if (isMounted.current) setUsersLoading(false);
            }
        };

        fetchUsers();

        return () => controller.abort();
    }, []);

    function set<K extends keyof LeadFormState>(field: K) {
        return (value: LeadFormState[K]) =>
            setForm((f) => ({ ...f, [field]: value }));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimmedName = form.personId.trim();
        if (!trimmedName) return;

        setStatus("saving");
        setErrorMessage(null);

        // Build the payload separately from form state so empty/optional
        // fields aren't sent as empty strings, and numeric fields are numbers.
        const payload = {
            ...form,
            personId: trimmedName,
            estimatedValue: form.estimatedValue
                ? Number(form.estimatedValue)
                : undefined,
            lastContactedAt: form.lastContactedAt || undefined,
            lostReason:
                form.status === "lost" ? form.lostReason.trim() : undefined,
        };

        try {
            const response = await axios.post(
                "/api/dashboardapi/Leads/CreateLead",
                payload
            );

            if (response.status === 201 || response.status === 200) {
                if (isMounted.current) setStatus("saved");
                router.push("/dashboard/leads");
                return;
            }

            throw new Error(`Unexpected response status: ${response.status}`);
        } catch (error) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message ?? error.message
                : "Something went wrong. Please try again.";

            console.error(message);

            if (isMounted.current) {
                setStatus("error");
                setErrorMessage(message);
                setTimeout(() => {
                    if (isMounted.current) setStatus("idle");
                }, 1800);
            }
        }
    };

    return (
        <div className="relative min-h-screen bg-[#FFF3C8] text-[#22303A] px-6 py-10 flex justify-center overflow-hidden">
            {/* Background decorations */}
            <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-[#458393]/15" />
            <div className="pointer-events-none absolute right-10 top-10 h-40 w-40 rounded-full bg-[#458393]/10" />

            <div className="relative w-full max-w-xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-3 mb-8"
                >
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="w-8 h-8 rounded-lg bg-white border border-[#E5CB90]/60 flex items-center justify-center text-[#5C6D71] hover:text-[#22303A] hover:border-[#458393] transition-colors shadow-sm"
                    >
                        <ArrowLeft size={15} />
                    </button>

                    <div>
                        <h1 className="font-serif text-xl font-medium text-[#22303A] m-0">
                            Create New Lead
                        </h1>
                        <p className="text-xs text-[#5C6D71] mt-0.5">
                            Add a new lead to your pipeline
                        </p>
                    </div>
                </motion.div>

                {/* Form */}
                <motion.form
                    onSubmit={handleSubmit}
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="bg-white border border-[#E5CB90]/60 rounded-2xl p-6 flex flex-col gap-5 shadow-md"
                >
                    {/* Person selector */}
                    <Field label="Person or organization name">
                        <div className={`${inputClass} flex items-center gap-2`}>
                            <User size={14} className="text-[#9A9A8F]" />
                            <input
                                type="text"
                                value={form.personId}
                                onChange={(e) => set("personId")(e.target.value)}
                                placeholder="Enter the Name"
                                className="w-full bg-transparent outline-none text-[#22303A] placeholder-[#9A9A8F]"
                                required
                            />
                        </div>
                    </Field>

                    {/* Contact details */}
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Email">
                            <div className="relative">
                                <Mail
                                    size={14}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9A8F]"
                                />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => set("email")(e.target.value)}
                                    placeholder="name@example.com"
                                    className={`${inputClass} pl-9`}
                                />
                            </div>
                        </Field>

                        <Field label="Phone">
                            <div className="relative">
                                <Phone
                                    size={14}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9A8F]"
                                />
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) => set("phone")(e.target.value)}
                                    placeholder="+92 300 1234567"
                                    className={`${inputClass} pl-9`}
                                />
                            </div>
                        </Field>
                    </div>

                    {/* Message / Comment */}
                    <Field label="Message / Comment">
                        <div className="relative">
                            <MessageSquare
                                size={14}
                                className="absolute left-3.5 top-3.5 text-[#9A9A8F]"
                            />
                            <textarea
                                value={form.message}
                                onChange={(e) => set("message")(e.target.value)}
                                placeholder="Add a message, comment, or notes about this lead..."
                                rows={4}
                                className={`${inputClass} pl-9 resize-none`}
                            />
                        </div>
                    </Field>

                    {/* Source */}
                    <Field label="Source">
                        <div className="grid grid-cols-5 gap-1.5">
                            {SOURCES.map(({ value, label, icon: Icon }) => {
                                const active = form.source === value;

                                return (
                                    <button
                                        type="button"
                                        key={value}
                                        onClick={() => set("source")(value)}
                                        className={`relative flex flex-col items-center gap-1.5 py-2.5 rounded-xl border text-[11px] font-medium transition-colors ${
                                            active
                                                ? "border-[#458393] text-white"
                                                : "border-[#E5E5E0] text-[#5C6D71] hover:border-[#C9A24A]"
                                        }`}
                                    >
                                        {active && (
                                            <motion.div
                                                layoutId="sourceHighlight"
                                                className="absolute inset-0 bg-[#458393] rounded-xl"
                                                transition={{
                                                    type: "spring",
                                                    bounce: 0.25,
                                                    duration: 0.4,
                                                }}
                                            />
                                        )}
                                        <Icon size={15} className="relative" />
                                        <span className="relative">{label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </Field>

                    {/* Priority */}
                    <Field label="Priority">
                        <div className="flex gap-2">
                            {PRIORITIES.map(
                                ({ value, label, activeBg, activeText }) => {
                                    const active = form.priority === value;

                                    return (
                                        <button
                                            type="button"
                                            key={value}
                                            onClick={() => set("priority")(value)}
                                            style={
                                                active
                                                    ? { backgroundColor: activeBg, color: activeText }
                                                    : undefined
                                            }
                                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-medium transition-colors ${
                                                active
                                                    ? "border-transparent"
                                                    : "border-[#E5E5E0] text-[#5C6D71] hover:border-[#C9A24A]"
                                            }`}
                                        >
                                            <Flame size={12} />
                                            {label}
                                        </button>
                                    );
                                }
                            )}
                        </div>
                    </Field>

                    {/* Status */}
                    <Field label="Status">
                        <select
                            value={form.status}
                            onChange={(e) =>
                                set("status")(e.target.value as StatusValue)
                            }
                            className={inputClass}
                        >
                            {STATUSES.map((s) => (
                                <option key={s} value={s}>
                                    {s[0].toUpperCase() + s.slice(1)}
                                </option>
                            ))}
                        </select>
                    </Field>

                    {/* Lost reason */}
                    <AnimatePresence>
                        {form.status === "lost" && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden"
                            >
                                <label className="text-xs text-[#5C6D71] mb-2 block font-medium">
                                    Lost Reason
                                </label>
                                <textarea
                                    value={form.lostReason}
                                    onChange={(e) => set("lostReason")(e.target.value)}
                                    placeholder="Why was this lead lost?"
                                    rows={2}
                                    className={`${inputClass} resize-none`}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Value + last contacted */}
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Estimated Value">
                            <div className="relative">
                                <DollarSign
                                    size={14}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9A8F]"
                                />
                                <input
                                    type="number"
                                    min="0"
                                    value={form.estimatedValue}
                                    onChange={(e) => set("estimatedValue")(e.target.value)}
                                    placeholder="2500"
                                    className={`${inputClass} pl-9`}
                                />
                            </div>
                        </Field>

                        <Field label="Last Contacted">
                            <div className="relative">
                                <Calendar
                                    size={14}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9A8F]"
                                />
                                <input
                                    type="date"
                                    value={form.lastContactedAt}
                                    onChange={(e) => set("lastContactedAt")(e.target.value)}
                                    className={`${inputClass} pl-9`}
                                />
                            </div>
                        </Field>
                    </div>

                    {/* Assigned to */}
                    <Field label="Assigned To">
                        <div className="relative">
                            <UserCheck
                                size={14}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9A8F]"
                            />
                            <select
                                value={form.assignedTo ?? ""}
                                onChange={(e) => set("assignedTo")(e.target.value || null)}
                                disabled={usersLoading}
                                className={`${inputClass} pl-9`}
                            >
                                <option value="">
                                    {usersLoading ? "Loading..." : "Unassigned"}
                                </option>
                                {users.map((u) => (
                                    <option key={u._id} value={u._id}>
                                        {u.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </Field>

                    {/* Error message */}
                    {status === "error" && errorMessage && (
                        <p className="text-xs text-[#C1523F] -mt-2">{errorMessage}</p>
                    )}

                    {/* Submit */}
                    <motion.button
                        variants={item}
                        type="submit"
                        disabled={!form.personId.trim() || status === "saving"}
                        whileTap={{ scale: 0.98 }}
                        className="mt-2 relative flex items-center justify-center gap-2 bg-[#458393] hover:bg-[#3A7180] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl py-3.5 text-sm font-semibold text-white transition-colors overflow-hidden shadow-sm"
                    >
                        <AnimatePresence mode="wait">
                            {status === "idle" && (
                                <motion.span
                                    key="idle"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2"
                                >
                                    Create Lead
                                </motion.span>
                            )}

                            {status === "saving" && (
                                <motion.span
                                    key="saving"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2"
                                >
                                    <Loader2 size={15} className="animate-spin" />
                                    Creating...
                                </motion.span>
                            )}

                            {status === "saved" && (
                                <motion.span
                                    key="saved"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2"
                                >
                                    <Check size={15} />
                                    Lead Created
                                </motion.span>
                            )}

                            {status === "error" && (
                                <motion.span
                                    key="error"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2"
                                >
                                    Try Again
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </motion.form>
            </div>
        </div>
    );
}