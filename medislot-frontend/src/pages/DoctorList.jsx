import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DoctorList() {

  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {

      const res = await axios.get("http://localhost:5000/doctors");

      setDoctors(res.data);

    } catch (error) {

      console.log("Error fetching doctors", error);

    }
  };

  return (
    <div className="container mt-4">

      <h2>Available Doctors</h2>

      <div className="row">

        {doctors.map((doc) => (

          <div className="col-md-4" key={doc._id}>

            <div className="card mb-3">

              <div className="card-body">

                <h5>{doc.name}</h5>

                <p>Specialization: {doc.specialization}</p>

                <p>Experience: {doc.experience} years</p>

                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/book/${doc._id}`)}
                >
                  Book Appointment
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default DoctorList;