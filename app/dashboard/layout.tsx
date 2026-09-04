// app/dashboard/layout.tsx
import type { ReactNode } from "react";
import DashboardGuard from "@/app/components/Auth/DashboardGuard";
import Sidebar from "../components/Dashboard/Homepage/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardGuard>
      <div className="leadwise-dashboard flex h-screen min-h-0 overflow-hidden">
        <div className="sticky top-0 z-100 h-screen shrink-0">
          <Sidebar />
        </div>
        <main className="min-w-0 min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </DashboardGuard>
  );
}