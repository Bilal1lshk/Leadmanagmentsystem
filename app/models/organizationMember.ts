import mongoose, { Schema, Document } from "mongoose";

export interface IOrganizationMember extends Document {
  user: mongoose.Types.ObjectId;
  organization: mongoose.Types.ObjectId;
  role: "Admin" | "employee" | "viewer";
  createdAt: Date;
  updatedAt: Date;
}

const organizationMemberSchema = new Schema<IOrganizationMember>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "employee", "viewer"],
      default: "employee",
    },
  },
  { timestamps: true }
);

// A user can only have one membership record per organization
organizationMemberSchema.index({ user: 1, organization: 1 }, { unique: true });

export default mongoose.models.OrganizationMember ||
  mongoose.model<IOrganizationMember>(
    "OrganizationMember",
    organizationMemberSchema
  );
