// app/dashboard/layout.tsx
import DashboardGuard from "@/app/components/Auth/DashboardGuard";
import Sidebar from "../components/Dashboard/Homepage/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <DashboardGuard>
      <div className="leadwise-dashboard flex min-h-screen">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </DashboardGuard>
  );
}