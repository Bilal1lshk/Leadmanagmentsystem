import { StatCardData, Task, TaskDetail } from "./types";

export const statCards: StatCardData[] = [
  { kind: "total", label: "Total", value: "4,022", changePct: "55%", changeDirection: "up" },
  { kind: "pending", label: "Pending", value: "365", changePct: "28%", changeDirection: "down" },
  { kind: "inProgress", label: "In Progress", value: "132", changePct: "18%", changeDirection: "up" },
  { kind: "completed", label: "Completed", value: "565", changePct: "55%", changeDirection: "up" },
];

export const tasks: Task[] = [
  {
    id: "1",
    name: "Follow up on proposal",
    relatedLead: "Janes Smith",
    assignedTo: { name: "Aamx Nanter" },
    priority: "High",
    status: "Pending",
    dueDate: "Jul 17, 2023",
  },
  {
    id: "2",
    name: "Prepare onboarding docs",
    relatedLead: "Bantow/Busson",
    assignedTo: { name: "Aman Smith" },
    priority: "Medium",
    status: "In Progress",
    dueDate: "Jul 17, 2023",
  },
  {
    id: "3",
    name: "Update contract details",
    relatedLead: "Mart Robin",
    assignedTo: { name: "Karin Smith" },
    priority: "Low",
    status: "Completed",
    dueDate: "Jul 17, 2023",
  },
  {
    id: "4",
    name: "Send invoice reminder",
    relatedLead: "John Hamim",
    assignedTo: { name: "Sam Rober" },
    priority: "Low",
    status: "Completed",
    dueDate: "Jul 17, 2023",
  },
  {
    id: "5",
    name: "Schedule demo call",
    relatedLead: "James Smith",
    assignedTo: { name: "Karly Smith" },
    priority: "Low",
    status: "Overdue",
    dueDate: "Jul 17, 2023",
  },
  {
    id: "6",
    name: "Review pricing tier",
    relatedLead: "Karen Smith",
    assignedTo: { name: "Aman Smith" },
    priority: "Medium",
    status: "Pending",
    dueDate: "Jul 17, 2023",
  },
  {
    id: "7",
    name: "Confirm renewal terms",
    relatedLead: "Walwon-Beris",
    assignedTo: { name: "Kahin Hanter" },
    priority: "Low",
    status: "In Progress",
    dueDate: "Jul 17, 2023",
  },
  {
    id: "8",
    name: "Draft follow-up email",
    relatedLead: "Reohen Jonson",
    assignedTo: { name: "Mary Smith" },
    priority: "Low",
    status: "Overdue",
    dueDate: "Jul 17, 2023",
  },
];

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