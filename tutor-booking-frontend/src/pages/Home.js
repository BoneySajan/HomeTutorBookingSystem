import React from "react";
import { getUserFromToken } from "../api/authApi";
import { Link } from "react-router-dom";

const Home = () => {
    const user = getUserFromToken();

    return (
        <div style={{ padding: "2rem" }}>
            <h2>🏠 Welcome to the Home Tutor Booking System</h2>

            {user ? (
                <>
                    <p>
                        You're logged in as <strong>{user.name}</strong> (
                        <em>{user.role}</em>).
                    </p>

                    {user.role === "student" && (
                        <Link to="/student">
                            <button>🎓 Go to Student Dashboard</button>
                        </Link>
                    )}

                    {user.role === "tutor" && (
                        <Link to="/tutor">
                            <button>📘 Go to Tutor Dashboard</button>
                        </Link>
                    )}

                    {user.role === "admin" && (
                        <Link to="/admin">
                            <button>🛠️ Go to Admin Dashboard</button>
                        </Link>
                    )}
                </>
            ) : (
                    <p>Please login or register to get started.</p>
            )}
        </div>
    );
};

export default Home;
