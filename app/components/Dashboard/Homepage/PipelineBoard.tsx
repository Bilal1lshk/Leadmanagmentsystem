import Card from "./Card";

const stages = [
  { name: "NEW", count: 24, value: "$20,000", border: "border-t-[#458393]", leads: ["John Smith", "Ali Raza"] },
  { name: "CONTACTED", count: 18, value: "$15,000", border: "border-t-[#34A99D]", leads: ["Sarah Khan", "Emma Jones"] },
  { name: "QUALIFIED", count: 12, value: "$35,000", border: "border-t-[#E5CB90]", leads: ["Mike Brown", "David Khan"] },
  { name: "PROPOSAL", count: 8, value: "$40,000", border: "border-t-[#458393]", leads: [] },
  { name: "WON", count: 15, value: "$50,000", border: "border-t-[#34A99D]", leads: [] },
];

export default function PipelineBoard() {
  return (
    <Card>
      <div className="flex items-baseline gap-2.5 mb-3.5">
        <h3 className="m-0 text-[15px] text-[#22303A]">Lead Pipeline</h3>
        <span className="text-xs text-[#5C6D71]">
          NEW → CONTACTED → QUALIFIED → PROPOSAL → WON / LOST
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2.5">
        {stages.map((stage) => (
          <div
            key={stage.name}
            className={`bg-[#FFF3C8]/40 border border-[#E5CB90]/60 border-t-[3px] ${stage.border} rounded-lg p-2.5 min-h-[150px]`}
          >
            <div className="text-xs font-bold tracking-wide text-[#22303A]">{stage.name}</div>
            <div className="text-[11px] text-[#5C6D71] mt-0.5">{stage.count} Leads</div>
            <div className="text-xs text-[#4A5A5F] mb-2">{stage.value}</div>

            {stage.leads.map((lead) => (
              <div
                key={lead}
                className="bg-white border border-[#E5CB90]/60 rounded-md px-2 py-1.5 text-xs mb-1.5 text-[#22303A]"
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