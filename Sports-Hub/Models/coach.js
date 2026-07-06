import mongoose from "mongoose";

const coachSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    sportSlug: { type: String, required: true },
    sportName: { type: String, required: true },
    experience: { type: String },
    specialization: { type: String },
    rating: { type: Number, default: 0 },
    pricePerSession: { type: Number, required: true },
    bio: { type: String },
    avatar: { type: String },
    isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Coach", coachSchema);
