# Home Tutor Booking System

The **Home Tutor Booking System** is a full-stack web application designed to help students (or parents) find and book qualified tutors based on subject and availability. 
The system includes role-based access for students, tutors, and admins.

---

## Project Structure
HomeTutorBookingSystem/ ├── backend/ # Node.js + Express backend 
                        ├── tutor-booking-frontend/ # React frontend 
                        └── README.md


---

## Features

- Secure login and registration using JWT
- Tutor profile creation, editing, and availability setup
- Students can search tutors and book based on time slots
- Admin can approve or reject tutor profiles
- Admin dashboard to manage users and view bookings
- Students can submit ratings and reviews

---

## Technology Stack

| Layer      | Technology        |
| ---------- | ----------------- |
| Frontend   | React, CSS        |
| Backend    | Node.js, Express  |
| Database   | MongoDB           |
| Auth       | JWT (JSON Web Token) |
| API Style  | RESTful APIs      |

---

## Prerequisites

Ensure the following are installed:

- Node.js (v16 or higher): [https://nodejs.org](https://nodejs.org)
- MongoDB (MongoDB Atlas)
- You need a MongoDB instance running:
o	Cloud-hosted via MongoDB Atlas 
o	Email: boneysajan03@gmail.com
o	Password: 4mongodb123
o	Kindly add your IP Address in Network Access page if facing issue with MongoDB Atlas.

- Git

---

## Installation Instructions

Step 1. Clone the repository

git clone https://github.com/your-username/HomeTutorBookingSystem.git
cd HomeTutorBookingSystem
Step 2: Install Backend Dependencies
cd backend
npm install

Step 3: Install Frontend Dependencies
cd ../tutor-booking-frontend
npm install

Step 4: Run the App

Option 1 – Run Backend and Frontend Separately:
•	Start MongoDB locally
•	Start backend:
cd backend
npm start
•	Start frontend:
cd ../tutor-booking-frontend
npm start


Option 2 – Use concurrently to run both:

Ensure "concurrently" is in root package.json and configured in a start script(Already included)
npm install concurrently
npm run dev


-----


Usage
Open http://localhost:3000 in a browser.

Register as a student or tutor.

Tutors can set up their profile and availability.

Students can search, filter, and book tutors.

Admins can approve tutors, manage users, and monitor bookings.


Testing
This project has been manually tested for:

Registration and login functionality

Role-based dashboard access

Booking workflows

Tutor approval flow

Review and rating submission


Notes
JWT tokens are securely stored in localStorage

Backend routes are protected with role-based middleware

API routes follow REST conventions

Future Improvements
Add payment gateway integration

Implement email notifications

Improve UI responsiveness and accessibility

Add unit tests and API testing
