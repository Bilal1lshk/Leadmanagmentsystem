"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAppDispatch } from "@/app/redux/hooks";
import {
  setActiveOrganization,
  setOrganizations,
} from "@/app/redux/organization";
import { setUser } from "@/app/redux/auth";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface SessionApiResponse {
  user?: SessionUser;
}

interface Organization {
  _id: string;
  name: string;
  companysize: string;
  plan: string;
  role?: string;
}

interface OrganizationApiResponse {
  success: boolean;
  organizations?: Organization[];
}

export default function DashboardGuard({
  children,
}: {
  children: React.ReactNode;
}) {
 

  return <>{children}</>;
}