import React, { useEffect, useState } from "react";
import {
    fetchAllTutors,
    approveTutor,
    rejectTutor
} from "../api/tutorApi"; // Tutor-related API calls
import {
    fetchAllUsers,
    deleteUser
} from "../api/adminApi"; // Admin-specific API calls

const AdminDashboard = () => {
    const [tutors, setTutors] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token"); // Get auth token from storage

    // Fetch all tutors from API
    const loadTutors = async () => {
        try {
            const data = await fetchAllTutors();
            setTutors(data);
        } catch (err) {
            console.error("Failed to fetch tutors", err.message);
            setMessage("Failed to load tutors");
        } finally {
            setLoading(false);
        }
    };

    // Fetch all bookings for display
    const loadBookings = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/bookings", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setBookings(Array.isArray(data) ? data : []);
        } catch (err) {
            setMessage("Failed to load bookings");
        }
    };

    // Fetch all users (excluding admins in the view)
    const loadUsers = async () => {
        try {
            const data = await fetchAllUsers();
            console.log("✅ Users fetched:", data);
            setUsers(data);
        } catch (err) {
            console.error("❌ Failed to load users:", err.message);
            setMessage("Failed to load users");
        }
    };

    // Approve tutor by ID
    const handleApprove = async (id) => {
        try {
            await approveTutor(id);
            setMessage("Tutor approved");
            loadTutors(); // Refresh tutor list
        } catch {
            setMessage("Approval failed");
        }
    };

    // Reject tutor by ID
    const handleReject = async (id) => {
        try {
            await rejectTutor(id);
            setMessage("Tutor rejected");
            loadTutors(); // Refresh tutor list
        } catch {
            setMessage("Rejection failed");
        }
    };

    // Delete user and cascade delete their profile/bookings
    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await deleteUser(id);
            alert("User deleted");
            loadUsers(); // Refresh user list
        } catch {
            alert("Failed to delete user");
        }
    };

    // Load all data on component
    useEffect(() => {
        loadTutors();
        loadBookings();
        loadUsers();
    }, []);

    return (
        <div style={{ padding: "1rem" }}>
            <h2>🛠️ Admin Dashboard</h2>
            {message && <p style={{ color: "green" }}>{message}</p>}

            {/* Tutor Section */}
            <h3>👨‍🏫 Tutor Profiles</h3>
            {loading ? (
                <p>Loading tutors...</p>
            ) : (
                <table border="1" cellPadding={10}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Subjects</th>
                            <th>Rate</th>
                            <th>Rating</th>
                            <th>Availability</th>
                            <th>Bio</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tutors.map((tutor) => (
                            <tr key={tutor._id}>
                                <td>{tutor.name}</td>
                                <td>{tutor.subjects?.join(", ")}</td>
                                <td>€{tutor.hourlyRate}</td>
                                <td>⭐ {tutor.rating || 0}</td>
                                <td>
                                    {tutor.availability?.map((slot, i) => (
                                        <div key={i}>
                                            {slot.day}: {slot.from} - {slot.to}
                                        </div>
                                    ))}
                                </td>
                                <td>{tutor.bio}</td>
                                <td>
                                    {tutor.status === "pending" && (
                                        <>
                                            <button onClick={() => handleApprove(tutor._id)}>✅ Approve</button>{" "}
                                            <button onClick={() => handleReject(tutor._id)}>❌ Reject</button>
                                        </>
                                    )}
                                    {tutor.status === "approved" && <span>Approved</span>}
                                    {tutor.status === "rejected" && <span>Rejected</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Booking Section */}
            <h3 style={{ marginTop: "3rem" }}>📆 All Bookings</h3>
            {bookings.length === 0 ? (
                <p>No bookings available.</p>
            ) : (
                <table border="1" cellPadding={8}>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Tutor</th>
                            <th>Date</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((b) => (
                            <tr key={b._id}>
                                <td>{b.student?.name}</td>
                                <td>{b.tutor?.name}</td>
                                <td>{b.date}</td>
                                <td>{b.from}</td>
                                <td>{b.to}</td>
                                <td>{b.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* User Section */}
            <h3 style={{ marginTop: "3rem" }}>👥 User Management</h3>
            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <table border="1" cellPadding={10}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users
                            .filter((user) => user.role !== "admin") // Hide admin users from the list
                            .map((user) => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminDashboard;
