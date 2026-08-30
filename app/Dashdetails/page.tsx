"use client";

import React from "react";
import Navbar from "@/app/components/ui/Home/Navbar";
import Footer from "@/app/components/ui/Home/Footer";
import { ArrowRight, BarChart3, PieChart, TrendingUp, Download, Eye } from "lucide-react";
import { motion ,type Variants} from "framer-motion";

export default function ReportsPage() {
  const containerVariants:Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants:Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#FFF3C8]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-24 sm:px-10 lg:px-16 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#E5CB90]/30 blur-[150px] rounded-full pointer-events-none" 
        />
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 text-sm font-semibold text-[#34A99D] mb-6 bg-[#34A99D]/10 px-4 py-2 rounded-full">
            <BarChart3 size={16} /> Actionable Insights
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-serif font-medium text-[#22303A] tracking-tight mb-6">
            Data that drives <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-[#458393] to-[#34A99D] bg-clip-text text-transparent">decisions, not confusion.</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg text-[#4A5A5F] max-w-2xl mx-auto mb-10">
            Stop guessing what's working. Leadwise Reports turn your raw CRM data into beautiful, easy-to-understand metrics that reveal the true health of your sales.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex justify-center gap-4">
            <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="/signup" className="flex items-center gap-2 bg-[#458393] hover:bg-[#34A99D] text-white px-6 py-3 rounded-lg font-medium transition">
              Start Analyzing <ArrowRight size={18} />
            </motion.a>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Showcase */}
      <section className="bg-white py-24 px-6 sm:px-10 lg:px-16 border-y border-[#E5CB90]/30">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="relative order-2 md:order-1"
          >
            {/* Dashboard Mockup */}
            <motion.div 
              whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(69, 131, 147, 0.15)" }}
              className="bg-white border border-[#E5CB90]/60 p-6 rounded-2xl shadow-xl shadow-[#458393]/10 transition-shadow duration-300"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-[#22303A]">Revenue Forecast</h3>
                <span className="text-xs bg-[#FFF3C8] text-[#458393] px-2 py-1 rounded-md font-medium">This Month</span>
              </div>
              
              {/* Fake Chart */}
              <div className="h-48 flex items-end justify-between gap-2 mb-6 border-b border-[#E5CB90]/30 pb-4">
                {[40, 60, 30, 80, 50, 90, 70].map((height, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ height: 0 }}
                    whileInView={{ height: `${height}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                    className="w-full bg-[#458393]/20 rounded-t-sm relative group cursor-pointer hover:bg-[#458393] transition-colors" 
                  >
                    {i === 5 && (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#22303A] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        $42k
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <motion.div whileHover={{ scale: 1.02 }} className="bg-[#FFF3C8]/40 p-4 rounded-xl border border-[#E5CB90]/30 cursor-pointer">
                  <div className="text-sm text-[#5C6D71] mb-1">Win Rate</div>
                  <div className="text-2xl font-bold text-[#22303A]">34.2%</div>
                  <div className="text-xs text-[#34A99D] flex items-center gap-1 mt-1">
                    <TrendingUp size={12} /> +2.4%
                  </div>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="bg-[#FFF3C8]/40 p-4 rounded-xl border border-[#E5CB90]/30 cursor-pointer">
                  <div className="text-sm text-[#5C6D71] mb-1">Avg Deal Size</div>
                  <div className="text-2xl font-bold text-[#22303A]">$8,450</div>
                  <div className="text-xs text-[#34A99D] flex items-center gap-1 mt-1">
                    <TrendingUp size={12} /> +12.1%
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="order-1 md:order-2"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-[#22303A] mb-6">
              Insights that actually mean something.
            </h2>
            <p className="text-[#4A5A5F] mb-8 leading-relaxed">
              We've stripped away the vanity metrics and overly complex pivot tables. Our reports focus purely on the numbers that help you scale your business and fix leaks in your funnel.
            </p>
            
            <div className="space-y-6">
              {[
                { icon: PieChart, color: "text-[#458393]", bg: "bg-[#458393]/10", title: "Conversion Analytics", desc: "See exactly where leads drop off in your pipeline so you can optimize your follow-up strategy." },
                { icon: TrendingUp, color: "text-[#34A99D]", bg: "bg-[#34A99D]/10", title: "Revenue Forecasting", desc: "Predict your future income based on current pipeline velocity and historical win rates." },
                { icon: Eye, color: "text-[#B89830]", bg: "bg-[#E5CB90]/30", title: "Source Attribution", desc: "Know exactly which marketing channels are generating your highest-value clients." }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + (i * 0.15) }}
                  whileHover={{ x: 5 }}
                  className="flex gap-4 cursor-pointer"
                >
                  <div className={`w-10 h-10 shrink-0 ${item.bg} ${item.color} rounded-lg flex items-center justify-center`}>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#22303A] mb-1">{item.title}</h4>
                    <p className="text-sm text-[#5C6D71]">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Export Section */}
      <section className="py-24 px-6 sm:px-10 lg:px-16 bg-[#FFF3C8]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.4 }}
            className="w-16 h-16 mx-auto bg-white border border-[#E5CB90]/60 text-[#458393] rounded-2xl flex items-center justify-center mb-8 shadow-sm cursor-pointer"
          >
            <Download size={28} />
          </motion.div>
          <h2 className="text-3xl font-serif font-medium text-[#22303A] mb-4">Export and share in seconds.</h2>
          <p className="text-[#4A5A5F] max-w-2xl mx-auto mb-10">
            Need to present to stakeholders or send a quick update to the team? Generate beautiful PDF or CSV reports with a single click, directly from your dashboard.
          </p>
          <motion.a 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/signup" 
            className="inline-flex items-center gap-2 bg-white border border-[#E5CB90]/60 text-[#22303A] hover:bg-white/50 px-6 py-3 rounded-lg font-medium transition shadow-sm"
          >
            Try Reports Now
          </motion.a>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
