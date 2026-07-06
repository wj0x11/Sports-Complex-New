import mongoose from "mongoose";

const equipmentRentalSchema = new mongoose.Schema({
    rentalId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "emp" },
    userEmail: { type: String, required: true },
    equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Equipment", required: true },
    equipmentName: { type: String, required: true },
    rentalDate: { type: Date, required: true },
    returnDate: { type: Date },
    dueDate: { type: Date, required: true },
    status: { type: String, default: "Rented", enum: ["Rented", "Returned", "Overdue"] },
    totalCost: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model("EquipmentRental", equipmentRentalSchema);
