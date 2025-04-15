const express = require("express");
const router = express.Router();
const Tutor = require("../models/Tutor");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Create tutor profile (restricted to tutors)
router.post("/", authMiddleware, async (req, res) => {
    if (req.user.role !== "tutor") {
        return res.status(403).json({ message: "Access denied. Only tutors can create profiles." });
    }

    try {
        // Prevent multiple profiles
        const existing = await Tutor.findOne({ user: req.user.id });
        if (existing) {
            return res.status(400).json({ message: "Profile already exists." });
        }

        const tutor = new Tutor({ ...req.body, user: req.user.id });
        await tutor.save();
        res.status(201).json(tutor);
    } catch (error) {
        res.status(500).json({ error: "Failed to create tutor" });
    }
});

// ✅ Get all tutors (open)
router.get("/", async (req, res) => {
    try {
        const tutors = await Tutor.find();
        res.json(tutors);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tutors" });
    }
});

// ✅ GET /my-profile
router.get("/my-profile", authMiddleware, async (req, res) => {
    try {
        console.log("Incoming /my-profile request from:", req.user);

        // Find profile for currently logged-in tutor
        const profile = await Tutor.findOne({ user: req.user.id });

        if (!profile) {
            console.log("No profile found for user:", req.user.id);
            return res.status(404).json({ message: "No profile found" });
        }

        console.log("Profile found:", profile._id);
        res.json(profile);
    } catch (error) {
        console.error("❌ Error fetching tutor profile:", error.message);
        res.status(500).json({ message: "Failed to fetch tutor profile" });
    }
});

// Search tutors (by subject, rate, rating) + day and time filtering
router.get("/search", async (req, res) => {
    const { subject, minRate, maxRate, minRating, day, time } = req.query;

    const query = { status: "approved" };

    // Filter by subject
    if (subject) {
        query.subjects = { $regex: subject, $options: "i" };
    }

    // Filter by rate
    if (minRate || maxRate) {
        query.hourlyRate = {};
        if (minRate) query.hourlyRate.$gte = Number(minRate);
        if (maxRate) query.hourlyRate.$lte = Number(maxRate);
    }

    // Filter by minimum rating
    if (minRating) {
        query.rating = { $gte: Number(minRating) };
    }

    // Day + Time availability filter
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
        res.json(tutors); // directly return the list
    } catch (err) {
        console.error("❌ Search failed:", err);
        res.status(500).json({ error: err.message || "Failed to search tutors" });
    }
});


// ✅ Get single tutor by ID
router.get("/:id", async (req, res) => {
    try {
        const tutor = await Tutor.findById(req.params.id);
        if (!tutor) return res.status(404).json({ message: "Tutor not found" });
        res.json(tutor);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tutor" });
    }
});

// ✅ Update tutor profile (tutor or admin only)
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const tutor = await Tutor.findById(req.params.id);
        if (!tutor) return res.status(404).json({ message: "Tutor not found" });

        if (req.user.role !== "admin" && req.user.id !== tutor.user.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        const updatedTutor = await Tutor.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        res.json(updatedTutor);
    } catch (error) {
        res.status(500).json({ error: "Failed to update tutor" });
    }
});

// ✅ Delete tutor profile (tutor or admin only)
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

// ✅ Approve tutor (admin only)
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

// ✅ Reject tutor (admin only)
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