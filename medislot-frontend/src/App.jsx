import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import BookAppointment from "./pages/BookAppointment";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AddDoctor from "./pages/AddDoctor";
import EditDoctor from "./pages/EditDoctor";
import DoctorList from "./pages/DoctorList";
import PatientDashboard from "./pages/PatientDashboard";

// Optional (if you want protection)
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* User Routes */}
        <Route
          path="/book"
          element={
            <ProtectedRoute role="user">
              <BookAppointment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-appointments"
          element={
            <ProtectedRoute role="user">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        {/* Doctor Routes */}
        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute role="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-doctor"
          element={
            <ProtectedRoute role="admin">
              <AddDoctor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-doctor/:id"
          element={
            <ProtectedRoute role="admin">
              <EditDoctor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor-list"
          element={
            <ProtectedRoute role="admin">
              <DoctorList />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;