import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import TutorDashboard from "./pages/TutorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import TutorProfileForm from "./pages/TutorProfileForm";
import SearchTutors from "./pages/SearchTutors";
import MyBookings from "./pages/MyBookings";
import ViewReviews from "./pages/ViewReviews";
import ReviewForm from "./pages/ReviewForm";



const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected dashboards */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/tutor"
                    element={
                        <ProtectedRoute role="tutor">
                            <TutorDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/student"
                    element={
                        <ProtectedRoute role="student">
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/student/search"
                    element={
                        <ProtectedRoute role="student">
                            <SearchTutors />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/my-bookings"
                    element={
                        <ProtectedRoute role={["student", "tutor"]}>
                            <MyBookings />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/reviews/:tutorId"
                    element={
                        <ViewReviews />
                    }
                />

                <Route
                    path="/reviews/:tutorId/add"
                    element={
                        <ProtectedRoute role="student">
                            <ReviewForm />
                        </ProtectedRoute>
                    }
                />

                {/* Tutor Profile Form */}
                <Route
                    path="/tutor/profile"
                    element={
                        <ProtectedRoute role="tutor">
                            <TutorProfileForm />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
