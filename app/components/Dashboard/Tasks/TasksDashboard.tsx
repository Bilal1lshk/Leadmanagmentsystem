"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "../Homepage/Sidebar";
import TopHeader from "../Homepage/Header";
import PageActions from "./Pageactions";
import StatsGrid from "./Statsgrid";
import FiltersBar from "./FilterBar";
import TasksTable from "./Tasktabel";
import Pagination from "./Pagination";
import TaskDetailPanel from "./Taskdetailpanel";
import { statCards, tasks as initialTasks, taskDetail } from "./Data";
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

export default function TasksDashboard() {
  const [tasks] = useState<Task[]>(initialTasks);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [headerSearch, setHeaderSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchTasks = async () => {
    const alltasks=await axios.get("/api/Task/AllTasks")
    dispatch(setTasks(alltasks.data.alltasks))
    }
    fetchTasks();
  }, []);
  const tasksselected = useAppSelector((store)=>store.tasksSlice);
  console.log(tasksselected)
  const filteredTasks = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    if (!query) return tasks;
    return tasks.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.relatedLead.toLowerCase().includes(query) ||
        t.assignedTo.name.toLowerCase().includes(query)
    );
  }, [tasks, filters.search]);

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
      <Sidebar activeItem="Tasks" />

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