"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, FileText, Loader2, MessageSquare, UserCheck, X } from "lucide-react";
import axios from "axios";

interface Lead {
  _id: string;
  name?: string;
  company?: string;
  personId?: string;
}

interface User {
  _id: string;
  name: string;
  email?: string;
}

export default function EditFollowupPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    lead: "",
    comments: "",
    duedate: "",
    assignedTo: "",
    status: "pending",
  });

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [followupRes, leadsRes, usersRes] = await Promise.all([
          axios.get(`/api/followups/Singlefollowup?id=${id}`),
          axios.get("/api/dashboardapi/Leads/AllLead"),
          axios.get("/api/User/AllUser"),
        ]);

        if (leadsRes.data?.data) {
          setLeads(leadsRes.data.data);
        }
        if (usersRes.data?.allusers) {
          setUsers(usersRes.data.allusers);
        }

        const followup = followupRes.data?.singlefollowup;
        if (followup) {
          // Format date for datetime-local input
          let formattedDate = "";
          if (followup.duedate) {
            const dateObj = new Date(followup.duedate);
            formattedDate = dateObj.toISOString().slice(0, 16);
          }

          const leadId =
            typeof followup.lead === "object" && followup.lead !== null
              ? followup.lead._id
              : followup.lead || "";

          const assignedToId =
            typeof followup.assignedTo === "object" &&
            followup.assignedTo !== null
              ? followup.assignedTo._id
              : followup.assignedTo || "";

          setFormData({
            lead: leadId,
            comments: followup.comments || "",
            duedate: formattedDate,
            assignedTo: assignedToId,
            status: followup.status || "pending",
          });
        }
      } catch (err: any) {
        console.error("Failed to load edit form data:", err);
        setError(
          err.response?.data?.message || err.message || "Failed to load follow-up details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
    try {
      setSaving(true);
      setError(null);

      const response = await axios.patch("/api/followups/UpdateStatus", {
        id,
        ...formData,
      });

      if (response.data?.success) {
        router.push("/dashboard/followups");
      } else {
        throw new Error(response.data?.message || "Failed to save follow-up");
      }
    } catch (err: any) {
      console.error("Failed to save follow-up:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to update follow-up"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF3C8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={24} className="text-[#458393] animate-spin" />
          <p className="text-sm text-[#5C6D71]">Loading follow-up details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF3C8] p-4 sm:p-6">
      <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl border border-[#E5CB90]/60">
        {/* Form Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#E5CB90]/40">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/dashboard/followups")}
              className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100"
            >
              <ArrowLeft size={16} />
            </button>
            <h2 className="text-xl font-serif font-medium text-[#22303A]">
              Edit Follow-up
            </h2>
          </div>
          <button
            type="button"
            onClick={() => router.push("/dashboard/followups")}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Lead */}
          <div>
            <label className="block text-xs font-semibold text-[#5C6D71] uppercase tracking-wider mb-1.5">
              Lead *
            </label>
            <select
              name="lead"
              value={formData.lead}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-3 text-sm text-[#22303A] outline-none focus:border-[#458393]"
            >
              <option value="">Select a lead</option>
              {leads?.map((lead) => (
                <option key={lead._id} value={lead._id}>
                  {lead.company || lead.name || lead.personId || "Unnamed lead"}
                </option>
              ))}
            </select>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-xs font-semibold text-[#5C6D71] uppercase tracking-wider mb-1.5">
              Details & Comments *
            </label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              placeholder="Enter follow-up details..."
              rows={4}
              required
              className="w-full border border-gray-300 rounded-lg p-3 text-sm text-[#22303A] outline-none focus:border-[#458393] resize-none"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs font-semibold text-[#5C6D71] uppercase tracking-wider mb-1.5">
              Due Date *
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-3 top-3.5 text-gray-400"
                size={16}
              />
              <input
                type="datetime-local"
                name="duedate"
                value={formData.duedate}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-3 pl-10 text-sm text-[#22303A] outline-none focus:border-[#458393]"
              />
            </div>
          </div>

          {/* Assigned To */}
          <div>
            <label className="block text-xs font-semibold text-[#5C6D71] uppercase tracking-wider mb-1.5">
              Assigned User *
            </label>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-3 text-sm text-[#22303A] outline-none focus:border-[#458393]"
            >
              <option value="">Select user</option>
              {users?.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-[#5C6D71] uppercase tracking-wider mb-1.5">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm text-[#22303A] outline-none focus:border-[#458393]"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="missed">Missed</option>
              <option value="rescheduled">Rescheduled</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push("/dashboard/followups")}
              className="w-1/2 py-3 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="w-1/2 bg-[#458393] hover:bg-[#3A7180] text-white py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
