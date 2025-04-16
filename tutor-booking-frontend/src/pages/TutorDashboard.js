import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchMyTutorProfile } from "../api/tutorApi";
import { getUserFromToken } from "../api/authApi";

const TutorDashboard = () => {
    // Local state to store tutor profile, loading, and error message
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Fetch the logged-in tutor's profile from the server
    const loadProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const data = await fetchMyTutorProfile(token); // API call
            setProfile(data); // Save profile
        } catch (err) {
            setError("No tutor profile found."); // Error if profile not found
        } finally {
            setLoading(false); // Stop loading indicator
        }
    };

    // Load the tutor profile when the component mounts
    useEffect(() => {
        loadProfile();
    }, []);

    // Show booking notifications (new bookings or cancellations)
    useEffect(() => {
        const checkTutorBookingStatus = async () => {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:5000/api/bookings/my", {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await res.json();

            if (res.ok && data.length > 0) {
                const shownMap = JSON.parse(localStorage.getItem("tutorShownMap") || "{}");

                // Loop through all bookings
                for (let booking of data) {
                    const lastStatus = shownMap[booking._id];

                    // Show alerts only if the booking's status has changed since last viewed
                    if (lastStatus !== booking.status) {
                        if (booking.status === "pending") {
                            alert(`📢 New booking from ${booking.student?.name || "a student"} on ${booking.date} (${booking.from} - ${booking.to})`);
                        } else if (booking.status === "cancelled") {
                            alert(`❌ Booking by ${booking.student?.name || "a student"} on ${booking.date} was cancelled.`);
                        }

                        // Save latest status in localStorage
                        shownMap[booking._id] = booking.status;
                    }
                }

                localStorage.setItem("tutorShownMap", JSON.stringify(shownMap));
            }
        };

        checkTutorBookingStatus(); // Run notification check once on mount
    }, []);

    // Navigate to tutor profile creation
    const handleCreate = () => {
        navigate("/tutor/profile");
    };

    // Navigate to edit profile page
    const handleEdit = () => {
        navigate("/tutor/profile");
    };

    // Get logged-in user from token
    const user = getUserFromToken();

    return (
        <div>
            <h2>🎓 Tutor Dashboard</h2>
            <p>
                👋 Hello, <strong>{user?.name}</strong> ({user?.role})
            </p>

            {/* Show loading state while fetching profile */}
            {loading && <p>Loading profile...</p>}

            {/* Show create profile button if no profile found */}
            {!loading && !profile && (
                <>
                    <p style={{ color: "red" }}>No tutor profile found.</p>
                    <button onClick={handleCreate}>➕ Create Profile</button>
                </>
            )}

            {/* Display profile info if available */}
            {!loading && profile && (
                <>
                    <p>
                        <strong>Status:</strong> {profile.status}
                    </p>

                    {/* Message if profile was rejected */}
                    {profile.status === "rejected" && (
                        <p style={{ color: "red" }}>
                            ❌ Your profile was rejected. Please contact admin.
                        </p>
                    )}

                    {/* Show edit profile option */}
                    <button onClick={handleEdit}>✏️ Edit Profile</button>

                    {/* Show bookings link only if profile is approved */}
                    {profile.status === "approved" && (
                        <>
                            <br />
                            <Link to="/my-bookings">📅 View My Bookings</Link>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default TutorDashboard;
