import Card from "./Card";

const sources = [
  { label: "Website", pct: 45, color: "#CBCFA0" },
  { label: "LinkedIn", pct: 25, color: "#5C8B96" },
  { label: "Facebook", pct: 15, color: "#4FBFA6" },
  { label: "Referrals", pct: 10, color: "#D8B677" },
  { label: "Other", pct: 5, color: "#6B7280" },
];

function Donut({ data, size = 150, thickness = 22 }) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {data.map((d) => {
        const dash = (d.pct / 100) * circumference;
        const el = (
          <circle
            key={d.label}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={d.color}
            strokeWidth={thickness}
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
}

export default function LeadSourcesChart() {
  return (
    <Card>
      <h3 className="m-0 mb-3 text-sm text-white">Lead Sources (Donut Chart)</h3>
      <div className="flex items-center gap-4">
        <Donut data={sources} />
        <div className="flex flex-col gap-2">
          {sources.map((s) => (
            <div key={s.label} className="flex items-center gap-2 text-[12.5px]">
              <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
              <span className="text-brand-gray-light flex-1">{s.label}</span>
              <span className="text-brand-gray-light">{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}