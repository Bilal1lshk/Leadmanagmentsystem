"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  Users,
} from "lucide-react";
import Card from "./Card";

const stages = [
  {
    name: "NEW",
    description: "Fresh leads",
    count: 24,
    value: "$20,000",
    color: "#458393",
    leads: ["John Smith", "Ali Raza"],
  },
  {
    name: "CONTACTED",
    description: "First contact",
    count: 18,
    value: "$15,000",
    color: "#34A99D",
    leads: ["Sarah Khan", "Emma Jones"],
  },
  {
    name: "QUALIFIED",
    description: "Sales qualified",
    count: 12,
    value: "$35,000",
    color: "#E5CB90",
    leads: ["Mike Brown", "David Khan"],
  },
  {
    name: "PROPOSAL",
    description: "Proposal sent",
    count: 8,
    value: "$40,000",
    color: "#458393",
    leads: [],
  },
  {
    name: "WON",
    description: "Successfully closed",
    count: 15,
    value: "$50,000",
    color: "#34A99D",
    leads: [],
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function PipelineBoard() {
  const totalLeads = stages.reduce(
    (total, stage) => total + stage.count,
    0
  );

  const totalValue = stages.reduce(
    (total, stage) =>
      total + Number(stage.value.replace(/[$,]/g, "")),
    0
  );

  return (
    <Card>
      {/* Header */}
      <a href="/dashboard/pipeline" className="block">
      <div className="mb-5 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="m-0 text-[15px] font-semibold text-[#22303A]">
                Lead Pipeline
              </h3>

              <span className="px-2 py-0.5 rounded-full bg-[#34A99D]/10 text-[#34A99D] text-[10px] font-semibold">
                LIVE
              </span>
            </div>

            <p className="mt-1 text-[11px] text-[#7A898D]">
              Track leads from first contact to closed deal
            </p>
          </div>

          <div className="flex items-center gap-5">
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-[#7A898D]">
                Total Leads
              </div>
              <div className="text-sm font-semibold text-[#22303A]">
                {totalLeads}
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-[#7A898D]">
                Pipeline Value
              </div>
              <div className="text-sm font-semibold text-[#458393]">
                ${totalValue.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline direction */}
        <div className="flex items-center gap-2">
          {stages.map((stage, index) => (
            <div key={stage.name} className="flex items-center flex-1">
              <div className="h-1.5 flex-1 rounded-full bg-[#EEF2F3] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: stage.color }}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </div>

              {index < stages.length - 1 && (
                <ArrowRight
                  size={12}
                  className="mx-1 text-[#B5C0C3]"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline columns */}
      <div className="grid grid-cols-5 gap-2.5">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -3 }}
            className="relative overflow-hidden rounded-xl border border-[#E8EDEE] bg-[#F9FAFA]"
          >
            {/* Stage color */}
            <div
              className="absolute top-0 left-0 right-0 h-[3px]"
              style={{ backgroundColor: stage.color }}
            />

            <div className="p-3">
              {/* Stage header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] font-bold tracking-[0.08em] text-[#22303A]">
                    {stage.name}
                  </div>

                  <div className="mt-0.5 text-[10px] text-[#8A979A]">
                    {stage.description}
                  </div>
                </div>

                <div
                  className="flex h-7 w-7 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: `${stage.color}15`,
                    color: stage.color,
                  }}
                >
                  {stage.name === "WON" ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <Users size={14} />
                  )}
                </div>
              </div>

              {/* Metrics */}
              <div className="mt-4">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-xl font-bold tracking-tight text-[#22303A]">
                      {stage.count}
                    </div>

                    <div className="text-[10px] text-[#7A898D]">
                      leads
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-[11px] font-semibold text-[#4A5A5F]">
                      <CircleDollarSign size={11} />
                      {stage.value}
                    </div>

                    <div className="text-[9px] text-[#9AA5A8]">
                      estimated value
                    </div>
                  </div>
                </div>
              </div>

              {/* Leads */}
              <div className="mt-4 space-y-1.5">
                {stage.leads.length > 0 ? (
                  stage.leads.map((lead, leadIndex) => (
                    <motion.div
                      key={lead}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.4 + index * 0.08 + leadIndex * 0.08,
                      }}
                      className="flex items-center gap-2 rounded-lg border border-[#E8EDEE] bg-white px-2 py-2 shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
                    >
                      <div
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
                        style={{
                          backgroundColor: `${stage.color}18`,
                          color: stage.color,
                        }}
                      >
                        {getInitials(lead)}
                      </div>

                      <span className="truncate text-[10px] font-medium text-[#34444A]">
                        {lead}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex h-[61px] items-center justify-center rounded-lg border border-dashed border-[#DDE3E4]">
                    <span className="text-[10px] text-[#9AA5A8]">
                      No leads to display
                    </span>
                  </div>
                )}
              </div>

              {/* More indicator */}
              {stage.count > stage.leads.length && (
                <div className="mt-2 text-center text-[9px] font-medium text-[#7A898D]">
                  +{stage.count - stage.leads.length} more leads
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      </a>
    </Card>
  );
}