import Card from "./Card";

const stages = [
  { name: "NEW", count: 24, value: "$20,000", border: "border-t-blue-500", leads: ["John Smith", "Ali Raza"] },
  { name: "CONTACTED", count: 18, value: "$15,000", border: "border-t-green-500", leads: ["Sarah Khan", "Emma Jones"] },
  { name: "QUALIFIED", count: 12, value: "$35,000", border: "border-t-amber-500", leads: ["Mike Brown", "David Khan"] },
  { name: "PROPOSAL", count: 8, value: "$40,000", border: "border-t-red-500", leads: [] },
  { name: "WON", count: 15, value: "$50,000", border: "border-t-emerald-500", leads: [] },
];

export default function PipelineBoard() {
  return (
    <Card>
      <div className="flex items-baseline gap-2.5 mb-3.5">
        <h3 className="m-0 text-[15px] text-white">Lead Pipeline</h3>
        <span className="text-xs text-slate-400">
          NEW → CONTACTED → QUALIFIED → PROPOSAL → WON / LOST
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2.5">
        {stages.map((stage) => (
          <div
            key={stage.name}
            className={`bg-[#0F1420] border border-[#1F2635] border-t-[3px] ${stage.border} rounded-lg p-2.5 min-h-[150px]`}
          >
            <div className="text-xs font-bold tracking-wide text-white">{stage.name}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{stage.count} Leads</div>
            <div className="text-xs text-slate-300 mb-2">{stage.value}</div>

            {stage.leads.map((lead) => (
              <div
                key={lead}
                className="bg-[#131826] border border-[#1F2635] rounded-md px-2 py-1.5 text-xs mb-1.5 text-slate-200"
              >
                {lead}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}