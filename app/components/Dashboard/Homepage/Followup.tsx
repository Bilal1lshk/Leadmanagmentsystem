import Card from "./Card";

const followUps = [
  { title: "Call John Smith", meta: "Today · 10:30 AM", color: "bg-[#34A99D]" },
  { title: "Send proposal to Sarah Khan", meta: "Today · 2:00 PM", color: "bg-[#E5CB90]" },
  { title: "Follow up with TechCorp", meta: "Tomorrow · 11:00 AM", color: "bg-[#458393]" },
];

export default function FollowUps() {
  return (
    <Card>
      <h3 className="m-0 mb-3 text-sm text-[#22303A]">Upcoming Follow-ups</h3>
      <div className="flex flex-col gap-3">
        {followUps.map((f) => (
          <div key={f.title} className="flex gap-2 items-start">
            <span className={`w-1.5 h-1.5 rounded-full ${f.color} mt-1.5 shrink-0`} />
            <div>
              <div className="text-[12.5px] text-[#22303A]">{f.title}</div>
              <div className="text-[11px] text-[#5C6D71]">{f.meta}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}