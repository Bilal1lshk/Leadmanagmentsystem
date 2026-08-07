"use client";

import StatCard from "./StatCard";
import { StatCardData } from "./types";

interface StatsGridProps {
  stats: StatCardData[];
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="flex flex-col gap-4 px-6 pt-4 sm:flex-row">
      {stats.map((stat) => (
        <StatCard key={stat.kind} {...stat} />
      ))}
    </div>
  );
}