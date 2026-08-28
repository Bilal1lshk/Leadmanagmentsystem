"use client";

import { Search } from "lucide-react";
import FilterDropdown from "./Filterdropdown";
import { FilterState, Task } from "./Types";

interface FiltersBarProps {
  filters: FilterState;
  onFilterChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
  tasks: Task[];
}

export default function FiltersBar({
  filters,
  onFilterChange,
  onReset,
  tasks = [],
}: FiltersBarProps) {
  
  // Dynamically extract unique values from the real data
  const statusOptions = Array.from(new Set(tasks.map(t => t.status).filter(Boolean)));
  const priorityOptions = Array.from(new Set(tasks.map(t => t.priority).filter(Boolean)));
  const assigneesOptions = Array.from(new Set(tasks.map(t => t.assignedTo?.name).filter(Boolean)));
  const leadsOptions = Array.from(new Set(tasks.map(t => t.relatedLead).filter(Boolean)));

  const handleStatusChange = (value: string) => {
    onFilterChange({ status: value });
  };
  const handlePriorityChange = (value: string) => {
    onFilterChange({ priority: value });
  };
  const handleAssignedToChange = (value: string) => {
    onFilterChange({ assignedTo: value });
  };
  const handleLeadChange = (value: string) => {
    onFilterChange({ lead: value });
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
            onChange={(e) => onFilterChange({ search: e.target.value })}
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
          options={priorityOptions}
          label={filters.priority || "Priority"}
          onChange={handlePriorityChange}
        />

        {/* Assigned To */}
        <FilterDropdown
          options={assigneesOptions}
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
          label={filters.status ? `Status: ${filters.status}` : "Grouping Status"}
          options={statusOptions}
          onChange={handleStatusChange}
        />

        <FilterDropdown
          label={filters.priority ? `Priority: ${filters.priority}` : "Sort by Priority"}
          options={priorityOptions}
          onChange={handlePriorityChange}
        />
        
        <FilterDropdown
          label={filters.lead || "Related Lead"}
          options={leadsOptions}
          onChange={handleLeadChange}
        />
      </div>
    </div>
  );
}