"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { Menu, X } from "lucide-react";
interface ApiResponse {
  success: boolean;
}

interface OrganizationApiResponse extends ApiResponse {
  organizations?: unknown[];
}

export default function Navbar() {
  const [user, setUser] = useState<boolean>(false);
  const [activeOrganization, setActiveOrganization] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  useEffect(() => {
    const getUserAndOrganization = async (): Promise<void> => {
      try {
        const [userResponse, organizationResponse] = await Promise.all([
          axios.get<ApiResponse>("/api/auth/me"),
          axios.get<OrganizationApiResponse>("/api/organization/my"),
        ]);
        setUser(userResponse.data.success);
        setActiveOrganization(
          Boolean(organizationResponse.data.organizations?.length),
        );
      } catch (error: unknown) {
        console.error("Failed to fetch user or organization:", error);
        setUser(false);
        setActiveOrganization(false);
      } finally {
        setAuthLoading(false);
      }
    };
    getUserAndOrganization();
  }, []);
  return (
    <nav className="relative rounded-xl bg-[#FFF3C8] px-5 py-3.5">
      {" "}
      <div className="flex items-center justify-between gap-4">
        {" "}
        {/* Logo */}{" "}
        <div className="flex items-center gap-2">
          {" "}
          <Image
            src="/favicon.ico"
            alt="Leadwise"
            width={32}
            height={32}
          />{" "}
        </div>{" "}
        {/* Desktop Navigation */}{" "}
        <div className="hidden items-center gap-7 md:flex">
          {" "}
          <a
            href="#features"
            className="text-sm text-[#5C6D71] hover:text-[#2A3F45]"
          >
            {" "}
            Features{" "}
          </a>{" "}
          <a
            href="/pipeline"
            className="text-sm text-[#5C6D71] hover:text-[#2A3F45]"
          >
            {" "}
            Pipeline{" "}
          </a>{" "}
          <a
            href="/Dashdetails"
            className="text-sm text-[#5C6D71] hover:text-[#2A3F45]"
          >
            {" "}
            Reports{" "}
          </a>{" "}
        </div>{" "}
        {/* Desktop Right Side */}{" "}
        <div className="hidden items-center gap-3 md:flex">
          {" "}
          {authLoading ? (
            <div className="h-9 w-32" aria-hidden="true" />
          ) : user ? (
            <a
              href={activeOrganization ? "/dashboard" : "/setupworkspace"}
              className="rounded-lg bg-[#34A99D] px-4 py-2 text-sm font-medium text-[#04342C] hover:bg-[#2F958A]"
            >
              {" "}
              {activeOrganization ? "Open dashboard" : "Set up workspace"}{" "}
            </a>
          ) : (
            <>
              {" "}
              <a
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-[#2A3F45] hover:bg-white/70"
              >
                {" "}
                Log in{" "}
              </a>{" "}
              <a
                href="/signup"
                className="rounded-lg bg-[#34A99D] px-4 py-2 text-sm font-medium text-[#04342C] hover:bg-[#2F958A]"
              >
                {" "}
                Get started{" "}
              </a>{" "}
            </>
          )}{" "}
        </div>{" "}
        {/* Mobile Menu Button */}{" "}
        <button
          type="button"
          onClick={() => setMobileOpen((previous) => !previous)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#2A3F45] hover:bg-white/70 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {" "}
          {mobileOpen ? <X size={25} /> : <Menu size={27} />}{" "}
        </button>{" "}
      </div>{" "}
      {/* Mobile Navigation */}{" "}
      {mobileOpen && (
        <div className="mt-3.5 flex flex-col gap-1 border-t border-[#E5CB90]/60 pt-3.5 md:hidden">
          {" "}
          <a
            href="#features"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#5C6D71] hover:bg-white/60 hover:text-[#2A3F45]"
          >
            {" "}
            Features{" "}
          </a>{" "}
          <a
            href="/pipeline"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#5C6D71] hover:bg-white/60 hover:text-[#2A3F45]"
          >
            {" "}
            Pipeline{" "}
          </a>{" "}
          <a
            href="/Dashdetails"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#5C6D71] hover:bg-white/60 hover:text-[#2A3F45]"
          >
            
            Reports
          </a>
          {/* Mobile Auth / Dashboard */}
          <div className="mt-2 flex flex-col gap-2 border-t border-[#E5CB90]/60 pt-3">
            
            {authLoading ? (
              <div className="h-10" aria-hidden="true" />
            ) : user ? (
              <a
                href={activeOrganization ? "/dashboard" : "/setupworkspace"}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg bg-[#34A99D] px-4 py-2.5 text-center text-sm font-medium text-[#04342C] hover:bg-[#2F958A]"
              >
                
                {activeOrganization
                  ? "Open dashboard"
                  : "Set up workspace"}
              </a>
            ) : (
              <>
                
                <a
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-2.5 text-center text-sm font-medium text-[#2A3F45] hover:bg-white/70"
                >
                  
                  Log in
                </a>
                <a
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg bg-[#34A99D] px-4 py-2.5 text-center text-sm font-medium text-[#04342C] hover:bg-[#2F958A]"
                >
                  
                  Get started
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
