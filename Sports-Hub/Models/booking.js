import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    id: { type: Number, required: true }, // Keeping frontend numeric ID for backward compatibility
    reservationId: { type: String, required: true },
    user: {
        fullName: String,
        email: String,
        phone: String,
        role: String
    },
    userEmail: { type: String, required: true },
    sport: {
        name: String,
        slug: String,
        type: { type: String }
    },
    court: {
        id: Number,
        name: String,
        pricePerHour: Number,
        capacity: String
    },
    coach: {
        id: Number,
        name: String,
        experience: String,
        rating: String,
        price: Number
    },
    equipment: [
        {
            id: String,
            name: String,
            rentalPrice: Number,
            sportSlug: String
        }
    ],
    bookingType: String,
    bookingDetails: {
        bookingDate: String,
        bookingDay: String,
        bookingTime: String,
        duration: String,
        players: Number,
        skillLevel: String,
        notes: String
    },
    totalAmount: Number,
    courtFee: Number,
    coachFee: Number,
    equipmentTotal: Number,
    serviceFee: Number,
    paymentMethod: String,
    paymentStatus: { type: String, default: "Paid" },
    status: { type: String, default: "Confirmed" },
    createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
