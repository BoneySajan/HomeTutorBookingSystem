import React, { useEffect, useState } from "react";
import { getUserFromToken } from "../api/authApi";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const user = getUserFromToken();

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
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

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
            fetchBookings();
        } catch (err) {
            alert(err.message);
        }
    };

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
            fetchBookings();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div style={{ padding: "1rem" }}>
            <h2>📆 My Bookings</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            {loading ? (
                <p>Loading...</p>
            ) : bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                <ul>
                    {bookings.map((b) => (
                        <li key={b._id} style={{ marginBottom: "1rem" }}>
                            <strong>Date:</strong> {b.date} |{" "}
                            <strong>Time:</strong> {b.from || "--"} - {b.to || "--"} <br />
                            <strong>{user.role === "student" ? "Tutor" : "Student"}:</strong>{" "}
                            {user.role === "student" ? b.tutor?.name : b.student?.name} |{" "}
                            <strong>Status:</strong> {b.status}

                            {/* Tutor action buttons */}
                            {user.role === "tutor" && b.status !== "cancelled" && (
                                <div>
                                    {b.status === "pending" && (
                                        <button onClick={() => handleStatusChange(b._id, "confirmed")}>✅ Accept</button>
                                    )}
                                    <button onClick={() => handleStatusChange(b._id, "cancelled")}>❌ Cancel</button>
                                </div>
                            )}


                            {/* Student cancel option */}
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
