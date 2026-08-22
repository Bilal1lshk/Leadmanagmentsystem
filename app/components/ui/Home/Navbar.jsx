"use client";

import { ChartLine } from "lucide-react";
import { useAppSelector } from "@/app/redux/hooks";
import axios from "axios";
import { useEffect, useState } from "react";
export default function Navbar() {
  const [user, setuser] = useState(false)
  const [activeOrganization, setactiveorganization] = useState(false)
  useEffect(() => {
    const getuser = async () => {
      const data = await axios.get("/api/auth/me")
      console.log(data)
      setuser(data.data.success)
    }
    const activeOrganization = async () => {
      const data = await axios.get(`/api/organization/my`)
      setactiveorganization(data.data.success)

      console.log(data)
      // setactiveorganization(data.data.success)
    }

    activeOrganization()
    getuser()

  }, [])
  console.log("organization", activeOrganization, "user", user)
  return (
    <nav className="flex items-center justify-between gap-4 rounded-xl bg-[#FFF3C8] px-5 py-3.5 flex-wrap">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#458393]">
          <ChartLine className="h-4.5 w-4.5 text-[#FFF3C8]" />
        </div>
        <span className="text-[17px] font-medium text-[#2A3F45]">Leadwise</span>
      </div>

      <div className="hidden items-center gap-7 md:flex">
        <a href="#features" className="text-sm text-[#5C6D71] hover:text-[#2A3F45]">
          Features
        </a>
        <a href="/pipeline" className="text-sm text-[#5C6D71] hover:text-[#2A3F45]">
          Pipeline
        </a>
        <a href="/Dashdetails" className="text-sm text-[#5C6D71] hover:text-[#2A3F45]">
          Reports
        </a>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {user ? (
          <a href={activeOrganization ? "/dashboard" : "/setupworkspace"} className="rounded-lg bg-[#34A99D] px-4 py-2 text-sm font-medium text-[#04342C] hover:bg-[#2F958A]">
            {activeOrganization ? "Open dashboard" : "Set up workspace"}
          </a>
        ) : (
          <>
            <a href="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-[#2A3F45] hover:bg-white/70">
              Log in
            </a>
            <a href="/signup" className="rounded-lg bg-[#34A99D] px-4 py-2 text-sm font-medium text-[#04342C] hover:bg-[#2F958A]">
              Get started
            </a>
          </>
        )}
      </div>
    </nav>
  );
}
