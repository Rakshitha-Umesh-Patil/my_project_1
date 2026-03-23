import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import BookAppointment from "./pages/BookAppointment"
import AdminDashboard from "./pages/AdminDashboard"
import DoctorList from "./pages/DoctorList";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AddDoctor from "./pages/AddDoctor";
import EditDoctor from "./pages/EditDoctor";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* ✅ FIXED HERE */}
        <Route path="/book" element={<BookAppointment />} />

        {/* USER */}
        <Route
          path="/my-appointments"
          element={
            <ProtectedRoute role="user">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        {/* DOCTOR */}
        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute role="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
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

        {/* OPTIONAL */}
        <Route path="/doctors" element={<DoctorList />} />

      </Routes>

    </BrowserRouter>
  )
}

export default App