import Sidebar from "../components/Dashboard/Sidebar.jsx";
import Header from "../components/Dashboard/Header.jsx";
import StatCards from "../components/Dashboard/Statcard.jsx";
import PipelineBoard from "../components/Dashboard/PipelineBoard.jsx";
import QuickActions from "../components/Dashboard/QuickActions.jsx";
import AIInsights from "../components/Dashboard/Aiinshights.jsx";
import RecentLeadsTable from "../components/Dashboard/RecentLeadsTable.jsx";
import LeadSourcesChart from "../components/Dashboard/LeadSourcesChart.jsx";
import FollowUps from "./components/FollowUps";
import LeadsChart from "./components/LeadsChart";
import LeadPriority from "../components/Dashboard/Leadpriority.jsx";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#0B0F17] text-[#F3F5F9] font-sans">
      <Sidebar />

      <main className="flex-1 p-6 flex flex-col gap-4">
        <Headers />

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