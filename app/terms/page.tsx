import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the terms that apply when you use the LeadWise service.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-[#FFF8E8] px-6 py-12 text-[#22303A] sm:px-10 lg:px-16">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-medium text-[#458393] hover:underline">
          LeadWise
        </Link>
        <h1 className="mt-8 text-4xl font-semibold tracking-tight">Terms of Service</h1>
        <p className="mt-3 text-sm text-[#5C6D71]">Last updated: September 6, 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-7 text-[#405158]">
          <section>
            <h2 className="text-xl font-semibold text-[#22303A]">1. Acceptance</h2>
            <p className="mt-2">
              These Terms of Service govern your use of LeadWise, a lead management and sales workspace. By creating an account, signing in, or using the service, you agree to these terms. If you use LeadWise for an organization, you confirm that you have authority to accept these terms on its behalf.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#22303A]">2. Your account</h2>
            <p className="mt-2">
              You are responsible for providing accurate account information, protecting your login credentials, and activity that occurs through your account. You must not impersonate another person, create accounts through unauthorized automation, or use the service if you are not legally able to accept these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#22303A]">3. Acceptable use</h2>
            <p className="mt-2">
              You may use LeadWise only for lawful business and collaboration purposes. You must not use it to violate privacy or other rights, distribute malicious code, interfere with the service, attempt unauthorized access, or upload content that is unlawful, abusive, or harmful.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#22303A]">4. Your content</h2>
            <p className="mt-2">
              You retain responsibility for the leads, contacts, notes, tasks, and other content you submit to LeadWise. You confirm that you have the rights and permissions needed to use that content. You grant LeadWise permission to process it only as needed to provide, secure, and improve the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#22303A]">5. Google sign-in</h2>
            <p className="mt-2">
              You may access LeadWise using Google authentication. Your use of Google sign-in is also subject to Google&apos;s applicable terms and policies. LeadWise does not control Google&apos;s availability or authentication service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#22303A]">6. Availability and changes</h2>
            <p className="mt-2">
              We work to keep LeadWise available and secure, but the service may change, be interrupted, or include errors. We may add, modify, or discontinue features and may suspend access when needed for security, legal compliance, or serious misuse.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#22303A]">7. Disclaimer and liability</h2>
            <p className="mt-2">
              LeadWise is provided on an as-is and as-available basis to the fullest extent permitted by law. We are not responsible for business decisions made from information stored in the service, loss caused by your failure to secure your account, or events outside our reasonable control. Nothing in these terms limits rights that cannot legally be limited.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#22303A]">8. Contact and updates</h2>
            <p className="mt-2">
              We may update these terms as the service evolves. Continued use after an update means you accept the revised terms. For questions about these terms, use the support contact provided by the LeadWise service operator.
            </p>
          </section>
        </div>

        <div className="mt-12 flex gap-5 border-t border-[#E5CB90] pt-6 text-sm">
          <Link href="/privacy" className="font-medium text-[#458393] hover:underline">Privacy Policy</Link>
          <Link href="/" className="font-medium text-[#458393] hover:underline">Back to LeadWise</Link>
        </div>
      </article>
    </main>
  );
}
