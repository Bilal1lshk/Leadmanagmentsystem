"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import axios from "axios";
import { ArrowLeft, Mail, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post("/api/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to send reset code");
      }

      setSuccess("A 6-digit reset code has been sent to your email.");
      
      // Redirect to reset password page with email prefilled
      setTimeout(() => {
        window.location.href = `/reset-password?email=${encodeURIComponent(email.trim().toLowerCase())}`;
      }, 1500);
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.response?.data?.error
        : err instanceof Error
          ? err.message
          : "Failed to send reset code";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FFF3C8] px-4 py-12">
      {/* Decorative background accents */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#458393]/10" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#34A99D]/10" />

      <div className="relative z-10 grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-2xl border border-[#E5CB90] bg-white shadow-[0_20px_60px_-15px_rgba(69,131,147,0.25)] md:grid-cols-2">
        {/* Left Brand Panel */}
        <div className="hidden flex-col justify-between bg-[#458393] p-10 md:flex">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2">
            <Image src="/favicon.ico" alt="Leadwise" width={32} height={32} />
            <span className="text-xl font-semibold text-white tracking-tight">Leadwise</span>
          </Link>

          {/* Message */}
          <div>
            <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 text-white">
              <Mail className="w-6 h-6 text-[#FFF3C8]" />
            </div>
            <h2 className="text-2xl font-medium leading-snug text-white">
              Quick & secure account recovery.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              Enter your email address and we&apos;ll send you a 6-digit code to securely reset your password.
            </p>
          </div>

          {/* Dots Indicator */}
          <div className="flex gap-2">
            <div className="h-1.5 w-6 rounded-full bg-[#FFF3C8]" />
            <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
            <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="p-8 md:p-10 flex flex-col justify-between">
          <div>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#458393] hover:text-[#2A3F45] transition-colors mb-6"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to login
            </Link>

            <h1 className="text-2xl font-medium text-[#2A3F45]">
              Forgot password?
            </h1>
            <p className="mt-1.5 text-sm text-[#5C6D71] leading-relaxed">
              No worries, enter your account email and we&apos;ll send you a verification code to reset it.
            </p>

            {error && (
              <div className="mt-5 rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-200 animate-[fadeIn_0.2s_ease-out]">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-5 rounded-lg bg-emerald-50 p-3.5 text-xs font-medium text-emerald-700 border border-emerald-200 flex items-start gap-2.5 animate-[fadeIn_0.2s_ease-out]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p>{success}</p>
                  <p className="mt-1 text-[11px] text-emerald-600/80">Redirecting to reset page...</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div>
                <label htmlFor="reset-email" className="mb-1.5 block text-xs font-medium text-[#2A3F45]">
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="reset-email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    disabled={loading || !!success}
                    className="w-full rounded-lg border border-[#E5CB90] bg-[#FFF3C8]/30 px-4 py-2.5 text-sm text-[#2A3F45] outline-none transition-all placeholder:text-[#8A8A82] focus:border-[#458393] focus:bg-white focus:ring-2 focus:ring-[#458393]/10 disabled:opacity-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim() || !!success}
                className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-[#34A99D] py-2.5 text-sm font-medium text-[#04342C] transition-all duration-200 hover:bg-[#2F958A] hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending code..." : "Send reset code"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </div>

          <div className="mt-8 border-t border-[#E5CB90]/40 pt-4 text-center">
            <p className="text-xs text-[#8A8A82]">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-medium text-[#458393] hover:text-[#2A3F45] transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
