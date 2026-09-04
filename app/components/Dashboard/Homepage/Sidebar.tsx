"use client"
import Image from "next/image";
import {
  Home,
  LayoutDashboard,
  Users,
  KanbanSquare,
  MessageCircle,
  BarChart3,
  Settings,
  FileDown,
  Menu,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { setAllLeads } from "@/app/redux/leads";
import { clearAuth } from "@/app/redux/auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", link: "/dashboard" },
  { icon: Users, label: "Leads", link: "/dashboard/leads" },
  { icon: KanbanSquare, label: "Pipeline", link: "/dashboard/pipeline" },
  { icon: MessageCircle, label: "Follow-ups", link: "/dashboard/followups" },
  { icon: BarChart3, label: "Analytics", link: "/dashboard/analytics" },
  { icon: FileDown, label: "Tasks", link: "/dashboard/task" },
  { icon: Settings, label: "Settings", link: "/dashboard/settings", adminOnly: true },
  { icon: Home, label: "Return", link: "/" },
];

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const activeOrganization = useAppSelector((store) => store.organizationSlice.activeOrganization);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useAppSelector((store) => store.LeadSlice.Lead);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    dispatch(clearAuth());
    delete axios.defaults.headers.common["x-organization-id"];
    window.location.href = "/login";
  };

  const filteredNavItems = navItems.filter(
    (item) => !item.adminOnly || activeOrganization?.role === "Admin"
  );

  return (
    <>
      {/* Mobile top bar — only rendered below md, takes normal space in flow */}
      <div className="flex md:hidden items-center bg-white border-b border-[#E5CB90]/60 px-2 py-3">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#5C6D71] hover:bg-[#FFF3C8]/50"
        >
          <Menu size={20} />
        </button>
      </div>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-[90] bg-black/40 md:hidden"
        />
      )}

      {/* Mobile drawer — fixed positioning = takes ZERO space in layout flow */}
      <aside
        className={`
          fixed md:hidden top-0 left-0 z-50
          h-screen overflow-hidden bg-white
          flex flex-col justify-start gap-1
          transition-[width,padding,border-color] duration-300 ease-out
          ${mobileOpen
            ? "w-64 border-r border-[#E5CB90]/60 p-3.5"
            : "pointer-events-none w-0 border-r-0 p-0"}
        `}
      >
        <div className="flex items-center justify-between px-2 pb-5">
          <Image src="/favicon.ico" alt="Leadwise" width={32} height={32} />
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5C6D71] hover:bg-[#FFF3C8]/50"
          >
            <X size={18} />
          </button>
        </div>

        {filteredNavItems.map(({ icon: Icon, label, link }) => (
          <Link key={label} href={link} className="block" onClick={() => setMobileOpen(false)}>
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-[#5C6D71] font-medium hover:bg-[#FFF3C8]/40 hover:text-[#458393] transition-colors">
              <Icon size={17} />
              {label}
            </div>
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-[#5C6D71] transition-colors hover:bg-[#FFF3C8]/40 hover:text-[#458393]"
        >
          Sign out
        </button>
      </aside>

      {/* Desktop sidebar — normal flex layout, unchanged from before */}
      <aside className="hidden md:flex w-56 min-h-screen bg-white border-r border-[#E5CB90]/60 p-3.5 flex-col justify-start gap-1">
        <div className="flex items-center gap-2 px-2 pb-5">
          <Image src="/favicon.ico" alt="Leadwise" width={32} height={32} />
        </div>

        {filteredNavItems.map(({ icon: Icon, label, link }) => (
          <Link key={label} href={link} className="block">
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-[#5C6D71] font-medium hover:bg-[#FFF3C8]/40 hover:text-[#458393] transition-colors">
              <Icon size={17} />
              {label}
            </div>
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-[#5C6D71] transition-colors hover:bg-[#FFF3C8]/40 hover:text-[#458393]"
        >
          Sign out
        </button>
      </aside>
    </>
  );
}