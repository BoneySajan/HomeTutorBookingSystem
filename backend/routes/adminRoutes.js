const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const Booking = require("../models/Booking");
const Tutor = require("../models/Tutor");

// ✅ Get all users (admin only)
router.get("/users", authMiddleware, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
    }

    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch users" });
    }
});

// ✅ Delete user (admin only)
router.delete("/users/:id", authMiddleware, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
    }

    try {
        const userId = req.params.id;

        // Delete the user
        await User.findByIdAndDelete(userId);

        // Delete tutor profile if exists
        await Tutor.findOneAndDelete({ user: userId });

        // Delete any bookings where the user is either student or tutor
        await Booking.deleteMany({
            $or: [{ student: userId }, { tutor: userId }]
        });

        res.json({ message: "User, profile, and related bookings deleted" });
    } catch (err) {
        console.error("❌ Deletion error:", err.message);
        res.status(500).json({ message: "Failed to delete user" });
    }
});

module.exports = router;
