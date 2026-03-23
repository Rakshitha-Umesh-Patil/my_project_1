import { useEffect, useState } from "react";
import axios from "axios";
import DoctorAvailability from "./DoctorAvailability";

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [tab, setTab] = useState("appointments");

  useEffect(() => {
    if (tab === "appointments") fetchAppointments();
  }, [tab]);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/appointments/doctor-appointments",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/appointments/update-status/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Doctor Dashboard</h2>

      <div className="mb-3">
        <button onClick={() => setTab("appointments")} className="btn btn-primary me-2">
          Appointments
        </button>

        <button onClick={() => setTab("availability")} className="btn btn-outline-primary">
          Set Availability
        </button>
      </div>

      {tab === "appointments" && (
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
            {appointments.map(a => (
              <tr key={a._id}>
                <td>{a.user?.name}</td>
                <td>{new Date(a.date).toLocaleDateString()}</td>
                <td>{a.slot}</td>
                <td>
                  {a.type === "EMERGENCY"
                    ? <span className="badge bg-danger">Emergency</span>
                    : "Normal"}
                </td>
                <td>{a.status}</td>
                <td>
                  {a.status === "pending" && (
                    <>
                      <button onClick={() => updateStatus(a._id, "accepted")} className="btn btn-success btn-sm me-2">
                        Accept
                      </button>
                      <button onClick={() => updateStatus(a._id, "rejected")} className="btn btn-danger btn-sm">
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === "availability" && <DoctorAvailability />}
    </div>
  );
}

export default DoctorDashboard;