"use client";

import Link from "next/link";
import { CiLinkedin ,CiMail } from "react-icons/ci";
import { FaTwitter,FaGithub,FaArrowUp } from "react-icons/fa";


const productLinks = [
  { label: "AI Lead Scoring", href: "#features" },
  { label: "AI Sales Insights", href: "#features" },
  { label: "AI Voice Agent", href: "#features" },
  { label: "Smart Follow-ups", href: "#features" },
  { label: "Pipeline Intelligence", href: "#features" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Book a Demo", href: "/book-demo" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050505] text-white">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        {/* Main footer */}
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-black">
                <span className="text-sm font-bold">AI</span>
              </div>

              <span className="text-lg font-semibold tracking-tight">
                YourProduct
              </span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-6 text-zinc-400">
              An intelligent sales platform built to help businesses capture
              more leads, automate their workflows, and turn opportunities
              into growth.
            </p>

            {/* CTA */}
            <Link
              href="/book-demo"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200"
            >
              Book a Demo
              <FaArrowUp className="h-4 w-4" />
            </Link>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold">Product</h3>

            <ul className="mt-5 space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold">Company</h3>

            <ul className="mt-5 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-y border-white/10 py-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h3 className="text-sm font-medium">
                Stay ahead with AI-powered sales.
              </h3>

              <p className="mt-1 text-xs text-zinc-500">
                Get product updates and insights delivered to your inbox.
              </p>
            </div>

            <form className="flex w-full max-w-md gap-2">
              <div className="relative flex-1">
                <CiMail  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.03] pl-10 pr-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-blue-400/40"
                />
              </div>

              <button
                type="submit"
                className="rounded-lg bg-white px-5 text-sm font-medium text-black transition hover:bg-zinc-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-6 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} YourProduct. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="text-xs text-zinc-600 transition hover:text-white"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="text-xs text-zinc-600 transition hover:text-white"
            >
              Terms
            </Link>

            <Link
              href="https://linkedin.com"
              target="_blank"
              aria-label="LinkedIn"
              className="text-zinc-600 transition hover:text-white"
            >
              <CiLinkedin className="h-4 w-4" />
            </Link>

            <Link
              href="https://twitter.com"
              target="_blank"
              aria-label="Twitter"
              className="text-zinc-600 transition hover:text-white"
            >
              <FaTwitter className="h-4 w-4" />
            </Link>

            <Link
              href="https://github.com"
              target="_blank"
              aria-label="GitHub"
              className="text-zinc-600 transition hover:text-white"
            >
              <FaGithub className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}