export default function HeroSection() {
  const columns = [
    {
      title: "New lead",
      color: "#33565F",
      cards: [
        { name: "Sarah Jones", sub: "Marketing Inquiry", value: "$901" },
      ],
    },
    {
      title: "Contacted",
      color: "#2E9C87",
      cards: [
        { name: "David Chen", sub: "Consulting Project", value: "$1,103" },
      ],
    },
    {
      title: "Proposal sent",
      color: "#D8B677",
      text: "#182635",
      cards: [
        { name: "Beverly Chen", sub: "Consulting Project", value: "$2,340" },
        { name: "David Chen", sub: "Consulting Project", value: "$165" },
      ],
    },
    {
      title: "Won",
      color: "#33565F",
      cards: [
        { name: "Sarah Awan", sub: "Consulting Project", value: "$4,265" },
      ],
    },
  ];

  return (
    <section className="relative overflow-hidden bg-brand-cream px-8 py-20 md:px-16">
      {/* decorative blobs */}
      <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-brand-teal/15" />
      <div className="pointer-events-none absolute right-10 top-10 h-40 w-40 rounded-full bg-brand-teal/10" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Left: copy */}
        <div>
          <h1 className="font-serif text-5xl font-medium leading-tight text-brand-navy md:text-6xl">
            Track leads,<br />not spreadsheets.
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-brand-gray">
            Leadwise is the simple lead tracker designed for small sales
            teams, freelancers, and solo <strong className="font-medium text-brand-navy">agencies</strong> who
            are done losing deals to disorganized spreadsheets or chats.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button className="rounded-lg bg-brand-teal px-6 py-3 text-sm font-medium text-white">
              Get started free
            </button>
            <button className="rounded-lg border border-brand-tan bg-transparent px-6 py-3 text-sm font-medium text-brand-navy">
              See how it works
            </button>
          </div>
        </div>

        {/* Right: pipeline mockup */}
        <div className="rounded-2xl border border-brand-tan/60 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-teal">
                <span className="text-xs font-medium text-white">L</span>
              </div>
              <span className="text-sm font-medium text-brand-navy">Leadwise</span>
            </div>
            <div className="hidden w-40 rounded-md border border-brand-line px-2 py-1 text-xs text-brand-gray sm:block">
              Search
            </div>
          </div>

          <p className="mb-3 text-base font-medium text-brand-navy">Pipeline</p>

          <div className="grid grid-cols-4 gap-3">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="mb-2 text-xs font-medium text-brand-gray">
                  {col.title}
                </p>
                <div className="flex flex-col gap-2">
                  {col.cards.map((card) => (
                    <div
                      key={card.name}
                      className="rounded-md p-2"
                      style={{ backgroundColor: col.color, color: col.text ?? "#FFFFFF" }}
                    >
                      <p className="text-[11px] font-medium leading-tight">
                        {card.name}
                      </p>
                      <p className="text-[10px] opacity-80 leading-tight">
                        {card.sub}
                      </p>
                      <p className="mt-1 text-[10px] font-medium leading-tight">
                        {card.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}