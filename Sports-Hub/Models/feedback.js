import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "emp" },
    userEmail: { type: String, required: true },
    userName: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    adminReply: { type: String },
    isVisible: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Feedback", feedbackSchema);
