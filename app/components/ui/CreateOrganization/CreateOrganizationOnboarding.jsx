"use client";

import { useState } from "react";
import { ChartLine, Building2 } from "lucide-react";
import CreateOrganizationForm from "./CreateOrganizationForm";
import JoinOrganizationForm from "./JoinOrganizationForm";

export default function CreateOrganizationOnboarding() {
  const [mode, setMode] = useState("create");
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
            <h2 className="text-2xl font-medium leading-snug text-white">{mode === "create" ? "Create your workspace" : "Join your workspace"}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              {mode === "create" ? "Set up your organization to start managing leads, tracking pipelines, and growing your business with your team." : "Use the workspace code shared by your administrator to collaborate with your team."}
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

          <h1 className="text-2xl font-medium text-[#2A3F45]">{mode === "create" ? "Set up your workspace" : "Join a workspace"}</h1>
          <p className="mt-1 text-sm text-[#5C6D71]">
            {mode === "create" ? "Tell us a bit about your organization to get started." : "Enter the code you received from your administrator."}
          </p>

          <div className="mt-6 flex rounded-lg bg-[#FFF3C8]/60 p-1 text-sm">
            <button onClick={() => setMode("create")} className={`flex-1 rounded-md px-3 py-2 font-medium ${mode === "create" ? "bg-white text-[#458393] shadow-sm" : "text-[#5C6D71]"}`}>Create</button>
            <button onClick={() => setMode("join")} className={`flex-1 rounded-md px-3 py-2 font-medium ${mode === "join" ? "bg-white text-[#458393] shadow-sm" : "text-[#5C6D71]"}`}>Join</button>
          </div>

          <div className="mt-5">
            {mode === "create" ? <CreateOrganizationForm /> : <JoinOrganizationForm />}
          </div>
        </div>
      </div>
    </div>
  );
}
