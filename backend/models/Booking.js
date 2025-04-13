const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    from: { type: String, required: true }, // e.g., "14:00"
    to: { type: String, required: true },   // e.g., "15:00"
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);