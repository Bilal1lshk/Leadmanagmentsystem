import Sidebar from "../components/Dashboard/Homepage/Sidebar";
import Header from "../components/Dashboard/Homepage/Header";
import StatCards from "../components/Dashboard/Homepage/Statcard";
import PipelineBoard from "../components/Dashboard/Homepage/PipelineBoard";
import QuickActions from "../components/Dashboard/Homepage/Quickactions";
import AIInsights from "../components/Dashboard/Homepage/Aiinshights";
import RecentLeadsTable from "../components/Dashboard/Homepage/Recentleadtable";
import LeadSourcesChart from "../components/Dashboard/Homepage/Leadsourcechart";
import FollowUps from "../components/Dashboard/Homepage/Followup";
import LeadsChart from "../components/Dashboard/Homepage/Leadchart";
import LeadPriority from "../components/Dashboard/Homepage/Leadpriority";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#0B0F17] text-[#F3F5F9] font-sans">
      <Sidebar />

      <main className="flex-1 p-6 flex flex-col gap-4">
        <Header />

        <StatCards />

        <div className="grid grid-cols-[2.4fr_1fr] gap-3.5">
          <PipelineBoard />
          <div className="flex flex-col gap-3.5">
            <AIInsights />
            <QuickActions />
          </div>
        </div>

        <div className="grid grid-cols-[2.4fr_1fr] gap-3.5">
          <RecentLeadsTable />
          <LeadSourcesChart />
        </div>

        <div className="grid grid-cols-[1fr_1.6fr_1fr] gap-3.5">
          <FollowUps />
          <LeadsChart />
          <LeadPriority />
        </div>
      </main>
    </div>
  );
}