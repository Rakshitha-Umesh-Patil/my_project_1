import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/doctors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/delete-doctor/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Doctor deleted successfully ✅");
      fetchDoctors();
    } catch (err) {
      console.error(err);
      alert("Failed to delete doctor ❌");
    }
  };

  const filteredDoctors = doctors
    .filter((doc) => doc.name.toLowerCase().includes(search.toLowerCase()))
    .filter((doc) => doc.specialization?.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>

      <button
        className="btn btn-success mb-3"
        onClick={() => navigate("/add-doctor")}
      >
        Add Doctor
      </button>

      {/* Search + Filter */}
      <div className="d-flex mb-3">
        <input
          type="text"
          placeholder="Search by name..."
          className="form-control me-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by specialization..."
          className="form-control"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <h3>Doctors List</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Specialization</th>
            <th>Experience</th>
            <th>Hospital</th>
            <th>Patients Treated</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doc) => (
              <tr key={doc._id}>
                <td>{doc.name}</td>
                <td>{doc.email}</td>
                <td>{doc.phone || "N/A"}</td>
                <td>{doc.specialization}</td>
                <td>{doc.experience}</td>
                <td>{doc.hospital || "N/A"}</td>
                <td>{doc.patientsTreated}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => navigate(`/edit-doctor/${doc._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteDoctor(doc._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                No doctors found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <h3 className="mt-5">Appointments List</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Date</th>
            <th>Slot</th>
            <th>Type</th>
            <th>Status</th>
            <th>Doctor</th>
            <th>Patient</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length > 0 ? (
            appointments.map((a) => (
              <tr key={a._id}>
                <td>{new Date(a.date).toLocaleDateString()}</td>
                <td>{a.slot}</td>
                <td>{a.type}</td>
                <td>{a.status}</td>
                <td>{a.doctor?.name}</td>
                <td>{a.user?.name}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No appointments found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;