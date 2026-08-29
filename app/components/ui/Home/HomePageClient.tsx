"use client";

import { useEffect, useState } from "react";
import Homee from "@/app/components/ui/Home/Home.tsx";
import CreateOrganizationOnboarding from "@/app/components/ui/CreateOrganization/CreateOrganizationOnboarding";
import { useAppDispatch } from "@/app/redux/hooks";
import {
  setActiveOrganization,
  setOrganizations,
  setOrgLoading,
} from "@/app/redux/organization";
import { setUser } from "@/app/redux/auth";

export default function HomePageClient() {
  const dispatch = useAppDispatch();
  const [view, setView] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    async function checkOrganizations() {
      dispatch(setOrgLoading(true));

      try {
        const [sessionResponse, response] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/organization/my"),
        ]);
        const [session, data] = await Promise.all([sessionResponse.json(), response.json()]);

        if (cancelled) return;

        if (!sessionResponse.ok || !response.ok || !data.success) {
          setView("marketing");
          return;
        }

        dispatch(setUser(session.user));

        const orgs = data.organizations || [];

        if (orgs.length > 0) {
          dispatch(setOrganizations(orgs));
          dispatch(setActiveOrganization(orgs[0]));
          setView("marketing");
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
