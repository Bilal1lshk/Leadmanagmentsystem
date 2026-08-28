"use client";

import { motion } from "framer-motion";
import {
  Brain,
  BarChart3,
  PhoneCall,
  MessageSquareText,
  GitBranch,
  Workflow,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

interface AIFeature {
  title: string;
  description: string;
  icon: React.ElementType;
  tag: string;
}

const aiFeatures: AIFeature[] = [
  {
    title: "AI Lead Scoring",
    description:
      "Identify high-intent leads automatically and prioritize the prospects most likely to convert.",
    icon: Brain,
    tag: "AI Intelligence",
  },
  {
    title: "AI Sales Insights",
    description:
      "Turn your sales data into clear insights, trends, opportunities, and actionable recommendations.",
    icon: BarChart3,
    tag: "Smart Analytics",
  },
  {
    title: "AI Voice Agent",
    description:
      "Let AI handle calls, answer questions, qualify leads, and book appointments around the clock.",
    icon: PhoneCall,
    tag: "AI Voice",
  },
  {
    title: "Smart Follow-ups",
    description:
      "Automatically generate and send personalized follow-ups based on each lead's behavior and conversation history.",
    icon: MessageSquareText,
    tag: "Automation",
  },
  {
    title: "Pipeline Intelligence",
    description:
      "Predict deal outcomes, identify pipeline risks, and know exactly where your sales team should focus.",
    icon: GitBranch,
    tag: "Predictions",
  },
  {
    title: "AI Workflow Automation",
    description:
      "Connect your workflows with intelligent triggers and actions that automate repetitive sales tasks.",
    icon: Workflow,
    tag: "AI Automation",
  },
];

export default function AIFeatures() {
  return (
    <section id="features" className="relative overflow-hidden bg-[#FFF3C8] px-6 py-24 text-[#22303A] sm:px-10 lg:px-16">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#458393]/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#458393]/20 bg-white/50 px-4 py-2 text-sm text-[#458393] backdrop-blur">
            <Sparkles className="h-4 w-4" />
            AI-POWERED GROWTH
          </div>

          <h2 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl text-[#22303A]">
            Products that power{" "}
            <span className="bg-gradient-to-r from-[#458393] via-[#34A99D] to-[#458393] bg-clip-text text-transparent">
              growth.
            </span>
          </h2>

          <p className="mt-5 text-2xl font-medium text-[#22303A]">
            AI built in. Not bolted on.
          </p>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#4A5A5F] sm:text-lg">
            AI that doesn&apos;t just analyze your business — it actively helps
            you grow.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {aiFeatures.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                <div className="relative h-full overflow-hidden rounded-2xl border border-[#E5CB90]/60 bg-white/70 p-7 backdrop-blur-xl transition-all duration-300 group-hover:border-[#458393]/30 group-hover:bg-white">
                  {/* Hover glow */}
                  <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#458393]/5 blur-3xl transition-all duration-500 group-hover:bg-[#458393]/10" />

                  {/* Icon */}
                  <div className="relative mb-8 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#458393]/20 bg-[#458393]/10 text-[#458393] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#458393]/20">
                      <Icon className="h-6 w-6" />
                    </div>

                    <ArrowUpRight className="h-5 w-5 text-[#5C6D71] transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#458393]" />
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <span className="text-xs font-medium uppercase tracking-wider text-[#458393]">
                      {feature.tag}
                    </span>

                    <h3 className="mt-3 text-xl font-semibold tracking-tight text-[#22303A]">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-[#4A5A5F]">
                      {feature.description}
                    </p>
                  </div>

                  {/* Bottom animation line */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-[#458393] to-[#34A99D]"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}