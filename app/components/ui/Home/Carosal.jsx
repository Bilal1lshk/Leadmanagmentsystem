"use client";

const testimonials = [
  {
    name: "Sarah Jones",
    role: "Founder, Jones Consulting",
    quote:
      "Leadwise replaced three spreadsheets and a WhatsApp group. I finally know which leads need a follow-up today.",
    initials: "SJ",
  },
  {
    name: "David Chen",
    role: "Freelance web developer",
    quote:
      "Simple enough to set up in ten minutes, but it actually keeps me on top of every client conversation.",
    initials: "DC",
  },
  {
    name: "Beverly Ahmed",
    role: "Real estate agent",
    quote:
      "I used to lose track of who I'd called. Now every lead has a full history I can check before I dial.",
    initials: "BA",
  },
  {
    name: "Zain Malik",
    role: "Agency owner",
    quote:
      "The pipeline view alone was worth switching for. My whole team can see where every deal stands.",
    initials: "ZM",
  },
];

export default function Carosal() {
  const track = [...testimonials, ...testimonials];

  return (
    <section className="bg-brand-cream py-16">
      <div className="mx-auto max-w-6xl px-8">
        <p className="mb-10 text-center text-sm font-medium uppercase tracking-wide text-brand-gray">
          What early users are saying
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-brand-cream to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-brand-cream to-transparent" />

        <div className="flex w-max animate-scroll gap-5">
          {track.map((t, i) => (
            <div
              key={i}
              className="w-80 shrink-0 rounded-xl border border-brand-tan/60 bg-white p-6"
            >
              <p className="text-sm leading-relaxed text-brand-gray">
                "{t.quote}"
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-teal text-xs font-medium text-white">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-navy">
                    {t.name}
                  </p>
                  <p className="text-xs text-brand-gray">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}