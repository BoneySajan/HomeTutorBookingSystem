import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ViewReviews = () => {
    const { tutorId } = useParams();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/reviews/${tutorId}`);
                const data = await res.json();

                if (!res.ok) throw new Error(data.message || "Failed to load reviews");
                setReviews(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [tutorId]);

    return (
        <div style={{ padding: "1rem" }}>
            <h2>💬 Reviews</h2>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {reviews.length === 0 ? (
                <p>No reviews yet.</p>
            ) : (
                <ul>
                    {reviews.map((review) => (
                        <li key={review._id} style={{ marginBottom: "1rem" }}>
                            <strong>⭐ {review.rating}</strong> by {review.student?.name || "Anonymous"}
                            <p>{review.comment}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ViewReviews;
