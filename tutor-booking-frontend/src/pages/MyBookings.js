import React, { useEffect, useState } from "react";
import { getUserFromToken } from "../api/authApi"; // Get current user from token

const MyBookings = () => {
    const [bookings, setBookings] = useState([]); // State to store booking data
    const [error, setError] = useState("");        // State for any error messages
    const [loading, setLoading] = useState(true);  // Loading indicator
    const user = getUserFromToken();               // Get user info from JWT token

    // Fetch current user's bookings
    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:5000/api/bookings/my", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to load bookings");

            setBookings(data);
        } catch (err) {
            setError(err.message); // Set error message to display
        } finally {
            setLoading(false); // Stop loading spinner
        }
    };

    // Fetch bookings when the component mounts
    useEffect(() => {
        fetchBookings();
    }, []);

    // Cancel a booking by updating its status to "cancelled"
    const handleCancel = async (id) => {
        const confirm = window.confirm("Are you sure you want to cancel this booking?");
        if (!confirm) return;

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: "cancelled" })
            });

            if (!res.ok) throw new Error("Cancel failed");
            alert("Booking canceled");
            fetchBookings(); // Refresh bookings after update
        } catch (err) {
            alert(err.message);
        }
    };

    // Change the booking status (used by tutor to accept or cancel)
    const handleStatusChange = async (id, status) => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to update status");
            alert(`Booking ${status}`);
            fetchBookings(); // Refresh bookings after update
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div style={{ padding: "1rem" }}>
            <h2>📆 My Bookings</h2>

            {/* Show error if exists */}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Loading state */}
            {loading ? (
                <p>Loading...</p>

                // No bookings message
            ) : bookings.length === 0 ? (
                <p>No bookings found.</p>

                // Bookings list
            ) : (
                <ul>
                    {bookings.map((b) => (
                        <li key={b._id} style={{ marginBottom: "1rem" }}>
                            <strong>Date:</strong> {b.date} |{" "}
                            <strong>Time:</strong> {b.from || "--"} - {b.to || "--"} <br />

                            {/* Display tutor name for student, or student name for tutor */}
                            <strong>{user.role === "student" ? "Tutor" : "Student"}:</strong>{" "}
                            {user.role === "student" ? b.tutor?.name : b.student?.name} |{" "}
                            <strong>Status:</strong> {b.status}

                            {/* If tutor, show buttons to Accept or Cancel */}
                            {user.role === "tutor" && b.status !== "cancelled" && (
                                <div>
                                    {b.status === "pending" && (
                                        <button onClick={() => handleStatusChange(b._id, "confirmed")}>
                                            ✅ Accept
                                        </button>
                                    )}
                                    <button onClick={() => handleStatusChange(b._id, "cancelled")}>
                                        ❌ Cancel
                                    </button>
                                </div>
                            )}

                            {/* If student, show Cancel Booking option for pending or confirmed */}
                            {user.role === "student" && (b.status === "pending" || b.status === "confirmed") && (
                                <div>
                                    <button onClick={() => handleCancel(b._id)}>❌ Cancel Booking</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyBookings;
