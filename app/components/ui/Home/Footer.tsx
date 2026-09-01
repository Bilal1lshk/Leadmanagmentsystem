"use client";

import Link from "next/link";
import Image from "next/image";
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
    <footer className="border-t border-[#E5CB90]/60 bg-[#FFF3C8] text-[#22303A]">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        {/* Main footer */}
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image src="/favicon.ico" alt="Leadwise" width={36} height={36} />
              <span className="text-lg font-semibold tracking-tight text-[#22303A]" style={{display: "none"}}>Leadwise</span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-6 text-[#4A5A5F]">
              An intelligent sales platform built to help businesses capture
              more leads, automate their workflows, and turn opportunities
              into growth.
            </p>

            {/* CTA */}
            <Link
              href="/signup"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#458393] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#34A99D]"
            >
              Book a Demo
              <FaArrowUp className="h-4 w-4" />
            </Link>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-[#22303A]">Product</h3>

            <ul className="mt-5 space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#5C6D71] transition hover:text-[#22303A]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-[#22303A]">Company</h3>

            <ul className="mt-5 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#5C6D71] transition hover:text-[#22303A]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-y border-[#E5CB90]/60 py-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h3 className="text-sm font-medium text-[#22303A]">
                Stay ahead with AI-powered sales.
              </h3>

              <p className="mt-1 text-xs text-[#5C6D71]">
                Get product updates and insights delivered to your inbox.
              </p>
            </div>

            <form className="flex w-full max-w-md gap-2">
              <div className="relative flex-1">
                <CiMail  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5C6D71]" />

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="h-11 w-full rounded-lg border border-[#E5CB90]/60 bg-white pl-10 pr-4 text-sm text-[#22303A] outline-none placeholder:text-[#5C6D71] focus:border-[#458393]/60"
                />
              </div>

              <button
                type="submit"
                className="rounded-lg bg-[#458393] px-5 text-sm font-medium text-white transition hover:bg-[#34A99D]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-6 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#5C6D71]">
            © {new Date().getFullYear()} Leadwise. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="text-xs text-[#5C6D71] transition hover:text-[#22303A]"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="text-xs text-[#5C6D71] transition hover:text-[#22303A]"
            >
              Terms
            </Link>

            <Link
              href="https://linkedin.com"
              target="_blank"
              aria-label="LinkedIn"
              className="text-[#5C6D71] transition hover:text-[#22303A]"
            >
              <CiLinkedin className="h-4 w-4" />
            </Link>

            <Link
              href="https://twitter.com"
              target="_blank"
              aria-label="Twitter"
              className="text-[#5C6D71] transition hover:text-[#22303A]"
            >
              <FaTwitter className="h-4 w-4" />
            </Link>

            <Link
              href="https://github.com"
              target="_blank"
              aria-label="GitHub"
              className="text-[#5C6D71] transition hover:text-[#22303A]"
            >
              <FaGithub className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}