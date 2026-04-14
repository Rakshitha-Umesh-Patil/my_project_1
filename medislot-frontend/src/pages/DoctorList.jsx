import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/doctors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(res.data || []);
    } catch (error) {
      console.log("Error fetching doctors", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Available Doctors</h2>

      <div className="row">
        {doctors.map((doc) => (
          <div className="col-md-4 mb-4" key={doc._id}>
            <div className="card shadow h-100 border-0">
              <div className="card-body">
                <div className="text-center mb-3">
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      background: "#e9ecef",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "28px",
                      fontWeight: "bold",
                      color: "#0d6efd",
                    }}
                  >
                    {doc.name.charAt(0)}
                  </div>
                </div>

                <h5 className="text-center">{doc.name}</h5>
                <hr />

                <p className="mb-1">
                  <strong>Specialization:</strong> {doc.specialization}
                </p>
                <p className="mb-1">
                  <strong>Experience:</strong> {doc.experience} years
                </p>
                <p className="mb-1">
                  <strong>Hospital:</strong> {doc.hospital || "N/A"}
                </p>
                <p className="mb-1">
                  <strong>Phone:</strong> {doc.phone || "N/A"}
                </p>
                <p className="mb-3">
                  <strong>Patients Treated:</strong>{" "}
                  {doc.patientsTreated || 0}
                </p>

                <div className="d-grid">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/book/${doc._id}`)}
                  >
                    Book Appointment
                  </button>
                </div>
              </div>

              <div className="card-footer text-center bg-light">
                <small className="text-success">Available for Booking</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorList;