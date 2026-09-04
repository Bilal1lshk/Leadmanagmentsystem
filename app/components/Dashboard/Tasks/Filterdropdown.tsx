"use client";

import { ChevronDown, LucideIcon } from "lucide-react";
import { useState } from "react";

interface FilterDropdownProps {
  label: string;
  icon?: LucideIcon;
  options: string[];
  onChange: (value: string) => void;
}

export default function FilterDropdown({
  label,
  icon: Icon,
  options,
  onChange,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
      >
        {Icon && <Icon className="h-4 w-4 text-slate-400" />}

        {label}

        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 min-w-[160px] rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
          {options?.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              className="block w-full rounded-md px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}