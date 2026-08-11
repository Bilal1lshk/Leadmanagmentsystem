import { useMemo } from "react";
import { useAppSelector } from "@/app/redux/hooks";
import { StatCardData, TaskDetail } from "./Types";

/**
 * Hook that computes stat-card data from the Redux tasks slice.
 * Must be called inside a React component.
 */
export function useStatCards(): StatCardData[] {
  const tasksRaw = useAppSelector((store) => store.tasksSlice);
  const tasks = Array.isArray(tasksRaw) ? tasksRaw : [];

  return useMemo(() => {
    const pending = tasks.filter((t: any) => t.completed === "notstarted").length;
    const inProgress = tasks.filter((t: any) => t.completed === "inprogress").length;
    const completed = tasks.filter((t: any) => t.completed === "completed").length;

    return [
      { kind: "total" as const, label: "Total", value: String(tasks.length), changePct: "55%", changeDirection: "up" as const },
      { kind: "pending" as const, label: "Pending", value: String(pending), changePct: "28%", changeDirection: "down" as const },
      { kind: "inProgress" as const, label: "In Progress", value: String(inProgress), changePct: "18%", changeDirection: "up" as const },
      { kind: "completed" as const, label: "Completed", value: String(completed), changePct: "55%", changeDirection: "up" as const },
    ];
  }, [tasks]);
}

export const taskDetail: TaskDetail = {
  id: "",
  name: "",
  relatedLead: "",
  assignedTo: { name: "" },
  priority: "Medium",
  status: "Pending",
  dueDate: "",
  description: "",
  relatedLeads: [],
  activity: [],
};