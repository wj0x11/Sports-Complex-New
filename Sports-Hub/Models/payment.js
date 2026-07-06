import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    paymentId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "emp" },
    userEmail: { type: String, required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true, enum: ["Online", "Cash"] },
    paymentStatus: { type: String, default: "Completed", enum: ["Pending", "Completed", "Failed", "Refunded"] },
    description: { type: String },
    invoiceNumber: { type: String }
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
