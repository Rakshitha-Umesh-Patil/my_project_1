import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";

function EditDoctor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    hospital: "",
    patientsTreated: 0,
  });

  // ✅ Always read token inside functions (not top-level)
  const getToken = () => localStorage.getItem("token");

  // ✅ Fetch doctor when id is available
  useEffect(() => {
    if (id) fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/users/doctor/${id}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      // ✅ IMPORTANT: backend usually sends { doctor: {...} }
      setDoctor(res.data.doctor || res.data);
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
      alert("Failed to fetch doctor data ❌");
    }
  };

  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${BACKEND_URL}/api/users/edit-doctor/${id}`,
        doctor,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      alert("Doctor updated successfully ✅");
      navigate("/admin");
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      alert("Update failed ❌");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Doctor</h2>

      <form onSubmit={handleUpdate}>
        <input
          name="name"
          value={doctor.name}
          onChange={handleChange}
          className="form-control mb-2"
          placeholder="Name"
          required
        />
        <input
          name="email"
          value={doctor.email}
          onChange={handleChange}
          className="form-control mb-2"
          placeholder="Email"
          type="email"
          required
        />
        <input
          name="phone"
          value={doctor.phone}
          onChange={handleChange}
          className="form-control mb-2"
          placeholder="Phone"
          required
        />
        <input
          name="specialization"
          value={doctor.specialization}
          onChange={handleChange}
          className="form-control mb-2"
          placeholder="Specialization"
          required
        />
        <input
          name="experience"
          value={doctor.experience}
          onChange={handleChange}
          className="form-control mb-2"
          placeholder="Experience (years)"
          type="number"
          required
        />
        <input
          name="hospital"
          value={doctor.hospital}
          onChange={handleChange}
          className="form-control mb-2"
          placeholder="Hospital"
          required
        />
        <input
          name="patientsTreated"
          value={doctor.patientsTreated}
          onChange={handleChange}
          className="form-control mb-2"
          placeholder="Patients Treated"
          type="number"
        />

        <button className="btn btn-primary">Update Doctor</button>
      </form>
    </div>
  );
}

export default EditDoctor;