// DoctorDashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import DoctorAvailability from "./DoctorAvailability";

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [tab, setTab] = useState("appointments");
  const [loading, setLoading] = useState(false);

  // Fetch appointments when tab is active
  useEffect(() => {
    if (tab === "appointments") fetchAppointments();
  }, [tab]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/appointments/doctor-appointments",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAppointments(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/appointments/update-status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh list after update
      fetchAppointments();
    } catch (err) {
      console.error("Update status error:", err);
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="badge bg-warning text-dark">Pending</span>;
      case "accepted":
        return <span className="badge bg-success">Accepted</span>;
      case "rejected":
        return <span className="badge bg-danger">Rejected</span>;
      case "completed":
        return <span className="badge bg-primary">Completed</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  return (
    <div className="container mt-4">
      <h2>Doctor Dashboard</h2>

      <div className="mb-3">
        <button
          onClick={() => setTab("appointments")}
          className={`btn me-2 ${tab === "appointments" ? "btn-primary" : "btn-outline-primary"}`}
        >
          Appointments
        </button>

        <button
          onClick={() => setTab("availability")}
          className={`btn ${tab === "availability" ? "btn-primary" : "btn-outline-primary"}`}
        >
          Set Availability
        </button>
      </div>

      {tab === "appointments" && (
        <>
          {loading ? (
            <div>Loading appointments...</div>
          ) : appointments.length === 0 ? (
            <div>No appointments found.</div>
          ) : (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Slot</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((a) => (
                  <tr key={a._id}>
                    <td>{a.user?.name || "N/A"}</td>
                    <td>{new Date(a.date).toLocaleDateString()}</td>
                    <td>{a.slot}</td>
                    <td>
                      {a.type === "EMERGENCY" ? (
                        <span className="badge bg-danger">Emergency</span>
                      ) : (
                        <span className="badge bg-secondary">Normal</span>
                      )}
                    </td>
                    <td>{renderStatusBadge(a.status)}</td>
                    <td>
                      {a.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateStatus(a._id, "accepted")}
                            className="btn btn-success btn-sm me-2"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => updateStatus(a._id, "rejected")}
                            className="btn btn-danger btn-sm"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {a.status === "accepted" && (
                        <button
                          onClick={() => updateStatus(a._id, "completed")}
                          className="btn btn-primary btn-sm"
                        >
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {tab === "availability" && <DoctorAvailability />}
    </div>
  );
}

export default DoctorDashboard;