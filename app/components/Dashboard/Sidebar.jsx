"use client"
import {
  LayoutDashboard,
  Users,
  KanbanSquare,
  MessageCircle,
  BarChart3,
  Settings,
  TrendingUp,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";


import Link from "next/link";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const navItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    link: "/dashboard",
  },
  {
    icon: Users,
    label: "Leads",
    link: "/dashboard/leads",
  },
  {
    icon: KanbanSquare,
    label: "Pipeline",
    link: "/dashboard/pipeline",
  },
  {
    icon: MessageCircle,
    label: "Follow-ups",
    link: "/dashboard/follow-ups",
  },
  {
    icon: BarChart3,
    label: "Analytics",
    link: "/dashboard/analytics",
  },
  {
    icon: Settings,
    label: "Settings",
    link: "/dashboard/settings",
  },
];

export default function Sidebar() {
  const dispatch = useAppDispatch();

  dispatch(setAllLeads(response.data.data ?? []));

  const data = useSelector((store) => store.LeadSlice.Lead)
  console.log(data)
  useEffect(() => {

  }, [])
  return (
    <aside className="w-56 min-h-screen bg-[#131826] border-r border-[#1F2635] p-3.5 flex flex-col gap-1">

      {/* Logo */}
      <div className="flex items-center gap-2 px-2 pb-5">
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
          <TrendingUp size={16} className="text-white" />
        </div>

        <span className="font-bold text-[17px] text-white">
          Leadwise
        </span>
      </div>

      {/* Navigation */}
      {navItems.map(({ icon: Icon, label, link }) => (
        <Link
          key={label}
          href={link}
          className="block"
        >
          <div
            className="
              flex items-center gap-2.5
              px-3 py-2.5
              rounded-lg
              text-sm
              cursor-pointer
              text-slate-400
              font-medium
              hover:bg-[#1A2030]
              hover:text-white
              transition-colors
            "
          >
            <Icon size={17} />
            {label}
          </div>
        </Link>
      ))}

    </aside>
  );
}