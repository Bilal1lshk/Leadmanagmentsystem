"use client"
import {
  Mail,
  MessageCircle,
  Slack,
  Calendar,
  Database,
  Zap,
  CreditCard,
  Sheet,
  Phone,
  ArrowRight,
} from "lucide-react";

const integrations = [
  { name: "Gmail", icon: Mail, color: "text-red-400" },
  { name: "WhatsApp", icon: MessageCircle, color: "text-emerald-400" },
  { name: "Slack", icon: Slack, color: "text-violet-400" },
  { name: "Calendar", icon: Calendar, color: "text-blue-400" },
  { name: "HubSpot", icon: Database, color: "text-orange-400" },
  { name: "Zapier", icon: Zap, color: "text-amber-400" },
  { name: "Stripe", icon: CreditCard, color: "text-indigo-400" },
  { name: "Sheets", icon: Sheet, color: "text-green-400" },
  { name: "Twilio", icon: Phone, color: "text-red-300" },
];

export default function IntegrationsSection() {
  return (
    <section className="bg-[#0B0F17] py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-semibold tracking-wider text-blue-400 uppercase">
              Integrations
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 leading-tight">
              No more copy-pasting
              <br />
              between tools
            </h2>
            <p className="text-slate-400 text-base mt-4 max-w-md leading-relaxed">
              Your leads move automatically between Leadwise and the apps you
              already use — set it up yourself in minutes.
            </p>

            <a
              href="#"
              className="inline-flex items-center gap-2 mt-7 bg-blue-500 hover:bg-blue-600 transition-colors text-white text-sm font-semibold px-5 py-3 rounded-lg"
            >
              See all integrations
              <ArrowRight size={15} />
            </a>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {integrations.map(({ name, icon: Icon, color }) => (
              <div
                key={name}
                className="bg-[#131826] border border-[#1F2635] rounded-2xl p-5 flex flex-col items-center justify-center gap-2.5 hover:border-blue-500/40 hover:bg-[#171D2C] transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-[#0F1420] border border-[#1F2635] flex items-center justify-center">
                  <Icon size={20} className={color} />
                </div>
                <span className="text-xs text-slate-300 font-medium">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}