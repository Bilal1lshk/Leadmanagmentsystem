"use client"
import { useState } from "react";
import Card from "./Card";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";


interface DonutEntry {
  label: string;
  pct: number;
  color: string;
}

function Donut({ data, size = 150, thickness = 22 }: { data: DonutEntry[]; size?: number; thickness?: number }) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {data.map((d: DonutEntry) => {
        const dash = (d.pct / 100) * circumference;
        const el = (
          <circle
            key={d.label}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={d.color}
            strokeWidth={thickness}
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
}

export default function LeadSourcesChart() {
  const lead = useAppSelector((store) => store.LeadSlice.Lead);

  const totalLeads = lead.length;

  const websiteData = lead.filter(
    (item) => item?.source === "website"
  );

  const referralData = lead.filter(
    (item) => item?.source === "referral"
  );

  const adData = lead.filter(
    (item) => item?.source === "ad"
  );

  const coldCallData = lead.filter(
    (item) => item?.source === "cold_call"
  );

  const otherData = lead.filter(
    (item) => item?.source === "other"
  );

  const websitePercentage =
    totalLeads > 0 ? (websiteData.length / totalLeads) * 100 : 0;

  const referralPercentage =
    totalLeads > 0 ? (referralData.length / totalLeads) * 100 : 0;

  const adPercentage =
    totalLeads > 0 ? (adData.length / totalLeads) * 100 : 0;

  const coldCallPercentage =
    totalLeads > 0 ? (coldCallData.length / totalLeads) * 100 : 0;

  const otherPercentage =
    totalLeads > 0 ? (otherData.length / totalLeads) * 100 : 0;

  const sources = [
    { label: "Website", pct: websitePercentage.toFixed(2), color: "#458393" },
    { label: "referral", pct: referralPercentage.toFixed(2), color: "#34A99D" },
    { label: "ad", pct: adPercentage.toFixed(2), color: "#E5CB90" },
    { label: "coldCall", pct: coldCallPercentage.toFixed(2), color: "#2A3F45" },
    { label: "other", pct: otherPercentage.toFixed(2), color: "#9CA3AF" },
  ];

  return (
    <Card>
      <h3 className="m-0 mb-3 text-sm text-[#22303A]">Lead Sources (Donut Chart)</h3>
      <div className="flex items-center gap-4">
        <Donut data={sources} />
        <div className="flex flex-col gap-2">
          {sources.map((s) => (
            <div key={s.label} className="flex items-center gap-2 text-[12.5px]">
              <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
              <span className="text-[#4A5A5F] flex-1">{s.label}</span>
              <span className="text-[#5C6D71]">{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}