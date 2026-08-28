"use client";

import { Search } from "lucide-react";
import FilterDropdown from "./Filterdropdown";
import { FilterState } from "./Types";
import { useAppSelector } from "@/app/redux/hooks";

interface FiltersBarProps {
  filters: FilterState;
  onFilterChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
}

const statusOptions = [
  "notstarted",
  "inprogress",
  "completed",
  "Overdue",
  "Cancelled",
];

export default function FiltersBar({
  filters,
  onFilterChange,
  onReset,
}: FiltersBarProps) {

  const data = useAppSelector((store) => store.tasksSlice);

  const mapped =
    data
      ?.map((task) => task.leadId?.personId?.name)
      .filter(Boolean) || [];

  const handleStatusChange = (value: string) => {
    onFilterChange({ status: value });
  };
  const handlePriorityChange = (value: string) => {
    onFilterChange({ priority: value });
  };
  const handleAssignedToChange = (value: string) => {
    onFilterChange({ assignedTo: value });
  };
  return (
    <div className="space-y-3 px-6 pt-6">

      <div className="flex flex-wrap items-center gap-2">

        {/* Search */}
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={filters.search}
            onChange={(e) =>
              onFilterChange({ search: e.target.value })
            }
            placeholder="Search tasks"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Status */}
        <FilterDropdown
          options={statusOptions}
          label={filters.status || "Status"}
          onChange={handleStatusChange}
        />

        {/* Priority */}
        <FilterDropdown
          options={["low", "medium", "high"]}
          label={filters.priority || "Priority"}
          onChange={handlePriorityChange}
        />

        {/* Assigned To */}
        <FilterDropdown
          options={mapped}
          label={filters.assignedTo || "Assigned To"}
          onChange={handleAssignedToChange}
        />

        {/* Reset */}
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50"
        >
          Reset Filters
        </button>

      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterDropdown
          label="Grouping Status"
          options={[]}
          onChange={() => {}}
        />

        <FilterDropdown
          label="Sort by Priority"
          options={[]}
          onChange={() => {}}
        />

        <FilterDropdown
          label="All Assignees"
          options={mapped}
          onChange={handleAssignedToChange}
        />
      </div>

    </div>
  );
}