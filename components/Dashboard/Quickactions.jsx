import { Plus, Upload, Download, PenSquare } from "lucide-react";
import Card from "./Card";

const actions = [
  { icon: Plus, label: "Add Lead" },
  { icon: Upload, label: "Import Leads" },
  { icon: Download, label: "Export Leads" },
  { icon: PenSquare, label: "Create Task" },
];

export default function QuickActions({ onAction }) {
  return (
    <Card>
      <h3 className="m-0 mb-3 text-sm text-white">Quick Actions</h3>
      <div className="flex flex-col gap-2">
        {actions.map(({ icon: Icon, label }) => (
          <button
            key={label}
            onClick={() => onAction?.(label)}
            className="flex items-center gap-2 bg-[#0F1420] border border-[#1F2635] rounded-lg px-3 py-2.5 text-sm text-white hover:bg-[#171D2C] transition-colors"
          >
            <Icon size={14} className="text-blue-500" />
            {label}
          </button>
        ))}
      </div>
    </Card>
  );
}