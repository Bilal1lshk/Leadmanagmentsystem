"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { ChartLine } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { useAppDispatch } from "@/app/redux/hooks";
import { setUser } from "@/app/redux/auth";
import events from "node:events";
import { NextError } from "next/dist/lib/is-error";
interface Errorlocal{
  message?:string
}

export default function Login() {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = ( e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if(!e)return
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
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
      dispatch(setUser(data.user));

      // Redirect after brief delay to let user see success message
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
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
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF3C8]">
              <ChartLine className="h-4 w-4 text-[#458393]" />
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
            <div className="h-1.5 w-6 rounded-full bg-[#FFF3C8]" />
            <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
            <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
          </div>
        </div>

        {/* Right Form */}
        <div className="p-8 md:p-10">

          <h1 className="text-2xl font-medium text-[#2A3F45]">
            Welcome back
          </h1>

          <p className="mt-1 text-sm text-[#5C6D71]">
            Log in to continue managing your leads.
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

          <div className="mt-7">
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#E5CB90] bg-white py-2.5 text-sm font-medium text-[#2A3F45] transition-all hover:bg-gray-50 active:scale-[0.98]"
            >
              <FcGoogle className="h-5 w-5" />
              Log in with Google
            </button>

            <div className="my-5 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-[#E5CB90] after:mt-0.5 after:flex-1 after:border-t after:border-[#E5CB90]">
              <p className="mx-4 mb-0 text-center text-xs font-medium text-[#8A8A82]">
                OR
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >

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
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-xs font-medium text-[#2A3F45]">
                  Password
                </label>

                <a
                  href="/forgot-password"
                  className="text-xs font-medium text-[#458393] transition-colors hover:text-[#2A3F45]"
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
                className="w-full rounded-lg border border-[#E5CB90] bg-[#FFF3C8]/30 px-4 py-2.5 text-sm text-[#2A3F45] outline-none transition-all placeholder:text-[#8A8A82] focus:border-[#458393] focus:bg-white focus:ring-2 focus:ring-[#458393]/10 disabled:opacity-50"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-lg bg-[#34A99D] py-2.5 text-sm font-medium text-[#04342C] transition-all duration-200 hover:bg-[#2F958A] hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          {/* Signup */}
          <p className="mt-6 text-center text-xs text-[#8A8A82]">
            Dont have an account?
            <a
              href="/signup"
              className="font-medium text-[#458393] transition-colors hover:text-[#2A3F45]"
            >
              Create an account
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}
