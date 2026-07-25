import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatCards from "./components/StatCards";
import PipelineBoard from "./components/PipelineBoard";
import AIInsights from "./components/AIInsights";
import QuickActions from "./components/QuickActions";
import RecentLeadsTable from "./components/RecentLeadsTable";
import LeadSourcesChart from "./components/LeadSourcesChart";
import FollowUps from "./components/FollowUps";
import LeadsChart from "./components/LeadsChart";
import LeadPriority from "./components/LeadPriority";

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