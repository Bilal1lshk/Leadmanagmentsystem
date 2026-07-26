import {
  LayoutDashboard,
  Users,
  KanbanSquare,
  MessageCircle,
  BarChart3,
  Settings,
  TrendingUp,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Users, label: "Leads" },
  { icon: KanbanSquare, label: "Pipeline" },
  { icon: MessageCircle, label: "Follow-ups" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-56 bg-[#131826] border-r border-[#1F2635] p-3.5 flex flex-col gap-1">
      <div className="flex items-center gap-2 px-2 pb-5">
        <div className="w-7.5 h-7.5 w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
          <TrendingUp size={16} className="text-white" />
        </div>
        <span className="font-bold text-[17px] text-white">Leadwise</span>
      </div>

      {navItems.map(({ icon: Icon, label, active }) => (
        <div
          key={label}
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm cursor-pointer ${
            active
              ? "bg-blue-500 text-white font-semibold"
              : "text-slate-400 font-medium hover:bg-[#1A2030]"
          }`}
        >
          <Icon size={17} />
          {label}
        </div>
      ))}
    </aside>
  );
}