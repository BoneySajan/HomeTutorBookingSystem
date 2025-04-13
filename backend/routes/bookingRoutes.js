const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Tutor = require("../models/Tutor");
const authMiddleware = require("../middleware/authMiddleware");

// Utility: Convert time string "HH:mm" to total minutes
const toMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
};

// Utility: Get day name (e.g. "Monday") from a date string "YYYY-MM-DD"
const getDayName = (dateStr) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date(dateStr);
    return days[date.getDay()];
};

// ✅ Create Booking (Student)
router.post("/", authMiddleware, async (req, res) => {
    if (req.user.role !== "student") {
        return res.status(403).json({ message: "Only students can book a tutor." });
    }

    const { tutor, date, from, to } = req.body;
    // ⛔ Prevent booking in the past
    const today = new Date().toISOString().split("T")[0]; // e.g. "2025-04-12"
    if (date < today) {
        return res.status(400).json({ message: "You cannot book for a past date." });
    }
    try {
        const day = getDayName(date);
        const fromMin = toMinutes(from);
        const toMin = toMinutes(to);

        // 🟡 Fetch tutor profile
        const tutorProfile = await Tutor.findById(tutor);
        if (!tutorProfile) return res.status(404).json({ message: "Tutor not found" });

        const availableDay = tutorProfile.availability.find((slot) =>
            slot.day
                .toLowerCase()
                .split(",")
                .map(d => d.trim())
                .includes(day.toLowerCase())
        );


        if (!availableDay) {
            return res.status(400).json({ message: `Tutor not available on ${day}` });
        }

        const availableFrom = toMinutes(availableDay.from);
        const availableTo = toMinutes(availableDay.to);

        // 🟠 Check if booking is within tutor's availability
        if (fromMin < availableFrom || toMin > availableTo) {
            return res.status(400).json({
                message: `Please book within tutor's available time: ${availableDay.from} - ${availableDay.to}`
            });
        }

        // ❗ Conflict check — overlapping bookings
        const existing = await Booking.find({
            tutor,
            date,
            $or: [
                { from: { $lt: to }, to: { $gt: from } }
            ]
        });

        if (existing.length > 0) {
            return res.status(409).json({
                message: "❌ Time slot overlaps with another booking. Please choose a different time."
            });
        }

        const booking = new Booking({
            tutor,
            student: req.user.id,
            date,
            from,
            to
        });

        const saved = await booking.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({ message: "Booking failed", error: error.message });
    }
});

// ✅ Get All Bookings (Admin)
router.get("/", authMiddleware, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Only admins can view all bookings." });
    }

    try {
        const bookings = await Booking.find().populate("student tutor");
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch bookings" });
    }
});

// ✅ Get My Bookings (Student/Tutor)
router.get("/my", authMiddleware, async (req, res) => {
    try {
        let query;

        if (req.user.role === "student") {
            query = { student: req.user.id };
        } else if (req.user.role === "tutor") {
            const tutorProfile = await Tutor.findOne({ user: req.user.id });
            if (!tutorProfile) {
                return res.status(404).json({ message: "Tutor profile not found" });
            }
            query = { tutor: tutorProfile._id };
        } else {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const bookings = await Booking.find(query).populate("student tutor");
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch your bookings" });
    }
});
;

// ✅ Cancel Booking
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) return res.status(404).json({ message: "Booking not found" });

        if (
            req.user.role !== "admin" &&
            booking.student.toString() !== req.user.id &&
            booking.tutor.toString() !== req.user.id
        ) {
            return res.status(403).json({ message: "Not authorized to delete" });
        }

        booking.status = "cancelled";
        await booking.save();
        res.json({ message: "Booking canceled" });

    } catch (error) {
        res.status(500).json({ message: "Delete failed" });
    }
});

// ✅ Update Booking Status (Tutor only)
router.put("/:id/status", authMiddleware, async (req, res) => {
    const { status } = req.body;

    if (!["confirmed", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
    }

    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        // Fix: Match tutor profile instead of user id
        const tutorProfile = await Tutor.findOne({ user: req.user.id });
        if (!tutorProfile || booking.tutor.toString() !== tutorProfile._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this booking" });
        }

        booking.status = status;
        await booking.save();

        res.json({ message: `Booking ${status}`, booking });
    } catch (err) {
        res.status(500).json({ message: "Failed to update booking status" });
    }
});


module.exports = router;
