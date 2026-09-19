"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { ArrowLeft, KeyRound, Eye, EyeOff, CheckCircle2, RotateCcw } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams?.get("email") || "";
  const initialCode = searchParams?.get("code") || "";

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState(initialCode);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");

  const handleResendCode = async () => {
    if (!email.trim()) {
      setError("Please provide your email address to resend the code.");
      return;
    }
    setError("");
    setResendSuccess("");
    setResending(true);

    try {
      const response = await axios.post("/api/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to resend reset code");
      }
      setResendSuccess("A new reset code has been sent to your email.");
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.response?.data?.error
        : err instanceof Error
          ? err.message
          : "Failed to resend reset code";
      setError(message);
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setResendSuccess("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!code.trim() || code.trim().length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/auth/reset-password", {
        email: email.trim().toLowerCase(),
        code: code.trim(),
        newPassword,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to reset password");
      }

      setSuccess("Your password has been reset successfully! Redirecting to login...");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.response?.data?.error
        : err instanceof Error
          ? err.message
          : "Failed to reset password";
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
              <KeyRound className="w-6 h-6 text-[#FFF3C8]" />
            </div>
            <h2 className="text-2xl font-medium leading-snug text-white">
              Set your new password.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              Choose a strong password with at least 8 characters to keep your account secure.
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
              href="/forgot-password"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#458393] hover:text-[#2A3F45] transition-colors mb-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Change email
            </Link>

            <h1 className="text-2xl font-medium text-[#2A3F45]">
              Reset Password
            </h1>
            <p className="mt-1 text-sm text-[#5C6D71]">
              Enter the 6-digit code sent to your email and your new password.
            </p>

            {error && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-200 animate-[fadeIn_0.2s_ease-out]">
                {error}
              </div>
            )}

            {resendSuccess && (
              <div className="mt-4 rounded-lg bg-blue-50 p-3 text-xs font-medium text-blue-700 border border-blue-200 animate-[fadeIn_0.2s_ease-out]">
                {resendSuccess}
              </div>
            )}

            {success && (
              <div className="mt-4 rounded-lg bg-emerald-50 p-3.5 text-xs font-medium text-emerald-700 border border-emerald-200 flex items-start gap-2.5 animate-[fadeIn_0.2s_ease-out]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p>{success}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3.5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-1 block text-xs font-medium text-[#2A3F45]">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  disabled={loading || !!success}
                  className="w-full rounded-lg border border-[#E5CB90] bg-[#FFF3C8]/30 px-3.5 py-2 text-sm text-[#2A3F45] outline-none transition-all placeholder:text-[#8A8A82] focus:border-[#458393] focus:bg-white focus:ring-2 focus:ring-[#458393]/10 disabled:opacity-50"
                />
              </div>

              {/* 6-Digit Code */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label htmlFor="code" className="block text-xs font-medium text-[#2A3F45]">
                    6-Digit Verification Code
                  </label>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resending || loading || !email.trim() || !!success}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#458393] hover:text-[#2A3F45] transition-colors disabled:opacity-50"
                  >
                    <RotateCcw className={`w-3 h-3 ${resending ? "animate-spin" : ""}`} />
                    {resending ? "Resending..." : "Resend code"}
                  </button>
                </div>
                <input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="123456"
                  maxLength={6}
                  required
                  disabled={loading || !!success}
                  className="w-full rounded-lg border border-[#E5CB90] bg-[#FFF3C8]/30 px-3.5 py-2 text-center text-lg font-mono tracking-[0.25em] text-[#2A3F45] outline-none transition-all placeholder:text-[#8A8A82] placeholder:tracking-normal focus:border-[#458393] focus:bg-white focus:ring-2 focus:ring-[#458393]/10 disabled:opacity-50"
                />
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="mb-1 block text-xs font-medium text-[#2A3F45]">
                  New Password (min 8 chars)
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    minLength={8}
                    required
                    disabled={loading || !!success}
                    className="w-full rounded-lg border border-[#E5CB90] bg-[#FFF3C8]/30 px-3.5 py-2 pr-10 text-sm text-[#2A3F45] outline-none transition-all placeholder:text-[#8A8A82] focus:border-[#458393] focus:bg-white focus:ring-2 focus:ring-[#458393]/10 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A82] hover:text-[#2A3F45]"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="mb-1 block text-xs font-medium text-[#2A3F45]">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    minLength={8}
                    required
                    disabled={loading || !!success}
                    className="w-full rounded-lg border border-[#E5CB90] bg-[#FFF3C8]/30 px-3.5 py-2 pr-10 text-sm text-[#2A3F45] outline-none transition-all placeholder:text-[#8A8A82] focus:border-[#458393] focus:bg-white focus:ring-2 focus:ring-[#458393]/10 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A82] hover:text-[#2A3F45]"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !code.trim() || code.length !== 6 || newPassword.length < 8 || !confirmPassword || !!success}
                className="mt-2 rounded-lg bg-[#34A99D] py-2.5 text-sm font-medium text-[#04342C] transition-all duration-200 hover:bg-[#2F958A] hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Resetting password..." : "Reset password"}
              </button>
            </form>
          </div>

          <div className="mt-6 border-t border-[#E5CB90]/40 pt-3 text-center">
            <p className="text-xs text-[#8A8A82]">
              Back to{" "}
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FFF3C8]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#458393] border-t-transparent" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
