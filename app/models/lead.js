import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    personId:{type:String, required:true},
    sourcedby: { type: mongoose.Schema.Types.ObjectId, ref: "Person", required: true },
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
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId, ref: "User", default: null
    },
    lastContactedAt: { type: Date },
    lostReason: { type: String, trim: true },
  },
  { timestamps: true }
);
export default mongoose.models.Lead || mongoose.model("Lead", leadSchema);
