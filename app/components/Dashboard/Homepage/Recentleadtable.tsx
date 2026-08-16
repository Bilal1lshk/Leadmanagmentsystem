import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import Card from "./Card";

const leads = [
  { name: "John Smith", company: "TechCorp", source: "Website", status: "New", value: "$2,500", date: "Today" },
  { name: "Sarah Khan", company: "Digital Co", source: "LinkedIn", status: "Qualified", value: "$5,000", date: "Today" },
];

const statusStyles = {
  New: "bg-brand-teal/20 text-brand-teal-light",
  Qualified: "bg-brand-emerald/20 text-brand-emerald-light",
};

export default function RecentLeadsTable({ onAddLead }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="m-0 text-[15px] text-white">Recent Leads</h3>
        <button
          onClick={onAddLead}
          className="flex items-center gap-1.5 bg-brand-teal rounded-lg px-3.5 py-2 text-sm font-semibold text-white hover:bg-brand-teal-dark transition-colors"
        >
          <Plus size={14} /> Add New Lead
        </button>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="text-brand-gray-light text-left">
            {["Lead", "Company", "Source", "Status", "Value", "Date", ""].map((h) => (
              <th key={h} className="font-medium px-2 py-1.5 border-b border-brand-navy-border">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.name}>
              <td className="px-2 py-2.5 flex items-center gap-2 text-white">
                <div className="w-6.5 h-6.5 w-7 h-7 rounded-full bg-brand-navy-surface" />
                {lead.name}
              </td>
              <td className="px-2 py-2.5 text-brand-gray-light">{lead.company}</td>
              <td className="px-2 py-2.5 text-brand-gray-light">{lead.source}</td>
              <td className="px-2 py-2.5">
                <span className={`text-[11px] px-2 py-0.5 rounded-md ${statusStyles[lead.status]}`}>
                  {lead.status}
                </span>
              </td>
              <td className="px-2 py-2.5 text-white">{lead.value}</td>
              <td className="px-2 py-2.5 text-brand-gray-light">{lead.date}</td>
              <td className="px-2 py-2.5">
                <div className="flex gap-2.5 text-brand-gray-light">
                  <Eye size={14} className="cursor-pointer hover:text-white" />
                  <Pencil size={14} className="cursor-pointer hover:text-white" />
                  <Trash2 size={14} className="cursor-pointer hover:text-red-400" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}