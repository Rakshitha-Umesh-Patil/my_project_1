# Medislot - Doctor & Appointment Management System

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

---

## Overview
Medislot is a web-based **Doctor & Appointment Management System** for clinics and hospitals.  
It allows **admins** to manage doctors, view appointments, and perform CRUD operations, while doctors and patients can manage their schedules effectively.

This project is built using **MERN stack** with **JWT authentication** for secure access.  

---

## Features
- Admin can:
  - Add, edit, and delete doctors
  - View all appointments
  - Search & filter doctors by name or specialization
- Doctor management:
  - Fields include Name, Email, Phone, Specialization, Experience, Hospital, and Patients Treated
- Appointment management:
  - View appointments with patient & doctor details
  - Filter by date, doctor, or status
- Secure authentication using JWT tokens

---

## Tech Stack
- **Frontend:** React.js, React Router, Axios, Bootstrap  
- **Backend:** Node.js, Express.js, MongoDB, Mongoose  
- **Authentication:** JWT (JSON Web Token)  
- **Password Security:** bcryptjs  
- **Tools:** Postman for API testing, VSCode

---

## Folder Structure

medislot/
├── backend/
│ ├── models/
│ │ └── User.js
| | |_Admin.js
| | |_Appointment.js
│ ├── routes/
│ │ └── userRoutes.js
│ ├── middleware/
│ │ └── authMiddleware.js
| |-Controllers
│ └── server.js
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── AdminDashboard.jsx
│ │ │ ├── AddDoctor.jsx
│ │ │ └── EditDoctor.jsx
| | | |_BookAppointment.jsx
│ │ │ ├── PatientDashboard.jsx
│ │ │ ├── DoctorDashboard.jsx
│ │ ├── App.js
│ │ └── index.js
├── package.json
├── package-lock.json
└── README.md
