import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import TutorDashboard from "./pages/TutorDashboard"; // placeholder
import AdminDashboard from "./pages/AdminDashboard"; // placeholder
import StudentDashboard from "./pages/StudentDashboard"; // placeholder
import ProtectedRoute from "./components/ProtectedRoute"; // you'll create this below

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected dashboards */}
                <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
                <Route path="/tutor" element={<ProtectedRoute role="tutor"><TutorDashboard /></ProtectedRoute>} />
                <Route path="/student" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
            </Routes>
        </Router>
    );
};

export default App;
