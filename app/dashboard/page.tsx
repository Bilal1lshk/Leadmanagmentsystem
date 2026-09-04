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
import ChatbotWidget from "../components/ui/ChatbotWidget";

export default function Dashboard() {
  return (
    <div className="flex min-h-full w-full bg-[#FFF3C8] font-sans text-[#22303A]">
      <main className="flex min-h-full min-w-0 flex-1 flex-col gap-4 p-4 sm:p-5 lg:p-6">
        <Header />

        <StatCards />

        <div className="grid min-w-0 grid-cols-1 gap-3.5 lg:grid-cols-[2.4fr_1fr]">
          <PipelineBoard />
          <div className="flex flex-col gap-3.5">
            <AIInsights />
            <QuickActions />
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-3.5 lg:grid-cols-[2.4fr_1fr]">
          <RecentLeadsTable />
          <LeadSourcesChart />
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-3.5 lg:grid-cols-[1fr_1.6fr_1fr]">
          <FollowUps />
          <LeadsChart />
          <LeadPriority />
        </div>
      </main>

      <ChatbotWidget />
    </div>
  );
}