const express = require("express");
const router = express.Router();
const Tutor = require("../models/Tutor");
const authMiddleware = require("../middleware/authMiddleware");

// Create a tutor profile (Only for users with role 'tutor')
router.post("/", authMiddleware, async (req, res) => {
    if (req.user.role !== "tutor") {
        return res.status(403).json({ message: "Access denied. Only tutors can create profiles." });
    }

    try {
        // Prevent duplicate profiles
        const existing = await Tutor.findOne({ user: req.user.id });
        if (existing) {
            return res.status(400).json({ message: "Profile already exists." });
        }

        // Create and save tutor profile
        const tutor = new Tutor({ ...req.body, user: req.user.id });
        await tutor.save();
        res.status(201).json(tutor);
    } catch (error) {
        res.status(500).json({ error: "Failed to create tutor" });
    }
});

// Get all tutors (Open route)
router.get("/", async (req, res) => {
    try {
        const tutors = await Tutor.find();
        res.json(tutors);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tutors" });
    }
});

// Get the currently logged-in tutor's profile
router.get("/my-profile", authMiddleware, async (req, res) => {
    try {
        console.log("Incoming /my-profile request from:", req.user);
        const profile = await Tutor.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(404).json({ message: "No profile found" });
        }

        res.json(profile);
    } catch (error) {
        console.error("Error fetching tutor profile:", error.message);
        res.status(500).json({ message: "Failed to fetch tutor profile" });
    }
});

// Search tutors based on filters (subject, rate, rating, day/time)
router.get("/search", async (req, res) => {
    const { subject, minRate, maxRate, minRating, day, time } = req.query;
    const query = { status: "approved" };

    // Apply filters if provided
    if (subject) {
        query.subjects = { $regex: subject, $options: "i" };
    }
    if (minRate || maxRate) {
        query.hourlyRate = {};
        if (minRate) query.hourlyRate.$gte = Number(minRate);
        if (maxRate) query.hourlyRate.$lte = Number(maxRate);
    }
    if (minRating) {
        query.rating = { $gte: Number(minRating) };
    }
    if (day || time) {
        query.availability = {
            $elemMatch: {
                ...(day && { day }),
                ...(time && {
                    from: { $lte: time },
                    to: { $gte: time }
                }),
            }
        };
    }

    try {
        const tutors = await Tutor.find(query);
        res.json(tutors);
    } catch (err) {
        res.status(500).json({ error: err.message || "Failed to search tutors" });
    }
});

// Get tutor by ID
router.get("/:id", async (req, res) => {
    try {
        const tutor = await Tutor.findById(req.params.id);
        if (!tutor) return res.status(404).json({ message: "Tutor not found" });
        res.json(tutor);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tutor" });
    }
});

// Update tutor profile (Only the owner or admin can do this)
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const tutor = await Tutor.findById(req.params.id);
        if (!tutor) return res.status(404).json({ message: "Tutor not found" });

        // Check permission
        if (req.user.role !== "admin" && req.user.id !== tutor.user.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        // Perform update
        const updatedTutor = await Tutor.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        res.json(updatedTutor);
    } catch (error) {
        res.status(500).json({ error: "Failed to update tutor" });
    }
});

// Delete tutor profile (Only the owner or admin)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const tutor = await Tutor.findById(req.params.id);
        if (!tutor) return res.status(404).json({ message: "Tutor not found" });

        if (req.user.role !== "admin" && req.user.id !== tutor.user.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        await tutor.deleteOne();
        res.json({ message: "Tutor deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete tutor" });
    }
});

// Approve tutor profile (Admin only)
router.put("/:id/approve", authMiddleware, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Only admins can approve tutors" });
    }

    try {
        const tutor = await Tutor.findByIdAndUpdate(
            req.params.id,
            { status: "approved" },
            { new: true }
        );
        if (!tutor) return res.status(404).json({ message: "Tutor not found" });
        res.json({ message: "Tutor approved", tutor });
    } catch (err) {
        res.status(500).json({ message: "Failed to approve tutor" });
    }
});

// Reject tutor profile (Admin only)
router.put("/:id/reject", authMiddleware, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Only admins can reject tutors" });
    }

    try {
        const tutor = await Tutor.findByIdAndUpdate(
            req.params.id,
            { status: "rejected" },
            { new: true }
        );
        if (!tutor) return res.status(404).json({ message: "Tutor not found" });
        res.json({ message: "Tutor rejected", tutor });
    } catch (err) {
        res.status(500).json({ message: "Failed to reject tutor" });
    }
});

module.exports = router;
