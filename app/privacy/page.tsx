import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how LeadWise handles account, authentication, and product data.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FFF8E8] px-6 py-12 text-[#22303A] sm:px-10 lg:px-16">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-medium text-[#458393] hover:underline">
          LeadWise
        </Link>
        <h1 className="mt-8 text-4xl font-semibold tracking-tight">Privacy Policy</h1>
        <p className="mt-3 text-sm text-[#5C6D71]">Last updated: September 6, 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-7 text-[#405158]">
          <section>
            <h2 className="text-xl font-semibold text-[#22303A]">1. About this policy</h2>
            <p className="mt-2">
              This Privacy Policy explains how LeadWise handles information when you use this lead management service, website, and related features. By using LeadWise, you acknowledge the practices described here.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#22303A]">2. Information we collect</h2>
            <p className="mt-2">
              We may collect information you provide when you create an account or workspace, such as your name, email address, organization details, leads, tasks, follow-ups, and other content you choose to store. When you sign in with Google, we receive the basic profile information Google makes available, such as your name, email address, and profile image.
            </p>
            <p className="mt-2">
              We also receive technical information needed to operate and secure the service, including authentication records, browser information, and basic request logs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#22303A]">3. How we use information</h2>
            <p className="mt-2">
              Information is used to provide and secure LeadWise, authenticate users, manage workspaces and permissions, save your sales data, respond to support requests, improve reliability, and detect misuse. We do not sell your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#22303A]">4. Google user data</h2>
            <p className="mt-2">
              LeadWise uses Google sign-in only to authenticate your account and associate your Google profile with your LeadWise account. We do not use Google user data for advertising, sell it, or transfer it to third parties except as needed to provide the service, comply with law, or protect the service and its users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#22303A]">5. Storage and sharing</h2>
            <p className="mt-2">
              Your information may be processed by the infrastructure and service providers required to host, authenticate, and operate LeadWise. We limit access to information to what is needed for those purposes and require service providers to protect it. We may disclose information when required by law or when necessary to prevent fraud, abuse, or security threats.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#22303A]">6. Your choices</h2>
            <p className="mt-2">
              You can review or update account information through the product where those controls are available. You may stop using LeadWise at any time. To request access, correction, or deletion of personal information, contact the service operator using the support contact provided with your deployment.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#22303A]">7. Changes and contact</h2>
            <p className="mt-2">
              We may update this policy as LeadWise changes. The date above shows when it was last revised. For privacy questions, use the support contact provided by the LeadWise service operator.
            </p>
          </section>
        </div>

        <div className="mt-12 flex gap-5 border-t border-[#E5CB90] pt-6 text-sm">
          <Link href="/terms" className="font-medium text-[#458393] hover:underline">Terms of Service</Link>
          <Link href="/" className="font-medium text-[#458393] hover:underline">Back to LeadWise</Link>
        </div>
      </article>
    </main>
  );
}
