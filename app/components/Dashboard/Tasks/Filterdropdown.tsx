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
      className="flex items-center gap-2 rounded-lg border border-brand-line bg-white px-3 py-2 text-sm font-medium text-brand-gray hover:bg-brand-cream/40"
    >
      {Icon && <Icon className="h-4 w-4 text-brand-gray" />}
      {label}
      <ChevronDown className="h-4 w-4 text-brand-gray" />
    </button>
  );
}