import mongoose,{Document, Schema} from "mongoose";
interface followup extends Document{
    organization: object | string,
    lead:object,
    comments:string,
    duedate:Date,
    CreatedBy:object|string,
    assignedTo:string|object,
    status:string,

}
const followupSchema=new Schema<followup>({ 
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    lead: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      index: true,
    },
    comments: {
      type: String,
      trim: true,
    },
    duedate: {
      type: Date,
      required: true,
      index: true,
    },
    CreatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "missed", "rescheduled"],
      default: "pending",
      index: true,
    },

 
}, { timestamps: true })
export default mongoose.models.Followup || mongoose.model<followup>("Followup", followupSchema)
