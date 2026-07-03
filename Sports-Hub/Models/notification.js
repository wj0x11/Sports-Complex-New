import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userEmail: { type: String, required: true }, // can be user's email or "admin"
    title: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["New", "Read"], default: "New" },
    createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
