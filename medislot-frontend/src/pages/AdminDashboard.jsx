import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Fetch doctors
  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/doctors");
      setDoctors(res.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  // Delete doctor
  const deleteDoctor = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/doctors/${id}`);
      alert("Doctor deleted successfully");
      fetchDoctors();
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };

  // ✅ FILTER LOGIC
  const filteredDoctors = doctors
    .filter((doc) =>
      doc.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((doc) =>
      doc.specialization.toLowerCase().includes(filter.toLowerCase())
    );

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>

      <a href="/add-doctor" className="btn btn-success mb-3">
        Add Doctor
      </a>

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
            <th>Action</th> {/* ✅ Single column */}
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

                <td>
                  {/* Edit */}
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() =>
                      (window.location.href = `/edit-doctor/${doc._id}`)
                    }
                  >
                    Edit
                  </button>

                  {/* Delete */}
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
              <td colSpan="7" className="text-center">
                No doctors found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;