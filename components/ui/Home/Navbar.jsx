import { ChartLine, Bell } from "lucide-react";
export default function Navbar() {
  return (
    <nav className="flex items-center justify-between gap-4 rounded-xl bg-[#FFF3C8] px-5 py-3.5 flex-wrap">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#458393]">
          <ChartLine className="h-4.5 w-4.5 text-[#FFF3C8]" />
        </div>
        <span className="text-[17px] font-medium text-[#2A3F45]">Leadwise</span>
      </div>

      {/* Nav links */}
      <div className="flex items-center gap-7">
        <a href="/dashboard" className="text-sm font-medium text-[#2A3F45]">
          Dashboard
        </a>
        <a href="/leads" className="text-sm text-[#5C6D71] hover:text-[#2A3F45]">
          Leads
        </a>
        <a href="/pipeline" className="text-sm text-[#5C6D71] hover:text-[#2A3F45]">
          Pipeline
        </a>
        <a href="/reports" className="text-sm text-[#5C6D71] hover:text-[#2A3F45]">
          Reports
        </a>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button className="flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-[#E5CB90] bg-white">
          <Bell className="h-4 w-4 text-[#458393]" />
        </button>

        <button className="rounded-lg bg-[#34A99D] px-4 py-2 text-sm font-medium text-[#04342C]">
          New lead
        </button>

        <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#458393] text-sm font-medium text-[#FFF3C8]">
          BS
        </div>
      </div>
    </nav>
  );
}