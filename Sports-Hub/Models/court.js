import mongoose from "mongoose";

const courtSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sportSlug: { type: String, required: true },
    sportName: { type: String, required: true },
    description: { type: String },
    pricePerHour: { type: Number, required: true },
    capacity: { type: String },
    images: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
    isUnderMaintenance: { type: Boolean, default: false },
    location: { type: String }
}, { timestamps: true });

export default mongoose.model("Court", courtSchema);
