import { MoreHorizontal } from "lucide-react";
import {Followup} from "@/app/dashboard/followups/page";
import {statusConfig} from "@/app/dashboard/followups/page";
import formatDate from "@/app/components/Dashboard/followups/Formatdate";
export default function FollowupRow({
  followup,
  menuOpen,
  onMenuToggle,
  onEdit,
  onDelete,
  onComplete,
  onReschedule,
}: {
  followup: Followup;
  menuOpen: boolean;
  onMenuToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
  onReschedule: () => void;
}) {
  const isOverdue =
    followup.status === "pending" &&
    new Date(followup.duedate).getTime() <
      Date.now();

  const status = statusConfig[followup.status];

  return (
    <tr
      className={`border-b border-gray-100 hover:bg-gray-50 ${
        isOverdue ? "bg-red-50/60" : ""
      }`}
    >

      {/* Checkbox */}

      <td className="px-4 py-4">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300"
        />
      </td>

      {/* Lead */}

      <td className="px-4 py-4">
        <p className="font-medium text-gray-900">
          {followup.lead?.company ||
            followup.lead?.name}
        </p>
      </td>

      {/* Assigned */}

      <td className="px-4 py-4">

        <div className="flex items-center gap-2">

          {followup.assignedTo?.avatar ? (
            <img
              src={followup.assignedTo.avatar}
              alt=""
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold">
              {followup.assignedTo?.name?.charAt(0)}
            </div>
          )}

          <span className="text-sm text-gray-800">
            {followup.assignedTo?.name}
          </span>

        </div>

      </td>

      {/* Due Date */}

      <td className="px-4 py-4">

        <div className="flex items-center gap-2">

          <span className="whitespace-nowrap text-sm text-gray-800">
            {formatDate(followup.duedate)}
          </span>

          {isOverdue && (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
              Overdue
            </span>
          )}

        </div>

      </td>

      {/* Status */}

      <td className="px-4 py-4">

        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
        >
          {status.label}
        </span>

      </td>

      {/* Comments */}

      <td className="max-w-[280px] px-4 py-4">

        <p
          className="truncate text-sm text-gray-700"
          title={followup.comments}
        >
          {followup.comments || "No comments"}
        </p>

      </td>

      {/* Actions */}

      <td className="relative px-4 py-4">

        <div className="flex items-center gap-2 whitespace-nowrap">

          <button className="text-sm text-blue-700 hover:underline">
            View
          </button>

          <span className="text-gray-300">|</span>

          <button
            onClick={onEdit}
            className="text-sm text-blue-700 hover:underline"
          >
            Edit
          </button>

          <span className="text-gray-300">|</span>

          <button
            onClick={onComplete}
            disabled={
              followup.status === "completed"
            }
            className="text-sm text-blue-700 hover:underline disabled:opacity-40"
          >
            Complete
          </button>

          <button
            onClick={onMenuToggle}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
          >
            <MoreHorizontal size={18} />
          </button>

        </div>

        {menuOpen && (
          <div className="absolute right-4 top-12 z-20 w-40 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">

            <button
              onClick={onReschedule}
              className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-50"
            >
              Reschedule
            </button>

            <button
              onClick={onDelete}
              className="w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              Delete
            </button>

          </div>
        )}

      </td>

    </tr>
  );
}