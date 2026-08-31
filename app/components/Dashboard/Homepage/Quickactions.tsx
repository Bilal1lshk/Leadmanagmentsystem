"use client"
import { Plus, Upload, Download, PenSquare } from "lucide-react";
import Card from "./Card";

const actions = [
  { icon: Plus, label: "Add Lead", href: "/dashboard/leads/create" },
  { icon: PenSquare, label: "Create Task", href: "/dashboard/task/newtask" },
];

export default function QuickActions({ onAction }: { onAction?: (label: string) => void }) {
  return (
    <Card>
      <h3 className="m-0 mb-3 text-sm text-[#22303A]">Quick Actions</h3>
      <div className="flex flex-col gap-2">
        {actions.map(({ icon: Icon, label,href,}) => (
          <a key={href} className="flex items-center gap-2 bg-[#FFF3C8]/40 border border-[#E5CB90]/60 rounded-lg px-3 py-2.5 text-sm text-[#22303A] hover:bg-[#FFF3C8] transition-colors"href={href}>
          <button
            key={label}
            onClick={() => onAction?.(label)}
            className=""
          >
            <Icon size={14} className="text-[#458393]" />
            {label}
          </button>
          </a>
        ))}
      </div>
    </Card>
  );
}