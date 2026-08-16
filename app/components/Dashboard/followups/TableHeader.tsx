import { type ReactNode } from "react";
export default function TableHeader({children,}: {children: ReactNode;}) {
  return (
    <th className="px-4 py-3 text-left text-sm font-semibold text-brand-navy">
      {children}
    </th>
  );
}