"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Globe,
  Megaphone,
  Phone,
  Users,
  Share2,
  TrendingUp,
} from "lucide-react";
import { useAppSelector } from "@/app/redux/hooks";
import Card from "@/app/components/Dashboard/Homepage/Card";

interface DonutEntry {
  label: string;
  pct: number;
  count: number;
  color: string;
  icon: any;
}

function Donut({
  data,
  size = 280,
  thickness = 34,
}: {
  data: DonutEntry[];
  size?: number;
  thickness?: number;
}) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="max-w-full"
      >
        {/* Background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#EEF2F3"
          strokeWidth={thickness}
        />

        {data.map((item, index) => {
          if (item.pct <= 0) return null;

          const dash = (item.pct / 100) * circumference;
          const currentOffset = offset;

          offset += dash;

          return (
            <motion.circle
              key={item.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={thickness}
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-currentOffset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              initial={{
                opacity: 0,
                strokeDasharray: `0 ${circumference}`,
              }}
              animate={{
                opacity: 1,
                strokeDasharray: `${dash} ${circumference - dash}`,
              }}
              transition={{
                duration: 1,
                delay: index * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          );
        })}
      </svg>

      {/* Center */}
      <div className="absolute flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-[32px] font-bold tracking-[-0.04em] text-[#22303A] sm:text-[38px] lg:text-[42px]"
        >
          {data.reduce((sum, item) => sum + item.count, 0)}
        </motion.span>

        <span className="text-[10px] font-medium text-[#7A898D] sm:text-xs">
          Total Leads
        </span>

        <div className="mt-1.5 flex items-center gap-1 text-[9px] font-semibold text-[#34A99D] sm:mt-2 sm:text-[10px]">
          <TrendingUp size={10} />
          Live data
        </div>
      </div>
    </div>
  );
}

export default function LeadSourcesChart() {
  const lead = useAppSelector((store) => store.LeadSlice.Lead);

  const totalLeads = lead.length;

  const getCount = (source: string) =>
    lead.filter((item) => item?.source === source).length;

  const getPercentage = (count: number) =>
    totalLeads > 0
      ? Number(((count / totalLeads) * 100).toFixed(1))
      : 0;

  const sources: DonutEntry[] = [
    {
      label: "Website",
      count: getCount("website"),
      pct: getPercentage(getCount("website")),
      color: "#458393",
      icon: Globe,
    },
    {
      label: "Referral",
      count: getCount("referral"),
      pct: getPercentage(getCount("referral")),
      color: "#34A99D",
      icon: Share2,
    },
    {
      label: "Ads",
      count: getCount("ad"),
      pct: getPercentage(getCount("ad")),
      color: "#E5CB90",
      icon: Megaphone,
    },
    {
      label: "Cold Call",
      count: getCount("cold_call"),
      pct: getPercentage(getCount("cold_call")),
      color: "#F59E0B",
      icon: Phone,
    },
    {
      label: "Other",
      count: getCount("other"),
      pct: getPercentage(getCount("other")),
      color: "#9CA3AF",
      icon: Users,
    },
  ];

  const topSource = [...sources].sort(
    (a, b) => b.count - a.count
  )[0];

  return (
    <div className="w-full min-w-0 space-y-5 px-2 py-2.5 sm:px-3">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#34A99D]" />

            <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#7A898D] sm:text-[10px] sm:tracking-[0.16em]">
              Acquisition Analytics
            </span>
          </div>

          <h1 className="text-[25px] font-bold leading-tight tracking-[-0.035em] text-[#22303A] sm:text-[28px] lg:text-[32px]">
            Where your leads{" "}
            <span className="text-[#458393]">come from.</span>
          </h1>

          <p className="mt-2 max-w-xl text-xs leading-relaxed text-[#7A898D] sm:text-sm">
            Understand which channels are bringing prospects into your
            pipeline and identify where your sales efforts are performing
            best.
          </p>
        </div>

        <div className="flex w-fit shrink-0 items-center gap-2 rounded-xl border border-[#E5EAEB] bg-white px-3 py-2">
          <div className="h-2 w-2 shrink-0 rounded-full bg-[#34A99D]" />

          <span className="whitespace-nowrap text-[10px] font-medium text-[#5C6D71] sm:text-xs">
            Tracking {totalLeads} leads
          </span>
        </div>
      </motion.div>

      {/* MAIN CARD */}
      <Card>
        <div className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.4fr)] lg:gap-10">
          {/* DONUT */}
          <div className="flex min-w-0 flex-col items-center justify-center py-4 sm:py-6">
            <div className="relative flex w-full max-w-[280px] items-center justify-center">
              {/* Glow */}
              <motion.div
                className="absolute inset-[12%] rounded-full bg-[#34A99D]/10 blur-3xl"
                animate={{
                  scale: [1, 1.08, 1],
                  opacity: [0.4, 0.6, 0.4],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
              />

              <div className="relative w-full">
                <div className="mx-auto aspect-square w-[210px] sm:w-[240px] lg:w-[280px]">
                  <Donut
                    data={sources}
                    size={280}
                    thickness={34}
                  />
                </div>
              </div>
            </div>

            {/* TOP SOURCE */}
            {topSource && topSource.count > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-4 flex max-w-full items-center gap-1.5 rounded-full border border-[#E5EAEB] bg-[#F8FAFA] px-2.5 py-1.5 sm:mt-5 sm:gap-2 sm:px-3"
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{
                    backgroundColor: topSource.color,
                  }}
                />

                <span className="text-[10px] text-[#7A898D] sm:text-[11px]">
                  Top source:
                </span>

                <span className="truncate text-[10px] font-semibold text-[#22303A] sm:text-[11px]">
                  {topSource.label}
                </span>

                <span className="shrink-0 text-[10px] font-bold text-[#458393] sm:text-[11px]">
                  {topSource.pct}%
                </span>
              </motion.div>
            )}
          </div>

          {/* SOURCE BREAKDOWN */}
          <div className="flex min-w-0 flex-col justify-center">
            <div className="mb-4 sm:mb-5">
              <h2 className="text-base font-semibold text-[#22303A] sm:text-lg">
                Lead Source Breakdown
              </h2>

              <p className="mt-1 text-[11px] leading-relaxed text-[#7A898D] sm:text-xs">
                Distribution of leads across your acquisition channels.
              </p>
            </div>

            <div className="space-y-2.5 sm:space-y-3">
              {sources.map((source, index) => {
                const Icon = source.icon;

                return (
                  <motion.div
                    key={source.label}
                    initial={{
                      opacity: 0,
                      x: 15,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay: 0.15 + index * 0.08,
                    }}
                    whileHover={{
                      x: 4,
                    }}
                    className="group min-w-0 rounded-xl border border-[#E8EDEE] bg-[#FAFBFB] p-2.5 transition-all hover:bg-white hover:shadow-[0_8px_25px_rgba(34,48,58,0.06)] sm:p-3.5"
                  >
                    <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                      {/* ICON */}
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9"
                        style={{
                          backgroundColor: `${source.color}15`,
                          color: source.color,
                        }}
                      >
                        <Icon size={15} className="sm:hidden" />
                        <Icon size={16} className="hidden sm:block" />
                      </div>

                      {/* NAME + PROGRESS */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-[11px] font-semibold text-[#34444A] sm:text-xs">
                            {source.label}
                          </span>

                          <span className="shrink-0 text-[11px] font-bold text-[#22303A] sm:text-xs">
                            {source.pct}%
                          </span>
                        </div>

                        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#E9EEEF] sm:mt-2">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              backgroundColor: source.color,
                            }}
                            initial={{
                              width: 0,
                            }}
                            animate={{
                              width: `${source.pct}%`,
                            }}
                            transition={{
                              duration: 0.8,
                              delay: 0.3 + index * 0.1,
                            }}
                          />
                        </div>
                      </div>

                      {/* COUNT */}
                      <div className="w-10 shrink-0 text-right sm:min-w-[55px]">
                        <div className="text-xs font-bold text-[#22303A] sm:text-sm">
                          {source.count}
                        </div>

                        <div className="text-[8px] text-[#9AA5A8] sm:text-[9px]">
                          leads
                        </div>
                      </div>

                      {/* ARROW */}
                      <ArrowUpRight
                        size={13}
                        className="hidden shrink-0 text-[#B5C0C3] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:block"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* BOTTOM INSIGHT */}
        <div className="mt-6 border-t border-[#EEF1F2] pt-4 sm:mt-8 sm:pt-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#9AA5A8] sm:text-[10px]">
                Analytics Insight
              </div>

              <p className="mt-1 text-[10px] leading-relaxed text-[#5C6D71] sm:text-xs">
                Your strongest acquisition channel is{" "}
                <span className="font-semibold text-[#22303A]">
                  {topSource?.label || "—"}
                </span>
                , generating{" "}
                <span className="font-semibold text-[#458393]">
                  {topSource?.count || 0}
                </span>{" "}
                leads.
              </p>
            </div>

            <button className="flex w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-[#E1E7E8] bg-white px-3 py-2 text-[10px] font-semibold text-[#458393] transition-all hover:border-[#458393]/30 hover:bg-[#458393]/5 sm:w-auto sm:text-[11px]">
              View detailed analytics
              <ArrowUpRight size={13} />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}