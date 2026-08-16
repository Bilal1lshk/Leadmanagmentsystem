import {
  Mail,
  MessageCircle,
  Hash,
  Calendar,
  Database,
  Zap,
  CreditCard,
  Sheet,
  Phone,
  ArrowRight,
} from "lucide-react";

const integrations = [
  { name: "Gmail", icon: Mail, color: "text-brand-tan" },
  { name: "WhatsApp", icon: MessageCircle, color: "text-brand-emerald-light" },
  { name: "Slack", icon: Hash, color: "text-brand-teal-light" },
  { name: "Calendar", icon: Calendar, color: "text-brand-teal-light" },
  { name: "HubSpot", icon: Database, color: "text-brand-tan-light" },
  { name: "Zapier", icon: Zap, color: "text-brand-tan-light" },
  { name: "Stripe", icon: CreditCard, color: "text-brand-teal-light" },
  { name: "Sheets", icon: Sheet, color: "text-brand-emerald-light" },
  { name: "Twilio", icon: Phone, color: "text-brand-teal-light" },
];

export default function IntegrationsSection() {
  return (
    <section className="bg-brand-navy-deep py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-semibold tracking-wider text-brand-teal-light uppercase">
              Integrations
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 leading-tight">
              No more copy-pasting
              <br />
              between tools
            </h2>
            <p className="text-brand-gray-light text-base mt-4 max-w-md leading-relaxed">
              Your leads move automatically between Leadwise and the apps you
              already use — set it up yourself in minutes.
            </p>

            <a
              href="#"
              className="inline-flex items-center gap-2 mt-7 bg-brand-teal hover:bg-brand-teal-dark transition-colors text-white text-sm font-semibold px-5 py-3 rounded-lg"
            >
              See all integrations
              <ArrowRight size={15} />
            </a>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {integrations.map(({ name, icon: Icon, color }) => (
              <div
                key={name}
                className="bg-brand-navy border border-brand-navy-border rounded-2xl p-5 flex flex-col items-center justify-center gap-2.5 hover:border-brand-teal/40 hover:bg-brand-navy-surface transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-navy-deep border border-brand-navy-border flex items-center justify-center">
                  <Icon size={20} className={color} />
                </div>
                <span className="text-xs text-brand-gray-light font-medium">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}