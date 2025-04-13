const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Tutor = require("../models/Tutor");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Add a Review (student)
router.post("/", authMiddleware, async (req, res) => {
    if (req.user.role !== "student") {
        return res.status(403).json({ message: "Only students can submit reviews." });
    }

    const { tutor, rating, comment } = req.body;

    try {
        // Save the new review
        const review = new Review({
            tutor,
            student: req.user.id,
            rating,
            comment
        });

        await review.save();

        // ✅ Recalculate average rating
        const allReviews = await Review.find({ tutor });
        const avgRating =
            allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

        // ✅ Update the tutor's rating in Tutor model
        await Tutor.findByIdAndUpdate(tutor, { rating: avgRating });

        res.status(201).json(review);
    } catch (err) {
        res.status(500).json({ message: "Failed to submit review", error: err.message });
    }
});

// ✅ Get Reviews for a Tutor (public)
router.get("/:tutorId", async (req, res) => {
    try {
        const reviews = await Review.find({ tutor: req.params.tutorId }).populate("student");
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch reviews" });
    }
});

module.exports = router;
