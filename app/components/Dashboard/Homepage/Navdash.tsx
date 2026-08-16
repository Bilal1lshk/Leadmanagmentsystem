import { Search, Bell, ChevronDown } from "lucide-react";

export default function Header({ name = "Bilal" }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[#22303A] m-0">
          Good morning, {name} 👋
        </h1>
        <p className="mt-1 text-[#5C6D71] text-sm">
          Here's what's happening with your leads today.
        </p>
      </div>

      <div className="flex items-center gap-3.5">
        <div className="flex items-center gap-2 bg-white border border-[#E5CB90]/60 rounded-lg px-3.5 py-2 text-[#5C6D71] text-sm w-56">
          <Search size={15} />
          Search leads...
        </div>

        <div className="relative">
          <Bell size={19} className="text-[#5C6D71]" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500" />
        </div>

        <div className="flex items-center gap-1.5">
          <div className="w-8 h-8 rounded-full bg-[#458393] flex items-center justify-center text-[13px] font-bold text-[#FFF3C8]">
            B
          </div>
          <ChevronDown size={14} className="text-[#5C6D71]" />
        </div>
      </div>
    </div>
  );
}