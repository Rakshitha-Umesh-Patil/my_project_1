import { useEffect, useState } from "react";
import axios from "axios";

function DoctorDashboard() {

  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/appointments/doctor-appointments",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setAppointments(res.data);

    } catch (error) {
      console.log(error);
    }

  };

  const updateStatus = async (id, status) => {

    try {

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/appointments/update-status/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchAppointments();

    } catch (error) {
      console.log(error);
    }

  };

  return (
    <div className="container mt-4">

      <h2>Doctor Dashboard</h2>

      <table className="table table-bordered">

        <thead>
          <tr>
            <th>Patient</th>
            <th>Date</th>
            <th>Slot</th>
            <th>Emergency</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {appointments.map((appt) => (

            <tr key={appt._id}>

              <td>{appt.patient?.name}</td>
              <td>{appt.date}</td>
              <td>{appt.slot}</td>

              <td>
                {appt.emergency ? (
                  <span className="badge bg-danger">Emergency</span>
                ) : (
                  "Normal"
                )}
              </td>

              <td>{appt.status}</td>

              <td>

                {appt.status === "pending" && (
                  <>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => updateStatus(appt._id, "accepted")}
                    >
                      Accept
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => updateStatus(appt._id, "rejected")}
                    >
                      Reject
                    </button>
                  </>
                )}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default DoctorDashboard;