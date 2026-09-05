"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";

interface FollowUp {
  _id: string;
  comments?: string;
  duedate: string;
  status: string;
  lead?: {
    personId?: string;
  };
}

interface FollowUpsResponse {
  data?: FollowUp[];
}

export default function FollowUps() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFollowUps = async () => {
      try {
        const response = await axios.get<FollowUpsResponse>("/api/followups/All");
        const upcoming = (response.data.data ?? [])
          .filter(
            (followUp) =>
              followUp.status === "pending" &&
              new Date(followUp.duedate).getTime() >= Date.now(),
          )
          .sort(
            (first, second) =>
              new Date(first.duedate).getTime() -
              new Date(second.duedate).getTime(),
          )
          .slice(0, 3);

        setFollowUps(upcoming);
      } catch (error) {
        console.error("Failed to load upcoming follow-ups:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFollowUps();
  }, []);

  const formatDueDate = (value: string) =>
    new Date(value).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Card>
      <h3 className="m-0 mb-3 text-sm text-[#22303A]">Upcoming Follow-ups</h3>
      <div className="flex flex-col gap-3">
        {loading ? (
          <p className="text-[11px] text-[#5C6D71]">Loading follow-ups...</p>
        ) : followUps.length === 0 ? (
          <p className="text-[11px] text-[#5C6D71]">No upcoming follow-ups</p>
        ) : followUps.map((followUp) => (
          <div key={followUp._id} className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#34A99D]" />
            <div>
              <div className="text-[12.5px] text-[#22303A]">
                {followUp.comments || `Follow up with ${followUp.lead?.personId || "lead"}`}
              </div>
              <div className="text-[11px] text-[#5C6D71]">
                {formatDueDate(followUp.duedate)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}