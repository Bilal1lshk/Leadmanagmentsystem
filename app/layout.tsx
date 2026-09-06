import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import ChatbotWidget from "./components/ui/ChatbotWidget";


export const metadata: Metadata = {
  metadataBase: new URL("https://leadmanagmentsystem-nu.vercel.app"),
  title: {
    default: "LeadWise — Lead Management System",
    template: "%s | LeadWise",
  },
  description:
    "LeadWise is a modern lead management system for tracking, organizing, and converting leads faster — built with secure authentication and role-based access control for growing teams.",
  applicationName: "LeadWise",
  category: "business software",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
  },
  keywords: [
    "lead management system",
    "lead tracking software",
    "free lead management software",
    "lead tracking system",
    "team lead management",
    "lead organization tool",
    "CRM for small business",
    "sales lead tracker",
  ],
  authors: [{ name: "LeadWise" }],
  creator: "LeadWise",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "LeadWise — Lead Management System",
    description:
      "A modern lead management system for tracking, organizing, and converting leads faster — with secure authentication and role-based access.",
    url: "https://leadmanagmentsystem-nu.vercel.app/",
    siteName: "LeadWise",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LeadWise — Lead Management System",
    description:
      "Track, organize, and convert leads faster with secure, role-based access control.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased `}>
      <body className="min-h-full flex flex-col "suppressHydrationWarning>
        <Providers>
          {children}
          <ChatbotWidget />
        </Providers>
      </body>
    </html>
  );
}
