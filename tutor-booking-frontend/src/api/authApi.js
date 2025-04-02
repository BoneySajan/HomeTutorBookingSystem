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
