"use client";

import { useEffect, useState, type FormEvent } from "react";
import axios, { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/redux/hooks";
import Sidebar from "../../components/Dashboard/Homepage/Sidebar";

type OrganizationRole = "Admin" | "employee" | "viewer";

interface ActiveOrganization {
  _id: string;
  name: string;
  role: OrganizationRole;
}

interface Member {
  membershipId: string;
  name: string;
  email: string;
  organizationRole: OrganizationRole;
}

interface JoinRequestUser {
  name: string;
  email: string;
}

interface JoinRequest {
  _id: string;
  user: JoinRequestUser;
  message?: string;
}

interface NewMemberForm {
  name: string;
  email: string;
  password: string;
  role: "employee" | "viewer";
}

export default function SettingsPage() {
  const router = useRouter();
  const organization = useAppSelector(
    (state) => state.organizationSlice.activeOrganization
  ) as ActiveOrganization | null;

  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [newMember, setNewMember] = useState<NewMemberForm>({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });
  const [addingMember, setAddingMember] = useState<boolean>(false);
  const [loggingOut, setLoggingOut] = useState<boolean>(false);

  useEffect(() => {
    if (organization && organization.role !== "Admin") {
      router.replace("/dashboard");
    }
  }, [organization, router]);

  useEffect(() => {
    if (!organization || organization.role !== "Admin") return;

    async function loadRequests() {
          if (!organization) return; // <-- add this line
      try {
        const [requestsResponse, membersResponse] = await Promise.all([
          axios.get(`/api/organization/${organization._id}/join-requests`),
          axios.get("/api/User/AllUser"),
        ]);
        setRequests(requestsResponse.data.requests);
        setMembers(membersResponse.data.allusers);
      } catch (requestError) {
        if (isAxiosError(requestError)) {
          setError(
            requestError.response?.data?.message ||
              "Only workspace Admins can view join requests."
          );
        } else {
          setError("Only workspace Admins can view join requests.");
        }
      } finally {
        setLoading(false);
      }
    }
    loadRequests();
  }, [organization]);

  if (!organization || organization.role !== "Admin") {
    return <main className="min-h-screen bg-[#FFF3C8]" />;
  }

  async function reviewRequest(requestId: string, action: "approve" | "reject") {
    if (!organization) return;
    try {
      await axios.patch(
        `/api/organization/${organization._id}/join-requests/${requestId}`,
        { action }
      );
      setRequests((current) => current.filter((request) => request._id !== requestId));
    } catch (reviewError) {
      if (isAxiosError(reviewError)) {
        setError(reviewError.response?.data?.message || "Unable to review request.");
      } else {
        setError("Unable to review request.");
      }
    }
  }

  async function addMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!organization) return;
    setError("");
    setAddingMember(true);
    try {
      await axios.post("/api/organization/createuser", {
        ...newMember,
        organizationId: organization._id,
      });
      const response = await axios.get("/api/User/AllUser");
      setMembers(response.data.allusers);
      setNewMember({ name: "", email: "", password: "", role: "employee" });
    } catch (addError) {
      if (isAxiosError(addError)) {
        setError(addError.response?.data?.message || "Unable to add member.");
      } else {
        setError("Unable to add member.");
      }
    } finally {
      setAddingMember(false);
    }
  }

  async function updatePosition(memberId: string, role: string) {
    if (!organization) return;
    try {
      const response = await axios.patch(
        `/api/organization/${organization._id}/members/${memberId}`,
        { role }
      );
      setMembers((current) =>
        current.map((member) =>
          member.membershipId === memberId
            ? { ...member, organizationRole: response.data.member.organizationRole }
            : member
        )
      );
    } catch (updateError) {
      if (isAxiosError(updateError)) {
        setError(updateError.response?.data?.message || "Unable to update position.");
      } else {
        setError("Unable to update position.");
      }
    }
  }

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await axios.post("/api/auth/logout");
      router.push("/login");
    } catch (logoutError) {
      if (isAxiosError(logoutError)) {
        setError(logoutError.response?.data?.message || "Unable to logout.");
      } else {
        setError("Unable to logout.");
      }
      setLoggingOut(false);
    }
  }

  return (
    <main className="min-h-screen w-full bg-[#FFF3C8] flex flex-row  p-6 text-[#22303A]">
      <div className="mx-auto min-w-4xl rounded-2xl border border-[#E5CB90] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Workspace settings</h1>
        <p className="mt-1 text-sm text-[#5C6D71]">
          Review people who requested to join {organization?.name || "your workspace"}.
        </p>
        {error && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
        {loading ? (
          <p className="mt-6 text-sm text-[#5C6D71]">Loading workspace settings...</p>
        ) : (
          <>
            <section className="mt-6 border-b border-[#E5CB90]/70 pb-8">
              <h2 className="text-lg font-semibold">Team members</h2>
              <div className="mt-3 space-y-2">
                {members.map((member) => (
                  <div
                    key={member.membershipId}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[#FFF3C8]/40 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-[#5C6D71]">{member.email}</p>
                    </div>
                    {member.organizationRole === "Admin" ? (
                      <span className="text-sm font-medium text-[#458393]">Admin</span>
                    ) : (
                      <select
                        value={member.organizationRole}
                        onChange={(event) =>
                          updatePosition(member.membershipId, event.target.value)
                        }
                        className="rounded-md border border-[#E5CB90] bg-white px-2 py-1 text-sm"
                      >
                        <option value="employee">Employee</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    )}
                  </div>
                ))}
              </div>
              <form
                onSubmit={addMember}
                className="mt-5 grid gap-3 rounded-xl bg-[#FFF3C8]/40 p-4 md:grid-cols-2"
              >
                <h3 className="md:col-span-2 text-sm font-semibold">Add team member</h3>
                <input
                  required
                  value={newMember.name}
                  onChange={(event) =>
                    setNewMember({ ...newMember, name: event.target.value })
                  }
                  placeholder="Name"
                  className="rounded-lg border border-[#E5CB90] bg-white px-3 py-2 text-sm"
                />
                <input
                  required
                  type="email"
                  value={newMember.email}
                  onChange={(event) =>
                    setNewMember({ ...newMember, email: event.target.value })
                  }
                  placeholder="Email"
                  className="rounded-lg border border-[#E5CB90] bg-white px-3 py-2 text-sm"
                />
                <input
                  required
                  type="password"
                  minLength={6}
                  value={newMember.password}
                  onChange={(event) =>
                    setNewMember({ ...newMember, password: event.target.value })
                  }
                  placeholder="Temporary password"
                  className="rounded-lg border border-[#E5CB90] bg-white px-3 py-2 text-sm"
                />
                <select
                  value={newMember.role}
                  onChange={(event) =>
                    setNewMember({
                      ...newMember,
                      role: event.target.value as "employee" | "viewer",
                    })
                  }
                  className="rounded-lg border border-[#E5CB90] bg-white px-3 py-2 text-sm"
                >
                  <option value="employee">Employee</option>
                  <option value="viewer">Viewer</option>
                </select>
                <button
                  disabled={addingMember}
                  className="rounded-lg bg-[#34A99D] px-4 py-2 text-sm font-medium text-[#04342C] disabled:opacity-50 md:col-span-2"
                >
                  {addingMember ? "Adding..." : "Add member"}
                </button>
              </form>
            </section>
            <section className="mt-6 border-b border-[#E5CB90]/70 pb-8">
              <h2 className="text-lg font-semibold">Join requests</h2>
              <div className="mt-3 space-y-3">
                {requests.length === 0 ? (
                  <p className="rounded-lg bg-[#FFF3C8]/50 p-4 text-sm text-[#5C6D71]">
                    No pending join requests.
                  </p>
                ) : (
                  requests.map((request) => (
                    <div
                      key={request._id}
                      className="rounded-xl border border-[#E5CB90]/70 p-4"
                    >
                      <p className="font-medium">{request.user?.name}</p>
                      <p className="text-sm text-[#5C6D71]">{request.user?.email}</p>
                      {request.message && (
                        <p className="mt-3 rounded-md bg-[#FFF3C8]/50 p-3 text-sm">
                          {request.message}
                        </p>
                      )}
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => reviewRequest(request._id, "approve")}
                          className="rounded-lg bg-[#34A99D] px-4 py-2 text-sm font-medium text-[#04342C]"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => reviewRequest(request._id, "reject")}
                          className="rounded-lg border border-[#E5CB90] px-4 py-2 text-sm font-medium text-[#2A3F45]"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
            <section className="mt-6">
              <h2 className="text-lg font-semibold">Account</h2>
              <p className="mt-1 text-sm text-[#5C6D71]">
                Manage your account settings and logout.
              </p>
              <div className="mt-4">
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                >
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}