import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "emp", required: true },
    userEmail: { type: String, required: true },
    type: { type: String, required: true, enum: ["Bronze", "Silver", "Gold"] },
    duration: { type: String, required: true, enum: ["Monthly", "Yearly"] },
    price: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, default: "Active", enum: ["Active", "Expired", "Cancelled"] },
    features: [{ type: String }]
}, { timestamps: true });

export default mongoose.model("Membership", membershipSchema);
