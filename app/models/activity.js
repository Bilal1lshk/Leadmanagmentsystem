import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true },
    type: {
      type: String,
      enum: ["call", "email", "meeting", "note", "status_change"],
      required: true,
    },
    description: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
export default mongoose.models.Activity || mongoose.model("Activity", activitySchema);