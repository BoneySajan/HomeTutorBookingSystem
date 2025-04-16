import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ReviewForm = () => {
    // Extract tutorId from URL params
    const { tutorId } = useParams();

    // Local state for form inputs
    const [rating, setRating] = useState(5);      // Rating (default 5)
    const [comment, setComment] = useState("");   // Review comment
    const [error, setError] = useState("");       // To show error if any
    const navigate = useNavigate();               // For programmatic navigation

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form refresh
        const token = localStorage.getItem("token"); // Get JWT from localStorage

        try {
            // Send POST request to submit the review
            const res = await fetch("http://localhost:5000/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` // Attach auth token
                },
                body: JSON.stringify({ tutor: tutorId, rating, comment }) // Review data
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to submit review");

            alert("✅ Review submitted!");
            navigate(`/reviews/${tutorId}`); // Redirect to tutor's review page
        } catch (err) {
            setError(err.message); // Show error message
        }
    };

    return (
        <div style={{ padding: "1rem" }}>
            <h2>📝 Submit Review</h2>

            {/* Show error message if any */}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Review form */}
            <form onSubmit={handleSubmit}>
                <label>
                    Rating (1-5):{" "}
                    <input
                        type="number"
                        min="1"
                        max="5"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)} // Update rating
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
                        onChange={(e) => setComment(e.target.value)} // Update comment
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
