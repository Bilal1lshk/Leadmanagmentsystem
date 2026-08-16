import { Flame, AlertTriangle, TrendingUp, Target } from "lucide-react";
import Card from "./Card";

const insights = [
  { icon: Flame, color: "text-red-600", text: "12 high-potential leads need attention" },
  { icon: AlertTriangle, color: "text-amber-600", text: "8 leads not contacted for 7 days" },
  { icon: TrendingUp, color: "text-emerald-600", text: "LinkedIn leads have highest conversion" },
  { icon: Target, color: "text-[#458393]", text: "John Smith likely to convert" },
];

export default function AIInsights() {
  return (
    <Card>
      <h3 className="m-0 mb-3 text-sm text-[#22303A]">🤖 AI Insights</h3>
      <div className="flex flex-col gap-2.5">
        {insights.map((i, idx) => (
          <div key={idx} className="flex gap-2 items-start">
            <i.icon size={14} className={`${i.color} mt-0.5 shrink-0`} />
            <span className="text-[12.5px] text-[#4A5A5F]">{i.text}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}