"use client";

import { useEffect, useMemo, useState } from "react";
import TopHeader from "../Homepage/Header";
import PageActions from "./Pageactions";
import StatsGrid from "./Statsgrid";
import FiltersBar from "./FilterBar";
import TasksTable from "./Tasktabel";
import Pagination from "./Pagination";
import TaskDetailPanel from "./Taskdetailpanel";
import { useStatCards, taskDetail } from "./Data";
import { FilterState, Task } from "./Types";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { setTasks } from "@/app/redux/tasks";

const emptyFilters: FilterState = {
  search: "",
  status: "",
  priority: "",
  assignedTo: "",
  lead: "",
  dueDate: "",
};

const PAGE_SIZE = 8;

/** Map a raw API task object to the shape our UI components expect. */
function mapApiTask(raw: any): Task {
  return {
    id: raw._id || raw.id || "",
    name: raw.title || raw.name || "Untitled Task",
    relatedLead:
      raw.leadId?.personId ||
      raw.leadId?.status ||
      raw.relatedLead ||
      "—",
    assignedTo: {
      name:
        (typeof raw.assignedTo === "object" && raw.assignedTo?.name) ||
        (typeof raw.assignedTo === "string" ? raw.assignedTo : "Unassigned"),
    },
    priority:
      raw.priority === "high"
        ? "High"
        : raw.priority === "low"
        ? "Low"
        : "Medium",
    status:
      raw.completed === "completed"
        ? "Completed"
        : raw.completed === "inprogress"
        ? "In Progress"
        : "Pending",
    dueDate: raw.dueDate
      ? new Date(raw.dueDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "—",
  };
}

export default function TasksDashboard() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [headerSearch, setHeaderSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const dispatch = useAppDispatch();
  const tasksRaw = useAppSelector((store) => store.tasksSlice);

  // Stat cards from the Redux store (hook, called inside component)
  const statCards = useStatCards();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("/api/Task/AllTasks");
        dispatch(setTasks(res.data.alltasks || []));
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    };
    fetchTasks();
  }, [dispatch]);

  // Map raw API data to the shape our UI expects
  const mappedTasks: Task[] = useMemo(
    () => (Array.isArray(tasksRaw) ? tasksRaw.map(mapApiTask) : []),
    [tasksRaw]
  );

  // Apply filters
  const filteredTasks = useMemo(() => {
    return mappedTasks.filter((task) => {
      if (
        filters.search &&
        !task.name.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      if (filters.status && task.status !== filters.status) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (
        filters.assignedTo &&
        !task.assignedTo.name
          .toLowerCase()
          .includes(filters.assignedTo.toLowerCase())
      )
        return false;
      if (
        filters.lead &&
        !task.relatedLead.toLowerCase().includes(filters.lead.toLowerCase())
      )
        return false;
      return true;
    });
  }, [mappedTasks, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / PAGE_SIZE));
  const pagedTasks = filteredTasks.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelectedIds((prev) => {
      const allSelected = pagedTasks.every((t) => prev.has(t.id));
      if (allSelected) return new Set();
      return new Set(pagedTasks.map((t) => t.id));
    });
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 text-slate-900">

      <div className="flex min-w-0 flex-1 flex-col">
        <TopHeader title="Tasks" searchValue={headerSearch} onSearchChange={setHeaderSearch} />

        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto pb-6">
            <PageActions />
            <StatsGrid stats={statCards} />

            <FiltersBar
              filters={filters}
              onFilterChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
              onReset={() => setFilters(emptyFilters)}
            />

            <div className="px-6 pt-4">
              <TasksTable
                tasks={pagedTasks}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
                onToggleSelectAll={toggleSelectAll}
                onView={setActiveTask}
              />
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </main>

          {activeTask && (
            <TaskDetailPanel
              task={{ ...taskDetail, ...activeTask }}
              onClose={() => setActiveTask(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}