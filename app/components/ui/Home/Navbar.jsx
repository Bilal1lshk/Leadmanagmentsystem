import { ChartLine, Bell } from "lucide-react";
export default function Navbar() {
  return (
    <nav className="flex items-center justify-between gap-4 rounded-xl bg-brand-cream px-5 py-3.5 flex-wrap">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-teal">
          <ChartLine className="h-4.5 w-4.5 text-brand-cream" />
        </div>
        <span className="text-[17px] font-medium text-brand-navy">Leadwise</span>
      </div>

      {/* Nav links */}
      <div className="flex items-center gap-7">
        <a href="/dashboard" className="text-sm font-medium text-brand-navy">
          Dashboard
        </a>
        <a href="/leads" className="text-sm text-brand-gray hover:text-brand-navy">
          Leads
        </a>
        <a href="/pipeline" className="text-sm text-brand-gray hover:text-brand-navy">
          Pipeline
        </a>
        <a href="/reports" className="text-sm text-brand-gray hover:text-brand-navy">
          Reports
        </a>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button className="flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-brand-tan bg-white">
          <Bell className="h-4 w-4 text-brand-teal" />
        </button>

        <button className="rounded-lg bg-brand-teal px-4 py-2 text-sm font-medium text-white">
          New lead
        </button>

        <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-brand-teal text-sm font-medium text-brand-cream">
          BS
        </div>
      </div>
    </nav>
  );
}