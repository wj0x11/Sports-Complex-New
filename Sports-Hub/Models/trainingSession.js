import mongoose from "mongoose";

const trainingSessionSchema = new mongoose.Schema({
    coachId: { type: mongoose.Schema.Types.ObjectId, ref: "Coach", required: true },
    coachName: { type: String, required: true },
    sportSlug: { type: String, required: true },
    sportName: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    duration: { type: String },
    players: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "emp" },
        name: { type: String },
        email: { type: String },
        attendance: { type: String, enum: ["Present", "Absent", "Late"] },
        progressNotes: { type: String }
    }],
    notes: { type: String }
}, { timestamps: true });

export default mongoose.model("TrainingSession", trainingSessionSchema);
