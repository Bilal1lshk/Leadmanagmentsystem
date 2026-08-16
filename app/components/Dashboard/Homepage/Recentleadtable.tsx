import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import Card from "./Card";

const leads = [
  { name: "John Smith", company: "TechCorp", source: "Website", status: "New", value: "$2,500", date: "Today" },
  { name: "Sarah Khan", company: "Digital Co", source: "LinkedIn", status: "Qualified", value: "$5,000", date: "Today" },
];

const statusStyles = {
  New: "bg-[#458393]/15 text-[#458393] font-semibold border border-[#458393]/30",
  Qualified: "bg-[#34A99D]/15 text-[#34A99D] font-semibold border border-[#34A99D]/30",
};

export default function RecentLeadsTable({ onAddLead }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="m-0 text-[15px] text-[#22303A]">Recent Leads</h3>
        <button
          onClick={onAddLead}
          className="flex items-center gap-1.5 bg-[#34A99D] rounded-lg px-3.5 py-2 text-sm font-semibold text-[#04342C] hover:bg-[#2F998E] transition-colors"
        >
          <Plus size={14} /> Add New Lead
        </button>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="text-[#5C6D71] text-left">
            {["Lead", "Company", "Source", "Status", "Value", "Date", ""].map((h) => (
              <th key={h} className="font-medium px-2 py-1.5 border-b border-[#E5CB90]/40">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.name}>
              <td className="px-2 py-2.5 flex items-center gap-2 text-[#22303A]">
                <div className="w-7 h-7 rounded-full bg-[#458393]/20 flex items-center justify-center text-xs font-bold text-[#458393]">{lead.name.split(" ").map(n => n[0]).join("")}</div>
                {lead.name}
              </td>
              <td className="px-2 py-2.5 text-[#4A5A5F]">{lead.company}</td>
              <td className="px-2 py-2.5 text-[#4A5A5F]">{lead.source}</td>
              <td className="px-2 py-2.5">
                <span className={`text-[11px] px-2 py-0.5 rounded-md ${statusStyles[lead.status]}`}>
                  {lead.status}
                </span>
              </td>
              <td className="px-2 py-2.5 text-[#22303A] font-medium">{lead.value}</td>
              <td className="px-2 py-2.5 text-[#4A5A5F]">{lead.date}</td>
              <td className="px-2 py-2.5">
                <div className="flex gap-2.5 text-[#5C6D71]">
                  <Eye size={14} className="cursor-pointer hover:text-[#22303A]" />
                  <Pencil size={14} className="cursor-pointer hover:text-[#22303A]" />
                  <Trash2 size={14} className="cursor-pointer hover:text-red-600" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}