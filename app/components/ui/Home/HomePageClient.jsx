"use client";

import { useEffect, useState } from "react";
import Homee from "@/app/components/ui/Home/Home.jsx";
import CreateOrganizationOnboarding from "@/app/components/ui/CreateOrganization/CreateOrganizationOnboarding";
import { useAppDispatch } from "@/app/redux/hooks";
import {
  setActiveOrganization,
  setOrganizations,
  setOrgLoading,
} from "@/app/redux/organization";

export default function HomePageClient() {
  const dispatch = useAppDispatch();
  const [view, setView] = useState("loading");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setView("marketing");
      return;
    }

    let cancelled = false;

    async function checkOrganizations() {
      dispatch(setOrgLoading(true));

      try {
        const response = await fetch("/api/organization/my");
        const data = await response.json();

        if (cancelled) return;

        if (!response.ok || !data.success) {
          setView("marketing");
          return;
        }

        const orgs = data.organizations || [];

        if (orgs.length > 0) {
          localStorage.setItem("activeOrganizationId", orgs[0]._id);
          dispatch(setOrganizations(orgs));
          dispatch(setActiveOrganization(orgs[0]));
          window.location.href = "/dashboard";
          return;
        }

        setView("onboarding");
      } catch {
        if (!cancelled) setView("marketing");
      } finally {
        if (!cancelled) dispatch(setOrgLoading(false));
      }
    }

    checkOrganizations();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  if (view === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF3C8]">
        <div className="text-sm font-medium text-[#458393]">Loading...</div>
      </div>
    );
  }

  if (view === "onboarding") {
    return <CreateOrganizationOnboarding />;
  }

  return <Homee />;
}
