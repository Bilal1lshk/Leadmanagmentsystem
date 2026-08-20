import DashboardGuard from "@/app/components/Auth/DashboardGuard";

export default function DashboardLayout({ children }) {
  return <DashboardGuard>{children}</DashboardGuard>;
}
