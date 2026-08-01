import type { Metadata } from "next";
import "./globals.css";
import Userprovider from "./context/Usercontext.jsx";

export const metadata: Metadata = {
  title: "Lead managment system",
  description: "A modern Lead Management System for managing, tracking, and organizing leads with secure authentication and role-based access.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Userprovider>{children}</Userprovider>
      </body>
    </html>
  );
}
