import { useEffect, useState } from "react";
import axios from "axios";

function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/appointments/my-appointments",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setAppointments(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  const cancelAppointment = async (id) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel?");
    if (!confirmCancel) return;

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/appointments/cancel/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Appointment cancelled ❌");

      // ✅ instant UI update (better UX)
      setAppointments(prev =>
        prev.map(appt =>
          appt._id === id ? { ...appt, status: "cancelled" } : appt
        )
      );

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Cancel failed");
    }
  };

  return (
    <div className="container mt-4">
      <h2>My Appointments</h2>

      {appointments.length === 0 ? (
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
            {appointments.map((appt) => (
              <tr key={appt._id}>
                <td>{appt.doctor?.name || "N/A"}</td>
                <td>{appt.doctor?.email || "N/A"}</td>
                <td>{new Date(appt.date).toLocaleDateString()}</td>
                <td>{appt.slot}</td>

                <td>
                  {appt.type === "EMERGENCY"
                    ? <span className="badge bg-danger">Emergency</span>
                    : <span className="badge bg-primary">Normal</span>}
                </td>

                <td>
                  {appt.status === "pending" && <span className="text-warning">Pending</span>}
                  {appt.status === "accepted" && <span className="text-success">Accepted</span>}
                  {appt.status === "rejected" && <span className="text-danger">Rejected</span>}
                  {appt.status === "completed" && <span className="text-info">Completed</span>}
                  {appt.status === "cancelled" && <span className="text-muted">Cancelled</span>}
                </td>

                <td>
                  {appt.status === "pending" && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => cancelAppointment(appt._id)}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PatientDashboard;