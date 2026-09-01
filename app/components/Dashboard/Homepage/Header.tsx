"use client";

import { Search, Bell, ChevronDown, Settings } from "lucide-react";
import Link from "next/link";
import Notifications from "../../ui/Notification/Notification";
import { Dispatch, SetStateAction } from "react";

interface HeaderProps {
  name?: string;
  title?: string;
  searchValue?: string;
  onSearchChange?: Dispatch<SetStateAction<string>> | ((value: string) => void);
}

export default function Header({ name = "Bilal", title, searchValue, onSearchChange }: HeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[#22303A] m-0">
          {title || `Good morning, ${name} 👋`}
        </h1>
        <p className="mt-1 text-[#5C6D71] text-sm">
          Here's what's happening with your leads today.
        </p>
      </div>

      <div className="flex items-center gap-3.5">
        <div className="flex items-center gap-2 bg-white border border-[#E5CB90]/60 rounded-lg px-3.5 py-2 text-[#5C6D71] text-sm w-56">
          <Search size={15} />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchValue ?? ""}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full bg-transparent outline-none text-[#22303A] placeholder:text-[#5C6D71]"
          />
        </div>

        <div className="relative">
     <Notifications/>
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500" />
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            href="/dashboard/settings"
            aria-label="Open settings"
            className="w-8 h-8 rounded-full bg-[#458393] flex items-center justify-center text-[#FFF3C8] transition hover:opacity-90"
          >
            <Settings size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}