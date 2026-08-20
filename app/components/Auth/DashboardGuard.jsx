"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAppDispatch } from "@/app/redux/hooks";
import { setActiveOrganization, setOrganizations } from "@/app/redux/organization";

export default function DashboardGuard({ children }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function establishWorkspace() {
      try {
        const response = await fetch("/api/organization/my");
        const data = await response.json();
        if (!response.ok) return router.replace("/login");
        if (!data.organizations?.length) return router.replace("/");
        const savedId = localStorage.getItem("activeOrganizationId");
        const organization = data.organizations.find((org) => org._id === savedId) || data.organizations[0];
        localStorage.setItem("activeOrganizationId", organization._id);
        axios.defaults.headers.common["x-organization-id"] = organization._id;
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
