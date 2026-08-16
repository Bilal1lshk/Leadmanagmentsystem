import { Calendar } from "lucide-react";

export default function EmptyState({
  onCreate,
}: {
  onCreate?: () => void;
}) {
  return (
    <tr>
      <td
        colSpan={7}
        className="px-6 py-16 text-center"
      >
        <Calendar
          size={42}
          className="mx-auto mb-3 text-brand-gray"
        />

        <h3 className="font-medium text-brand-navy">
          No follow-ups found
        </h3>

        <p className="mt-1 text-sm text-brand-gray">
          Try changing your filters or create a new
          follow-up.
        </p>

        <button
          onClick={onCreate}
          className="mt-4 rounded-lg bg-brand-teal px-4 py-2 text-sm font-medium text-white hover:bg-brand-teal-dark"
        >
          Create Follow-up
        </button>
      </td>
    </tr>
  );
}