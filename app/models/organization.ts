import mongoose, { Schema, Document } from "mongoose";

interface IOrganization extends Document {
  name: string;
  companysize: "1-10" | "11-50" | "51-200" | "201-500" | "501-1000" | "1000+";
  createdBy: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  plan: "free" | "pro" | "enterprise";
  inviteCode: string;
}

const organizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    companysize: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
      default: "1-10",
    },
    // Role lives on OrganizationMember, not here — a single org has many members with different roles
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: String,
      enum: ["free", "pro", "enterprise"],
      default: "free",
    },
    inviteCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
      uppercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Organization ||
  mongoose.model<IOrganization>("Organization", organizationSchema);
