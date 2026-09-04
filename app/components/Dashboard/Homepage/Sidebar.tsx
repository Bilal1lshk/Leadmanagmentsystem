"use client";

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
import { AnimatePresence, motion } from "framer-motion";

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
  {
    icon: Home,
    label: "Return",
    link: "/",
  },
];

export default function Sidebar() {
  const dispatch = useAppDispatch();

  const activeOrganization = useAppSelector(
    (store) => store.organizationSlice.activeOrganization
  );

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const gettingData = async () => {
      try {
        const response = await axios.get(
          "/api/dashboardapi/Leads/AllLead"
        );

        dispatch(setAllLeads(response.data.data));
      } catch (err) {
        console.error(
          "Failed to fetch leads:",
          err instanceof Error ? err.message : String(err)
        );
      }
    };

    gettingData();
  }, [dispatch]);

  // Prevent background scrolling while mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      dispatch(clearAuth());

      delete axios.defaults.headers.common[
        "x-organization-id"
      ];

      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const filteredNavItems = navItems.filter(
    (item) =>
      !item.adminOnly ||
      activeOrganization?.role === "Admin"
  );

  return (
    <>
      {/* =====================================================
          MOBILE MENU BUTTON
      ===================================================== */}
      <div
        className="
          flex
          h-12
          w-full
          items-center
          px-3
          md:hidden
        "
      >
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            border-0
            bg-transparent
            p-0
            text-[#5C6D71]
            outline-none
            transition-transform
            duration-200
            hover:text-[#458393]
            active:scale-90
          "
        >
          <Menu
            size={22}
            strokeWidth={1.8}
          />
        </button>
      </div>

      {/* =====================================================
          MOBILE DRAWER + BACKDROP
      ===================================================== */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              onClick={() => setMobileOpen(false)}
              className="
                fixed
                inset-0
                z-[90]
                bg-black/30
                backdrop-blur-[1px]
                md:hidden
              "
            />

            {/* DRAWER */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "tween",
                duration: 0.25,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                fixed
                left-0
                top-0
                z-[100]
                flex
                h-screen
                w-[260px]
                max-w-[85vw]
                flex-col
                overflow-hidden
                border-r
                border-[#E5CB90]/60
                bg-white
                p-3.5
                shadow-[8px_0_30px_rgba(34,48,58,0.08)]
                md:hidden
              "
            >
              {/* DRAWER HEADER */}
              <div className="flex shrink-0 items-center justify-between px-2 pb-5">
                <Image
                  src="/favicon.ico"
                  alt="Leadwise"
                  width={32}
                  height={32}
                  priority
                />

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    border-0
                    bg-transparent
                    p-0
                    text-[#5C6D71]
                    outline-none
                    transition
                    duration-200
                    hover:bg-[#FFF3C8]/50
                    hover:text-[#458393]
                    active:scale-90
                  "
                >
                  <X size={19} strokeWidth={1.8} />
                </button>
              </div>

              {/* NAVIGATION */}
              <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
                <div className="flex flex-col gap-1">
                  {filteredNavItems.map(
                    ({ icon: Icon, label, link }) => (
                      <Link
                        key={label}
                        href={link}
                        onClick={() =>
                          setMobileOpen(false)
                        }
                        className="
                          block
                          w-full
                          min-w-0
                        "
                      >
                        <motion.div
                          whileTap={{ scale: 0.98 }}
                          className="
                            flex
                            w-full
                            min-w-0
                            items-center
                            gap-2.5
                            rounded-lg
                            px-3
                            py-2.5
                            text-sm
                            font-medium
                            text-[#5C6D71]
                            transition-colors
                            duration-150
                            hover:bg-[#FFF3C8]/40
                            hover:text-[#458393]
                          "
                        >
                          <Icon
                            size={17}
                            strokeWidth={1.8}
                            className="shrink-0"
                          />

                          <span className="min-w-0 truncate">
                            {label}
                          </span>
                        </motion.div>
                      </Link>
                    )
                  )}
                </div>
              </nav>

              {/* LOGOUT */}
              <button
                type="button"
                onClick={handleLogout}
                className="
                  mt-3
                  flex
                  w-full
                  shrink-0
                  items-center
                  gap-2.5
                  rounded-lg
                  px-3
                  py-2.5
                  text-left
                  text-sm
                  font-medium
                  text-[#5C6D71]
                  transition-colors
                  duration-150
                  hover:bg-[#FFF3C8]/40
                  hover:text-[#458393]
                "
              >
                Sign out
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* =====================================================
          DESKTOP SIDEBAR
      ===================================================== */}
      <aside
        className="
          hidden
          min-h-screen
          w-56
          shrink-0
          flex-col
          justify-start
          gap-1
          border-r
          border-[#E5CB90]/60
          bg-white
          p-3.5
          md:flex
        "
      >
        {/* LOGO */}
        <div className="flex shrink-0 items-center gap-2 px-2 pb-5">
          <Image
            src="/favicon.ico"
            alt="Leadwise"
            width={32}
            height={32}
            priority
          />
        </div>

        {/* NAVIGATION */}
        <nav className="flex min-h-0 flex-1 flex-col gap-1">
          {filteredNavItems.map(
            ({ icon: Icon, label, link }) => (
              <Link
                key={label}
                href={link}
                className="block w-full"
              >
                <div
                  className="
                    flex
                    w-full
                    items-center
                    gap-2.5
                    rounded-lg
                    px-3
                    py-2.5
                    text-sm
                    font-medium
                    text-[#5C6D71]
                    transition-colors
                    duration-150
                    hover:bg-[#FFF3C8]/40
                    hover:text-[#458393]
                  "
                >
                  <Icon
                    size={17}
                    strokeWidth={1.8}
                    className="shrink-0"
                  />

                  <span className="truncate">
                    {label}
                  </span>
                </div>
              </Link>
            )
          )}
        </nav>

        {/* LOGOUT */}
        <button
          type="button"
          onClick={handleLogout}
          className="
            mt-auto
            flex
            w-full
            shrink-0
            items-center
            gap-2.5
            rounded-lg
            px-3
            py-2.5
            text-left
            text-sm
            font-medium
            text-[#5C6D71]
            transition-colors
            duration-150
            hover:bg-[#FFF3C8]/40
            hover:text-[#458393]
          "
        >
          Sign out
        </button>
      </aside>
    </>
  );
}