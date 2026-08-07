"use client";

import { Search, Calendar } from "lucide-react";
import FilterDropdown from "./Filterdropdown";
import { FilterState } from "./Types";

interface FiltersBarProps {
  filters: FilterState;
  onFilterChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
}

export default function FiltersBar({ filters, onFilterChange, onReset }: FiltersBarProps) {
  return (
    <div className="space-y-3 px-6 pt-6">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search tasks"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <FilterDropdown label={filters.status || "Status"} />
        <FilterDropdown label={filters.priority || "Priority"} />
        <FilterDropdown label={filters.assignedTo || "Assigned To"} />
        <FilterDropdown label={filters.lead || "Lead"} />
        <FilterDropdown label={filters.dueDate || "Due Date"} icon={Calendar} />

        <button
          type="button"
          onClick={onReset}
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50"
        >
          Reset Filters
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterDropdown label="Grouping Status" />
        <FilterDropdown label="Sort by Priority" />
        <FilterDropdown label="All Assignees" />
      </div>
    </div>
  );
}