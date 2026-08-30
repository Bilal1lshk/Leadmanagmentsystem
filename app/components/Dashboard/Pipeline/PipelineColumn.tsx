"use client";

import { useState, type DragEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import LeadCard from "./LeadCard";
import { type Lead } from "@/app/redux/leads";

/* ---------------------------------- Types --------------------------------- */

type LeadStatus =
    | "new"
    | "contacted"
    | "qualified"
    | "proposal"
    | "won"
    | "lost";

interface StageConfigEntry {
    label: string;
    accent: string;
    bg: string;
    border: string;
}

interface PipelineColumnProps {
    stage: LeadStatus;
    leads: Lead[];
    isDragOver: boolean;
    onDragOver: (e: DragEvent<HTMLDivElement>) => void;
    onDragLeave: () => void;
    onDrop: (e: DragEvent<HTMLDivElement>) => void;
    onCardDragStart: (e: DragEvent<HTMLDivElement>, lead: Lead) => void;
    onCardDragEnd: () => void;
    draggingLead: Lead | null;
    onView?: (lead: Lead) => void;
}

/* --------------------------------- Constants ------------------------------- */

const stageConfig: Record<LeadStatus, StageConfigEntry> = {
    new: { label: "New Lead", accent: "#458393", bg: "bg-[#458393]/10", border: "border-t-[#458393]" },
    contacted: { label: "Contacted", accent: "#34A99D", bg: "bg-[#34A99D]/10", border: "border-t-[#34A99D]" },
    qualified: { label: "Qualified", accent: "#E5CB90", bg: "bg-[#E5CB90]/25", border: "border-t-[#C9A24A]" },
    proposal: { label: "Proposal Sent", accent: "#458393", bg: "bg-[#458393]/10", border: "border-t-[#458393]" },
    won: { label: "Won ✓", accent: "#22c55e", bg: "bg-emerald-50", border: "border-t-emerald-500" },
    lost: { label: "Lost", accent: "#ef4444", bg: "bg-red-50", border: "border-t-red-400" },
};

/* ------------------------------- Component --------------------------------- */

export default function PipelineColumn({
    stage,
    leads,
    isDragOver,
    onDragOver,
    onDragLeave,
    onDrop,
    onCardDragStart,
    onCardDragEnd,
    draggingLead,
    onView,
}: PipelineColumnProps) {
    const [collapsed, setCollapsed] = useState(false);
    const cfg = stageConfig[stage] ?? stageConfig.new;
    const totalValue = leads.reduce((sum, l) => sum + (l.estimatedValue || 0), 0);

    return (
        <div
            className={`flex-shrink-0 w-64 flex flex-col rounded-2xl border border-[#E5CB90]/50 border-t-4 ${cfg.border} bg-white transition-all duration-200 ${
                isDragOver ? "ring-2 ring-[#458393]/40 shadow-lg scale-[1.01]" : ""
            }`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            {/* Column header */}
            <div className={`px-3.5 py-3 rounded-t-xl ${cfg.bg}`}>
                <div className="flex items-center justify-between mb-1">
                    <button
                        onClick={() => setCollapsed((v) => !v)}
                        className="flex items-center gap-2"
                    >
                        <span className="text-sm font-bold text-[#22303A]">{cfg.label}</span>
                        <span
                            className="text-xs font-medium text-white rounded-full px-2 py-0.5"
                            style={{ backgroundColor: cfg.accent }}
                        >
                            {leads.length}
                        </span>
                    </button>
                    <button className="p-1 rounded-lg hover:bg-white/60 text-[#5C6D71]">
                        <Plus size={14} />
                    </button>
                </div>
                <p className="text-xs text-[#5C6D71] font-medium">
                    Total: £{totalValue.toLocaleString()}
                </p>
            </div>

            {/* Cards area */}
            <AnimatePresence>
                {!collapsed && (
                    <motion.div
                        key="cards"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-2 p-2.5 overflow-hidden min-h-[120px]"
                    >
                        {leads.length === 0 && (
                            <div
                                className={`flex-1 flex items-center justify-center rounded-xl border-2 border-dashed border-[#E5CB90]/50 min-h-[100px] text-[#5C6D71] text-xs transition-colors ${
                                    isDragOver ? "bg-[#FFF3C8]/40 border-[#458393]/40" : ""
                                }`}
                            >
                                {isDragOver ? "Drop here" : "No leads"}
                            </div>
                        )}
                        <AnimatePresence>
                            {leads.map((lead) => (
                                <LeadCard
                                    key={lead._id}
                                    lead={lead}
                                    isDragging={draggingLead?._id === lead._id}
                                    onDragStart={onCardDragStart}
                                    onDragEnd={onCardDragEnd}
                                    onView={onView}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}