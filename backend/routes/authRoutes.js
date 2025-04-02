console.log("✅ authRoutes.js loaded");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Test route to confirm it's working
router.get("/test", (req, res) => {
    console.log("test route hit");
    res.send("Auth test route working!");
});

// REGISTER USER
router.post("/register", async (req, res) => {
    console.log("register route hit");

    const { name, email, password, role } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create and save new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        const savedUser = await newUser.save();
        res.status(201).json({ message: "User registered", user: savedUser });

    } catch (err) {
        console.error("Registration error:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

// LOGIN USER
router.post("/login", async (req, res) => {
    console.log("login route hit");

    const { email, password } = req.body;

    try {
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare password
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
