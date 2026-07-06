import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sportSlug: { type: String, required: true },
    sportName: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: { type: String },
    maxParticipants: { type: Number },
    registrationDeadline: { type: Date },
    entryFee: { type: Number, default: 0 },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "emp" }],
    status: { type: String, default: "Upcoming", enum: ["Upcoming", "Ongoing", "Completed", "Cancelled"] },
    winner: { type: String },
    prizes: [{ type: String }]
}, { timestamps: true });

export default mongoose.model("Tournament", tournamentSchema);
