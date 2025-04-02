const mongoose = require("mongoose");

const tutorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subjects: { type: [String], required: true },
    hourlyRate: { type: Number, required: true },
    availability: [{ day: String, from: String, to: String }],
    rating: { type: Number, default: 0 },
    bio: { type: String },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Tutor", tutorSchema);
