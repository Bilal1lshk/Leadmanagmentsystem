"use client";

import React from "react";
import Navbar from "@/app/components/ui/Home/Navbar";
import Footer from "@/app/components/ui/Home/Footer";
import { ArrowRight, LayoutDashboard, MousePointerClick, Zap, CheckCircle2 } from "lucide-react";

export default function PipelinePage() {
  return (
    <div className="min-h-screen bg-[#FFF3C8]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-24 sm:px-10 lg:px-16 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#458393]/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif font-medium text-[#22303A] tracking-tight mb-6">
            Your sales process, <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-[#458393] to-[#34A99D] bg-clip-text text-transparent">visualized clearly.</span>
          </h1>
          <p className="text-lg text-[#4A5A5F] max-w-2xl mx-auto mb-10">
            See exactly where every deal stands. Our intuitive Kanban pipeline gives you the clarity you need to move leads from first contact to closed won.
          </p>
          
          <div className="flex justify-center gap-4">
            <a href="/signup" className="flex items-center gap-2 bg-[#458393] hover:bg-[#34A99D] text-white px-6 py-3 rounded-lg font-medium transition">
              Get Started Free <ArrowRight size={18} />
            </a>
            <a href="/login" className="flex items-center gap-2 bg-white border border-[#E5CB90]/60 text-[#22303A] hover:bg-[#FFF3C8]/50 px-6 py-3 rounded-lg font-medium transition">
              View Demo
            </a>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="bg-white py-24 px-6 sm:px-10 lg:px-16 border-y border-[#E5CB90]/30">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#458393] mb-4 bg-[#458393]/10 px-3 py-1.5 rounded-full">
              <LayoutDashboard size={16} /> Drag & Drop Simplicity
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-[#22303A] mb-6">
              Move deals forward with a single click.
            </h2>
            <p className="text-[#4A5A5F] mb-8 leading-relaxed">
              Updating your CRM shouldn't feel like a chore. Leadwise lets you effortlessly drag and drop opportunities across customized stages, so your CRM is always up to date without the hassle.
            </p>
            
            <ul className="space-y-4">
              {[
                "Customizable pipeline stages to match your workflow",
                "Color-coded deal value highlights",
                "Quick actions right from the pipeline view",
                "Automated stage triggers and notifications"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-[#5C6D71]">
                  <CheckCircle2 className="text-[#34A99D] shrink-0 mt-0.5" size={18} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#458393]/20 to-[#34A99D]/20 transform rotate-3 rounded-2xl" />
            <div className="relative bg-white border border-[#E5CB90]/60 p-6 rounded-2xl shadow-xl shadow-[#458393]/5">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#E5CB90]/30">
                <div className="font-medium text-[#22303A]">Sales Pipeline</div>
                <div className="text-sm text-[#5C6D71]">Total: $45,200</div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {/* Column 1 */}
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-[#5C6D71] uppercase tracking-wide">Contacted</div>
                  <div className="bg-[#FFF3C8]/40 border border-[#E5CB90]/40 p-3 rounded-lg">
                    <div className="text-sm font-medium text-[#22303A]">TechFlow Redesign</div>
                    <div className="text-xs text-[#5C6D71] mt-1">Jane Doe</div>
                    <div className="text-sm font-semibold text-[#458393] mt-3">$12,000</div>
                  </div>
                </div>
                
                {/* Column 2 */}
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-[#5C6D71] uppercase tracking-wide">Proposal</div>
                  <div className="bg-white border border-[#458393]/40 shadow-sm p-3 rounded-lg transform -translate-y-1 relative z-10 cursor-pointer">
                    <MousePointerClick className="absolute -bottom-4 -right-2 text-[#458393] animate-bounce" size={24} />
                    <div className="text-sm font-medium text-[#22303A]">Acme Corp Audit</div>
                    <div className="text-xs text-[#5C6D71] mt-1">John Smith</div>
                    <div className="text-sm font-semibold text-[#458393] mt-3">$25,500</div>
                  </div>
                </div>
                
                {/* Column 3 */}
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-[#5C6D71] uppercase tracking-wide">Won</div>
                  <div className="bg-[#FFF3C8]/40 border border-[#E5CB90]/40 p-3 rounded-lg opacity-60">
                    <div className="text-sm font-medium text-[#22303A]">Stark Ind.</div>
                    <div className="text-xs text-[#5C6D71] mt-1">Tony S.</div>
                    <div className="text-sm font-semibold text-[#458393] mt-3">$7,700</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Secondary Features Grid */}
      <section className="py-24 px-6 sm:px-10 lg:px-16 bg-[#FFF3C8]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-medium text-[#22303A] mb-4">Built for velocity.</h2>
            <p className="text-[#4A5A5F] max-w-2xl mx-auto">Everything you need to manage your pipeline efficiently, without the clutter of traditional CRM systems.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-[#E5CB90]/60 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-[#458393]/10 text-[#458393] rounded-xl flex items-center justify-center mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-semibold text-[#22303A] mb-3">Lightning Fast</h3>
              <p className="text-[#5C6D71] leading-relaxed">Instantly update deal values, assign team members, and add notes without leaving the board view.</p>
            </div>
            
            <div className="bg-white border border-[#E5CB90]/60 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-[#34A99D]/10 text-[#34A99D] rounded-xl flex items-center justify-center mb-6">
                <LayoutDashboard size={24} />
              </div>
              <h3 className="text-xl font-semibold text-[#22303A] mb-3">Multiple Views</h3>
              <p className="text-[#5C6D71] leading-relaxed">Switch seamlessly between Kanban boards, list views, and timeline projections based on your preference.</p>
            </div>
            
            <div className="bg-white border border-[#E5CB90]/60 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-[#458393]/10 text-[#458393] rounded-xl flex items-center justify-center mb-6">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-xl font-semibold text-[#22303A] mb-3">Goal Tracking</h3>
              <p className="text-[#5C6D71] leading-relaxed">Set monthly pipeline goals and watch your progress bar fill up as deals move to the closed-won column.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
