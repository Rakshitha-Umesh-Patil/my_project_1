import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${BACKEND_URL}/api/appointments/my-appointments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAppointments(res.data || []);
    } catch (err) {
      console.error("Fetch appointments error:", err);
      alert("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?"))
      return;

    try {
      await axios.put(
        `${BACKEND_URL}/api/appointments/cancel/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Appointment cancelled successfully ❌");

      // update UI instantly
      setAppointments((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, status: "cancelled" } : a
        )
      );
    } catch (err) {
      console.error("Cancel error:", err);
      alert(err.response?.data?.message || "Cancel failed");
    }
  };

  // 🔥 Case-proof status badge
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
      <h2>My Appointments</h2>

      {loading ? (
        <p>Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments found</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Email</th>
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
                  <td>{appt.doctor?.name || "N/A"}</td>
                  <td>{appt.doctor?.email || "N/A"}</td>
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
                    {status === "pending" ? (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => cancelAppointment(appt._id)}
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PatientDashboard;