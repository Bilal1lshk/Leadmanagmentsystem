import mongoose from "mongoose";

const workspaceJoinRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    message: { type: String, trim: true, maxlength: 500, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

workspaceJoinRequestSchema.index({ user: 1, organization: 1 }, { unique: true });
workspaceJoinRequestSchema.index({ organization: 1, status: 1, createdAt: -1 });

export default mongoose.models.WorkspaceJoinRequest ||
  mongoose.model("WorkspaceJoinRequest", workspaceJoinRequestSchema);
