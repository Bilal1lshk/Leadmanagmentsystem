"use client"
import {
  LayoutDashboard,
  Users,
  KanbanSquare,
  MessageCircle,
  BarChart3,
  Settings,
  TrendingUp,
  FileDown 
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { setAllLeads } from "@/app/redux/leads";



import Link from "next/link";
import { useEffect } from "react";
import axios from "axios";

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
    icon: FileDown,
    label: "Tasks",
    link: "/dashboard/task",
  },
  {
    icon: Settings,
    label: "Settings",
    link: "/dashboard/settings",
  },
  
];

export default function Sidebar() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const gettingdata = async () => {
      try {
        const response = await axios.get("/api/dashboardapi/Leads/AllLead");
        console.log(response.data, "response");
        dispatch(setAllLeads(response.data.data ?? []));
      } catch (err) {
        console.log(err?.message ?? err, "failed");
      }
    };

    gettingdata();
  }, [dispatch]);

  const data = useAppSelector((store) => store.LeadSlice.Lead);

  return (
    <aside className="w-56 min-h-screen bg-[#131826] border-r border-[#1F2635] p-3.5 flex flex-col gap-1">

      {/* Logo */}
      <div className="flex items-center gap-2 px-2 pb-5">
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
          <TrendingUp data={data} size={16} className="text-white" />
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