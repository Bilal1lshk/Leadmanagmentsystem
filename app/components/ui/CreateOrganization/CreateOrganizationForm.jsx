"use client";

import { useState } from "react";
import { useAppDispatch } from "@/app/redux/hooks";
import {
  setActiveOrganization,
  setOrganizations,
} from "@/app/redux/organization";

const COMPANY_SIZES = [
  { value: "1-10", label: "1–10 employees" },
  { value: "11-50", label: "11–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201-500", label: "201–500 employees" },
  { value: "501-1000", label: "501–1,000 employees" },
  { value: "1000+", label: "1,000+ employees" },
];

export default function CreateOrganizationForm() {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({
    name: "",
    companySize: "1-10",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdOrganization, setCreatedOrganization] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setError("");
  };

  const validate = () => {
    const errors = {};
    const trimmedName = form.name.trim();

    if (!trimmedName) {
      errors.name = "Organization name is required.";
    } else if (trimmedName.length > 100) {
      errors.name = "Organization name must be 100 characters or fewer.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/organization/createoranizatiohn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          companySize: form.companySize,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to create organization.");
      }

      const org = data.organization;
      dispatch(setOrganizations([org]));
      dispatch(setActiveOrganization(org));
      setCreatedOrganization(org);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (createdOrganization) {
    return (
      <div className="rounded-lg border border-[#E5CB90] bg-[#FFF3C8]/40 p-4">
        <p className="text-sm font-medium text-[#2A3F45]">Your workspace is ready.</p>
        <p className="mt-2 text-xs text-[#5C6D71]">Share this workspace code with teammates so they can join:</p>
        <code className="mt-3 block rounded-md bg-white px-3 py-2 text-center text-sm font-semibold tracking-widest text-[#458393]">
          {createdOrganization.inviteCode}
        </code>
        <button onClick={() => { window.location.href = "/dashboard"; }} className="mt-4 w-full rounded-lg bg-[#34A99D] py-2.5 text-sm font-medium text-[#04342C] hover:bg-[#2F958A]">
          Continue to dashboard
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-xs font-medium text-[#2A3F45]">
          Workspace name
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Acme Inc."
          disabled={loading}
          className="w-full rounded-lg border border-[#E5CB90] bg-[#FFF3C8]/30 px-4 py-2.5 text-sm text-[#2A3F45] outline-none transition-all placeholder:text-[#8A8A82] focus:border-[#458393] focus:bg-white focus:ring-2 focus:ring-[#458393]/10 disabled:opacity-50"
        />
        {fieldErrors.name && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {fieldErrors.name}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-[#2A3F45]">
          Company size
        </label>
        <select
          name="companySize"
          value={form.companySize}
          onChange={handleChange}
          disabled={loading}
          className="w-full rounded-lg border border-[#E5CB90] bg-[#FFF3C8]/30 px-4 py-2.5 text-sm text-[#2A3F45] outline-none transition-all focus:border-[#458393] focus:bg-white focus:ring-2 focus:ring-[#458393]/10 disabled:opacity-50"
        >
          {COMPANY_SIZES.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-lg bg-[#34A99D] py-2.5 text-sm font-medium text-[#04342C] transition-all duration-200 hover:bg-[#2F958A] hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create workspace"}
      </button>
    </form>
  );
}
