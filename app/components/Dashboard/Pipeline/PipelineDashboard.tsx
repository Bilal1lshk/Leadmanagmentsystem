"use client";

import { useState, useCallback, type DragEvent } from "react";
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import { setAllLeads, type Lead } from "@/app/redux/leads";
import axios from "axios";
import Sidebar from "../Homepage/Sidebar";
import PipelineStats from "./PipelineStats";
import PipelineColumn from "./PipelineColumn";
import WonLostModal from "./WonLostModal";
import { Search, RefreshCw } from "lucide-react";

/* ---------------------------------- Types --------------------------------- */

type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "won"
  | "lost";

// If you already have a shared Lead type (e.g. from your CreateLead form or
// a redux/types file), import and reuse that instead of redeclaring it here.


interface WonLostPending {
  lead: Lead;
  targetStatus: "won" | "lost";
}

const STAGES: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "won",
  "lost",
];

/* ------------------------------- Component --------------------------------- */

export default function PipelineDashboard() {
  const dispatch = useAppDispatch();
  const leads = useAppSelector((s) => s.LeadSlice.Lead) as Lead[];

  const [draggingLead, setDraggingLead] = useState<Lead | null>(null);
  const [dragOverStage, setDragOverStage] = useState<LeadStatus | null>(null);
  const [wonLostPending, setWonLostPending] = useState<WonLostPending | null>(
    null
  );
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const filtered = leads.filter((l) =>
    search
      ? (l.personId || "").toLowerCase().includes(search.toLowerCase()) ||
      (l.source || "").toLowerCase().includes(search.toLowerCase())
      : true
  );

  const byStage = STAGES.reduce<Record<LeadStatus, Lead[]>>((acc, s) => {
    acc[s] = filtered.filter((l) => l.status === s);
    return acc;
  }, {} as Record<LeadStatus, Lead[]>);

  // ── Drag handlers ──────────────────────────────────────────────────────
  const handleCardDragStart = useCallback(
    (e: DragEvent<HTMLDivElement>, lead: Lead) => {
      e.dataTransfer.effectAllowed = "move";
      setDraggingLead(lead);
    },
    []
  );

  const handleCardDragEnd = useCallback(() => {
    setDraggingLead(null);
    setDragOverStage(null);
  }, []);

  const handleDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>, stage: LeadStatus) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setDragOverStage(stage);
    },
    []
  );

  const handleDragLeave = useCallback(() => {
    setDragOverStage(null);
  }, []);

  const commitStatusChange = useCallback(
    async (lead: Lead, newStatus: LeadStatus, reason: string | null) => {
      const updated = leads.map((l) =>
        l._id === lead._id
          ? { ...l, status: newStatus, lostReason: reason }
          : l
      );
      dispatch(setAllLeads(updated));
      try {
        await axios.patch("/api/dashboardapi/Leads/UpdateStatus", {
          leadId: lead._id,
          status: newStatus,
          lostReason: reason,
        });
      } catch (err) {
        console.error("Failed to update lead status:", err);
        dispatch(setAllLeads(leads)); // rollback
      }
    },
    [leads, dispatch]
  );

  const handleDrop = useCallback(
    async (e: DragEvent<HTMLDivElement>, targetStage: LeadStatus) => {
      e.preventDefault();
      setDragOverStage(null);
      if (!draggingLead || draggingLead.status === targetStage) return;

      if (targetStage === "won" || targetStage === "lost") {
        setWonLostPending({ lead: draggingLead, targetStatus: targetStage });
        return;
      }
      await commitStatusChange(draggingLead, targetStage, null);
    },
    [draggingLead, commitStatusChange]
  );

  const handleWonLostConfirm = async (reason: string) => {
    if (!wonLostPending) return;
    await commitStatusChange(
      wonLostPending.lead,
      wonLostPending.targetStatus,
      reason
    );
    setWonLostPending(null);
    setDraggingLead(null);
  };

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/dashboardapi/Leads/AllLead");
      dispatch(setAllLeads(res.data.data || []));
    } catch (err) {
      console.error("Failed to refresh leads:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#FFF3C8] text-[#22303A]">
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between gap-4 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-[#22303A]">Lead Pipeline</h1>
            <p className="text-sm text-[#5C6D71] mt-0.5">
              Drag cards to move leads across stages
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C6D71]"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search leads..."
                className="pl-9 pr-3 py-2 rounded-xl border border-[#E5CB90]/60 bg-white text-sm text-[#22303A] placeholder:text-slate-400 focus:outline-none focus:border-[#458393] w-52"
              />
            </div>
            <button
              onClick={refresh}
              disabled={loading}
              className="p-2 rounded-xl border border-[#E5CB90]/60 bg-white text-[#5C6D71] hover:bg-[#FFF3C8]/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="px-6 shrink-0">
          <PipelineStats leads={leads} />
        </div>

        {/* Kanban board */}
        <div className="flex-1 overflow-x-auto px-6 pb-6">
          <div className="flex gap-4 h-full min-w-max">
            {STAGES.map((stage) => (
              <PipelineColumn
                key={stage}
                stage={stage}
                leads={byStage[stage] || []}
                isDragOver={dragOverStage === stage}
                onDragOver={(e: DragEvent<HTMLDivElement>) =>
                  handleDragOver(e, stage)
                }
                onDragLeave={handleDragLeave}
                onDrop={(e: DragEvent<HTMLDivElement>) => handleDrop(e, stage)}
                onCardDragStart={handleCardDragStart}
                onCardDragEnd={handleCardDragEnd}
                draggingLead={draggingLead}
              />
            ))}
          </div>
        </div>
      </main>

      {wonLostPending && (
        <WonLostModal
          lead={wonLostPending.lead}
          targetStatus={wonLostPending.targetStatus}
          onConfirm={handleWonLostConfirm}
          onCancel={() => {
            setWonLostPending(null);
            setDraggingLead(null);
          }}
        />
      )}
    </div>
  );
}