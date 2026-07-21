import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    personId: { type: mongoose.Schema.Types.ObjectId, ref: "Person", required: true },
    source: {
      type: String,
      enum: ["website", "referral", "ad", "cold_call", "other"],
      default: "other",
    },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "proposal", "won", "lost"],
      default: "new",
    },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    estimatedValue: { type: Number, default: 0 },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    lastContactedAt: { type: Date },
    lostReason: { type: String, trim: true },
  },
  { timestamps: true }
);

leadSchema.index({ status: 1, assignedTo: 1 });

export default mongoose.models.Lead || mongoose.model("Lead", leadSchema);