"use client";

import { Search, Settings } from "lucide-react";
import Link from "next/link";
import Notifications from "../../ui/Notification/Notification";
import { Dispatch, SetStateAction } from "react";

interface HeaderProps {
  name?: string;
  title?: string;
  searchValue?: string;
  onSearchChange?:
    | Dispatch<SetStateAction<string>>
    | ((value: string) => void);
}

export default function Header({
  name = "Bilal",
  title,
  searchValue = "",
  onSearchChange,
}: HeaderProps) {
  const heading = title || `Good morning, ${name} 👋`;

  return (
    <header className="w-full min-w-0">
      <div className="w-full min-w-0 px-4 py-4 sm:px-6 lg:px-8">

        {/* ================= DESKTOP ================= */}
        <div className="hidden min-w-0 w-full items-center justify-between gap-6 md:flex">

          {/* LEFT CONTENT */}
          <div className="min-w-0 flex-1 overflow-hidden">
            <h1
              className="
                truncate
                text-[22px]
                font-bold
                leading-tight
                text-[#22303A]
                lg:text-[25px]
              "
            >
              {heading}
            </h1>

            <p
              className="
                mt-1.5
                truncate
                text-[14px]
                leading-5
                text-[#5C6D71]
                lg:text-[15px]
              "
            >
              Here's what's happening with your leads today.
            </p>
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex shrink-0 items-center gap-3">

            {/* SEARCH */}
            <div
              className="
                box-border
                flex
                h-10
                w-50
                min-h-10
                min-w-50
                max-h-10
                max-w-50
                shrink-0
                grow-0
                basis-50
                items-center
                gap-2
                overflow-hidden
                rounded-lg
                border
                border-[#E5CB90]/60
                bg-white
                px-3
                shadow-sm
                focus-within:border-[#458393]
                focus-within:ring-2
                focus-within:ring-[#458393]/10
              "
            >
              <Search
                size={16}
                strokeWidth={2}
                className="h-4 w-4 shrink-0 text-[#5C6D71]"
              />

              <input
                type="text"
                value={searchValue}
                placeholder="Search leads..."
                onChange={(event) =>
                  onSearchChange?.(event.target.value)
                }
                className="
                  block
                  h-full
                  w-38
                  min-w-38
                  max-w-38
                  shrink-0
                  grow-0
                  border-0
                  bg-transparent
                  p-0
                  text-sm
                  text-[#22303A]
                  outline-none
                  placeholder:text-[#8A999D]
                "
              />
            </div>

            {/* NOTIFICATIONS */}
            <div className="relative h-10 w-10 shrink-0">
              <Notifications />

              <span
                className="
                  pointer-events-none
                  absolute
                  right-0
                  top-0
                  h-2
                  w-2
                  rounded-full
                  bg-red-500
                  ring-2
                  ring-white
                "
              />
            </div>

            {/* SETTINGS */}
            <Link
              href="/dashboard/settings"
              aria-label="Open settings"
              className="
                flex
                h-10
                w-10
                min-h-10
                min-w-10
                max-h-10
                max-w-10
                shrink-0
                grow-0
                items-center
                justify-center
                rounded-full
                bg-[#458393]
                text-[#FFF3C8]
                shadow-sm
                transition
                hover:opacity-90
                active:scale-95
              "
            >
              <Settings size={17} strokeWidth={2} />
            </Link>
          </div>
        </div>

        {/* ================= MOBILE ================= */}
        <div className="flex w-full min-w-0 flex-col gap-4 md:hidden">

          {/* TOP ROW */}
          <div className="flex w-full min-w-0 items-center justify-between gap-3">

            {/* TITLE */}
            <div className="min-w-0 flex-1 overflow-hidden">
              <h1
                className="
                  truncate
                  text-[20px]
                  font-bold
                  leading-[1.3]
                  text-[#22303A]
                  sm:text-[21px]
                "
              >
                {heading}
              </h1>

              <p
                className="
                  mt-1.5
                  truncate
                  text-[13px]
                  leading-4.75
                  text-[#5C6D71]
                  sm:text-[14px]
                "
              >
                Here's what's happening with your leads today.
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex shrink-0 items-center gap-2">

              {/* NOTIFICATIONS */}
              <div className="relative h-9 w-9 shrink-0">
                <Notifications />

                <span
                  className="
                    pointer-events-none
                    absolute
                    right-0
                    top-0
                    h-2
                    w-2
                    rounded-full
                    bg-red-500
                    ring-2
                    ring-white
                  "
                />
              </div>

              {/* SETTINGS */}
              <Link
                href="/dashboard/settings"
                aria-label="Open settings"
                className="
                  flex
                  h-9
                  w-9
                  min-h-9
                  min-w-9
                  max-h-9
                  max-w-9
                  shrink-0
                  grow-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#458393]
                  text-[#FFF3C8]
                  shadow-sm
                  transition
                  hover:opacity-90
                  active:scale-95
                "
              >
                <Settings size={16} strokeWidth={2} />
              </Link>
            </div>
          </div>

          {/* MOBILE SEARCH */}
          <div
            className="
              box-border
              flex
              h-10
              w-50
              min-h-10
              min-w-50
              max-h-10
              max-w-50
              shrink-0
              grow-0
              basis-50
              items-center
              gap-2
              overflow-hidden
              rounded-lg
              border
              border-[#E5CB90]/60
              bg-white
              px-3
              shadow-sm
              focus-within:border-[#458393]
              focus-within:ring-2
              focus-within:ring-[#458393]/10
            "
          >
            <Search
              size={16}
              strokeWidth={2}
              className="h-4 w-4 shrink-0 text-[#5C6D71]"
            />

            <input
              type="text"
              value={searchValue}
              placeholder="Search leads..."
              onChange={(event) =>
                onSearchChange?.(event.target.value)
              }
              className="
                block
                h-full
                w-38
                min-w-38
                max-w-38
                shrink-0
                grow-0
                border-0
                bg-transparent
                p-0
                text-sm
                text-[#22303A]
                outline-none
                placeholder:text-[#8A999D]
              "
            />
          </div>
        </div>
      </div>
    </header>
  );
}