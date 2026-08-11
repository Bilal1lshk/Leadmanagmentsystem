import { useAppSelector } from "@/app/redux/hooks";
import { StatCardData, Task, TaskDetail } from "./Types";

export const statCards = (): StatCardData[] => {
  return useAppSelector((store) => store.tasksSlice);
};

  export const useTasks = (): Task[] => {
  return useAppSelector((store) => store.tasksSlice);
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