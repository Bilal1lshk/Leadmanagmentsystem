import Card from "./Card";

export default function LeadPriority() {
  return (
    <Card>
      <h3 className="m-0 mb-3 text-sm text-[#22303A]">Lead Priority 🔥</h3>

      <div className="flex justify-between text-[11px] text-[#5C6D71] mb-2">
        <span>Hot Lead</span>
        <span>Score</span>
        <span>Action</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#458393]/20 flex items-center justify-center text-[10px] font-bold text-[#458393]">JS</div>
          <span className="text-[12.5px] text-[#22303A]">John Smith</span>
        </div>
        <span className="text-[12.5px] text-[#34A99D] font-semibold">92/100</span>
        <span className="text-[12.5px] text-[#458393] font-semibold">Contact Today</span>
      </div>
    </Card>
  );
}