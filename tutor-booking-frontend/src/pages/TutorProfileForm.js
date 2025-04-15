﻿import React, { useEffect, useState } from "react";

const TutorProfileForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        subjects: "",
        hourlyRate: "",
        availability: [{ day: "", from: "", to: "" }],
        bio: "",
    });
    const [profileId, setProfileId] = useState(null);
    const [message, setMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    const token = localStorage.getItem("token");

    const fetchProfile = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/tutors/my-profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();

            if (res.ok) {
                setProfileId(data._id);
                setFormData({
                    name: data.name,
                    subjects: data.subjects.join(", "),
                    hourlyRate: data.hourlyRate,
                    availability: data.availability || [{ day: "", from: "", to: "" }],
                    bio: data.bio || "",
                });
                setIsEditing(true);
            }
        } catch (err) {
            console.error("Failed to fetch tutor profile", err);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleAvailabilityChange = (index, field, value) => {
        const updated = [...formData.availability];
        updated[index][field] = value;
        setFormData({ ...formData, availability: updated });
    };

    const addAvailability = () => {
        setFormData({
            ...formData,
            availability: [...formData.availability, { day: "", from: "", to: "" }],
        });
    };

    const removeAvailability = (index) => {
        const updated = formData.availability.filter((_, i) => i !== index);
        setFormData({ ...formData, availability: updated });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            name: formData.name,
            subjects: formData.subjects.split(",").map((s) => s.trim()),
            hourlyRate: Number(formData.hourlyRate),
            availability: formData.availability,
            bio: formData.bio,
        };

        try {
            const res = await fetch(
                `http://localhost:5000/api/tutors${isEditing ? `/${profileId}` : ""}`,
                {
                    method: isEditing ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Something went wrong");
            setMessage(isEditing ? "✅ Profile updated!" : "✅ Profile created!");
        } catch (err) {
            setMessage("❌ " + err.message);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete your tutor profile?")) return;

        try {
            const res = await fetch(`http://localhost:5000/api/tutors/${profileId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to delete profile");

            setMessage("🗑️ Profile deleted!");
            setIsEditing(false);
            setFormData({
                name: "",
                subjects: "",
                hourlyRate: "",
                availability: [{ day: "", from: "", to: "" }],
                bio: "",
            });
        } catch (err) {
            setMessage("❌ " + err.message);
        }
    };

    return (
        <div>
            <h2>{isEditing ? "Edit" : "Create"} Tutor Profile</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Tutor Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                /><br />

                <input
                    type="text"
                    name="subjects"
                    placeholder="Subjects (comma-separated)"
                    value={formData.subjects}
                    onChange={handleChange}
                    required
                /><br />

                <input
                    type="number"
                    name="hourlyRate"
                    placeholder="Hourly Rate (€)"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    required
                /><br />

                <textarea
                    name="bio"
                    placeholder="Short Bio"
                    value={formData.bio}
                    onChange={handleChange}
                    required
                /><br />

                <h4>Availability</h4>
                {formData.availability.map((slot, index) => (
                    <div key={index}>
                        <select
                            value={slot.day}
                            onChange={(e) => handleAvailabilityChange(index, "day", e.target.value)}
                            required
                        >
                            <option value="">Select Day</option>
                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                                <option key={day} value={day}>{day}</option>
                            ))}
                        </select>

                        <input
                            type="time"
                            value={slot.from}
                            onChange={(e) => handleAvailabilityChange(index, "from", e.target.value)}
                            required
                        />
                        <input
                            type="time"
                            value={slot.to}
                            onChange={(e) => handleAvailabilityChange(index, "to", e.target.value)}
                            required
                        />
                        <button type="button" onClick={() => removeAvailability(index)}>Remove</button>
                    </div>
                ))}

                <button type="button" onClick={addAvailability}>➕ Add Availability</button><br /><br />
                <button type="submit">{isEditing ? "Update Profile" : "Create Profile"}</button>
            </form>

            {isEditing && (
                <button onClick={handleDelete} style={{ marginTop: "10px", color: "red" }}>
                    Delete Profile
                </button>
            )}

            {message && <p>{message}</p>}
        </div>
    );
};

export default TutorProfileForm;
