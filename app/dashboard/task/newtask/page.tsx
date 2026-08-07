"use client";

import { useState } from "react";
import { Calendar, FileText, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
interface Lead {
  _id: string;
  name: string;
}
interface UserType {
  _id: string;
  name: string;
}
interface CreateTaskFormProps {
  leads: Lead[];
  users: UserType[];
  onClose?: () => void;
}
export default function CreateTaskForm({
  leads,
  users,
  onClose,
}: CreateTaskFormProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const handleClose = onClose ?? (() => router.push("/dashboard/task"));
  const [formData,setFormData] = useState({
    title:"",
    leadId:"",
    dueDate:"",
    assignedTo:"",
  });
  const handleChange = (
    e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:e.target.value
    });

  };
  const handleSubmit = async(
    e:React.FormEvent
  )=>{
    e.preventDefault()
    if(
      !formData.title ||
      !formData.leadId ||
      !formData.dueDate
    ){
      alert("Fill required fields");
      return;
    }
    const taskData = {
      title:formData.title,
      leadId:formData.leadId,
      dueDate:formData.dueDate,
      assignedTo:formData.assignedTo || undefined,
    };



    try{
      console.log("Creating Task:",taskData);

      setFormData({
        title:"",
        leadId:"",
        dueDate:"",
        assignedTo:"",
      });



      handleClose();



    }catch(error){

      console.log(error);

    }

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


          {
            leads?.map((lead)=>(
              <option
              key={lead._id}
              value={lead._id}
              >
                {lead.name}
              </option>
            ))
          }


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
            users?.map((user)=>(
              <option
              key={user._id}
              value={user._id}
              >
                {user.name}
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