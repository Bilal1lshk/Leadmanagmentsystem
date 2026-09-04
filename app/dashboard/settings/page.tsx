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
    <main className="min-h-screen w-full min-w-0 bg-[#FFF3C8] p-3 text-[#22303A] sm:p-4 md:p-5 lg:p-6">
      <div className="mx-auto w-full min-w-0 max-w-5xl rounded-xl border border-[#E5CB90] bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5 md:p-6">
        {/* HEADER */}
        <div className="min-w-0">
          <h1 className="text-xl font-semibold sm:text-2xl">
            Workspace settings
          </h1>

          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#5C6D71] sm:text-sm">
            Review people who requested to join{" "}
            <span className="font-medium text-[#22303A]">
              {organization?.name || "your workspace"}
            </span>
            .
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600 sm:mt-5 sm:text-sm">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <p className="mt-5 text-xs text-[#5C6D71] sm:mt-6 sm:text-sm">
            Loading workspace settings...
          </p>
        ) : (
          <>
            {/* ================= TEAM MEMBERS ================= */}
            <section className="mt-5 border-b border-[#E5CB90]/70 pb-6 sm:mt-6 sm:pb-8">
              <h2 className="text-base font-semibold sm:text-lg">
                Team members
              </h2>

              <div className="mt-3 space-y-2">
                {members.map((member) => (
                  <div
                    key={member.membershipId}
                    className="flex min-w-0 flex-col gap-3 rounded-lg bg-[#FFF3C8]/40 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    {/* MEMBER INFO */}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {member.name}
                      </p>

                      <p className="truncate text-xs text-[#5C6D71]">
                        {member.email}
                      </p>
                    </div>

                    {/* ROLE */}
                    {member.organizationRole === "Admin" ? (
                      <span className="w-fit shrink-0 text-xs font-medium text-[#458393] sm:text-sm">
                        Admin
                      </span>
                    ) : (
                      <select
                        value={member.organizationRole}
                        onChange={(event) =>
                          updatePosition(
                            member.membershipId,
                            event.target.value
                          )
                        }
                        className="w-full rounded-md border border-[#E5CB90] bg-white px-2.5 py-2 text-xs outline-none transition focus:border-[#458393] sm:w-auto sm:text-sm"
                      >
                        <option value="employee">Employee</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    )}
                  </div>
                ))}
              </div>

              {/* ADD MEMBER */}
              <form
                onSubmit={addMember}
                className="mt-5 grid grid-cols-1 gap-3 rounded-xl bg-[#FFF3C8]/40 p-3 sm:p-4 md:grid-cols-2"
              >
                <h3 className="text-sm font-semibold md:col-span-2">
                  Add team member
                </h3>

                <input
                  required
                  value={newMember.name}
                  onChange={(event) =>
                    setNewMember({
                      ...newMember,
                      name: event.target.value,
                    })
                  }
                  placeholder="Name"
                  className="h-10 w-full min-w-0 rounded-lg border border-[#E5CB90] bg-white px-3 text-xs outline-none transition focus:border-[#458393] sm:text-sm"
                />

                <input
                  required
                  type="email"
                  value={newMember.email}
                  onChange={(event) =>
                    setNewMember({
                      ...newMember,
                      email: event.target.value,
                    })
                  }
                  placeholder="Email"
                  className="h-10 w-full min-w-0 rounded-lg border border-[#E5CB90] bg-white px-3 text-xs outline-none transition focus:border-[#458393] sm:text-sm"
                />

                <input
                  required
                  type="password"
                  minLength={6}
                  value={newMember.password}
                  onChange={(event) =>
                    setNewMember({
                      ...newMember,
                      password: event.target.value,
                    })
                  }
                  placeholder="Temporary password"
                  className="h-10 w-full min-w-0 rounded-lg border border-[#E5CB90] bg-white px-3 text-xs outline-none transition focus:border-[#458393] sm:text-sm"
                />

                <select
                  value={newMember.role}
                  onChange={(event) =>
                    setNewMember({
                      ...newMember,
                      role: event.target.value as "employee" | "viewer",
                    })
                  }
                  className="h-10 w-full min-w-0 rounded-lg border border-[#E5CB90] bg-white px-3 text-xs outline-none transition focus:border-[#458393] sm:text-sm"
                >
                  <option value="employee">Employee</option>
                  <option value="viewer">Viewer</option>
                </select>

                <button
                  disabled={addingMember}
                  className="h-10 w-full rounded-lg bg-[#34A99D] px-4 text-xs font-medium text-[#04342C] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 md:col-span-2 sm:text-sm"
                >
                  {addingMember ? "Adding..." : "Add member"}
                </button>
              </form>
            </section>

            {/* ================= JOIN REQUESTS ================= */}
            <section className="mt-5 border-b border-[#E5CB90]/70 pb-6 sm:mt-6 sm:pb-8">
              <div>
                <h2 className="text-base font-semibold sm:text-lg">
                  Join requests
                </h2>

                <p className="mt-1 text-[11px] text-[#7A898D] sm:text-xs">
                  Review requests from people who want to join your workspace.
                </p>
              </div>

              <div className="mt-3 space-y-3">
                {requests.length === 0 ? (
                  <p className="rounded-lg bg-[#FFF3C8]/50 p-3 text-xs text-[#5C6D71] sm:p-4 sm:text-sm">
                    No pending join requests.
                  </p>
                ) : (
                  requests.map((request) => (
                    <div
                      key={request._id}
                      className="min-w-0 rounded-xl border border-[#E5CB90]/70 p-3 sm:p-4"
                    >
                      {/* USER */}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {request.user?.name}
                        </p>

                        <p className="truncate text-xs text-[#5C6D71] sm:text-sm">
                          {request.user?.email}
                        </p>
                      </div>

                      {/* MESSAGE */}
                      {request.message && (
                        <p className="mt-3 break-words rounded-md bg-[#FFF3C8]/50 p-3 text-xs leading-relaxed sm:text-sm">
                          {request.message}
                        </p>
                      )}

                      {/* ACTIONS */}
                      <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:flex">
                        <button
                          onClick={() =>
                            reviewRequest(request._id, "approve")
                          }
                          className="rounded-lg bg-[#34A99D] px-3 py-2 text-xs font-medium text-[#04342C] transition hover:opacity-90 sm:px-4 sm:text-sm"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            reviewRequest(request._id, "reject")
                          }
                          className="rounded-lg border border-[#E5CB90] px-3 py-2 text-xs font-medium text-[#2A3F45] transition hover:bg-[#FFF3C8]/40 sm:px-4 sm:text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* ================= ACCOUNT ================= */}
            <section className="mt-5 sm:mt-6">
              <h2 className="text-base font-semibold sm:text-lg">
                Account
              </h2>

              <p className="mt-1 text-xs leading-relaxed text-[#5C6D71] sm:text-sm">
                Manage your account settings and logout.
              </p>

              <div className="mt-4">
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full rounded-lg border border-red-300 bg-red-50 px-4 py-2.5 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:text-sm"
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