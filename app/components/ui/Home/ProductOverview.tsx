"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  Check,
  Gauge,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

const benefits = [
  "Capture and manage leads from one place",
  "AI automatically prioritizes high-value opportunities",
  "Automate follow-ups and repetitive sales tasks",
  "Get real-time insights into your sales pipeline",
];

export default function ProductOverview() {
  return (
    <section className="relative overflow-hidden bg-[#050505] px-6 py-24 text-white sm:px-10 lg:px-16">
      {/* Background */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[160px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Top content */}
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
              <Sparkles className="h-4 w-4" />
              THE INTELLIGENT SALES PLATFORM
            </div>

            <h2 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Your entire sales operation,{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                powered by AI.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
              Bring your leads, conversations, pipeline, and sales workflows
              together in one intelligent platform. Our AI works alongside
              your team to identify opportunities, automate repetitive work,
              and help you close more deals.
            </p>

            {/* Benefits */}
            <div className="mt-8 space-y-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-start gap-3 text-sm text-zinc-300"
                >
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-blue-400">
                    <Check className="h-3 w-3" />
                  </div>

                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right - Product Preview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="rounded-2xl border border-white/10 bg-[#0b0b0d] p-4 shadow-2xl shadow-blue-950/20">
              {/* Browser top */}
              <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
                </div>

                <div className="rounded-md bg-white/5 px-8 py-1.5 text-[10px] text-zinc-500">
                  dashboard.app
                </div>

                <div />
              </div>

              {/* Dashboard */}
              <div className="grid gap-3 sm:grid-cols-2">
                {/* Revenue */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">
                      Pipeline Value
                    </span>

                    <TrendingUp className="h-4 w-4 text-blue-400" />
                  </div>

                  <div className="mt-3 text-2xl font-semibold">
                    $284.6K
                  </div>

                  <div className="mt-2 text-xs text-emerald-400">
                    +18.4% this month
                  </div>
                </div>

                {/* Leads */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">
                      Qualified Leads
                    </span>

                    <Users className="h-4 w-4 text-blue-400" />
                  </div>

                  <div className="mt-3 text-2xl font-semibold">1,284</div>

                  <div className="mt-2 text-xs text-blue-400">
                    AI qualified
                  </div>
                </div>

                {/* AI Score */}
                <div className="rounded-xl border border-blue-400/20 bg-blue-500/[0.06] p-5 sm:col-span-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
                      <Brain className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        AI Lead Intelligence
                      </p>
                      <p className="text-xs text-zinc-500">
                        Analyzing your pipeline
                      </p>
                    </div>

                    <span className="ml-auto text-xs text-emerald-400">
                      Active
                    </span>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div>
                      <div className="mb-2 flex justify-between text-xs">
                        <span className="text-zinc-400">
                          High-intent leads
                        </span>
                        <span className="text-white">82%</span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "82%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1 }}
                          className="h-full rounded-full bg-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex justify-between text-xs">
                        <span className="text-zinc-400">
                          Conversion probability
                        </span>
                        <span className="text-white">74%</span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "74%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full rounded-full bg-cyan-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI notification */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-6 -left-6 hidden w-64 rounded-xl border border-white/10 bg-[#111114] p-4 shadow-xl sm:block"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <Zap className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-xs font-medium">
                      AI Recommendation
                    </p>

                    <p className="mt-1 text-[11px] text-zinc-500">
                      Follow up with Sarah today
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-28 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-white/[0.03] to-transparent px-6 py-14 text-center sm:px-12"
        >
          <div className="mx-auto max-w-3xl">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
              <Gauge className="h-6 w-6" />
            </div>

            <h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to turn your sales process into a growth engine?
            </h3>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
              See how AI can help your team capture more leads, automate
              follow-ups, and close more opportunities.
            </p>

            <motion.a
              href="/book-demo"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
            >
              Book a Demo
              <ArrowRight className="h-4 w-4" />
            </motion.a>

            <p className="mt-4 text-xs text-zinc-600">
              See the platform in action. No commitment required.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}