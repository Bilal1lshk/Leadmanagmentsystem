import Card from "./Card";

const followUps = [
  { title: "Call John Smith", meta: "Today · 10:30 AM", color: "bg-emerald-400" },
  { title: "Send proposal to Sarah Khan", meta: "Today · 2:00 PM", color: "bg-amber-400" },
  { title: "Follow up with TechCorp", meta: "Tomorrow · 11:00 AM", color: "bg-blue-400" },
];

export default function FollowUps() {
  return (
    <Card>
      <h3 className="m-0 mb-3 text-sm text-white">Upcoming Follow-ups</h3>
      <div className="flex flex-col gap-3">
        {followUps.map((f) => (
          <div key={f.title} className="flex gap-2 items-start">
            <span className={`w-1.5 h-1.5 rounded-full ${f.color} mt-1.5 shrink-0`} />
            <div>
              <div className="text-[12.5px] text-white">{f.title}</div>
              <div className="text-[11px] text-slate-400">{f.meta}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}