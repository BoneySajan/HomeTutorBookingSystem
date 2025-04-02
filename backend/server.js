const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: "./backend/.env" });

const app = express();

// ✅ Middleware
app.use(express.json());  // Allows JSON data in requests
app.use(cors({
  origin: "http://localhost:3000",  // Allow frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ Base route to test server
app.get("/", (req, res) => {
    res.send("API is running...");
});

// ✅ Register routes BEFORE server starts
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tutors", require("./routes/tutorRoutes"));

// ✅ Define port
const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected successfully");
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection failed:", err.message);
    });
