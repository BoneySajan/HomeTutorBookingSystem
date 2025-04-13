const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
	tutor: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor", required: true },
	student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	rating: { type: Number, required: true },
	comment: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
