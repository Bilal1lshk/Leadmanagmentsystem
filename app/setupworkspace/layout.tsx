import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Set up your workspace",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SetupWorkspaceLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
