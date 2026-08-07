"use client";

import { ChevronDown, LucideIcon } from "lucide-react";

interface FilterDropdownProps {
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
}

export default function FilterDropdown({ label, icon: Icon, onClick }: FilterDropdownProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
    >
      {Icon && <Icon className="h-4 w-4 text-slate-400" />}
      {label}
      <ChevronDown className="h-4 w-4 text-slate-400" />
    </button>
  );
}