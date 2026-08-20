"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAppDispatch } from "@/app/redux/hooks";
import { setActiveOrganization, setOrganizations } from "@/app/redux/organization";
import { setUser } from "@/app/redux/auth";

export default function DashboardGuard({ children }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function establishWorkspace() {
      try {
        const [sessionResponse, organizationsResponse] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/organization/my"),
        ]);
        if (!sessionResponse.ok || !organizationsResponse.ok) return router.replace("/login");
        const [session, data] = await Promise.all([sessionResponse.json(), organizationsResponse.json()]);
        if (!data.organizations?.length) return router.replace("/");
        const organization = data.organizations[0];
        axios.defaults.headers.common["x-organization-id"] = organization._id;
        dispatch(setUser(session.user));
        dispatch(setOrganizations(data.organizations));
        dispatch(setActiveOrganization(organization));
        setReady(true);
      } catch {
        router.replace("/login");
      }
    }
    establishWorkspace();
  }, [dispatch, router]);

  if (!ready) return <div className="flex min-h-screen items-center justify-center bg-[#FFF3C8] text-sm font-medium text-[#458393]">Loading workspace...</div>;
  return children;
}
