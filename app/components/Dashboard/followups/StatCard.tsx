import { type ReactNode } from "react";
export default function StatCard({
  icon,
  title,
  value,
  description,
  iconClass,
  highlighted = false,
}: {
  icon: ReactNode;
  title: string;
  value: number;
  description: string;
  iconClass: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border bg-white p-5 shadow-sm ${
        highlighted
          ? "border-blue-400 ring-1 ring-blue-100"
          : "border-gray-200"
      }`}
    >
      <div className="flex items-center gap-4">

        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg text-white ${iconClass}`}
        >
          {icon}
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700">
            {title}
          </p>

          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {value}
          </p>

          <p className="text-sm text-gray-600">
            {description}
          </p>
        </div>

      </div>
    </div>
  );
}