import { Search, Bell, ChevronDown } from "lucide-react";
import Link from "next/link";
import Notifications from "../../ui/Notification/Notification";

export default function Header({ name = "Bilal" }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white m-0">
          Good morning, {name} 👋
        </h1>
        <p className="mt-1 text-brand-gray-light text-sm">
          Here's what's happening with your leads today.
        </p>
      </div>

      <div className="flex items-center gap-3.5">
        <div className="flex items-center gap-2 bg-brand-navy border border-brand-navy-border rounded-lg px-3.5 py-2 text-brand-gray-light text-sm w-56">
          <Search size={15} />
          Search leads...
        </div>

        <div className="relative">
     <Notifications/>
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500" />
        </div>

        <div className="flex items-center gap-1.5">
          <div className="w-8 h-8 rounded-full bg-brand-teal flex items-center justify-center text-[13px] font-bold text-white">
            B
          </div>
          <ChevronDown size={14} className="text-brand-gray-light" />
        </div>
      </div>
    </div>
  );
}