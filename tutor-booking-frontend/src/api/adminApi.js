const BASE = "http://localhost:5000/api/admin";

const getToken = () => localStorage.getItem("token");

// ✅ Fetch all users
export const fetchAllUsers = async () => {
    const res = await fetch(`${BASE}/users`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch users");
    return data;
};

// ✅ Delete a user
export const deleteUser = async (id) => {
    const res = await fetch(`${BASE}/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to delete user");
    return data;
};
