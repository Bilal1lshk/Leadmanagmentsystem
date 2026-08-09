"use client";

import { useState, useEffect } from "react";
import { Calendar, FileText, X } from "lucide-react";
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { setAllLeads } from "@/app/redux/leads";
import axios from "axios";

interface Lead {
  _id?: string;
  id?: string;
  personId?: string;
  name?: string;
}
interface UserType {
  _id: string;
  name: string;
}
interface CreateTaskFormProps {
  leads?: Lead[];
  users?: UserType[];
  onClose?: () => void;
}
export default function CreateTaskForm({ onClose }: CreateTaskFormProps) {
  const leads = useAppSelector((store) => store.LeadSlice.Lead);
  const [users, setUsers] = useState<UserType[]>([]);
  const router = useRouter();
  const handleleaditchange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      leadId: e.target.value
    });
  }
  const handleClose = onClose ?? (() => router.push("/dashboard/task"));
  const [formData, setFormData] = useState({
    title: "",
    leadId: "",
    dueDate: "",
    assignedTo: "",
  });
  console.log(formData)
  const dispatch = useAppDispatch();
  useEffect(() => {
    const gettingdata = async () => {
      try {
        const response = await Promise.all([
          axios.get("/api/dashboardapi/Leads/AllLead"),
          axios.get("/api/User/AllUser")
        ]);
        dispatch(setAllLeads(response[0].data.data));
        setUsers(response[1].data.allusers);
      } catch (err) {
        console.log(err, "failed");
      }
    };

    gettingdata();
  }, [dispatch]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()
    if (
      !formData.title ||
      !formData.leadId ||
      !formData.dueDate
    ) {
      alert("Fill required fields");
      return;
    }
   const response = await axios.post("/api/Task/Createtask", formData)
   console.log(response)

   
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Create New Task</h2>
          <button onClick={handleClose}>
            <X />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>
              Task Title *
            </label>
            <div className="relative">
              <FileText
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Call client"
                className="w-full border rounded-lg p-3 pl-10"
              />
            </div>
          </div>
          <div>
            <label>
              Lead *
            </label>
            <select
              name="leadId"
              value={formData.leadId}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option value="">
                Select Lead
              </option>
              {leads?.map((lead) => (
                <option key={lead._id} value={lead._id}>
                  {lead?.personId || lead?.name || "Unnamed lead"}
                </option>
              ))}
            </select>
          </div>
          <div>

            <label>
              Due Date *
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 pl-10"
              />
            </div>
          </div>
          <div>
            <label>
              Assign User
            </label>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option value="">
                Unassigned
              </option>
              {
                users?.map((user) => (
                  <option
                    key={user._id}
                    value={user._id}
                  >
                    {user?.name}
                  </option>
                ))
              }
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            Create Task
          </button>
        </form>
      </div>
    </div>

  );
}