"use client";

import { useAppSelector } from "@/app/redux/hooks";
import StatCard from "./Statcards";
import { StatCardData } from "./Types";

interface StatsGridProps {
  stats: StatCardData[];
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="flex flex-col gap-4 px-6 pt-4 sm:flex-row">
      {stats.length > 0 && stats.map((stat) => (
        <StatCard key={stat.kind} {...stat} />
      ))}
    </div>
  );
}