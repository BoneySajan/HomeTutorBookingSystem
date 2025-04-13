// src/pages/ReviewForm.js
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ReviewForm = () => {
    const { tutorId } = useParams();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("http://localhost:5000/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ tutor: tutorId, rating, comment })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to submit review");

            alert("✅ Review submitted!");
            navigate(`/reviews/${tutorId}`);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ padding: "1rem" }}>
            <h2>📝 Submit Review</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <label>
                    Rating (1-5):{" "}
                    <input
                        type="number"
                        min="1"
                        max="5"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Comment:
                    <br />
                    <textarea
                        rows="4"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    ></textarea>
                </label>
                <br />
                <button type="submit">💬 Submit Review</button>
            </form>
        </div>
    );
};

export default ReviewForm;
