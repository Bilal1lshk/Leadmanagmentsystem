import { ReactNode } from "react";

export default function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`bg-white border border-[#E5CB90]/60 rounded-2xl p-4 ${className}`}
    >
      {children}
    </div>
  );
}