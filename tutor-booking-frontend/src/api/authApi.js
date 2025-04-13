const API_BASE = "http://localhost:5000/api/auth";

export const loginUser = async (email, password) => {
    try {
        const res = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Login failed");
        return data;
    } catch (err) {
        if (err.name === "TypeError") {
            throw new Error("Network error: Unable to connect to the server.");
        }
        throw err;
    }
};

// ✅ Register new user
export const registerUser = async (userData) => {
    try {
        const res = await fetch(`${API_BASE}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Registration failed");
        return data;
    } catch (err) {
        if (err.name === "TypeError") {
            throw new Error("Network error: Unable to connect to the server.");
        }
        throw err;
    }
};
// Decode token from localStorage
export const getUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (err) {
        console.error("Invalid token");
        return null;
    }
};
