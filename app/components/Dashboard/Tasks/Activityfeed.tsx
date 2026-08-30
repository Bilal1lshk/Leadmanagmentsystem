import { ReactNode } from "react";
import { ActivityItem } from "./Types";

interface ActivityFeedProps {
  items: ActivityItem[];
}

export default function ActivityFeed({ items }: ActivityFeedProps) {
  if (!items || items.length === 0) {
    return (
      <p className="text-sm text-slate-400 py-2">No activity yet.</p>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id} className="flex items-start gap-3 text-sm">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
            {(item.user || item.label || "?")
              .split(" ")
              .map((n: string) => n[0])
              .join("")}
          </div>
          <div>
            <span className="font-medium text-slate-700">{item.user || item.label || "Activity"}</span>{" "}
            <span className="text-slate-500">{item.action || ""}</span>
            <p className="mt-0.5 text-[11px] text-slate-400">{item.time || item.timeAgo || ""}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
