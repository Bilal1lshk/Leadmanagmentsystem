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
  { name: "Gmail", icon: Mail, color: "text-[#D93025]" },
  { name: "WhatsApp", icon: MessageCircle, color: "text-[#25D366]" },
  { name: "Slack", icon: Hash, color: "text-[#E01E5A]" },
  { name: "Calendar", icon: Calendar, color: "text-[#4285F4]" },
  { name: "HubSpot", icon: Database, color: "text-[#FF7A59]" },
  { name: "Zapier", icon: Zap, color: "text-[#FF4A00]" },
  { name: "Stripe", icon: CreditCard, color: "text-[#635BFF]" },
  { name: "Sheets", icon: Sheet, color: "text-[#0F9D58]" },
  { name: "Twilio", icon: Phone, color: "text-[#F22F46]" },
];

export default function IntegrationsSection() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-semibold tracking-wider text-[#458393] uppercase">
              Integrations
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#22303A] mt-3 leading-tight font-serif">
              No more copy-pasting
              <br />
              between tools
            </h2>
            <p className="text-[#4A5A5F] text-base mt-4 max-w-md leading-relaxed">
              Your leads move automatically between Leadwise and the apps you
              already use — set it up yourself in minutes.
            </p>

            <a
              href="#"
              className="inline-flex items-center gap-2 mt-7 bg-[#458393] hover:bg-[#34A99D] transition-colors text-white text-sm font-semibold px-5 py-3 rounded-lg"
            >
              See all integrations
              <ArrowRight size={15} />
            </a>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {integrations.map(({ name, icon: Icon, color }) => (
              <div
                key={name}
                className="bg-white border border-[#E5CB90]/60 rounded-2xl p-5 flex flex-col items-center justify-center gap-2.5 hover:border-[#458393]/40 hover:bg-[#FFF3C8] transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-[#FFF3C8]/50 border border-[#E5CB90]/30 flex items-center justify-center">
                  <Icon size={20} className={color} />
                </div>
                <span className="text-xs text-[#5C6D71] font-medium">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}