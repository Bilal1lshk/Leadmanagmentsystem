"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAppSelector } from "@/app/redux/hooks";

export default function SettingsPage() {
  const organization = useAppSelector((state) => state.organizationSlice.activeOrganization);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!organization) return;
    async function loadRequests() {
      try {
        const response = await axios.get(`/api/organization/${organization._id}/join-requests`);
        setRequests(response.data.requests);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Only workspace Admins can view join requests.");
      } finally {
        setLoading(false);
      }
    }
    loadRequests();
  }, [organization]);

  async function reviewRequest(requestId, action) {
    try {
      await axios.patch(`/api/organization/${organization._id}/join-requests/${requestId}`, { action });
      setRequests((current) => current.filter((request) => request._id !== requestId));
    } catch (reviewError) {
      setError(reviewError.response?.data?.message || "Unable to review request.");
    }
  }

  return (
    <main className="min-h-screen bg-[#FFF3C8] p-6 text-[#22303A]">
      <div className="mx-auto max-w-3xl rounded-2xl border border-[#E5CB90] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Workspace settings</h1>
        <p className="mt-1 text-sm text-[#5C6D71]">Review people who requested to join {organization?.name || "your workspace"}.</p>
        {error && <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
        {loading ? <p className="mt-6 text-sm text-[#5C6D71]">Loading requests...</p> : <div className="mt-6 space-y-3">
          {requests.length === 0 ? <p className="rounded-lg bg-[#FFF3C8]/50 p-4 text-sm text-[#5C6D71]">No pending join requests.</p> : requests.map((request) => <div key={request._id} className="rounded-xl border border-[#E5CB90]/70 p-4"><p className="font-medium">{request.user?.name}</p><p className="text-sm text-[#5C6D71]">{request.user?.email}</p>{request.message && <p className="mt-3 rounded-md bg-[#FFF3C8]/50 p-3 text-sm">{request.message}</p>}<div className="mt-4 flex gap-2"><button onClick={() => reviewRequest(request._id, "approve")} className="rounded-lg bg-[#34A99D] px-4 py-2 text-sm font-medium text-[#04342C]">Approve</button><button onClick={() => reviewRequest(request._id, "reject")} className="rounded-lg border border-[#E5CB90] px-4 py-2 text-sm font-medium text-[#2A3F45]">Reject</button></div></div>)}
        </div>}
      </div>
    </main>
  );
}
