import { useAppSelector } from "@/app/redux/hooks";
import { StatCardData, Task, TaskDetail } from "./Types";

// ✅ Renamed with "use" prefix, must be called INSIDE a component
export const statCards = (): StatCardData[] => {
  const tasksRaw = useAppSelector((store) => store.tasksSlice);
  const tasks: Task[] = Array.isArray(tasksRaw) ? tasksRaw : [];

  const pending = tasks.filter((t) => t.status === "Pending").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const completed = tasks.filter((t) => t.status === "Completed").length;

  return [
    { kind: "total", label: "Total", value: String(tasks.length), changePct: "55%", changeDirection: "up" },
    { kind: "pending", label: "Pending", value: String(pending), changePct: "28%", changeDirection: "down" },
    { kind: "inProgress", label: "In Progress", value: String(inProgress), changePct: "18%", changeDirection: "up" },
    { kind: "completed", label: "Completed", value: String(completed), changePct: "55%", changeDirection: "up" },
  ];
};

// ✅ Also converted to a hook — this was your old static mock array,
// now redundant with Redux. Delete every import of the old `tasks` array.
export const tasks = (): Task[] => {
  const tasksRaw = useAppSelector((store) => store.tasksSlice);
  return Array.isArray(tasksRaw) ? tasksRaw : [];
};

export const taskDetail: TaskDetail = {
  id: "2",
  name: "Prepare onboarding docs",
  relatedLead: "Bantow/Busson",
  assignedTo: { name: "Aman Smith" },
  priority: "Medium",
  status: "In Progress",
  dueDate: "Jun 17, 2023",
  description:
    "Put together the onboarding checklist and account setup notes so the customer success team can hand this lead off cleanly.",
  relatedLeads: [{ name: "Barin Smith" }, { name: "Astar Nanter" }],
  activity: [
    { id: "a1", label: "Completed task attachments", timeAgo: "17 hours ago", icon: "check" },
    { id: "a2", label: "Assigned task to Aman Smith", timeAgo: "8 hours ago", icon: "assign" },
    { id: "a3", label: "Reached task comments", timeAgo: "7 hours ago", icon: "comment" },
  ],
};