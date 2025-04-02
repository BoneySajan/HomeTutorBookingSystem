import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, children }) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role) return <Navigate to="/" />;

    return children;
};

export default ProtectedRoute;
