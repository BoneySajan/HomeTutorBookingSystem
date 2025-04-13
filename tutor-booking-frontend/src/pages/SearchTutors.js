﻿import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchTutors = () => {
    const [filters, setFilters] = useState({
        subject: "",
        minRate: "",
        maxRate: "",
        minRating: "",
        day: "",
        time: "",
    });

    const [tutors, setTutors] = useState([]);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFilters((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSearch = async () => {
        let query = [];
        for (let key in filters) {
            if (filters[key]) {
                query.push(`${key}=${encodeURIComponent(filters[key])}`);
            }
        }

        try {
            const res = await fetch(`http://localhost:5000/api/tutors/search?${query.join("&")}`);
            const data = await res.json();

            if (res.ok) {
                setTutors(data || []);
                setMessage("");
            } else {
                setMessage(data.message || "Search failed");
            }
        } catch (err) {
            setMessage("Error connecting to server");
        }
    };

    const handleBook = async (tutorId) => {
        const token = localStorage.getItem("token");

        const date = prompt("Enter booking date (YYYY-MM-DD):");
        const from = prompt("Enter start time (HH:MM, 24hr format):");
        const to = prompt("Enter end time (HH:MM, 24hr format):");

        const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

        if (!date || !from || !to) {
            return alert("❌ All fields are required.");
        }

        if (!timeRegex.test(from) || !timeRegex.test(to)) {
            return alert("❌ Invalid time format. Use HH:MM (e.g., 14:00)");
        }

        if (from >= to) {
            return alert("❌ Start time must be before end time.");
        }

        try {
            const res = await fetch("http://localhost:5000/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ tutor: tutorId, date, from, to })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Booking failed");

            alert("✅ Booking successful!");
        } catch (err) {
            alert("❌ Booking failed: " + err.message);
        }
    };

    return (
        <div style={{ padding: "1rem" }}>
            <h2>🔍 Search Tutors</h2>
            <input name="subject" placeholder="Subject" onChange={handleChange} />
            <input name="minRate" placeholder="Min Rate" type="number" onChange={handleChange} />
            <input name="maxRate" placeholder="Max Rate" type="number" onChange={handleChange} />
            <input name="minRating" placeholder="Min Rating" type="number" onChange={handleChange} />
            <input name="day" placeholder="Day (e.g. Monday)" onChange={handleChange} />
            <input name="time" placeholder="Time (HH:MM)" type="time" onChange={handleChange} />
            <button onClick={handleSearch}>Search</button>

            {message && <p style={{ color: "red" }}>{message}</p>}

            {tutors.map((tutor) => (
                <div key={tutor._id} style={{ border: "1px solid #ccc", margin: "1rem", padding: "1rem" }}>
                    <h3>{tutor.name}</h3>
                    <p><strong>Subjects:</strong> {tutor.subjects.join(", ")}</p>
                    <p><strong>Rate:</strong> €{tutor.hourlyRate}</p>
                    <p><strong>Bio:</strong> {tutor.bio}</p>
                    <p><strong>Status:</strong> {tutor.status}</p>
                    <p><strong>Rating:</strong> ⭐ {tutor.rating || 0}</p>

                    {tutor.availability && tutor.availability.length > 0 && (
                        <>
                            <p><strong>Availability:</strong></p>
                            <ul>
                                {tutor.availability.map((slot, i) => (
                                    <li key={i}>
                                        {slot.day}: {slot.from} - {slot.to}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                    <button onClick={() => handleBook(tutor._id)}>📚 Book Now</button>{" "}
                    <button onClick={() => navigate(`/reviews/${tutor._id}`)}>💬 View Reviews</button>{" "}
                    <button onClick={() => navigate(`/reviews/${tutor._id}/add`)}>✍️ Write Review</button>
                </div>
            ))}
        </div>
    );
};

export default SearchTutors;
