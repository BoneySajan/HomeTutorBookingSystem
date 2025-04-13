import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
    useEffect(() => {
        const checkBookingStatus = async () => {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:5000/api/bookings/my", {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await res.json();

            if (res.ok && data.length > 0) {
                // Load previous status map from localStorage
                const shownMap = JSON.parse(localStorage.getItem("studentShownMap") || "{}");

                for (let booking of data) {
                    const lastStatus = shownMap[booking._id];

                    if (lastStatus !== booking.status) {
                        if (booking.status === "confirmed") {
                            alert(`✅ Booking on ${booking.date} (${booking.from} - ${booking.to}) confirmed!`);
                        } else if (booking.status === "cancelled") {
                            alert(`❌ Booking on ${booking.date} (${booking.from} - ${booking.to}) was cancelled.`);
                        }
                        shownMap[booking._id] = booking.status;
                    }
                }

                // Save updated map
                localStorage.setItem("studentShownMap", JSON.stringify(shownMap));
            }
        };

        checkBookingStatus();
    }, []);


    return (
        <div>
            <h2>🎓 Student Dashboard</h2>
            <p>Welcome, Student! You can search and book tutors here.</p>

            <div style={{ marginTop: "1rem" }}>
                <Link to="/student/search">🔍 Search Tutors</Link> <br />
                <Link to="/my-bookings">📆 View My Bookings</Link>
            </div>
        </div>
    );
};

export default StudentDashboard;
