import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
    useEffect(() => {
        // Notify student of booking status changes (confirmed or cancelled)
        const checkBookingStatus = async () => {
            const token = localStorage.getItem("token"); // Get stored auth token

            const res = await fetch("http://localhost:5000/api/bookings/my", {
                headers: { Authorization: `Bearer ${token}` } // Pass token in headers
            });

            const data = await res.json();

            if (res.ok && data.length > 0) {
                //  Load previously shown statuses from localStorage
                const shownMap = JSON.parse(localStorage.getItem("studentShownMap") || "{}");

                // Loop through current bookings
                for (let booking of data) {
                    const lastStatus = shownMap[booking._id]; // Get previously known status

                    // If status has changed (or not shown yet), alert the student
                    if (lastStatus !== booking.status) {
                        if (booking.status === "confirmed") {
                            alert(`✅ Booking on ${booking.date} (${booking.from} - ${booking.to}) confirmed!`);
                        } else if (booking.status === "cancelled") {
                            alert(`❌ Booking on ${booking.date} (${booking.from} - ${booking.to}) was cancelled.`);
                        }

                        // ✅ Update shown status map with current status
                        shownMap[booking._id] = booking.status;
                    }
                }

                // Save updated statuses to localStorage to prevent repeat alerts
                localStorage.setItem("studentShownMap", JSON.stringify(shownMap));
            }
        };

        // Run notification logic on initial render
        checkBookingStatus();
    }, []);

    return (
        <div>
            <h2>🎓 Student Dashboard</h2>
            <p>Welcome, Student! You can search and book tutors here.</p>

            {/* 📌 Navigation links to student pages */}
            <div style={{ marginTop: "1rem" }}>
                <Link to="/student/search">🔍 Search Tutors</Link> <br />
                <Link to="/my-bookings">📆 View My Bookings</Link>
            </div>
        </div>
    );
};

export default StudentDashboard;
