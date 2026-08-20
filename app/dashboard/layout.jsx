import DashboardGuard from "@/app/components/Auth/DashboardGuard";

export default function DashboardLayout({ children }) {
  return <DashboardGuard><div className="leadwise-dashboard">{children}</div></DashboardGuard>;
}
