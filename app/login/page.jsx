"use client";

import { useState } from "react";
import { ChartLine } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const data=JSON.stringify(form)
     try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to log in");
      }

      setSuccess("Login successful!");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect after brief delay to let user see success message
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-cream px-4 py-12">

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-teal/10" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-brand-emerald/10" />

      <div className="relative z-10 grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-2xl border border-brand-tan bg-white shadow-[0_20px_60px_-15px_rgba(69,131,147,0.25)] md:grid-cols-2">

        {/* Left Brand Panel */}
        <div className="hidden flex-col justify-between bg-brand-teal p-10 md:flex">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-cream">
              <ChartLine className="h-4 w-4 text-brand-teal" />
            </div>

            <span className="text-lg font-medium text-white">
              Leadwise
            </span>
          </div>

          {/* Content */}
          <div>
            <h2 className="text-2xl font-medium leading-snug text-white">
              Your leads. Your pipeline. Your growth.
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-white/75">
              Stay organized, follow up faster, and turn more opportunities
              into customers with Leadwise.
            </p>
          </div>

          {/* Dots */}
          <div className="flex gap-2">
            <div className="h-1.5 w-6 rounded-full bg-brand-cream" />
            <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
            <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
          </div>
        </div>

        {/* Right Form */}
        <div className="p-8 md:p-10">

          <h1 className="text-2xl font-medium text-brand-navy">
            Welcome back
          </h1>

          <p className="mt-1 text-sm text-brand-gray">
            Log in to continue managing your leads.
          </p>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 rounded-lg bg-brand-emerald/10 p-3 text-xs font-medium text-brand-emerald border border-brand-emerald/30">
              {success}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-7 flex flex-col gap-4"
          >

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-navy">
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
                className="w-full rounded-lg border border-brand-tan bg-brand-cream/30 px-4 py-2.5 text-sm text-brand-navy outline-none transition-all placeholder:text-brand-gray focus:border-brand-teal focus:bg-white focus:ring-2 focus:ring-brand-teal/10 disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-xs font-medium text-brand-navy">
                  Password
                </label>

                <a
                  href="/forgot-password"
                  className="text-xs font-medium text-brand-teal transition-colors hover:text-brand-navy"
                >
                  Forgot password?
                </a>
              </div>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                disabled={loading}
                className="w-full rounded-lg border border-brand-tan bg-brand-cream/30 px-4 py-2.5 text-sm text-brand-navy outline-none transition-all placeholder:text-brand-gray focus:border-brand-teal focus:bg-white focus:ring-2 focus:ring-brand-teal/10 disabled:opacity-50"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-lg bg-brand-teal py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-brand-teal-dark hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          {/* Signup */}
          <p className="mt-6 text-center text-xs text-brand-gray">
            Dont have an account?
            <a
              href="/signup"
              className="font-medium text-brand-teal transition-colors hover:text-brand-navy"
            >
              Create an account
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}