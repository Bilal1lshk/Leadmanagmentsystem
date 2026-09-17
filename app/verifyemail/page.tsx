"use client";

import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { FormEvent, useState } from "react";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("email")?.trim().toLowerCase() || "";
    }
    return "";
  });
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const getErrorMessage = (value: unknown, fallback: string) => {
    if (axios.isAxiosError(value)) {
      return value.response?.data?.message || value.response?.data?.error || fallback;
    }
    return value instanceof Error ? value.message : fallback;
  };

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        "/api/auth/verify-email",
        { email: email.trim().toLowerCase(), code: code.trim() },
        { headers: { "Content-Type": "application/json" } },
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Unable to verify your email.");
      }

      setMessage("Email verified successfully. Redirecting to login...");
      window.setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch (verificationError) {
      setError(getErrorMessage(verificationError, "Unable to verify your email."));
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setMessage("");
    setResending(true);

    try {
      const response = await axios.post("/api/Email/SendMail", {
        email: email.trim().toLowerCase(),
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Unable to send a new code.");
      }

      setMessage("A new verification code was sent to your email.");
    } catch (resendError) {
      setError(getErrorMessage(resendError, "Unable to send a new code."));
    } finally {
      setResending(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FFF3C8] px-4 py-12">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#458393]/10" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#34A99D]/10" />

      <section className="relative z-10 w-full max-w-md rounded-2xl border border-[#E5CB90] bg-white p-8 shadow-[0_20px_60px_-15px_rgba(69,131,147,0.25)] md:p-10">
        <Link href="/" aria-label="Go to home" className="mb-8 inline-flex">
          <Image src="/favicon.ico" alt="Leadwise" width={36} height={36} />
        </Link>

        <h1 className="text-2xl font-medium text-[#2A3F45]">Verify your email</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#5C6D71]">
          Enter the six-digit code we sent to your email address.
        </p>

        {error && <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
        {message && <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-600">{message}</div>}

        <form onSubmit={handleVerify} className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="verification-email" className="mb-1.5 block text-xs font-medium text-[#2A3F45]">Email address</label>
            <input
              id="verification-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={loading || resending}
              className="w-full rounded-lg border border-[#E5CB90] bg-[#FFF3C8]/30 px-4 py-2.5 text-sm text-[#2A3F45] outline-none focus:border-[#458393] focus:bg-white"
            />
          </div>
          <div>
            <label htmlFor="verification-code" className="mb-1.5 block text-xs font-medium text-[#2A3F45]">Verification code</label>
            <input
              id="verification-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="123456"
              required
              maxLength={6}
              disabled={loading || resending}
              className="w-full rounded-lg border border-[#E5CB90] bg-[#FFF3C8]/30 px-4 py-3 text-center text-xl tracking-[0.35em] text-[#2A3F45] outline-none focus:border-[#458393] focus:bg-white"
            />
          </div>
          <button type="submit" disabled={loading || resending || code.length !== 6 || !email} className="rounded-lg bg-[#34A99D] py-2.5 text-sm font-medium text-[#04342C] hover:bg-[#2F958A] disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? "Verifying..." : "Verify email"}
          </button>
          <button type="button" onClick={handleResend} disabled={loading || resending || !email} className="text-sm font-medium text-[#458393] hover:text-[#2A3F45] disabled:opacity-50">
            {resending ? "Sending code..." : "Resend verification code"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#8A8A82]">
          <Link href="/signup" className="font-medium text-[#458393] hover:text-[#2A3F45]">Back to signup</Link>
        </p>
      </section>
    </main>
  );
}
