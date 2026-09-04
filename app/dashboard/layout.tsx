// app/dashboard/layout.tsx
import type { ReactNode } from "react";
import DashboardGuard from "@/app/components/Auth/DashboardGuard";
import Sidebar from "../components/Dashboard/Homepage/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardGuard>
      <div className="leadwise-dashboard flex min-h-screen">
        <div className="sticky top-0 h-screen z-[100]">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </DashboardGuard>
  );
}