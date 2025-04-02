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
        <nav>
            <Link to="/">Home</Link> |{" "}
            {!user && <Link to="/login">Login</Link>} |{" "}
            {!user && <Link to="/register">Register</Link>} |{" "}
            {user && <span>Welcome, {user.name}</span>} |{" "}
            {user && <button onClick={handleLogout}>Logout</button>}
        </nav>
    );
};

export default Navbar;
