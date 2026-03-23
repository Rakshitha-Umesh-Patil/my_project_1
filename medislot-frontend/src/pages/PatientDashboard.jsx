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
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setAppointments(res.data);

    } catch (error) {
      console.log("Error fetching appointments", error);
    }
  };

  const cancelAppointment = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/appointments/cancel/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Appointment cancelled");
      fetchAppointments();

    } catch (error) {
      console.log("Cancel error", error);
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
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {appointments.map((appt) => (

              <tr key={appt._id}>

                <td>{appt.doctor?.name}</td>
                <td>{appt.doctor?.email}</td>

                <td>
                  {new Date(appt.date).toLocaleDateString()}
                </td>

                <td>{appt.slot}</td>

                <td>
                  <span
                    className={
                      appt.status === "cancelled"
                        ? "text-danger"
                        : "text-success"
                    }
                  >
                    {appt.status}
                  </span>
                </td>

                <td>
                  {appt.status !== "cancelled" && (
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