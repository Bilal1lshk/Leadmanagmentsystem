"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GripVertical, Phone, Mail, MoreHorizontal, Star } from "lucide-react";

const priorityColors = {
  high: "bg-red-100 text-red-600 border-red-200",
  medium: "bg-[#E5CB90]/30 text-[#C9A24A] border-[#E5CB90]",
  low: "bg-slate-100 text-slate-500 border-slate-200",
};

const priorityDot = {
  high: "bg-red-500",
  medium: "bg-[#E5CB90]",
  low: "bg-slate-400",
};

export default function LeadCard({ lead, onDragStart, onDragEnd, isDragging, onView }) {
  const [showMenu, setShowMenu] = useState(false);

  const initials = (lead.personId || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      layout
      layoutId={lead._id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: isDragging ? 0.4 : 1, y: 0, scale: isDragging ? 0.97 : 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      draggable
      onDragStart={(e) => onDragStart(e, lead)}
      onDragEnd={onDragEnd}
      className="bg-white border border-[#E5CB90]/50 rounded-xl p-3.5 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md hover:border-[#458393]/40 transition-all group"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#458393]/15 flex items-center justify-center text-xs font-bold text-[#458393] shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#22303A] leading-tight">{lead.personId}</p>
            <p className="text-[11px] text-[#5C6D71]">{lead.source?.replace("_", " ")}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical size={14} className="text-[#5C6D71]" />
          <div className="relative">
            <button
              onClick={() => setShowMenu((v) => !v)}
              className="p-1 rounded-md hover:bg-[#FFF3C8] text-[#5C6D71]"
            >
              <MoreHorizontal size={14} />
            </button>
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.95 }}
                  className="absolute right-0 top-7 z-20 bg-white border border-[#E5CB90]/60 rounded-xl shadow-lg p-1 min-w-[130px]"
                >
                  {["View Details", "Edit", "Delete"].map((item) => (
                    <button
                      key={item}
                      onClick={() => { setShowMenu(false); if (item === "View Details") onView?.(lead); }}
                      className={`w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-[#FFF3C8] ${item === "Delete" ? "text-red-500" : "text-[#22303A]"}`}
                    >
                      {item}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Priority & Value */}
      <div className="flex items-center justify-between mb-2.5">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${priorityColors[lead.priority] || priorityColors.medium}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${priorityDot[lead.priority] || priorityDot.medium}`} />
          {lead.priority || "medium"}
        </span>
        <span className="text-sm font-bold text-[#22303A]">
          £{(lead.estimatedValue || 0).toLocaleString()}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-1.5 pt-2 border-t border-[#E5CB90]/30">
        <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-[#458393]/10 text-[#458393] text-xs hover:bg-[#458393]/20 transition-colors">
          <Phone size={12} /> Call
        </button>
        <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-[#FFF3C8]/60 text-[#5C6D71] text-xs hover:bg-[#FFF3C8] border border-[#E5CB90]/40 transition-colors">
          <Mail size={12} /> Email
        </button>
      </div>
    </motion.div>
  );
}
