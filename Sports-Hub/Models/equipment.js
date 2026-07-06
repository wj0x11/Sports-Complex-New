import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sportSlug: { type: String, required: true },
    sportName: { type: String, required: true },
    description: { type: String },
    rentalPrice: { type: Number, required: true },
    totalQuantity: { type: Number, required: true, default: 1 },
    availableQuantity: { type: Number, required: true, default: 1 },
    image: { type: String },
    isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Equipment", equipmentSchema);
