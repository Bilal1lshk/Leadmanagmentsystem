import { Sparkles } from "lucide-react";
import Card from "./Card";

export default function AIInsights() {
  return (
    <Card>
      <h3 className="m-0 mb-3 text-sm text-[#22303A]">🤖 AI Insights</h3>
      <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#458393]/10">
          <Sparkles size={16} className="text-[#458393]" />
        </div>
        <p className="text-[12.5px] font-medium text-[#4A5A5F]">
          AI Insights not available right now
        </p>
        <p className="text-[11px] text-[#9AA5A8]">
          Coming soon to your dashboard
        </p>
      </div>
    </Card>
  );
}