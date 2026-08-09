import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true },
    dueDate: { type: Date, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    completed: { type: String, enum: ["notstarted", "inprogress", "completed"], default: "notstarted" },
  },
  { timestamps: true }
);
export default mongoose.models.Task || mongoose.model("Task", taskSchema);