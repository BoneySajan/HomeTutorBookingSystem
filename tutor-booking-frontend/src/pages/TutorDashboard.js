import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchMyTutorProfile } from "../api/tutorApi";
import { getUserFromToken } from "../api/authApi";

const TutorDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const loadProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const data = await fetchMyTutorProfile(token);
            setProfile(data);
        } catch (err) {
            setError("No tutor profile found.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    // 🛎️ One-time booking notification for tutor
    useEffect(() => {
        const checkTutorBookingStatus = async () => {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:5000/api/bookings/my", {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await res.json();

            if (res.ok && data.length > 0) {
                const shownMap = JSON.parse(localStorage.getItem("tutorShownMap") || "{}");

                for (let booking of data) {
                    const lastStatus = shownMap[booking._id];

                    if (lastStatus !== booking.status) {
                        if (booking.status === "pending") {
                            alert(`📢 New booking from ${booking.student?.name || "a student"} on ${booking.date} (${booking.from} - ${booking.to})`);
                        } else if (booking.status === "cancelled") {
                            alert(`❌ Booking by ${booking.student?.name || "a student"} on ${booking.date} was cancelled.`);
                        }

                        shownMap[booking._id] = booking.status;
                    }
                }

                localStorage.setItem("tutorShownMap", JSON.stringify(shownMap));
            }
        };

        checkTutorBookingStatus();
    }, []);



    const handleCreate = () => {
        navigate("/tutor/profile");
    };

    const handleEdit = () => {
        navigate("/tutor/profile");
    };

    const user = getUserFromToken();

    return (
        <div>
            <h2>🎓 Tutor Dashboard</h2>
            <p>
                👋 Hello, <strong>{user?.name}</strong> ({user?.role})
            </p>

            {loading && <p>Loading profile...</p>}

            {!loading && !profile && (
                <>
                    <p style={{ color: "red" }}>No tutor profile found.</p>
                    <button onClick={handleCreate}>➕ Create Profile</button>
                </>
            )}

            {!loading && profile && (
                <>
                    <p>
                        <strong>Status:</strong> {profile.status}
                    </p>

                    {profile.status === "rejected" && (
                        <p style={{ color: "red" }}>
                            ❌ Your profile was rejected. Please contact admin.
                        </p>
                    )}

                    <button onClick={handleEdit}>✏️ Edit Profile</button>

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
