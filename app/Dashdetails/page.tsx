"use client";

import React from "react";
import Navbar from "@/app/components/ui/Home/Navbar";
import Footer from "@/app/components/ui/Home/Footer";
import { ArrowRight, BarChart3, PieChart, TrendingUp, Download, Eye } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-[#FFF3C8]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-24 sm:px-10 lg:px-16 text-center">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#E5CB90]/30 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#34A99D] mb-6 bg-[#34A99D]/10 px-4 py-2 rounded-full">
            <BarChart3 size={16} /> Actionable Insights
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-medium text-[#22303A] tracking-tight mb-6">
            Data that drives <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-[#458393] to-[#34A99D] bg-clip-text text-transparent">decisions, not confusion.</span>
          </h1>
          <p className="text-lg text-[#4A5A5F] max-w-2xl mx-auto mb-10">
            Stop guessing what's working. Leadwise Reports turn your raw CRM data into beautiful, easy-to-understand metrics that reveal the true health of your sales.
          </p>
          
          <div className="flex justify-center gap-4">
            <a href="/signup" className="flex items-center gap-2 bg-[#458393] hover:bg-[#34A99D] text-white px-6 py-3 rounded-lg font-medium transition">
              Start Analyzing <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="bg-white py-24 px-6 sm:px-10 lg:px-16 border-y border-[#E5CB90]/30">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 md:order-1">
            {/* Dashboard Mockup */}
            <div className="bg-white border border-[#E5CB90]/60 p-6 rounded-2xl shadow-xl shadow-[#458393]/10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-[#22303A]">Revenue Forecast</h3>
                <span className="text-xs bg-[#FFF3C8] text-[#458393] px-2 py-1 rounded-md font-medium">This Month</span>
              </div>
              
              {/* Fake Chart */}
              <div className="h-48 flex items-end justify-between gap-2 mb-6 border-b border-[#E5CB90]/30 pb-4">
                {[40, 60, 30, 80, 50, 90, 70].map((height, i) => (
                  <div key={i} className="w-full bg-[#458393]/20 rounded-t-sm relative group cursor-pointer hover:bg-[#458393] transition-colors" style={{ height: `${height}%` }}>
                    {i === 5 && (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#22303A] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        $42k
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#FFF3C8]/40 p-4 rounded-xl border border-[#E5CB90]/30">
                  <div className="text-sm text-[#5C6D71] mb-1">Win Rate</div>
                  <div className="text-2xl font-bold text-[#22303A]">34.2%</div>
                  <div className="text-xs text-[#34A99D] flex items-center gap-1 mt-1">
                    <TrendingUp size={12} /> +2.4%
                  </div>
                </div>
                <div className="bg-[#FFF3C8]/40 p-4 rounded-xl border border-[#E5CB90]/30">
                  <div className="text-sm text-[#5C6D71] mb-1">Avg Deal Size</div>
                  <div className="text-2xl font-bold text-[#22303A]">$8,450</div>
                  <div className="text-xs text-[#34A99D] flex items-center gap-1 mt-1">
                    <TrendingUp size={12} /> +12.1%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-[#22303A] mb-6">
              Insights that actually mean something.
            </h2>
            <p className="text-[#4A5A5F] mb-8 leading-relaxed">
              We've stripped away the vanity metrics and overly complex pivot tables. Our reports focus purely on the numbers that help you scale your business and fix leaks in your funnel.
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 bg-[#458393]/10 text-[#458393] rounded-lg flex items-center justify-center">
                  <PieChart size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-[#22303A] mb-1">Conversion Analytics</h4>
                  <p className="text-sm text-[#5C6D71]">See exactly where leads drop off in your pipeline so you can optimize your follow-up strategy.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 bg-[#34A99D]/10 text-[#34A99D] rounded-lg flex items-center justify-center">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-[#22303A] mb-1">Revenue Forecasting</h4>
                  <p className="text-sm text-[#5C6D71]">Predict your future income based on current pipeline velocity and historical win rates.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 bg-[#E5CB90]/20 text-[#B89830] rounded-lg flex items-center justify-center">
                  <Eye size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-[#22303A] mb-1">Source Attribution</h4>
                  <p className="text-sm text-[#5C6D71]">Know exactly which marketing channels are generating your highest-value clients.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Export Section */}
      <section className="py-24 px-6 sm:px-10 lg:px-16 bg-[#FFF3C8]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto bg-white border border-[#E5CB90]/60 text-[#458393] rounded-2xl flex items-center justify-center mb-8 shadow-sm">
            <Download size={28} />
          </div>
          <h2 className="text-3xl font-serif font-medium text-[#22303A] mb-4">Export and share in seconds.</h2>
          <p className="text-[#4A5A5F] max-w-2xl mx-auto mb-10">
            Need to present to stakeholders or send a quick update to the team? Generate beautiful PDF or CSV reports with a single click, directly from your dashboard.
          </p>
          <a href="/signup" className="inline-flex items-center gap-2 bg-white border border-[#E5CB90]/60 text-[#22303A] hover:bg-white/50 px-6 py-3 rounded-lg font-medium transition shadow-sm">
            Try Reports Now
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
