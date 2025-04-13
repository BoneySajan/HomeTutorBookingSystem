import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
            <Link to="/">Home</Link>{" | "}

            {!user && <Link to="/login">Login</Link>}{" | "}
            {!user && <Link to="/register">Register</Link>}

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
