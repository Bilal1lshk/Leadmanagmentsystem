"use client";

import Image from "next/image";
import { ChangeEvent, useState } from "react";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "agent",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement|HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to sign up");
      }

      setSuccess("Account created successfully!");
      
      // Redirect after brief delay
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err:any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FFF3C8] px-4 py-12">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#458393]/10" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#34A99D]/10" />

      <div className="relative z-10 grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-2xl border border-[#E5CB90] bg-white shadow-[0_20px_60px_-15px_rgba(69,131,147,0.25)] md:grid-cols-2">

        {/* Left Brand Panel */}
        <div className="hidden flex-col justify-between bg-[#458393] p-10 md:flex">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image src="/favicon.ico" alt="Leadwise" width={32} height={32} />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-2xl font-medium leading-snug text-white">
              Track leads, not spreadsheets.
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-white/75">
              Join small teams and freelancers who manage every lead in one
              simple, organized place.
            </p>
          </div>

          {/* Dots */}
          <div className="flex gap-2">
            <div className="h-1.5 w-6 rounded-full bg-[#FFF3C8]" />
            <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
            <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
          </div>
        </div>

        {/* Right Form */}
        <div className="p-8 md:p-10">

          <h1 className="text-2xl font-medium text-[#2A3F45]">
            Create your account
          </h1>

          <p className="mt-1 text-sm text-[#5C6D71]">
            Start managing your leads in minutes.
          </p>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-xs font-medium text-emerald-600 border border-emerald-200">
              {success}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-7 flex flex-col gap-4"
          >

            {/* Full Name */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#2A3F45]">
                Full name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Bilal Sheikh"
                required
                disabled={loading}
                className="w-full rounded-lg border border-[#E5CB90] bg-[#FFF3C8]/30 px-4 py-2.5 text-sm text-[#2A3F45] outline-none transition-all placeholder:text-[#8A8A82] focus:border-[#458393] focus:bg-white focus:ring-2 focus:ring-[#458393]/10 disabled:opacity-50"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#2A3F45]">
                Email address
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
                required
                disabled={loading}
                className="w-full rounded-lg border border-[#E5CB90] bg-[#FFF3C8]/30 px-4 py-2.5 text-sm text-[#2A3F45] outline-none transition-all placeholder:text-[#8A8A82] focus:border-[#458393] focus:bg-white focus:ring-2 focus:ring-[#458393]/10 disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#2A3F45]">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                required
                minLength={8}
                disabled={loading}
                className="w-full rounded-lg border border-[#E5CB90] bg-[#FFF3C8]/30 px-4 py-2.5 text-sm text-[#2A3F45] outline-none transition-all placeholder:text-[#8A8A82] focus:border-[#458393] focus:bg-white focus:ring-2 focus:ring-[#458393]/10 disabled:opacity-50"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#2A3F45]">
                Account role
              </label>

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full rounded-lg border border-[#E5CB90] bg-[#FFF3C8]/30 px-4 py-2.5 text-sm text-[#2A3F45] outline-none transition-all focus:border-[#458393] focus:bg-white focus:ring-2 focus:ring-[#458393]/10 disabled:opacity-50"
              >
                <option value="agent">Agent (Sales Rep)</option>
                <option value="admin">Admin (Manager)</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-lg bg-[#34A99D] py-2.5 text-sm font-medium text-[#04342C] transition-all duration-200 hover:bg-[#2F958A] hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Login */}
          <p className="mt-6 text-center text-xs text-[#8A8A82]">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-[#458393] transition-colors hover:text-[#2A3F45]"
            >
              Log in
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}