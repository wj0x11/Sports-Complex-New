import mongoose from "mongoose";

const sportSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, default: "court" },
    image: { type: String },
    courtsCount: { type: Number, default: 0 },
    coachesCount: { type: Number, default: 0 },
    equipmentCount: { type: Number, default: 0 },
    isDisabled: { type: Boolean, default: false } 
}, { timestamps: true });

export default mongoose.model("Sport", sportSchema);