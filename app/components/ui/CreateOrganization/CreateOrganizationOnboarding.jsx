"use client";

import { ChartLine, Building2 } from "lucide-react";
import CreateOrganizationForm from "./CreateOrganizationForm";

export default function CreateOrganizationOnboarding() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FFF3C8] px-4 py-12">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#458393]/10" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#34A99D]/10" />

      <div className="relative z-10 grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-2xl border border-[#E5CB90] bg-white shadow-[0_20px_60px_-15px_rgba(69,131,147,0.25)] md:grid-cols-2">
        <div className="hidden flex-col justify-between bg-[#458393] p-10 md:flex">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF3C8]">
              <ChartLine className="h-4 w-4 text-[#458393]" />
            </div>
            <span className="text-lg font-medium text-white">Leadwise</span>
          </div>

          <div>
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF3C8]/20">
              <Building2 className="h-8 w-8 text-[#FFF3C8]" />
            </div>
            <h2 className="text-2xl font-medium leading-snug text-white">
              Create your workspace
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              Set up your organization to start managing leads, tracking
              pipelines, and growing your business with your team.
            </p>
          </div>

          <div className="flex gap-2">
            <div className="h-1.5 w-6 rounded-full bg-[#FFF3C8]" />
            <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
            <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
          </div>
        </div>

        <div className="p-8 md:p-10">
          <div className="mb-6 flex items-center gap-2 md:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#458393]">
              <ChartLine className="h-4 w-4 text-[#FFF3C8]" />
            </div>
            <span className="text-lg font-medium text-[#2A3F45]">Leadwise</span>
          </div>

          <h1 className="text-2xl font-medium text-[#2A3F45]">
            Set up your workspace
          </h1>
          <p className="mt-1 text-sm text-[#5C6D71]">
            Tell us a bit about your organization to get started.
          </p>

          <div className="mt-7">
            <CreateOrganizationForm />
          </div>
        </div>
      </div>
    </div>
  );
}
