import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditDoctor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    hospital: ""
  });

  useEffect(() => {
    fetchDoctor();
  }, []);

  const fetchDoctor = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/doctors`);
      const found = res.data.find(d => d._id === id);
      if (found) setDoctor(found);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:5000/api/doctors/${id}`,
        doctor
      );

      alert("Doctor updated successfully ✅");
      navigate("/admin");

    } catch (error) {
      console.error(error);
      alert("Update failed ❌");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Doctor</h2>

      <form onSubmit={handleUpdate}>
        <input name="name" value={doctor.name} onChange={handleChange} className="form-control mb-2" required />
        <input name="email" value={doctor.email} onChange={handleChange} className="form-control mb-2" required />
        <input name="phone" value={doctor.phone} onChange={handleChange} className="form-control mb-2" required />
        <input name="specialization" value={doctor.specialization} onChange={handleChange} className="form-control mb-2" required />
        <input name="experience" value={doctor.experience} onChange={handleChange} className="form-control mb-2" required />
        <input name="hospital" value={doctor.hospital} onChange={handleChange} className="form-control mb-2" required />

        <button className="btn btn-primary">Update Doctor</button>
      </form>
    </div>
  );
}

export default EditDoctor;