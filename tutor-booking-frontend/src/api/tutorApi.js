const API_BASE = "http://localhost:5000/api/tutors";

// Utility: fetch token from localStorage
const getToken = () => localStorage.getItem("token");

// Get all tutors (public)
export const fetchAllTutors = async () => {
    const res = await fetch(API_BASE);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch tutors");
    return data;
};

// Approve a tutor (admin only)
export const approveTutor = async (id) => {
    const res = await fetch(`${API_BASE}/${id}/approve`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${getToken()}`
        },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to approve tutor");
    return data;
};

// Reject a tutor (admin only)
export const rejectTutor = async (id) => {
    const res = await fetch(`${API_BASE}/${id}/reject`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${getToken()}`
        },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to reject tutor");
    return data;
};
// Get current tutor profile
export const fetchMyTutorProfile = async (token) => {
    const res = await fetch("http://localhost:5000/api/tutors/my-profile", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch tutor profile");
    return data;
};

// Delete tutor profile
export const deleteTutorProfile = async (id) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:5000/api/tutors/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to delete tutor profile");
    return data;
};
