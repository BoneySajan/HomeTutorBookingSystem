import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate(); // Used to programmatically navigate pages
    const user = JSON.parse(localStorage.getItem("user")); // Get user from localStorage

    // Handle logout by clearing localStorage and redirecting to login page
    const handleLogout = () => {
        localStorage.removeItem("token"); // Remove auth token
        localStorage.removeItem("user");  // Remove user info
        navigate("/login");               // Redirect to login
    };

    return (
        <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
            {/* Always visible Home link */}
            <Link to="/">Home</Link>{" | "}

            {/* Show Login/Register only when user is not logged in */}
            {!user && <Link to="/login">Login</Link>}{" | "}
            {!user && <Link to="/register">Register</Link>}

            {/* If user is logged in, show greeting and logout button */}
            {user && (
                <>
                    <span style={{ margin: "0 10px" }}>
                        👋 Hello, <strong>{user.name}</strong> ({user.role})
                    </span>
                    <button onClick={handleLogout}>Logout</button>
                </>
            )}
        </nav>
    );
};

export default Navbar;
