import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ViewReviews = () => {
    const { tutorId } = useParams(); // Extract tutorId from the URL
    const [reviews, setReviews] = useState([]); // State to hold fetched reviews
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(""); // Error message state

    // Fetch reviews when the component loads or tutorId changes
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                // Call the API to get reviews for the tutor
                const res = await fetch(`http://localhost:5000/api/reviews/${tutorId}`);
                const data = await res.json();

                // Throw error if response is not ok
                if (!res.ok) throw new Error(data.message || "Failed to load reviews");

                setReviews(data); // Store reviews in state
            } catch (err) {
                setError(err.message); // Set error message
            } finally {
                setLoading(false); // Hide loading spinner
            }
        };

        fetchReviews(); // Trigger API call
    }, [tutorId]);

    return (
        <div style={{ padding: "1rem" }}>
            <h2>💬 Reviews</h2>

            {/* Loading state */}
            {loading && <p>Loading...</p>}

            {/* Display error if any */}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* If no reviews, show message */}
            {reviews.length === 0 ? (
                <p>No reviews yet.</p>
            ) : (
                <ul>
                    {reviews.map((review) => (
                        <li key={review._id} style={{ marginBottom: "1rem" }}>
                            {/* Show rating and student name (fallback to 'Anonymous') */}
                            <strong>⭐ {review.rating}</strong> by {review.student?.name || "Anonymous"}
                            <p>{review.comment}</p> {/* Show review comment */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ViewReviews;
