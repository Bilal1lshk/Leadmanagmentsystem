import { Users, Sparkles, Target, Wallet, CheckCircle2 } from "lucide-react";
import Card from "./Card";

const stats = [
  { icon: Users, color: "text-blue-400", label: "Total Leads", value: "1,248" },
  { icon: Sparkles, color: "text-violet-400", label: "New Leads", value: "86", sub: "this month" },
  { icon: Target, color: "text-red-400", label: "Qualified Leads", value: "342" },
  { icon: Wallet, color: "text-amber-400", label: "Pipeline Value", value: "$85,400" },
  { icon: CheckCircle2, color: "text-emerald-400", label: "Conversion Rate", value: "24.8%" },
];

export default function StatCards() {
  return (
    <div className="grid grid-cols-5 gap-3.5">
      {stats.map((s) => (
        <Card key={s.label}>
          <div className="flex items-center gap-2 mb-2.5">
            <s.icon size={16} className={s.color} />
            <span className="text-[13px] text-slate-400">{s.label}</span>
          </div>
          <div className="text-2xl font-bold text-white">{s.value}</div>
          {s.sub && <div className="text-xs text-slate-400 mt-0.5">{s.sub}</div>}
        </Card>
      ))}
    </div>
  );
}