import { Calendar } from "lucide-react";

function EmptyState({
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
          className="mx-auto mb-3 text-gray-300"
        />

        <h3 className="font-medium text-gray-900">
          No follow-ups found
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Try changing your filters or create a new
          follow-up.
        </p>

        <button
          onClick={onCreate}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Create Follow-up
        </button>
      </td>
    </tr>
  );
}