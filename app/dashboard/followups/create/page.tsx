"use client";

import { useAppSelector } from "@/app/redux/hooks";
import axios from "axios";
import { useEffect, useState } from "react";

interface Lead {
  _id: string;
  name: string;
}

interface User {
  _id: string;
  name: string;
}

interface CreateFollowupFormProps {
  users: User[];
  onSubmit: (data: {
    lead: string;
    comments: string;
    duedate: string;
    assignedTo: string;
    status: string;
  }) => void;
}

export default function CreateFollowupForm() {
  interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
  const [users,setusers]=useState<User[]>([])
  const leads=useAppSelector((store)=>store.LeadSlice.Lead)
  console.log(leads)
  useEffect(() => {
    const gettingdata = async () => {
      const data= await axios.get("/api/User/AllUser")
      setusers(data?.data?.allusers)
    }
    gettingdata()

  }, [])
  const [formData, setFormData] = useState({
    lead: "",
    comments: "",
    duedate: "",
    assignedTo: "",
    status: "pending",
  });
console.log(formData)
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data=await axios.post(`/api/followups/Create`,formData);
    console.log(data)
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl bg-white p-6 shadow-sm"
    >
      {/* Lead */}
      <div>
        <label
          htmlFor="lead"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Lead
        </label>

        <select
          id="lead"
          name="lead"
          value={formData.lead}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-black"
        >
          <option value="">Select a lead</option>

          {leads?.map((lead) => (
            <option key={lead?._id} value={lead?._id}>
              {lead?.personId}
            </option>
          ))}
        </select>
      </div>

      {/* Comments */}
      <div>
        <label
          htmlFor="comments"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Comments
        </label>

        <textarea
          id="comments"
          name="comments"
          value={formData.comments}
          onChange={handleChange}
          placeholder="Enter follow-up details..."
          rows={4}
          required
          className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-black"
        />
      </div>

      {/* Due Date */}
      <div>
        <label
          htmlFor="duedate"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Due Date
        </label>

        <input
          type="datetime-local"
          id="duedate"
          name="duedate"
          value={formData.duedate}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-black"
        />
      </div>

      {/* Assigned To */}
      <div>
        <label
          htmlFor="assignedTo"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Assigned To
        </label>

        <select
          id="assignedTo"
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-black"
        >
          <option value="">Select user</option>

          {users?.map((user) => (
            <option key={user?._id} value={user?._id}>
              {user?.name}
            </option>
          ))}
        </select>
      </div>

      {/* Status */}
      <div>
        <label
          htmlFor="status"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Status
        </label>

        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-black"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full rounded-lg bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
      >
        Create Follow-up
      </button>
    </form>
  );
}