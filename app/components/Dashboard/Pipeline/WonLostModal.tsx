"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import { useState, type MouseEvent } from "react";
import { type Lead } from "@/app/redux/leads";

/* ---------------------------------- Types --------------------------------- */

type WonLostStatus = "won" | "lost";

interface WonLostModalProps {
    lead: Lead;
    targetStatus: WonLostStatus;
    onConfirm: (reason: string) => void;
    onCancel: () => void;
}

/* --------------------------------- Constants ------------------------------- */

const LOST_REASONS = [
    "Price too high",
    "Chose a competitor",
    "No budget",
    "Bad timing",
    "No response",
    "Requirements changed",
    "Other",
];

const WON_REASONS = [
    "Best price",
    "Strong relationship",
    "Product fit",
    "Referral",
    "Followed up consistently",
];

/* ------------------------------- Component --------------------------------- */

export default function WonLostModal({
    lead,
    targetStatus,
    onConfirm,
    onCancel,
}: WonLostModalProps) {
    const [selectedReason, setSelectedReason] = useState("");
    const [customReason, setCustomReason] = useState("");
    const isLost = targetStatus === "lost";
    const reasons = isLost ? LOST_REASONS : WON_REASONS;
    const finalReason = selectedReason === "Other" ? customReason : selectedReason;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e: MouseEvent<HTMLDivElement>) =>
                    e.target === e.currentTarget && onCancel()
                }
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className="bg-white rounded-2xl shadow-2xl border border-[#E5CB90]/60 w-full max-w-md mx-4"
                >
                    {/* Header */}
                    <div
                        className={`px-5 py-4 rounded-t-2xl flex items-center justify-between ${
                            isLost
                                ? "bg-red-50 border-b border-red-100"
                                : "bg-emerald-50 border-b border-emerald-100"
                        }`}
                    >
                        <div className="flex items-center gap-2.5">
                            <div
                                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                                    isLost ? "bg-red-100" : "bg-emerald-100"
                                }`}
                            >
                                {isLost ? (
                                    <AlertTriangle size={16} className="text-red-500" />
                                ) : (
                                    <span className="text-emerald-600 font-bold text-sm">✓</span>
                                )}
                            </div>
                            <div>
                                <p className="font-bold text-[#22303A] text-sm">
                                    Mark as {isLost ? "Lost" : "Won"}
                                </p>
                                <p className="text-[11px] text-[#5C6D71]">{lead?.personId}</p>
                            </div>
                        </div>
                        <button
                            onClick={onCancel}
                            className="p-1.5 rounded-lg hover:bg-white text-[#5C6D71]"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="px-5 py-4">
                        <p className="text-sm font-semibold text-[#22303A] mb-3">
                            {isLost ? "Why was this lead lost?" : "What drove this win?"}
                        </p>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                            {reasons.map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setSelectedReason(r)}
                                    className={`text-left px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                                        selectedReason === r
                                            ? isLost
                                                ? "bg-red-50 border-red-300 text-red-700"
                                                : "bg-emerald-50 border-emerald-300 text-emerald-700"
                                            : "bg-[#FFF3C8]/30 border-[#E5CB90]/40 text-[#5C6D71] hover:border-[#E5CB90]"
                                    }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                        {selectedReason === "Other" && (
                            <textarea
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                placeholder="Describe the reason..."
                                rows={2}
                                className="w-full text-sm border border-[#E5CB90]/60 rounded-xl px-3 py-2 text-[#22303A] placeholder:text-slate-400 focus:outline-none focus:border-[#458393] resize-none"
                            />
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex gap-2 px-5 pb-5">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-2.5 rounded-xl border border-[#E5CB90]/60 text-sm font-semibold text-[#5C6D71] hover:bg-[#FFF3C8]/30 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={!finalReason}
                            onClick={() => onConfirm(finalReason)}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                                isLost ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"
                            }`}
                        >
                            Confirm {isLost ? "Lost" : "Won"}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}