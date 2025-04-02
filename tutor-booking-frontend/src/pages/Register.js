import React, { useState } from "react";
import { registerUser } from "../api/authApi";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "student",
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await registerUser(formData);
            setMessage("✅ Registered successfully!");
            console.log(res.user);
        } catch (err) {
            setMessage(`❌ ${err.message}`);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                /><br />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                /><br />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                /><br />

                <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="student">Student</option>
                    <option value="tutor">Tutor</option>
                    <option value="admin">Admin</option>
                </select><br />

                <button type="submit">Register</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;
