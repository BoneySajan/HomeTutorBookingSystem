import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, children }) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return <Navigate to="/login" />;

    // Support single role OR array of roles
    if (role) {
        const allowedRoles = Array.isArray(role) ? role : [role];
        if (!allowedRoles.includes(user.role)) {
            return <Navigate to="/" />;
        }
    }

    return children;
};

export default ProtectedRoute;
