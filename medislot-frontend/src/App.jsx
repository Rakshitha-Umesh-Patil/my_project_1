import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import BookAppointment from "./pages/BookAppointment"
import AdminDashboard from "./pages/AdminDashboard"
import DoctorList from "./pages/DoctorList";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<BookAppointment />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/doctors" element={<DoctorList />} />
        <Route path="/my-appointments" element={<PatientDashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App