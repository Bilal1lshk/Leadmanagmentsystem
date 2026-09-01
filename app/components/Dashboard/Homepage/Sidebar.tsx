"use client"
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  KanbanSquare,
  MessageCircle,
  BarChart3,
  Settings,
  FileDown 
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { setAllLeads } from "@/app/redux/leads";
import { clearAuth } from "@/app/redux/auth";



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
    link: "/dashboard/followups",
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
    adminOnly: true,
  },
  
];

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const activeOrganization = useAppSelector((store) => store.organizationSlice.activeOrganization);
  useEffect(() => {
    const gettingdata = async () => {
      try {
        const response = await axios.get("/api/dashboardapi/Leads/AllLead");
        dispatch(setAllLeads(response.data.data));
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
      }
    };

    gettingdata();
  }, [dispatch]);

  // data is read from redux but only used for the lead count badge — not passed to SVG icons
  useAppSelector((store) => store.LeadSlice.Lead);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    dispatch(clearAuth());
    delete axios.defaults.headers.common["x-organization-id"];
    window.location.href = "/login";
  };

  return (
    <aside className="w-56 min-h-screen mr-3 bg-white border-r border-[#E5CB90]/60 p-3.5 flex justify-start flex-col gap-1">

      {/* Logo */}
      <div className="flex items-center gap-2 px-2 pb-5">
        <Image src="/favicon.ico" alt="Leadwise" width={32} height={32} />
      </div>

      {/* Navigation */}
      {navItems.filter((item) => !item.adminOnly || activeOrganization?.role === "Admin").map(({ icon: Icon, label, link }) => (
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
              text-[#5C6D71]
              font-medium
              hover:bg-[#FFF3C8]/40
              hover:text-[#458393]
              transition-colors
            "
          >
            <Icon size={17} />
            {label}
          </div>
        </Link>
      ))}

      <button onClick={handleLogout} className="mt-auto flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-[#5C6D71] transition-colors hover:bg-[#FFF3C8]/40 hover:text-[#458393]">
        Sign out
      </button>

    </aside>
  );
}
