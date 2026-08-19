import mongoose, { Schema ,Document} from "mongoose";

interface organization extends Document {
    name: String,
    companysize: "1-10" | "11-50" | "51-200" | "201-500" | "501-1000" | "1000+";
    Role: "Admin" | "employee" | "viewer",
    CreatedBy: mongoose.Types.ObjectId,
    plan: "free" | "pro" | "enterprise";
    Owner: Schema.Types.ObjectId
}
const data = new Schema<organization>({
    name: { type: String, required: true, trim: true },
    companysize: {
        type: String,
        enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
        default: "1-10",
    },
    Role: {
        type: String,
        enum: ["Admin", "employee", "viewer"],
        default: "employee",
    },
    Owner: {
        type: Schema.Types.ObjectId,
        required: true
    },
    CreatedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    plan: {
        type: String,
        enum: ["free", "pro", "enterprise"],
        default: "free",
    },
});
export default  mongoose.model("Organization", data)