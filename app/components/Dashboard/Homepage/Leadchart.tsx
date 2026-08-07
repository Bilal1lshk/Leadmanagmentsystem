import Card from "./Card";

export default function Leadchart() {
  return (
    <Card>
      <h3 className="m-0 mb-3 text-sm text-white">Lead Priority 🔥</h3>

      <div className="flex justify-between text-[11px] text-slate-400 mb-2">
        <span>Hot Lead</span>
        <span>Score</span>
        <span>Action</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#2A3244]" />
          <span className="text-[12.5px] text-white">John Smith</span>
        </div>
        <span className="text-[12.5px] text-emerald-400">92/100</span>
        <span className="text-[12.5px] text-blue-400">Contact Today</span>
      </div>
    </Card>
  );
}