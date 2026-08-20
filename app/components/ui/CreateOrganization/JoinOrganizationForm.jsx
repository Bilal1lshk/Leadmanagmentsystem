"use client";

import { useEffect, useState } from "react";

export default function JoinOrganizationForm() {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrganizations() {
      try {
        const response = await fetch("/api/organization/discover");
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load workspaces.");
        setOrganizations(data.organizations);
        setStatus("ready");
      } catch (loadError) {
        setError(loadError.message);
        setStatus("error");
      }
    }
    loadOrganizations();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (!selectedOrganization) return setError("Select a workspace before sending your request.");
    setStatus("submitting");
    try {
      const response = await fetch("/api/organization/join-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId: selectedOrganization, message }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Unable to send request.");
      setStatus("submitted");
    } catch (submitError) {
      setError(submitError.message);
      setStatus("ready");
    }
  }

  if (status === "submitted") return <div className="rounded-lg border border-[#E5CB90] bg-[#FFF3C8]/40 p-4 text-sm text-[#2A3F45]">Your request was sent. You can access the dashboard after an Admin approves it.</div>;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600">{error}</div>}
      <div><label className="mb-1.5 block text-xs font-medium text-[#2A3F45]">Select workspace</label><select value={selectedOrganization} onChange={(event) => setSelectedOrganization(event.target.value)} disabled={status !== "ready"} className="w-full rounded-lg border border-[#E5CB90] bg-[#FFF3C8]/30 px-4 py-2.5 text-sm text-[#2A3F45] outline-none focus:border-[#458393]"><option value="">{status === "loading" ? "Loading workspaces..." : "Choose a workspace"}</option>{organizations.map((organization) => <option key={organization._id} value={organization._id}>{organization.name} ({organization.companysize})</option>)}</select></div>
      <div><label className="mb-1.5 block text-xs font-medium text-[#2A3F45]">Message (optional)</label><textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={500} rows={3} disabled={status !== "ready"} placeholder="Tell the Admin why you want to join." className="w-full resize-none rounded-lg border border-[#E5CB90] bg-[#FFF3C8]/30 px-4 py-2.5 text-sm text-[#2A3F45] outline-none focus:border-[#458393]" /></div>
      <button type="submit" disabled={status !== "ready"} className="mt-2 rounded-lg bg-[#34A99D] py-2.5 text-sm font-medium text-[#04342C] hover:bg-[#2F958A] disabled:opacity-50">{status === "submitting" ? "Sending request..." : "Request to join"}</button>
    </form>
  );
}
