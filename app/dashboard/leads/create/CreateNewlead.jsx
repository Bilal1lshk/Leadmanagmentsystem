"use client"
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GetuserId } from "../../../context/Usercontext.jsx"
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
    MoreHorizontal,
} from "lucide-react";
import axios from "axios";
function Field({ label, children }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-xs text-brand-gray font-medium">
                {label}
            </label>

            {children}
        </div>
    );
}
export default function CreateLeadPage() {
    const { userId } = GetuserId()

    const SOURCES = [
        { value: "website", label: "Website", icon: Globe },
        { value: "referral", label: "Referral", icon: Users },
        { value: "ad", label: "Ad", icon: Megaphone },
        { value: "cold_call", label: "Cold Call", icon: Phone },
        { value: "other", label: "Other", icon: MoreHorizontal },
    ];

    // bg/text pairs chosen for AA contrast on a light card
    const PRIORITIES = [
        { value: "low", label: "Low", activeBg: "#E8E3CD", activeText: "#6B7280" },
        { value: "medium", label: "Medium", activeBg: "#D8B677", activeText: "#FFFFFF" },
        { value: "high", label: "High", activeBg: "#C1523F", activeText: "#FFFFFF" },
    ];

    const STATUSES = ["new", "contacted", "qualified", "proposal", "won", "lost"];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.06, delayChildren: 0.05 },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
    };
const router = useRouter();
    const [data, setdata] = useState()
    useEffect(() => {
        const fetchingdata = async () => {
            const resposne = await fetch("/api/User/AllUser", {
                method: "Get",
                headers: {
                    "content-type": "application/json"
                },
            })
            const dataofapi = await resposne.json();
            if(status !== 200) return 
            console.log(dataofapi)
            setdata(dataofapi?.allusers)

        }
        fetchingdata()

    }, [])
    const [form, setForm] = useState({
        sourcedby: userId,
        personId: "",
        source: "website",
        status: "new",
        priority: "medium",
        estimatedValue: "",
        assignedTo: null,
        lastContactedAt: "",
        lostReason: "",
    });
    useEffect(() => {
        if (userId) {
            setForm((f) => ({ ...f, sourcedby: userId }));
        }
    }, [userId]);

    const [status, setStatus] = useState("idle"); 
    const selectedPerson = data?.find((p) => p?._id === form?.personId);
    const set = (field) => (val) => setForm((f) => ({ ...f, [field]: val }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.personId) return;
        setStatus("saving");
        try {
            const respone = await axios.post("/api/dashboardapi/Leads/CreateLead", form);
            if(respone?.status===200){
                router.push("/dashboard/leads")
            }
            setStatus("saved");
        } catch (error) {
            console.error(error.response?.data || error.message);
            setStatus("idle");
        }

        await new Promise((r) => setTimeout(r, 900));
        setTimeout(() => setStatus("idle"), 1800);
    };

    const inputClass =
        "w-full bg-white border border-brand-line rounded-xl px-3.5 py-3 text-sm text-brand-navy placeholder:text-brand-gray-light outline-none focus:border-brand-teal transition-colors";

    return (
        <div className="relative min-h-screen bg-brand-cream text-brand-navy px-6 py-10 flex justify-center overflow-hidden">
            {/* decorative blobs — same as HeroSection */}
            <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-brand-teal/15" />
            <div className="pointer-events-none absolute right-10 top-10 h-40 w-40 rounded-full bg-brand-teal/10" />

            <div className="relative w-full max-w-xl">
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-3 mb-8"
                >
                    <button className="w-8 h-8 rounded-lg bg-white border border-brand-tan/60 flex items-center justify-center text-brand-gray hover:text-brand-navy hover:border-brand-teal transition-colors shadow-sm">
                        <ArrowLeft size={15} />
                    </button>
                    <div>
                        <h1 className="font-serif text-xl font-medium text-brand-navy m-0">
                            Create New Lead
                        </h1>
                        <p className="text-xs text-brand-gray mt-0.5">
                            Add a new lead to your pipeline
                        </p>
                    </div>
                </motion.div>

                <motion.form
                    onSubmit={handleSubmit}
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="bg-white border border-brand-tan/60 rounded-2xl p-6 flex flex-col gap-5 shadow-md"
                >
                    {/* Person selector */}
                    <Field label="Person or organization name">
                        <div className="relative">
                            <div className={`${inputClass} flex items-center gap-2`}>
                                <User size={14} className="text-brand-gray-light" />
                                <input
                                    type="text"
                                    value={form.personId}
                                    onChange={(e) => set("personId")(e.target.value)}
                                    placeholder="Enter the Name"
                                    className="w-full bg-transparent outline-none text-brand-navy placeholder-brand-gray-light"
                                />
                            </div>
                        </div>
                    </Field>

                    {/* Source — segmented control */}
                    <Field label="Source">
                        <div className="grid grid-cols-5 gap-1.5">
                            {SOURCES?.map(({ value, label, icon: Icon }) => {
                                const active = form.source === value;
                                return (
                                    <button
                                        type="button"
                                        key={value}
                                        onClick={() => set("source")(value)}
                                        className={`relative flex flex-col items-center gap-1.5 py-2.5 rounded-xl border text-[11px] font-medium transition-colors ${active
                                            ? "border-brand-teal text-white"
                                            : "border-brand-line text-brand-gray hover:border-brand-tan"
                                            }`}
                                    >
                                        {active && (
                                            <motion.div
                                                layoutId="sourceHighlight"
                                                className="absolute inset-0 bg-brand-teal rounded-xl"
                                                transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
                                            />
                                        )}
                                        <Icon size={15} className="relative" />
                                        <span className="relative">{label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </Field>

                    {/* Priority — segmented pill control */}
                    <Field label="Priority">
                        <div className="flex gap-2">
                            {PRIORITIES?.map(({ value, label, activeBg, activeText }) => {
                                const active = form.priority === value;
                                return (
                                    <button
                                        type="button"
                                        key={value}
                                        onClick={() => set("priority")(value)}
                                        style={active ? { backgroundColor: activeBg, color: activeText } : {}}
                                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-medium transition-colors ${active
                                            ? "border-transparent"
                                            : "border-brand-line text-brand-gray hover:border-brand-tan"
                                            }`}
                                    >
                                        <Flame size={12} />
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </Field>

                    {/* Status */}
                    <Field label="Status">
                        <select
                            value={form.status}
                            onChange={(e) => set("status")(e.target.value)}
                            className={inputClass}
                        >
                            {STATUSES?.map((s) => (
                                <option key={s} value={s}>
                                    {s[0].toUpperCase() + s.slice(1)}
                                </option>
                            ))}
                        </select>
                    </Field>

                    {/* Lost reason — animates in only when status is lost */}
                    <AnimatePresence>
                        {form?.status === "lost" && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden"
                            >
                                <label className="text-xs text-brand-gray mb-2 block font-medium">
                                    Lost Reason
                                </label>
                                <textarea
                                    value={form.lostReason}
                                    onChange={(e) => set("lostReason")(e.target.value)}
                                    placeholder="Why was this lead lost?"
                                    rows={2}
                                    className={inputClass}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Value + last contacted */}
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Estimated Value">
                            <div className="relative">
                                <DollarSign size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-gray-light" />
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
                                <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-gray-light" />
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
                            <UserCheck size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-gray-light" />
                            <select
                                value={form.assignedTo}
                                onChange={(e) => set("assignedTo")(e.target.value)}
                                className={`${inputClass} pl-9`}
                            >
                                <option value="">Unassigned</option>
                                {data?.map((u) => (
                                    <option key={u?._id} value={u?._id}>
                                        {u?.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </Field>

                    {/* Submit */}
                    <motion.button
                        variants={item}
                        type="submit"
                        disabled={!form.personId || status === "saving"}
                        whileTap={{ scale: 0.98 }}
                        className="mt-2 relative flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-teal-dark disabled:opacity-50 disabled:cursor-not-allowed rounded-xl py-3.5 text-sm font-semibold text-white transition-colors overflow-hidden shadow-sm"
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
                        </AnimatePresence>
                    </motion.button>
                </motion.form>
            </div>
        </div>
    );
}