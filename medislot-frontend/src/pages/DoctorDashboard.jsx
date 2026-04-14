import { useEffect, useState } from "react";
import axios from "axios";
import DoctorAvailability from "./DoctorAvailability";
import { BACKEND_URL } from "../config";

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [tab, setTab] = useState("appointments");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token && tab === "appointments") {
      fetchAppointments();
    }
  }, [tab]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${BACKEND_URL}/api/appointments/doctor-appointments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAppointments(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${BACKEND_URL}/api/appointments/update-status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // instant UI update
      setAppointments((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, status } : a
        )
      );
    } catch (err) {
      console.error("Update status error:", err);
      alert("Status update failed");
    }
  };

  const renderStatusBadge = (status) => {
    const s = status?.toLowerCase();
    const map = {
      pending: "warning",
      accepted: "success",
      rejected: "danger",
      completed: "primary",
      cancelled: "secondary",
    };
    return (
      <span className={`badge bg-${map[s] || "dark"}`}>
        {s}
      </span>
    );
  };

  return (
    <div className="container mt-4">
      <h2>Doctor Dashboard</h2>

      <div className="mb-3">
        <button
          onClick={() => setTab("appointments")}
          className={`btn me-2 ${
            tab === "appointments" ? "btn-primary" : "btn-outline-primary"
          }`}
        >
          Appointments
        </button>

        <button
          onClick={() => setTab("availability")}
          className={`btn ${
            tab === "availability" ? "btn-primary" : "btn-outline-primary"
          }`}
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
                {appointments.map((appt) => {
                  const status = appt.status?.toLowerCase();

                  return (
                    <tr key={appt._id}>
                      <td>{appt.user?.name || "N/A"}</td>
                      <td>{new Date(appt.date).toLocaleDateString()}</td>
                      <td>{appt.slot}</td>

                      <td>
                        <span
                          className={`badge ${
                            appt.type === "EMERGENCY"
                              ? "bg-danger"
                              : "bg-secondary"
                          }`}
                        >
                          {appt.type}
                        </span>
                      </td>

                      <td>{renderStatusBadge(appt.status)}</td>

                      <td>
                        {status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                updateStatus(appt._id, "accepted")
                              }
                              className="btn btn-success btn-sm me-2"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                updateStatus(appt._id, "rejected")
                              }
                              className="btn btn-danger btn-sm"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {status === "accepted" && (
                          <button
                            onClick={() =>
                              updateStatus(appt._id, "completed")
                            }
                            className="btn btn-primary btn-sm"
                          >
                            Complete
                          </button>
                        )}

                        {!["pending", "accepted"].includes(status) && (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
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