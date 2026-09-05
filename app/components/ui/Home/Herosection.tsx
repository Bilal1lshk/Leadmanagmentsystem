import Image from "next/image";
import { useAppSelector } from "@/app/redux/hooks"
export default function HeroSection() {
  const { user } = useAppSelector((state) => state.auth);
  const columns = [
    {
      title: "New lead",
      color: "#458393",
      cards: [
        { name: "Sarah Jones", sub: "Marketing Inquiry", value: "$901" },
      ],
    },
    {
      title: "Contacted",
      color: "#34A99D",
      cards: [
        { name: "David Chen", sub: "Consulting Project", value: "$1,103" },
      ],
    },
    {
      title: "Proposal sent",
      color: "#E5CB90",
      cards: [
        { name: "Beverly Chen", sub: "Consulting Project", value: "$2,340" },
        { name: "David Chen", sub: "Consulting Project", value: "$165" },
      ],
    },
    {
      title: "Won",
      color: "#458393",
      cards: [
        { name: "Sarah Awan", sub: "Consulting Project", value: "$4,265" },
      ],
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#FFF3C8] px-8 py-20 md:px-16">
      {/* decorative blobs */}
      <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-[#458393]/15" />
      <div className="pointer-events-none absolute right-10 top-10 h-40 w-40 rounded-full bg-[#458393]/10" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Left: copy */}
        <div>
          <h1 className="font-serif text-3xl font-medium leading-tight text-[#22303A] md:text-6xl">
            Track leads,<br />not spreadsheets.
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-[#4A5A5F]">
            Leadwise is the simple lead tracker designed for small sales
            teams, freelancers, and solo <strong className="font-medium text-[#22303A]">agencies</strong> who
            are done losing deals to disorganized spreadsheets or chats.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a href="/signup" className="rounded-lg bg-[#458393] px-6 py-3 text-sm font-medium text-white">
              Get started free
            </a>
            {
              user ? (
                <a href="/dashboard" className="rounded-lg border border-[#458393] px-6 py-3 text-sm font-medium text-[#458393]">
                  Go to dashboard
                </a>
              ) : (
                <a href="/login" className="rounded-lg border border-[#458393] px-6 py-3 text-sm font-medium text-[#458393]">
                  Log in
                </a>
              )}
          </div>
        </div>

        {/* Right: pipeline mockup */}
        <div className="rounded-2xl border border-[#E5CB90]/60 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src="/favicon.ico" alt="Leadwise" width={24} height={24} />
            </div>
            <div className="hidden w-40 rounded-md border border-[#E5E5E0] px-2 py-1 text-xs text-[#8A8A82] sm:block">
              Search
            </div>
          </div>

          <p className="mb-3 text-base font-medium text-[#22303A]">Pipeline</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="mb-2 text-xs font-medium text-[#5C6D71]">
                  {col.title}
                </p>
                <div className="flex flex-col gap-2">
                  {col.cards.map((card) => (
                    <div
                      key={card.name}
                      className="rounded-md p-2 text-white"
                      style={{ backgroundColor: col.color }}
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
