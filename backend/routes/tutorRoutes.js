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

// ✅ Update tutor profile (tutor only)
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const tutor = await Tutor.findById(req.params.id);

        if (!tutor) return res.status(404).json({ message: "Tutor not found" });

        // Only the owner tutor or admin can update
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

// ✅ Delete tutor profile (tutor or admin)
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

// ❌ Reject tutor (admin only)
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